/*
 * Introduction:
 * Turns Markdown-generated language blocks into a bilingual side-by-side layout.
 * The script detects language label headings, removes the labels, and aligns matching blocks row by row.
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
 * Edit CONFIG below for static customization, or call updateConfig() after this script has loaded.
 */

(function () {
  "use strict";

  const CONFIG = {
    contentSelector: ".post-content", // Main Markdown article container.
    languageHeadingSelector: "h1", // Language block marker, usually h1 in Markdown output.
    gap: "1.6rem", // Space between columns and center divider.
    dividerOpacity: 0.42, // Center line opacity.
    restoreButtonText: "看双语内容", // Text used in desktop single-language mode.
    narrowBreakpoint: 760, // Below this width, show only one language.
    autoRun: true, // Plug-and-play behavior.

    languageFontScale: {
      zh: 1.1, // Chinese is usually shorter, so it is enlarged slightly by default.
      en: 0.85,
      fr: 0.85
    },

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
    config: deepMerge({}, CONFIG), // Runtime config, changed by updateConfig().
    root: null, // Current processed article container.
    originalHTML: null, // Original HTML for reset/re-render.
    wrapper: null, // Generated bilingual layout wrapper.
    leftLang: null, // Language key for left column.
    rightLang: null // Language key for right column.
  };

  /** Deep-merges config objects; parameters are target object and one or more sources. */
  function deepMerge(target, ...sources) {
    sources.forEach((source) => {
      if (!source || typeof source !== "object") return; // Ignore invalid config input.

      Object.keys(source).forEach((key) => {
        const value = source[key];

        if (Array.isArray(value)) {
          target[key] = value.slice(); // Copy arrays to avoid shared mutation.
        } else if (value && typeof value === "object") {
          target[key] = deepMerge(target[key] || {}, value); // Merge nested config.
        } else {
          target[key] = value; // Assign primitive values.
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
      return aliases.map(normalizeLabel).includes(label); // Exact match avoids false positives.
    });
  }

  /** Checks whether a DOM node should be kept in a rendered section; parameter is a DOM node. */
  function isRenderableNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) return true; // Keep elements.
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0; // Keep meaningful text.
    return false; // Drop comments and empty nodes.
  }

  /** Finds direct child language markers inside the article; parameter is the article root. */
  function findLanguageMarkers(root) {
    const selector = STATE.config.languageHeadingSelector;
    const nodes = Array.from(root.childNodes);
    const markers = [];

    nodes.forEach((node, index) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return; // Only elements can match selectors.
      if (!node.matches(selector)) return; // Only configured heading selector is valid.

      const lang = getLanguageKey(node.textContent);
      if (!lang) return; // Ignore ordinary headings.

      markers.push({ node, index, lang });
    });

    return markers;
  }

  /** Selects the first two detected language sections; parameters are article root and detected markers. */
  function getFirstPairSections(root, markers) {
    if (markers.length < 2) return null; // Need two language blocks.

    const allNodes = Array.from(root.childNodes);
    const leftMarker = markers[0];
    const rightMarker = markers[1];
    const endIndex = markers[2] ? markers[2].index : allNodes.length; // Preserve later language blocks or unrelated content.

    return {
      before: allNodes.slice(0, leftMarker.index).filter(isRenderableNode),
      left: allNodes.slice(leftMarker.index + 1, rightMarker.index).filter(isRenderableNode),
      right: allNodes.slice(rightMarker.index + 1, endIndex).filter(isRenderableNode),
      after: allNodes.slice(endIndex).filter(isRenderableNode),
      leftLang: leftMarker.lang,
      rightLang: rightMarker.lang
    };
  }

  /** Clones a list of nodes into a document fragment; parameter is an array of DOM nodes. */
  function cloneNodes(nodes) {
    const fragment = document.createDocumentFragment();

    nodes.forEach((node) => {
      fragment.appendChild(node.cloneNode(true)); // Clone so original HTML can be restored.
    });

    return fragment;
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

  /** Applies language-specific visual style to text cells; parameters are element and language key. */
  function applyLanguageStyle(element, lang) {
    const scale = STATE.config.languageFontScale?.[lang] || 1;

    element.style.fontSize = `calc(1em * ${scale})`; // Balance visual density across languages.
  }

  /** Returns whether the layout is currently in narrow mode; no parameters. */
  function isNarrowMode() {
    const breakpoint = Number(STATE.config.narrowBreakpoint) || 760;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches; // Match CSS breakpoint.
  }

  /** Returns the current display mode from wrapper classes; no parameters. */
  function getCurrentMode() {
    if (!STATE.wrapper) return "bilingual"; // Default before render.

    if (STATE.wrapper.classList.contains("bmd-mode-left")) return "left";
    if (STATE.wrapper.classList.contains("bmd-mode-right")) return "right";
    return "bilingual";
  }

  /** Injects or updates layout CSS; no parameters. */
  function injectStyles() {
    let style = document.getElementById("bmd-layout-style");

    if (!style) {
      style = document.createElement("style");
      style.id = "bmd-layout-style";
      document.head.appendChild(style);
    }

    const breakpoint = Number(STATE.config.narrowBreakpoint) || 760;

    style.textContent = `
      .bmd-wrapper {
        width: 100%;
        margin: 1rem 0;
      }

      .bmd-toolbar {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
        column-gap: var(--bmd-gap, 1.6rem);
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

      .bmd-button[aria-pressed="true"] {
        opacity: 1;
      }

      .bmd-button-left,
      .bmd-button-right {
        justify-self: center;
      }

      .bmd-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
        column-gap: var(--bmd-gap, 1.6rem);
        align-items: stretch;
      }

      .bmd-cell {
        min-width: 0;
      }

      .bmd-cell > :first-child {
        margin-top: 0;
      }

      .bmd-divider {
        width: 1px;
        min-height: 1em;
        align-self: stretch;
        background: currentColor;
        opacity: var(--bmd-divider-opacity, 0.42);
      }

      .bmd-mode-left .bmd-toolbar,
      .bmd-mode-right .bmd-toolbar {
        display: block;
        text-align: center;
      }

      .bmd-mode-left .bmd-row,
      .bmd-mode-right .bmd-row {
        display: block;
      }

      .bmd-mode-left .bmd-cell-right,
      .bmd-mode-left .bmd-divider,
      .bmd-mode-left .bmd-toolbar-divider,
      .bmd-mode-left .bmd-button-right {
        display: none;
      }

      .bmd-mode-right .bmd-cell-left,
      .bmd-mode-right .bmd-divider,
      .bmd-mode-right .bmd-toolbar-divider,
      .bmd-mode-right .bmd-button-left {
        display: none;
      }

      @media (max-width: ${breakpoint}px) {
        .bmd-toolbar,
        .bmd-mode-left .bmd-toolbar,
        .bmd-mode-right .bmd-toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          column-gap: 0.75rem;
          text-align: initial;
        }

        .bmd-toolbar-divider {
          display: none;
        }

        .bmd-button,
        .bmd-mode-left .bmd-button-left,
        .bmd-mode-left .bmd-button-right,
        .bmd-mode-right .bmd-button-left,
        .bmd-mode-right .bmd-button-right {
          display: inline-block;
          justify-self: center;
          grid-column: auto;
        }

        .bmd-row,
        .bmd-mode-left .bmd-row,
        .bmd-mode-right .bmd-row {
          display: block;
        }

        .bmd-divider {
          display: none;
        }

        .bmd-mode-bilingual .bmd-cell-right,
        .bmd-mode-left .bmd-cell-right,
        .bmd-mode-right .bmd-cell-left {
          display: none;
        }

        .bmd-mode-bilingual .bmd-cell-left,
        .bmd-mode-left .bmd-cell-left,
        .bmd-mode-right .bmd-cell-right {
          display: block;
        }
      }
    `;
  }

  /** Applies wrapper-level CSS variables; parameter is wrapper element. */
  function applyWrapperStyle(wrapper) {
    wrapper.style.setProperty("--bmd-gap", STATE.config.gap); // Runtime column spacing.
    wrapper.style.setProperty("--bmd-divider-opacity", STATE.config.dividerOpacity); // Runtime divider opacity.
  }

  /** Updates button text and active state according to mode; parameter is mode string. */
  function updateButtonState(mode) {
    if (!STATE.wrapper) return; // Nothing to update before render.

    const leftButton = STATE.wrapper.querySelector(".bmd-button-left");
    const rightButton = STATE.wrapper.querySelector(".bmd-button-right");
    const narrow = isNarrowMode();

    if (!leftButton || !rightButton) return; // Buttons are required.

    if (narrow) {
      leftButton.textContent = getButtonText(STATE.leftLang); // Mobile buttons always remain language switches.
      rightButton.textContent = getButtonText(STATE.rightLang); // Mobile buttons always remain language switches.

      leftButton.setAttribute("aria-pressed", mode === "left" || mode === "bilingual" ? "true" : "false");
      rightButton.setAttribute("aria-pressed", mode === "right" ? "true" : "false");

      return;
    }

    leftButton.setAttribute("aria-pressed", "false");
    rightButton.setAttribute("aria-pressed", "false");

    if (mode === "bilingual") {
      leftButton.textContent = getButtonText(STATE.leftLang); // Left button belongs to left language.
      rightButton.textContent = getButtonText(STATE.rightLang); // Right button belongs to right language.
      return;
    }

    if (mode === "left") {
      leftButton.textContent = STATE.config.restoreButtonText; // Desktop left-only mode restores bilingual.
      rightButton.textContent = getButtonText(STATE.rightLang); // Hidden on desktop, kept semantically stable.
      return;
    }

    if (mode === "right") {
      leftButton.textContent = getButtonText(STATE.leftLang); // Hidden on desktop, kept semantically stable.
      rightButton.textContent = STATE.config.restoreButtonText; // Desktop right-only mode restores bilingual.
    }
  }

  /** Sets bilingual, left-only, or right-only view; parameter is mode string. */
  function setMode(mode) {
    if (!STATE.wrapper) return; // Nothing to update before render.

    STATE.wrapper.classList.remove("bmd-mode-bilingual", "bmd-mode-left", "bmd-mode-right");
    STATE.wrapper.classList.add(`bmd-mode-${mode}`);

    updateButtonState(mode); // Keep button labels correct across desktop/mobile.
  }

  /** Builds aligned bilingual rows; parameters are left and right section node arrays and language keys. */
  function createRows(leftNodes, rightNodes, leftLang, rightLang) {
    const fragment = document.createDocumentFragment();
    const max = Math.max(leftNodes.length, rightNodes.length);

    for (let i = 0; i < max; i += 1) {
      const row = document.createElement("div");
      const leftCell = document.createElement("div");
      const divider = document.createElement("div");
      const rightCell = document.createElement("div");

      row.className = "bmd-row";
      leftCell.className = `bmd-cell bmd-cell-left bmd-lang-${leftLang}`;
      divider.className = "bmd-divider";
      rightCell.className = `bmd-cell bmd-cell-right bmd-lang-${rightLang}`;

      applyLanguageStyle(leftCell, leftLang); // Enlarge or shrink left language by config.
      applyLanguageStyle(rightCell, rightLang); // Enlarge or shrink right language by config.

      if (leftNodes[i]) leftCell.appendChild(leftNodes[i].cloneNode(true)); // Align by top-level block index.
      if (rightNodes[i]) rightCell.appendChild(rightNodes[i].cloneNode(true)); // Matching paragraph/title position.

      row.append(leftCell, divider, rightCell);
      fragment.appendChild(row);
    }

    return fragment;
  }

  /** Builds the whole bilingual wrapper; parameter is selected section data. */
  function buildLayout(sections) {
    const wrapper = document.createElement("div");
    const toolbar = document.createElement("div");
    const toolbarDivider = document.createElement("div");
    const rows = document.createElement("div");

    wrapper.className = "bmd-wrapper bmd-mode-bilingual";
    toolbar.className = "bmd-toolbar";
    toolbarDivider.className = "bmd-toolbar-divider";
    rows.className = "bmd-rows";

    applyWrapperStyle(wrapper); // Apply runtime CSS variables.

    const leftButton = createButton(getButtonText(sections.leftLang), "bmd-button-left", () => {
      if (isNarrowMode()) {
        setMode("left"); // Mobile: switch directly to left language.
        return;
      }

      const isSingle = getCurrentMode() === "left";
      setMode(isSingle ? "bilingual" : "left"); // Desktop: toggle left-only and bilingual.
    });

    const rightButton = createButton(getButtonText(sections.rightLang), "bmd-button-right", () => {
      if (isNarrowMode()) {
        setMode("right"); // Mobile: switch directly to right language.
        return;
      }

      const isSingle = getCurrentMode() === "right";
      setMode(isSingle ? "bilingual" : "right"); // Desktop: toggle right-only and bilingual.
    });

    toolbar.append(leftButton, toolbarDivider, rightButton); // Buttons sit above their own columns.
    rows.appendChild(createRows(sections.left, sections.right, sections.leftLang, sections.rightLang));

    wrapper.append(toolbar, rows);

    return wrapper;
  }

  /** Refreshes responsive button state after viewport changes; no parameters. */
  function syncResponsiveState() {
    if (!STATE.wrapper) return; // Nothing to sync before render.
    updateButtonState(getCurrentMode()); // Re-label buttons for current viewport.
  }

  /** Renders the bilingual layout inside the configured article container; no parameters. */
  function render() {
    const root = document.querySelector(STATE.config.contentSelector);
    if (!root) return false; // Container not found.
    if (root.dataset.bmdProcessed === "true") return true; // Avoid duplicate rendering.

    const markers = findLanguageMarkers(root);
    const sections = getFirstPairSections(root, markers);
    if (!sections) return false; // Not a bilingual article.

    injectStyles();

    STATE.root = root;
    STATE.originalHTML = root.innerHTML;
    STATE.leftLang = sections.leftLang;
    STATE.rightLang = sections.rightLang;

    const wrapper = buildLayout(sections);
    STATE.wrapper = wrapper;

    root.innerHTML = "";
    root.appendChild(cloneNodes(sections.before)); // Preserve content before language label.
    root.appendChild(wrapper); // Insert bilingual layout.
    root.appendChild(cloneNodes(sections.after)); // Preserve later unrelated content.
    root.dataset.bmdProcessed = "true";

    updateButtonState("bilingual"); // Mobile bilingual mode visually defaults to left language.

    return true;
  }

  /** Restores the original article HTML before bilingual processing; no parameters. */
  function reset() {
    if (!STATE.root || STATE.originalHTML === null) return false; // Nothing to restore.

    STATE.root.innerHTML = STATE.originalHTML;
    delete STATE.root.dataset.bmdProcessed;

    STATE.root = null;
    STATE.originalHTML = null;
    STATE.wrapper = null;
    STATE.leftLang = null;
    STATE.rightLang = null;

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

  let resizeTimer = null; // Debounces resize updates.

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(syncResponsiveState, 120); // Avoid excessive resize work.
  });

  window.BilingualMDLayout = {
    render,
    reset,
    updateConfig,
    getConfig
  };

  window.updateConfig = updateConfig; // Direct shortcut required by the file format.

  if (STATE.config.autoRun) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", render, { once: true }); // Run after DOM is ready.
    } else {
      render(); // Run immediately if DOM is already ready.
    }
  }
})();