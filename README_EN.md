# ChatGPT Batch Cleanup

[简体中文](README.md) | English

A small ChatGPT conversation management tool for selecting, archiving, or deleting multiple conversations from the sidebar.

The project provides both a userscript and an unpacked Chrome extension. It intentionally stays focused and does not include analytics, cloud sync, advertising, or unrelated features.

## Features

- Select or deselect a conversation with a single click.
- Select or deselect all conversations currently loaded in the sidebar.
- Archive selected conversations in bulk.
- Delete selected conversations in bulk.
- Review conversation titles and confirm archive or delete operations before processing.
- Show batch progress and hide each successfully processed conversation immediately.
- Preserve selected items across page reloads and conversation navigation.
- Support both light and dark ChatGPT themes.

## Userscript Installation (Recommended)

1. Install Tampermonkey in Chrome.
2. Open the [userscript installation URL](https://raw.githubusercontent.com/OrangeMagician/ChatGPTBatchCleanup/main/chatgpt-batch-cleanup.user.js).
3. Confirm the installation in Tampermonkey, then refresh ChatGPT.

The userscript is a single-file build intended for personal use and GitHub distribution. It does not require a Chrome Web Store developer account.

## Chrome Extension Installation

1. Download the project, or run `git clone https://github.com/OrangeMagician/ChatGPTBatchCleanup.git`.
2. Open `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project root directory, then refresh ChatGPT.

## Usage

1. Click the batch-management button next to the **Recent** heading in the ChatGPT sidebar.
2. Click a conversation to select it; click it again to deselect it.
3. Double-click a conversation to open it while keeping the current selection.
4. Use the current-list select-all, archive, or delete buttons in the toolbar.
5. Review the conversation titles in the confirmation dialog, then confirm the action. The toolbar will display processing progress.
6. Click the highlighted exit button to leave selection mode and clear the selection.

Successfully archived or deleted conversations are hidden from the sidebar immediately. The page refreshes after the batch finishes. Failed items remain selected so they can be retried. The dialog warns when previously selected conversations are not currently visible in the sidebar but will still be processed.

## Data and Privacy

- Selection state, conversation IDs, and conversation titles used for confirmation are stored only in the local browser.
- Conversation message content is not read or stored.
- ChatGPT login tokens are not stored.
- No data is sent to the developer or third-party servers.
- Archive and delete requests are sent only to the currently signed-in ChatGPT site.

## Notes

- Deleted conversations cannot be recovered. Review the selection before confirming.
- This project depends on the current ChatGPT page structure and private web endpoints. Future ChatGPT updates may require corresponding changes.
- This is an unofficial project and is not affiliated with or endorsed by OpenAI or ChatGPT.

## Development

`content.js` and `styles.css` are the shared source files for both installation formats. After changing either file, run:

```bash
node scripts/build-userscript.mjs
```

This command regenerates `chatgpt-batch-cleanup.user.js` using the version in `manifest.json`.

Before committing changes, run:

```bash
node --check content.js
node --check chatgpt-batch-cleanup.user.js
node scripts/build-userscript.mjs --check
```

GitHub Actions runs the same source and generated-file consistency checks for pushes and pull requests.

## License

This project is available under the [MIT License](LICENSE).

## Project Structure

```text
ChatGPTBatchCleanup/
├── .github/workflows/verify.yml   # GitHub verification workflow
├── chatgpt-batch-cleanup.user.js  # Installable userscript
├── content.js                     # Core behavior
├── LICENSE                        # MIT License
├── styles.css                     # Interface styles
├── manifest.json                  # Chrome extension manifest
├── scripts/build-userscript.mjs   # Userscript build tool
├── README.md                      # Chinese documentation
└── README_EN.md                   # English documentation
```
