# LinkedIn to Google Sheets Browser Extension

A lightweight Manifest V3 browser extension that adds a small **+** button next to a LinkedIn profile name.
When clicked, it captures profile data and sends it to your Google Sheet through your Google Apps Script Web App URL.

## Captured fields
- `name`
- `email` (only if present on page in a visible `mailto:` link)
- `profileUrl`
- `capturedAt`

## Files
- `manifest.json` - extension config
- `content.js` / `content.css` - injects the button into LinkedIn profile pages
- `service-worker.js` - posts data to your webhook
- `options.html` / `options.js` - save your Apps Script URL
- `popup.html` / `popup.js` - quick extension guidance

## Load in browser (Chrome/Edge)
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder (`/workspace/linktosheets`)

### Important for Incognito / InPrivate
If you test LinkedIn in Incognito/InPrivate mode, open the extension card in `chrome://extensions` and enable:
- **Allow in Incognito** (Chrome)
- **Allow in InPrivate** (Edge)

Without this setting, content scripts do not run and the **+** button will not appear.

## Configure
1. Open extension details and click **Extension options**
2. Paste your deployed Google Apps Script Web App URL
3. Save

## Use
1. Open any LinkedIn profile URL (`https://www.linkedin.com/in/...`)
2. Click the small `+` next to the profile name
3. On success, the `+` is replaced with a small looping Lottie tick animation

## Troubleshooting
- Reload the extension after code changes.
- Refresh the LinkedIn tab after loading the extension.
- Verify you are on a profile URL (`/in/`).
- In Incognito/InPrivate, ensure extension access is enabled.

## Notes
- Keep usage compliant with LinkedIn policies and your own legal/privacy obligations.
- This extension only reads data already present on the currently-open profile page and sends data only when you click the button.
