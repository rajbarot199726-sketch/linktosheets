chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'send-to-sheets') {
    return false;
  }

  (async () => {
    try {
      const { webhookUrl, payload } = message;

      if (!webhookUrl) {
        throw new Error('Missing Google Apps Script webhook URL.');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      sendResponse({
        ok: response.ok,
        status: response.status,
        body: responseText
      });
    } catch (error) {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  })();

  return true;
});
