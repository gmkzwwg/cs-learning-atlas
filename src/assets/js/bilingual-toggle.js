/*
 * Introduction:
 * Turns Markdown-generated language blocks into bilingual side-by-side layouts.
 * The script detects language-label h1 blocks, removes the labels, and aligns matching blocks row by row.
 *
 * Usage:
 * Include this file after the article HTML, or include it in <head>; it runs automatically when the DOM is ready.
 * Default container: .post-content. Default language heading selector: h1.
 *
 * Global API:
 * BilingualMDLayout.render()
 * BilingualMDLayout.reset()
 * BilingualMDLayout.updateConfig(partialConfig)
 * BilingualMDLayout.getConfig()
 * updateConfig(partialConfig) is also exposed as a direct global shortcut.
 *
 * Notes:
 * Only headings whose text matches configured language aliases are treated as language labels.
 * Each language section ends at the next configured heading, even if that heading is not a language label.
 * Multiple pairs such as # English # 中文 # English # 中文 are processed as separate bilingual groups.
 */

(function () {
  "use strict";

  const CONFIG = {
    contentSelector: ".post-content", // Main Markdown article container.
    languageHeadingSelector: "h1", // Language block marker, usually h1.
    gap: "1.6rem", // Space between columns and center divider.
    dividerOpacity: 0.45, // Center line opacity.
    restoreButtonText: "看双语内容", // Text used in single-language mode.
    autoRun: true, // Plug-and-play behavior.

    languages: {
      zh: {
        name: "中文",
        aliases: ["中文", "汉语", "漢語", "华语", "華語", "zh", "zh-cn", "chinese", "cn", "中文版"],
        buttonText: "阅读中文版"
      },
      en: {
        name: "English",
        aliases: ["英语", "英語", "英文", "en", "eng", "english", "english version", "英文版"],
        buttonText: "View in English"
      },
      fr: {
        name: "Français",
        aliases: ["法语", "法語", "法文", "fr", "fra", "fre", "french", "français", "francais", "francis"],
        buttonText: "Lire en français"
      }
    }
  };

  const STATE = {
    config: deepMerge({}, CONFIG), // Runtime config.
    root: null, // Current processed article container.
    originalHTML: null, // Original HTML for reset/re-render.
    wrappers: [] // Generated bilingual groups.
  };

  /** Deep-merges config objects; parameters are target object and one or more sources. */
  function deepMerge(target, ...sources) {
    sources.forEach((source) => {
      if (!source || typeof source !== "object") return; // Ignore invalid config.

      Object.keys(source).forEach((key) => {
        const value = source[key];

        if (Array.isArray(value)) {
          target[key] = value.slice(); // Copy arrays.
        } else if (value && typeof value === "object") {
          target[key] = deepMerge(target[key] || {}, value); // Merge nested config.
        } else {
          target[key] = value; // Assign primitive value.
        }
      });
    });

    return target;
  }

  /** Normalizes heading text for alias matching; parameter is raw heading text. */
  function normalizeLabel(text) {
    return String(text || "")
      .trim()
      .toLowerCase()
      .replace(/[：:]/g, "")
      .replace(/\s+/g, " ");
  }

  /** Returns language key if heading text is a configured language label; parameter is heading text. */
  function getLanguageKey(text) {
    const label = normalizeLabel(text);
    const languages = STATE.config.languages;

    return Object.keys(languages).find((key) => {
      const aliases = languages[key].aliases || [];
      return aliases.map(normalizeLabel).includes(label); // Exact match only.
    });
  }

  /** Checks whether a node is the configured section heading; parameter is a DOM node. */
  function isSectionHeading(node) {
    return node.nodeType === Node.ELEMENT_NODE && node.matches(STATE.config.languageHeadingSelector);
  }

  /** Checks whether a heading is a language label; parameter is a DOM node. */
  function isLanguageHeading(node) {
    return isSectionHeading(node) && Boolean(getLanguageKey(node.textContent));
  }

  /** Checks whether a DOM node should be rendered inside bilingual rows; parameter is a DOM node. */
  function isRenderableNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) return true; // Keep elements.
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0; // Keep meaningful text.
    return false; // Drop comments and empty whitespace.
  }

  /** Collects section content until the next configured heading; parameters are all nodes and start index. */
  function collectSection(nodes, startIndex) {
    const sectionNodes = [];
    let i = startIndex;

    while (i < nodes.length && !isSectionHeading(nodes[i])) {
      sectionNodes.push(nodes[i]); // Section belongs only to the current h1.
      i += 1;
    }

    return {
      nodes: sectionNodes,
      endIndex: i // Points to next h1 or document end.
    };
  }

  /** Clones nodes into a document fragment; parameter is an array of DOM nodes. */
  function cloneNodes(nodes) {
    const fragment = document.createDocumentFragment();

    nodes.forEach((node) => {
      fragment.appendChild(node.cloneNode(true)); // Preserve original nodes.
    });

    return fragment;
  }

  /** Appends cloned nodes to a parent; parameters are parent node and node array. */
  function appendClones(parent, nodes) {
    parent.appendChild(cloneNodes(nodes)); // Keep unprocessed content unchanged.
  }

  /** Creates a compact control button; parameters are text, className, and click handler. */
  function createButton(text, className, onClick) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `bmd-button ${className}`;
    button.textContent = text;
    button.addEventListener("click", onClick); // Switch display mode.

    return button;
  }

  /** Returns button text for a language key; parameter is language key. */
  function getButtonText(lang) {
    const langConfig = STATE.config.languages[lang] || {};
    return langConfig.buttonText || langConfig.name || lang;
  }

  /** Injects layout CSS once; no parameters. */
  function injectStyles() {
    if (document.getElementById("bmd-layout-style")) return; // Avoid duplicate style tags.

    const style = document.createElement("style");
    style.id = "bmd-layout-style";
    style.textContent = `
      .bmd-wrapper {
        --bmd-gap: 1.6rem;
        --bmd-divider-opacity: 0.45;
        width: 100%;
        margin: 1rem 0;
      }

      .bmd-toolbar {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
        column-gap: var(--bmd-gap);
        align-items: center;
        margin: 0.75rem 0 1rem;
      }

      .bmd-toolbar-divider {
        width: 1px;
        min-height: 1em;
      }

      .bmd-button {
        font: inherit;
        line-height: 1.2;
        cursor: pointer;
        padding: 0.35em 0.75em;
        border: 1px solid currentColor;
        border-radius: 999px;
        background: transparent;
        opacity: 0.82;
      }

      .bmd-button:hover {
        opacity: 1;
      }

      .bmd-button-left,
      .bmd-button-right {
        justify-self: center;
      }

      .bmd-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
        column-gap: var(--bmd-gap);
        align-items: stretch;
      }

      .bmd-cell {
        min-width: 0;
        max-width: 100%;
        overflow-wrap: break-word;
        word-break: normal;
      }

      .bmd-cell * {
        box-sizing: border-box;
        max-width: 100%;
      }

      .bmd-cell a {
        overflow-wrap: anywhere;
        word-break: break-word;
        white-space: normal;
      }

      .bmd-cell ul,
      .bmd-cell ol {
        padding-inline-start: 1.35em;
      }

      .bmd-cell pre {
        max-width: 100%;
        overflow-x: auto;
        white-space: pre;
      }

      .bmd-cell table {
        display: block;
        max-width: 100%;
        overflow-x: auto;
      }

      .bmd-cell > :first-child {
        margin-top: 0;
      }

      .bmd-divider {
        width: 1px;
        min-height: 1em;
        align-self: stretch;
        background: currentColor;
        opacity: var(--bmd-divider-opacity);
      }

      .bmd-mode-left .bmd-toolbar,
      .bmd-mode-right .bmd-toolbar {
        display: block;
        text-align: center;
      }

      .bmd-mode-left .bmd-button-right,
      .bmd-mode-left .bmd-toolbar-divider,
      .bmd-mode-right .bmd-button-left,
      .bmd-mode-right .bmd-toolbar-divider {
        display: none;
      }

      .bmd-mode-left .bmd-row,
      .bmd-mode-right .bmd-row {
        display: block;
      }

      .bmd-mode-left .bmd-cell-right,
      .bmd-mode-left .bmd-divider,
      .bmd-mode-right .bmd-cell-left,
      .bmd-mode-right .bmd-divider {
        display: none;
      }
    `;

    document.head.appendChild(style);
  }

  /** Sets bilingual, left-only, or right-only view; parameters are wrapper and mode string. */
  function setMode(wrapper, mode) {
    const leftButton = wrapper.querySelector(".bmd-button-left");
    const rightButton = wrapper.querySelector(".bmd-button-right");
    const leftLang = wrapper.dataset.leftLang;
    const rightLang = wrapper.dataset.rightLang;

    wrapper.classList.remove("bmd-mode-bilingual", "bmd-mode-left", "bmd-mode-right");
    wrapper.classList.add(`bmd-mode-${mode}`);

    if (mode === "bilingual") {
      leftButton.textContent = getButtonText(leftLang); // Button belongs to left text.
      rightButton.textContent = getButtonText(rightLang); // Button belongs to right text.
      return;
    }

    if (mode === "left") leftButton.textContent = STATE.config.restoreButtonText; // Restore from left-only mode.
    if (mode === "right") rightButton.textContent = STATE.config.restoreButtonText; // Restore from right-only mode.
  }

  /** Builds aligned bilingual rows; parameters are left and right section node arrays. */
  function createRows(leftNodes, rightNodes) {
    const fragment = document.createDocumentFragment();
    const left = leftNodes.filter(isRenderableNode);
    const right = rightNodes.filter(isRenderableNode);
    const max = Math.max(left.length, right.length);

    for (let i = 0; i < max; i += 1) {
      const row = document.createElement("div");
      const leftCell = document.createElement("div");
      const divider = document.createElement("div");
      const rightCell = document.createElement("div");

      row.className = "bmd-row";
      leftCell.className = "bmd-cell bmd-cell-left";
      divider.className = "bmd-divider";
      rightCell.className = "bmd-cell bmd-cell-right";

      if (left[i]) leftCell.appendChild(left[i].cloneNode(true)); // Align by block index.
      if (right[i]) rightCell.appendChild(right[i].cloneNode(true)); // Matching translated block.

      row.append(leftCell, divider, rightCell);
      fragment.appendChild(row);
    }

    return fragment;
  }

  /** Builds one bilingual group wrapper; parameter is selected section data. */
  function buildLayout(sections) {
    const wrapper = document.createElement("div");
    const toolbar = document.createElement("div");
    const toolbarDivider = document.createElement("div");
    const rows = document.createElement("div");

    wrapper.className = "bmd-wrapper bmd-mode-bilingual";
    wrapper.dataset.leftLang = sections.leftLang;
    wrapper.dataset.rightLang = sections.rightLang;
    wrapper.style.setProperty("--bmd-gap", STATE.config.gap); // Runtime spacing.
    wrapper.style.setProperty("--bmd-divider-opacity", STATE.config.dividerOpacity); // Runtime divider opacity.

    toolbar.className = "bmd-toolbar";
    toolbarDivider.className = "bmd-toolbar-divider";
    rows.className = "bmd-rows";

    const leftButton = createButton(getButtonText(sections.leftLang), "bmd-button-left", () => {
      const isSingle = wrapper.classList.contains("bmd-mode-left");
      setMode(wrapper, isSingle ? "bilingual" : "left"); // Show left language only.
    });

    const rightButton = createButton(getButtonText(sections.rightLang), "bmd-button-right", () => {
      const isSingle = wrapper.classList.contains("bmd-mode-right");
      setMode(wrapper, isSingle ? "bilingual" : "right"); // Show right language only.
    });

    toolbar.append(leftButton, toolbarDivider, rightButton); // Buttons sit above their own columns.
    rows.appendChild(createRows(sections.left, sections.right));
    wrapper.append(toolbar, rows);

    return wrapper;
  }

  /** Processes all valid language pairs in the article; parameter is article root. */
  function buildProcessedContent(root) {
    const nodes = Array.from(root.childNodes);
    const fragment = document.createDocumentFragment();
    let i = 0;
    let processed = false;

    while (i < nodes.length) {
      const current = nodes[i];

      if (!isLanguageHeading(current)) {
        fragment.appendChild(current.cloneNode(true)); // Keep ordinary content unchanged.
        i += 1;
        continue;
      }

      const leftLang = getLanguageKey(current.textContent);
      const leftSection = collectSection(nodes, i + 1);
      const nextHeading = nodes[leftSection.endIndex];

      if (!isLanguageHeading(nextHeading)) {
        fragment.appendChild(current.cloneNode(true)); // Keep unpaired language heading unchanged.
        appendClones(fragment, leftSection.nodes);
        i = leftSection.endIndex;
        continue;
      }

      const rightLang = getLanguageKey(nextHeading.textContent);
      const rightSection = collectSection(nodes, leftSection.endIndex + 1);
      const wrapper = buildLayout({
        leftLang,
        rightLang,
        left: leftSection.nodes,
        right: rightSection.nodes
      });

      fragment.appendChild(wrapper);
      STATE.wrappers.push(wrapper);
      processed = true;
      i = rightSection.endIndex; // Continue scanning after this pair.
    }

    return { fragment, processed };
  }

  /** Renders bilingual layouts inside the configured article container; no parameters. */
  function render() {
    const root = document.querySelector(STATE.config.contentSelector);
    if (!root) return false; // Container not found.
    if (root.dataset.bmdProcessed === "true") return true; // Avoid duplicate rendering.

    injectStyles();

    STATE.root = root;
    STATE.originalHTML = root.innerHTML;
    STATE.wrappers = [];

    const result = buildProcessedContent(root);
    if (!result.processed) {
      STATE.root = null;
      STATE.originalHTML = null;
      STATE.wrappers = [];
      return false; // No valid bilingual pair found.
    }

    root.innerHTML = "";
    root.appendChild(result.fragment);
    root.dataset.bmdProcessed = "true";

    return true;
  }

  /** Restores the original article HTML before bilingual processing; no parameters. */
  function reset() {
    if (!STATE.root || STATE.originalHTML === null) return false; // Nothing to restore.

    STATE.root.innerHTML = STATE.originalHTML;
    delete STATE.root.dataset.bmdProcessed;

    STATE.root = null;
    STATE.originalHTML = null;
    STATE.wrappers = [];

    return true;
  }

  /** Updates runtime config and re-renders; parameter is a partial config object. */
  function updateConfig(partialConfig) {
    reset(); // Revert before applying new rules.
    STATE.config = deepMerge({}, STATE.config, partialConfig || {});
    return render(); // Re-apply immediately.
  }

  /** Returns a copy of the active config; no parameters. */
  function getConfig() {
    return deepMerge({}, STATE.config);
  }

  window.BilingualMDLayout = {
    render,
    reset,
    updateConfig,
    getConfig
  };

  window.updateConfig = updateConfig; // Direct shortcut.

  if (STATE.config.autoRun) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", render, { once: true }); // Run after DOM ready.
    } else {
      render(); // Run immediately if DOM is ready.
    }
  }
})();