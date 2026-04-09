(() => {
  const BUTTON_ID = 'linktosheets-add-btn';
  const WRAPPER_ID = 'linktosheets-wrapper';
  const DOTLOTTIE_SCRIPT_ID = 'linktosheets-dotlottie-script';

  function ensureDotLottieScript() {
    if (document.getElementById(DOTLOTTIE_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = DOTLOTTIE_SCRIPT_ID;
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.10/dist/dotlottie-wc.js';
    script.type = 'module';
    document.head.appendChild(script);
  }

  function getEmailFromPage() {
    const mailtoAnchor = document.querySelector('a[href^="mailto:"]');
    if (!mailtoAnchor) return '';

    const href = mailtoAnchor.getAttribute('href') || '';
    return href.replace(/^mailto:/i, '').trim();
  }

  function getProfileData() {
    const nameEl = document.querySelector('h1');
    const name = nameEl?.textContent?.trim() || '';
    const profileUrl = window.location.href.split('?')[0];
    const email = getEmailFromPage();

    return {
      name,
      email,
      profileUrl,
      capturedAt: new Date().toISOString(),
      source: 'linkedin_profile'
    };
  }

  async function getWebhookUrl() {
    const result = await chrome.storage.sync.get(['appsScriptWebhookUrl']);
    return (result.appsScriptWebhookUrl || '').trim();
  }

  function showTick(wrapper) {
    wrapper.innerHTML = `
      <dotlottie-wc
        class="linktosheets-tick"
        src="https://lottie.host/7fd903da-a14f-44fb-b01f-e464b17e042f/4kkBxPVE5l.lottie"
        style="width:22px;height:22px"
        autoplay
        loop
      ></dotlottie-wc>
    `;
  }

  function showButton() {
    const nameEl = document.querySelector('h1');
    if (!nameEl) return;

    if (document.getElementById(WRAPPER_ID)) return;

    ensureDotLottieScript();

    const wrapper = document.createElement('span');
    wrapper.id = WRAPPER_ID;
    wrapper.className = 'linktosheets-wrapper';

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.className = 'linktosheets-btn';
    button.type = 'button';
    button.title = 'Add to Google Sheet';
    button.setAttribute('aria-label', 'Add LinkedIn profile to Google Sheet');
    button.textContent = '+';

    const status = document.createElement('span');
    status.className = 'linktosheets-status';

    button.addEventListener('click', async () => {
      button.disabled = true;
      status.textContent = 'Saving...';

      const webhookUrl = await getWebhookUrl();
      if (!webhookUrl) {
        button.disabled = false;
        status.textContent = 'Set webhook URL in extension options.';
        return;
      }

      const payload = getProfileData();

      chrome.runtime.sendMessage(
        {
          type: 'send-to-sheets',
          webhookUrl,
          payload
        },
        (response) => {
          if (chrome.runtime.lastError) {
            button.disabled = false;
            status.textContent = 'Extension error. Try again.';
            return;
          }

          if (!response?.ok) {
            button.disabled = false;
            status.textContent = 'Failed to save. Check webhook.';
            return;
          }

          status.textContent = 'Saved';
          showTick(wrapper);
        }
      );
    });

    wrapper.appendChild(button);
    wrapper.appendChild(status);
    nameEl.insertAdjacentElement('afterend', wrapper);
  }

  const observer = new MutationObserver(() => {
    showButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  showButton();
})();
