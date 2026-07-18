import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
const content = await readFile(path.join(root, "content.js"), "utf8");
const styles = await readFile(path.join(root, "styles.css"), "utf8");
const outputPath = path.join(root, "chatgpt-batch-cleanup.user.js");
const repositoryUrl = "https://github.com/OrangeMagician/ChatGPTBatchCleanup";
const rawUserscriptUrl =
  "https://raw.githubusercontent.com/OrangeMagician/ChatGPTBatchCleanup/main/chatgpt-batch-cleanup.user.js";
const rawIconUrl =
  "https://raw.githubusercontent.com/OrangeMagician/ChatGPTBatchCleanup/main/icons/icon-128.png";

const metadata = `// ==UserScript==
// @name         ChatGPT Batch Cleanup
// @namespace    ${repositoryUrl}
// @version      ${manifest.version}
// @description  Batch select, archive, or delete ChatGPT conversations.
// @homepageURL  ${repositoryUrl}
// @supportURL   ${repositoryUrl}/issues
// @downloadURL  ${rawUserscriptUrl}
// @updateURL    ${rawUserscriptUrl}
// @icon         ${rawIconUrl}
// @icon64       ${rawIconUrl}
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==`;

const userscript = `${metadata}

// Generated from content.js and styles.css. Run scripts/build-userscript.mjs after editing either file.
(() => {
  "use strict";

  const chrome = {
    storage: {
      local: {
        async get(key) {
          const value = await GM_getValue(key);
          return value === undefined ? {} : { [key]: value };
        },
        async set(items) {
          await Promise.all(
            Object.entries(items).map(([key, value]) => GM_setValue(key, value))
          );
        }
      }
    }
  };

  GM_addStyle(${JSON.stringify(styles)});

${content.trimEnd()}
})();
`;

if (process.argv.includes("--check")) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== userscript) {
    console.error("chatgpt-batch-cleanup.user.js is out of date. Run: node scripts/build-userscript.mjs");
    process.exitCode = 1;
  } else {
    console.log(`chatgpt-batch-cleanup.user.js is up to date (${manifest.version})`);
  }
} else {
  await writeFile(outputPath, userscript);
  console.log(`Generated chatgpt-batch-cleanup.user.js (${manifest.version})`);
}
