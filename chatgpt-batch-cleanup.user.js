// ==UserScript==
// @name         ChatGPT Batch Cleanup
// @namespace    https://github.com/OrangeMagician/ChatGPTBatchCleanup
// @version      1.2.0
// @description  Batch select, archive, or delete ChatGPT conversations.
// @homepageURL  https://github.com/OrangeMagician/ChatGPTBatchCleanup
// @supportURL   https://github.com/OrangeMagician/ChatGPTBatchCleanup/issues
// @downloadURL  https://raw.githubusercontent.com/OrangeMagician/ChatGPTBatchCleanup/main/chatgpt-batch-cleanup.user.js
// @updateURL    https://raw.githubusercontent.com/OrangeMagician/ChatGPTBatchCleanup/main/chatgpt-batch-cleanup.user.js
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

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

  GM_addStyle(":root {\n  --cgpt-batch-accent: #0f766e;\n  --cgpt-batch-accent-soft: rgb(15 118 110 / 10%);\n  --cgpt-batch-danger: #b42318;\n  --cgpt-batch-danger-soft: rgb(180 35 24 / 9%);\n  --cgpt-batch-focus: #2563eb;\n  --cgpt-batch-ink: #202123;\n  --cgpt-batch-muted: #676767;\n  --cgpt-batch-line: #deded8;\n  --cgpt-batch-panel: #f7f7f5;\n  --cgpt-batch-dialog: #fff;\n}\n\nhtml.dark,\nhtml[data-theme=\"dark\"],\nbody.dark {\n  --cgpt-batch-accent: #5eead4;\n  --cgpt-batch-accent-soft: rgb(94 234 212 / 12%);\n  --cgpt-batch-danger: #ff8a80;\n  --cgpt-batch-danger-soft: rgb(255 138 128 / 12%);\n  --cgpt-batch-focus: #60a5fa;\n  --cgpt-batch-ink: #ececec;\n  --cgpt-batch-muted: #b4b4b4;\n  --cgpt-batch-line: #454545;\n  --cgpt-batch-panel: #262626;\n  --cgpt-batch-dialog: #2f2f2f;\n}\n\n.cgpt-batch-header-host {\n  min-width: 0;\n}\n\n#cgpt-batch-toggle {\n  display: inline-grid;\n  flex: 0 0 28px;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  color: var(--cgpt-batch-muted);\n  background: transparent;\n  border: 0;\n  border-radius: 6px;\n  cursor: pointer;\n  place-items: center;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n}\n\n#cgpt-batch-toggle:hover:not(:disabled) {\n  color: var(--cgpt-batch-ink);\n  background: rgb(127 127 127 / 10%);\n}\n\n#cgpt-batch-toggle.active {\n  color: var(--cgpt-batch-accent);\n  background: var(--cgpt-batch-accent-soft);\n}\n\n#cgpt-batch-toggle:disabled {\n  cursor: not-allowed;\n  opacity: 0.45;\n}\n\n#cgpt-batch-toggle:focus-visible,\n#cgpt-batch-toolbar button:focus-visible,\n#cgpt-batch-dialog button:focus-visible {\n  outline: 2px solid var(--cgpt-batch-focus);\n  outline-offset: 1px;\n}\n\n#cgpt-batch-toggle svg,\n#cgpt-batch-toolbar svg {\n  display: block;\n  pointer-events: none;\n}\n\n#cgpt-batch-toolbar {\n  display: none;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 6px;\n  min-height: 38px;\n  margin: 0 8px 6px;\n  padding: 4px 5px 4px 8px;\n  color: var(--cgpt-batch-ink);\n  background: var(--cgpt-batch-panel);\n  border-top: 1px solid var(--cgpt-batch-line);\n  border-bottom: 1px solid var(--cgpt-batch-line);\n  font: 12px/1.25 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0;\n}\n\n#cgpt-batch-toolbar.active {\n  display: grid;\n}\n\n#cgpt-batch-toolbar .cgpt-batch-status {\n  min-width: 0;\n  overflow: hidden;\n  color: var(--cgpt-batch-muted);\n  font-variant-numeric: tabular-nums;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n#cgpt-batch-toolbar[data-tone=\"error\"] .cgpt-batch-status {\n  color: var(--cgpt-batch-danger);\n}\n\n#cgpt-batch-toolbar[data-tone=\"success\"] .cgpt-batch-status {\n  color: var(--cgpt-batch-accent);\n}\n\n#cgpt-batch-toolbar[data-tone=\"success\"] .cgpt-batch-actions {\n  visibility: hidden;\n}\n\n#cgpt-batch-toolbar .cgpt-batch-actions {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n}\n\n#cgpt-batch-toolbar .cgpt-batch-action {\n  display: inline-grid;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  color: var(--cgpt-batch-muted);\n  background: transparent;\n  border: 0;\n  border-radius: 6px;\n  cursor: pointer;\n  place-items: center;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n}\n\n#cgpt-batch-toolbar .cgpt-batch-action:hover:not(:disabled) {\n  color: var(--cgpt-batch-ink);\n  background: rgb(127 127 127 / 10%);\n}\n\n#cgpt-batch-toolbar .cgpt-batch-select-all.active {\n  color: var(--cgpt-batch-accent);\n  background: var(--cgpt-batch-accent-soft);\n}\n\n#cgpt-batch-toolbar .cgpt-batch-action.danger {\n  color: var(--cgpt-batch-danger);\n}\n\n#cgpt-batch-toolbar .cgpt-batch-action.danger:hover:not(:disabled) {\n  background: var(--cgpt-batch-danger-soft);\n}\n\n#cgpt-batch-toolbar .cgpt-batch-action:disabled {\n  cursor: not-allowed;\n  opacity: 0.35;\n}\n\n#cgpt-batch-toolbar .cgpt-batch-progress {\n  display: none;\n  grid-column: 1 / -1;\n  height: 3px;\n  overflow: hidden;\n  background: var(--cgpt-batch-line);\n  border-radius: 2px;\n}\n\n#cgpt-batch-toolbar.working .cgpt-batch-actions {\n  visibility: hidden;\n}\n\n#cgpt-batch-toolbar.working .cgpt-batch-progress {\n  display: block;\n}\n\n#cgpt-batch-toolbar .cgpt-batch-progress-value {\n  display: block;\n  width: 0;\n  height: 100%;\n  background: var(--cgpt-batch-accent);\n  border-radius: inherit;\n  transition: width 160ms ease-out;\n}\n\n.cgpt-batch-checkbox {\n  position: relative;\n  display: inline-grid;\n  flex: 0 0 24px;\n  width: 24px;\n  height: 28px;\n  margin-left: -4px;\n  pointer-events: none;\n  place-items: center;\n}\n\n.cgpt-batch-checkbox::before {\n  width: 14px;\n  height: 14px;\n  content: \"\";\n  background: transparent;\n  border: 1.5px solid #9b9b95;\n  border-radius: 4px;\n  box-sizing: border-box;\n}\n\n.cgpt-batch-selected .cgpt-batch-checkbox::before {\n  background: var(--cgpt-batch-accent);\n  border-color: var(--cgpt-batch-accent);\n}\n\n.cgpt-batch-selected .cgpt-batch-checkbox::after {\n  position: absolute;\n  width: 6px;\n  height: 3px;\n  content: \"\";\n  border-bottom: 1.5px solid #fff;\n  border-left: 1.5px solid #fff;\n  transform: translateY(-1px) rotate(-45deg);\n}\n\n.cgpt-batch-mode .cgpt-batch-row button {\n  visibility: hidden !important;\n  pointer-events: none !important;\n}\n\n.cgpt-batch-mode a[href*=\"/c/\"] {\n  cursor: pointer;\n  user-select: none;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.cgpt-batch-mode a[href*=\"/c/\"] > .cgpt-batch-content {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.cgpt-batch-mode a[href*=\"/c/\"].cgpt-batch-selected {\n  background: var(--cgpt-batch-accent-soft);\n}\n\n.cgpt-batch-row-hiding {\n  opacity: 0 !important;\n  transform: translateX(-6px);\n  pointer-events: none !important;\n  transition:\n    opacity 140ms ease-out,\n    transform 140ms ease-out;\n}\n\n#cgpt-batch-dialog {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  width: min(400px, calc(100vw - 32px));\n  max-height: calc(100dvh - 32px);\n  margin: 0;\n  padding: 0;\n  color: var(--cgpt-batch-ink);\n  background: var(--cgpt-batch-dialog);\n  border: 1px solid var(--cgpt-batch-line);\n  border-radius: 8px;\n  box-shadow: 0 18px 54px rgb(0 0 0 / 24%);\n  font: 14px/1.45 ui-sans-serif, system-ui, sans-serif;\n  letter-spacing: 0;\n  overscroll-behavior: contain;\n  transform: translate(-50%, -50%);\n}\n\n#cgpt-batch-dialog::backdrop {\n  background: rgb(0 0 0 / 42%);\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-content {\n  max-height: calc(100dvh - 32px);\n  overflow-y: auto;\n  padding: 20px;\n  box-sizing: border-box;\n}\n\n#cgpt-batch-dialog h2 {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 650;\n  letter-spacing: 0;\n  text-wrap: balance;\n}\n\n#cgpt-batch-dialog p {\n  margin: 8px 0 14px;\n  color: var(--cgpt-batch-muted);\n  text-wrap: pretty;\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-list {\n  display: grid;\n  gap: 0;\n  max-height: 210px;\n  margin: 0;\n  padding: 0;\n  overflow-y: auto;\n  border-top: 1px solid var(--cgpt-batch-line);\n  border-bottom: 1px solid var(--cgpt-batch-line);\n  list-style: none;\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-list li {\n  min-width: 0;\n  padding: 9px 2px;\n  overflow: hidden;\n  color: var(--cgpt-batch-ink);\n  border-bottom: 1px solid var(--cgpt-batch-line);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-list li:last-child {\n  border-bottom: 0;\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-more,\n#cgpt-batch-dialog .cgpt-batch-dialog-hidden {\n  margin: 10px 0 0;\n  font-size: 12px;\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-hidden {\n  color: var(--cgpt-batch-danger);\n  font-weight: 600;\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 20px;\n}\n\n#cgpt-batch-dialog button {\n  min-width: 72px;\n  height: 34px;\n  padding: 0 12px;\n  color: var(--cgpt-batch-ink);\n  background: transparent;\n  border: 1px solid var(--cgpt-batch-line);\n  border-radius: 6px;\n  cursor: pointer;\n  font: inherit;\n  font-weight: 600;\n  letter-spacing: 0;\n  touch-action: manipulation;\n}\n\n#cgpt-batch-dialog button:hover {\n  background: rgb(127 127 127 / 10%);\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-confirm {\n  color: #fff;\n  background: var(--cgpt-batch-accent);\n  border-color: var(--cgpt-batch-accent);\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-confirm:hover {\n  background: #0b655f;\n  border-color: #0b655f;\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-confirm.danger {\n  background: var(--cgpt-batch-danger);\n  border-color: var(--cgpt-batch-danger);\n}\n\n#cgpt-batch-dialog .cgpt-batch-dialog-confirm.danger:hover {\n  background: #941d14;\n  border-color: #941d14;\n}\n\nhtml.dark #cgpt-batch-dialog .cgpt-batch-dialog-confirm:hover,\nhtml[data-theme=\"dark\"] #cgpt-batch-dialog .cgpt-batch-dialog-confirm:hover,\nbody.dark #cgpt-batch-dialog .cgpt-batch-dialog-confirm:hover {\n  background: #34b9a9;\n  border-color: #34b9a9;\n}\n\nhtml.dark #cgpt-batch-dialog .cgpt-batch-dialog-confirm.danger:hover,\nhtml[data-theme=\"dark\"] #cgpt-batch-dialog .cgpt-batch-dialog-confirm.danger:hover,\nbody.dark #cgpt-batch-dialog .cgpt-batch-dialog-confirm.danger:hover {\n  background: #e66f66;\n  border-color: #e66f66;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  #cgpt-batch-toolbar .cgpt-batch-progress-value,\n  .cgpt-batch-row-hiding {\n    transition: none;\n  }\n}\n");

(() => {
  const CHECKBOX_CLASS = "cgpt-batch-checkbox";
  const CONTENT_CLASS = "cgpt-batch-content";
  const TOGGLE_ID = "cgpt-batch-toggle";
  const TOOLBAR_ID = "cgpt-batch-toolbar";
  const DIALOG_ID = "cgpt-batch-dialog";
  const STORAGE_KEY = "chatgptBatchCleanupState";
  const selectedIds = new Set();
  const selectedTitles = new Map();
  const clickTimers = new WeakMap();

  let selectionMode = false;
  let isWorking = false;
  let isConfirming = false;
  let scanQueued = false;
  let accessTokenPromise = null;
  let operationStatus = "";
  let operationTone = "neutral";
  let operationProgress = null;
  let sidebarObserver = null;
  let observedSidebarRoot = null;

  const ICONS = {
    archive:
      '<rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path>',
    close: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    selectAll:
      '<rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="m8 12 2.5 2.5L16 9"></path>',
    trash:
      '<path d="M3 6h18"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path>'
  };

  function icon(name) {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  }

  function conversationId(anchor) {
    try {
      const parts = new URL(anchor.href, location.href).pathname.split("/");
      const index = parts.indexOf("c");
      return index >= 0 ? parts[index + 1] || "" : "";
    } catch {
      return "";
    }
  }

  function allConversationAnchors() {
    return [...document.querySelectorAll('nav a[href*="/c/"]')].filter(conversationId);
  }

  function visibleConversationAnchors() {
    return allConversationAnchors().filter((anchor) => anchor.offsetParent !== null);
  }

  function normalizeTitle(value) {
    const title = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
    return title.slice(0, 200) || "未命名会话";
  }

  function conversationTitle(anchor) {
    return normalizeTitle(
      anchor?.dataset.cgptBatchTitle ||
        anchor?.getAttribute("aria-label") ||
        anchor?.textContent
    );
  }

  function selectConversation(id, anchor) {
    selectedIds.add(id);
    selectedTitles.set(id, conversationTitle(anchor));
  }

  function deselectConversation(id) {
    selectedIds.delete(id);
    selectedTitles.delete(id);
  }

  async function loadState() {
    try {
      const stored = await chrome.storage.local.get(STORAGE_KEY);
      const state = stored[STORAGE_KEY] || {};
      selectionMode = Boolean(state.selectionMode);
      const storedItems = Array.isArray(state.selectedItems) ? state.selectedItems : [];
      const storedIds = Array.isArray(state.selectedIds) ? state.selectedIds : [];
      if (selectionMode) {
        for (const item of storedItems) {
          if (!item || typeof item.id !== "string" || !item.id) continue;
          selectedIds.add(item.id);
          if (typeof item.title === "string" && item.title.trim()) {
            selectedTitles.set(item.id, normalizeTitle(item.title));
          }
        }
        for (const id of storedIds) {
          if (typeof id === "string" && id) selectedIds.add(id);
        }
      } else if (storedItems.length > 0 || storedIds.length > 0) {
        await saveState();
      }
    } catch (error) {
      console.warn("[ChatGPT Batch Cleanup] 无法读取保存状态", error);
    }
  }

  async function saveState(selectionModeOverride = selectionMode) {
    try {
      await chrome.storage.local.set({
        [STORAGE_KEY]: {
          selectionMode: selectionModeOverride,
          selectedIds: [...selectedIds],
          selectedItems: [...selectedIds].map((id) => ({
            id,
            title: selectedTitles.get(id) || ""
          }))
        }
      });
    } catch (error) {
      console.warn("[ChatGPT Batch Cleanup] 无法保存状态", error);
    }
  }

  function findConversationRow(anchor) {
    let current = anchor.parentElement;
    for (let depth = 0; current && depth < 7; depth += 1) {
      const links = current.querySelectorAll('a[href*="/c/"]');
      if (links.length === 1 && current.querySelector("button")) return current;
      current = current.parentElement;
    }
    return anchor.parentElement;
  }

  function hideConversationRow(id) {
    const anchor = allConversationAnchors().find((item) => conversationId(item) === id);
    if (!anchor) return;

    const row = findConversationRow(anchor);
    row.classList.add("cgpt-batch-row-hiding");
    row.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      row.style.display = "none";
    }, 180);
  }

  function rememberAnchorSemantics(anchor) {
    if (anchor.dataset.cgptBatchSemanticsSaved === "true") return;
    anchor.dataset.cgptBatchSemanticsSaved = "true";
    anchor.dataset.cgptBatchOriginalRole = anchor.getAttribute("role") || "";
    anchor.dataset.cgptBatchOriginalLabel = anchor.getAttribute("aria-label") || "";
    anchor.dataset.cgptBatchTitle = (anchor.getAttribute("aria-label") || anchor.textContent || "会话").trim();
  }

  function restoreAnchorSemantics(anchor) {
    if (anchor.dataset.cgptBatchSemanticsSaved !== "true") return;

    if (anchor.dataset.cgptBatchOriginalRole) {
      anchor.setAttribute("role", anchor.dataset.cgptBatchOriginalRole);
    } else {
      anchor.removeAttribute("role");
    }

    if (anchor.dataset.cgptBatchOriginalLabel) {
      anchor.setAttribute("aria-label", anchor.dataset.cgptBatchOriginalLabel);
    } else {
      anchor.removeAttribute("aria-label");
    }
    anchor.removeAttribute("aria-checked");
  }

  function renderConversation(anchor) {
    const existing = anchor.querySelector(`.${CHECKBOX_CLASS}`);
    const content = [...anchor.children].find(
      (element) =>
        !element.classList.contains(CHECKBOX_CLASS) &&
        !element.classList.contains("trailing")
    );
    const row = findConversationRow(anchor);

    if (!selectionMode) {
      existing?.remove();
      content?.classList.remove(CONTENT_CLASS);
      anchor.classList.remove("cgpt-batch-selected");
      row?.classList.remove("cgpt-batch-row");
      restoreAnchorSemantics(anchor);
      return;
    }

    const id = conversationId(anchor);
    if (!id) return;

    rememberAnchorSemantics(anchor);
    content?.classList.add(CONTENT_CLASS);
    if (!existing) {
      const control = document.createElement("span");
      control.className = CHECKBOX_CLASS;
      control.setAttribute("aria-hidden", "true");
      anchor.prepend(control);
    }

    const checked = selectedIds.has(id);
    const title = anchor.dataset.cgptBatchTitle || "会话";
    if (checked && !selectedTitles.has(id)) selectedTitles.set(id, title);
    anchor.classList.toggle("cgpt-batch-selected", checked);
    anchor.setAttribute("role", "checkbox");
    anchor.setAttribute("aria-checked", String(checked));
    anchor.setAttribute("aria-label", `${checked ? "取消选择" : "选择"}会话：${title}`);
    row?.classList.add("cgpt-batch-row");
  }

  async function toggleConversation(anchor) {
    const id = conversationId(anchor);
    if (!id || isWorking) return;

    if (selectedIds.has(id)) deselectConversation(id);
    else selectConversation(id, anchor);

    operationStatus = "";
    operationTone = "neutral";
    renderConversation(anchor);
    updateUi();
    await saveState();
  }

  async function toggleAllConversations() {
    if (!selectionMode || isWorking || isConfirming) return;

    const anchors = visibleConversationAnchors();
    const ids = anchors.map(conversationId).filter(Boolean);
    if (ids.length === 0) return;

    const allSelected = ids.every((id) => selectedIds.has(id));
    if (allSelected) {
      ids.forEach(deselectConversation);
    } else {
      anchors.forEach((anchor) => {
        const id = conversationId(anchor);
        if (id) selectConversation(id, anchor);
      });
    }

    operationStatus = "";
    operationTone = "neutral";
    anchors.forEach(renderConversation);
    updateUi();
    await saveState();
  }

  function bindConversation(anchor) {
    if (anchor.dataset.cgptBatchBound === "true") return;
    anchor.dataset.cgptBatchBound = "true";

    anchor.addEventListener("click", (event) => {
      if (!selectionMode) return;

      event.preventDefault();
      event.stopPropagation();

      const previousTimer = clickTimers.get(anchor);
      if (previousTimer) clearTimeout(previousTimer);

      if (event.detail > 1) {
        clickTimers.delete(anchor);
        return;
      }

      const timer = setTimeout(() => {
        clickTimers.delete(anchor);
        toggleConversation(anchor);
      }, 220);
      clickTimers.set(anchor, timer);
    });

    anchor.addEventListener("dblclick", async (event) => {
      if (!selectionMode || isWorking) return;

      event.preventDefault();
      event.stopPropagation();

      const timer = clickTimers.get(anchor);
      if (timer) clearTimeout(timer);
      clickTimers.delete(anchor);
      await saveState();
      location.assign(anchor.href);
    });

    anchor.addEventListener("keydown", (event) => {
      if (!selectionMode || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      toggleConversation(anchor);
    });
  }

  function findRecentHeading() {
    const labels = new Set(["最近", "Recent", "Chats", "会话"]);
    const candidates = [...document.querySelectorAll("nav h2, nav h3, nav div, nav span")];
    return candidates
      .filter((element) => {
        const text = (element.textContent || "").trim();
        return labels.has(text) && element.offsetParent !== null;
      })
      .sort((left, right) => left.querySelectorAll("*").length - right.querySelectorAll("*").length)[0];
  }

  function makeButton({ label, className, iconName, text, action }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `${iconName ? icon(iconName) : ""}${text ? `<span>${text}</span>` : ""}`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      Promise.resolve(action()).catch((error) => {
        console.warn("[ChatGPT Batch Cleanup] 操作失败", error);
      });
    });
    return button;
  }

  function createToggle() {
    return makeButton({
      label: "批量管理会话",
      className: "cgpt-batch-toggle",
      iconName: "trash",
      action: toggleSelectionMode
    });
  }

  function createToolbar() {
    const toolbar = document.createElement("section");
    toolbar.id = TOOLBAR_ID;
    toolbar.setAttribute("aria-label", "批量管理会话");

    const status = document.createElement("span");
    status.className = "cgpt-batch-status";
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");

    const progress = document.createElement("span");
    progress.className = "cgpt-batch-progress";
    progress.setAttribute("role", "progressbar");
    progress.innerHTML = '<span class="cgpt-batch-progress-value"></span>';

    const actions = document.createElement("span");
    actions.className = "cgpt-batch-actions";
    actions.append(
      makeButton({
        label: "全选当前列表",
        className: "cgpt-batch-action cgpt-batch-select-all",
        iconName: "selectAll",
        action: toggleAllConversations
      }),
      makeButton({
        label: "归档所选会话",
        className: "cgpt-batch-action cgpt-batch-operation",
        iconName: "archive",
        action: () => runBatch("archive")
      }),
      makeButton({
        label: "删除所选会话",
        className: "cgpt-batch-action cgpt-batch-operation danger",
        iconName: "trash",
        action: () => runBatch("delete")
      })
    );

    toolbar.append(status, actions, progress);
    return toolbar;
  }

  function createDialog() {
    const dialog = document.createElement("dialog");
    dialog.id = DIALOG_ID;
    dialog.setAttribute("aria-labelledby", "cgpt-batch-dialog-title");
    dialog.setAttribute(
      "aria-describedby",
      "cgpt-batch-dialog-description cgpt-batch-dialog-more cgpt-batch-dialog-hidden"
    );
    dialog.innerHTML = `
      <div class="cgpt-batch-dialog-content">
        <h2 id="cgpt-batch-dialog-title"></h2>
        <p id="cgpt-batch-dialog-description"></p>
        <ul class="cgpt-batch-dialog-list" aria-label="待处理会话"></ul>
        <p id="cgpt-batch-dialog-more" class="cgpt-batch-dialog-more" hidden></p>
        <p id="cgpt-batch-dialog-hidden" class="cgpt-batch-dialog-hidden" hidden></p>
        <div class="cgpt-batch-dialog-actions">
          <button type="button" class="cgpt-batch-dialog-cancel">取消</button>
          <button type="button" class="cgpt-batch-dialog-confirm"></button>
        </div>
      </div>
    `;
    document.body.append(dialog);
    return dialog;
  }

  function ensureUi() {
    const heading = findRecentHeading();
    if (!heading) return;

    const headingTrigger = heading.closest("button") || heading;
    const headingRow = headingTrigger.parentElement;
    if (!headingRow) return;
    headingRow.classList.add("cgpt-batch-header-host");

    let toggle = document.getElementById(TOGGLE_ID);
    if (!toggle) {
      toggle = createToggle();
      toggle.id = TOGGLE_ID;
      headingTrigger.insertAdjacentElement("afterend", toggle);
    }

    let toolbar = document.getElementById(TOOLBAR_ID);
    if (!toolbar) {
      toolbar = createToolbar();
      headingRow.insertAdjacentElement("afterend", toolbar);
    }

    if (!document.getElementById(DIALOG_ID)) createDialog();
  }

  async function toggleSelectionMode() {
    if (isWorking || isConfirming) return;

    selectionMode = !selectionMode;
    if (!selectionMode) {
      selectedIds.clear();
      selectedTitles.clear();
    }
    operationStatus = "";
    operationTone = "neutral";
    await saveState();
    scan();
  }

  function updateUi(status = null, tone = null) {
    if (status !== null) operationStatus = status;
    if (tone !== null) operationTone = tone;
    document.documentElement.classList.toggle("cgpt-batch-mode", selectionMode);

    const toggle = document.getElementById(TOGGLE_ID);
    const toolbar = document.getElementById(TOOLBAR_ID);
    if (!toggle || !toolbar) return;

    toggle.classList.toggle("active", selectionMode);
    toggle.disabled = isWorking || isConfirming;
    toggle.setAttribute("aria-pressed", String(selectionMode));
    toggle.setAttribute("aria-label", selectionMode ? "退出并清空选择" : "批量管理会话");
    toggle.title = selectionMode ? "退出并清空选择" : "批量管理会话";
    const toggleIcon = selectionMode ? "close" : "trash";
    if (toggle.dataset.icon !== toggleIcon) {
      toggle.innerHTML = icon(toggleIcon);
      toggle.dataset.icon = toggleIcon;
    }

    toolbar.classList.toggle("active", selectionMode);
    toolbar.classList.toggle("working", Boolean(operationProgress));
    toolbar.dataset.tone = operationTone;

    const statusElement = toolbar.querySelector(".cgpt-batch-status");
    statusElement.textContent = operationStatus || `已选 ${selectedIds.size}`;

    const selectableIds = visibleConversationAnchors().map(conversationId).filter(Boolean);
    const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.has(id));
    const selectAllButton = toolbar.querySelector(".cgpt-batch-select-all");
    const selectAllLabel = allSelected ? "取消全选当前列表" : "全选当前列表";
    selectAllButton.disabled = isWorking || isConfirming || selectableIds.length === 0;
    selectAllButton.classList.toggle("active", allSelected);
    selectAllButton.setAttribute("aria-pressed", String(allSelected));
    selectAllButton.setAttribute("aria-label", selectAllLabel);
    selectAllButton.title = selectAllLabel;

    const progress = toolbar.querySelector(".cgpt-batch-progress");
    if (operationProgress) {
      const percent = Math.round((operationProgress.processed / operationProgress.total) * 100);
      progress.setAttribute("aria-label", `${operationProgress.label}进度`);
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", String(operationProgress.total));
      progress.setAttribute("aria-valuenow", String(operationProgress.processed));
      progress.querySelector(".cgpt-batch-progress-value").style.width = `${percent}%`;
    } else {
      progress.removeAttribute("aria-valuenow");
      progress.querySelector(".cgpt-batch-progress-value").style.width = "0";
    }

    for (const button of toolbar.querySelectorAll(".cgpt-batch-operation")) {
      button.disabled = isWorking || isConfirming || selectedIds.size === 0;
    }
  }

  function scan() {
    ensureUi();
    updateUi();
    for (const anchor of visibleConversationAnchors()) {
      bindConversation(anchor);
      renderConversation(anchor);
    }

    if (!selectionMode) {
      document.querySelectorAll(`.${CHECKBOX_CLASS}`).forEach((item) => item.remove());
      document.querySelectorAll(".cgpt-batch-row").forEach((item) => item.classList.remove("cgpt-batch-row"));
      allConversationAnchors().forEach((anchor) => {
        anchor.classList.remove("cgpt-batch-selected");
        anchor.querySelector(`.${CONTENT_CLASS}`)?.classList.remove(CONTENT_CLASS);
        restoreAnchorSemantics(anchor);
      });
    }
    observeSidebar();
  }

  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(() => {
      scanQueued = false;
      scan();
    });
  }

  function observeSidebar() {
    const nav = document.querySelector("nav");
    const root = nav?.parentElement || nav;
    if (!root || root === observedSidebarRoot) return;

    sidebarObserver?.disconnect();
    sidebarObserver = new MutationObserver(queueScan);
    sidebarObserver.observe(root, { childList: true, subtree: true });
    observedSidebarRoot = root;
  }

  function confirmBatchAction(action, ids) {
    const dialog = document.getElementById(DIALOG_ID) || createDialog();
    const isDelete = action === "delete";
    const title = dialog.querySelector("#cgpt-batch-dialog-title");
    const description = dialog.querySelector("#cgpt-batch-dialog-description");
    const list = dialog.querySelector(".cgpt-batch-dialog-list");
    const more = dialog.querySelector(".cgpt-batch-dialog-more");
    const hidden = dialog.querySelector(".cgpt-batch-dialog-hidden");
    const cancelButton = dialog.querySelector(".cgpt-batch-dialog-cancel");
    const confirmButton = dialog.querySelector(".cgpt-batch-dialog-confirm");
    const visibleById = new Map(
      visibleConversationAnchors().map((anchor) => [conversationId(anchor), anchor])
    );
    const items = ids.map((id) => ({
      id,
      title: selectedTitles.get(id) || conversationTitle(visibleById.get(id)),
      isVisible: visibleById.has(id)
    }));
    const hiddenCount = items.filter((item) => !item.isVisible).length;
    const previewLimit = 6;

    title.textContent = `${isDelete ? "删除" : "归档"} ${items.length} 个会话？`;
    description.textContent = isDelete
      ? "删除后将无法恢复。"
      : "归档后可在 ChatGPT 设置中查看和恢复。";
    list.replaceChildren(
      ...items.slice(0, previewLimit).map((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item.title;
        listItem.title = item.title;
        return listItem;
      })
    );
    more.hidden = items.length <= previewLimit;
    more.textContent = more.hidden ? "" : `另有 ${items.length - previewLimit} 个会话未在此列出。`;
    hidden.hidden = hiddenCount === 0;
    hidden.textContent = hidden.hidden
      ? ""
      : `其中 ${hiddenCount} 个会话当前不在侧栏列表中，但仍会处理。`;
    confirmButton.textContent = isDelete ? "确认删除" : "确认归档";
    confirmButton.classList.toggle("danger", isDelete);

    return new Promise((resolve) => {
      let settled = false;
      const finish = (confirmed) => {
        if (settled) return;
        settled = true;
        cancelButton.removeEventListener("click", cancel);
        confirmButton.removeEventListener("click", confirm);
        dialog.removeEventListener("cancel", onCancel);
        dialog.close();
        resolve(confirmed);
      };
      const cancel = () => finish(false);
      const confirm = () => finish(true);
      const onCancel = (event) => {
        event.preventDefault();
        finish(false);
      };

      cancelButton.addEventListener("click", cancel);
      confirmButton.addEventListener("click", confirm);
      dialog.addEventListener("cancel", onCancel);
      dialog.showModal();
      requestAnimationFrame(() => cancelButton.focus());
    });
  }

  async function getAccessToken() {
    if (!accessTokenPromise) {
      accessTokenPromise = fetch(`${location.origin}/api/auth/session`, {
        credentials: "include",
        cache: "no-store"
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`无法读取登录状态 (HTTP ${response.status})`);
          const session = await response.json();
          if (!session.accessToken) throw new Error("当前登录状态中没有访问令牌");
          return session.accessToken;
        })
        .catch((error) => {
          accessTokenPromise = null;
          throw error;
        });
    }
    return accessTokenPromise;
  }

  async function requestConversationAction(id, action, retry = true) {
    const accessToken = await getAccessToken();
    const body = action === "archive" ? { is_archived: true } : { is_visible: false };
    const response = await fetch(
      `${location.origin}/backend-api/conversation/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    if (response.status === 401 && retry) {
      accessTokenPromise = null;
      return requestConversationAction(id, action, false);
    }
    if (!response.ok) throw new Error(`请求失败 (HTTP ${response.status})`);
  }

  async function runBatch(action) {
    if (isWorking || isConfirming || selectedIds.size === 0) return;

    const ids = [...selectedIds];
    isConfirming = true;
    updateUi();
    let confirmed = false;
    try {
      confirmed = await confirmBatchAction(action, ids);
    } finally {
      isConfirming = false;
      updateUi();
    }
    if (!confirmed) return;

    isWorking = true;
    const actionLabel = action === "archive" ? "归档" : "删除";
    let completed = 0;
    let processed = 0;
    const failed = [];
    operationProgress = { label: actionLabel, processed: 0, total: ids.length };
    updateUi(`正在${actionLabel} 0/${ids.length}`, "neutral");

    for (const id of ids) {
      try {
        await requestConversationAction(id, action);
        deselectConversation(id);
        hideConversationRow(id);
        completed += 1;
      } catch (error) {
        failed.push({ id, message: error instanceof Error ? error.message : String(error) });
        console.warn("[ChatGPT Batch Cleanup]", id, error);
      }
      processed += 1;
      operationProgress.processed = processed;
      updateUi(`正在${actionLabel} ${processed}/${ids.length}`);
    }

    isWorking = false;
    operationProgress = null;

    if (failed.length > 0) {
      updateUi(`${completed} 个成功，${failed.length} 个失败；失败项已保留`, "error");
      await saveState();
    } else {
      updateUi(`${actionLabel}完成 ${completed}/${ids.length}`, "success");
      await saveState(false);
    }

    if (completed > 0) setTimeout(() => location.reload(), 1400);
  }

  async function start() {
    document.getElementById("cgpt-batch-controls")?.remove();
    await loadState();
    scan();

    if (!observedSidebarRoot) {
      const bootstrapObserver = new MutationObserver(() => {
        if (!document.querySelector("nav")) return;
        bootstrapObserver.disconnect();
        queueScan();
      });
      bootstrapObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  start();
})();
})();
