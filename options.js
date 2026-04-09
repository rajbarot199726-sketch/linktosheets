const webhookInput = document.getElementById('webhook');
const saveBtn = document.getElementById('save');
const statusEl = document.getElementById('status');

async function load() {
  const result = await chrome.storage.sync.get(['appsScriptWebhookUrl']);
  webhookInput.value = result.appsScriptWebhookUrl || '';
}

saveBtn.addEventListener('click', async () => {
  const url = webhookInput.value.trim();

  await chrome.storage.sync.set({ appsScriptWebhookUrl: url });
  statusEl.textContent = 'Saved.';
});

load();
