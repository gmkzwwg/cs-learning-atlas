/*!
 * Introduction:
 *   Applies first-line indentation to Chinese-dominant paragraphs inside article content.
 *
 * Usage:
 *   Include this file on the page. It runs automatically after loading.
 *   Default behavior can be customized by editing DEFAULT_CONFIG below.
 *   Runtime behavior can be customized with window.ChineseTextIndent.updateConfig().
 *
 * Global API:
 *   window.ChineseTextIndent.updateConfig(config)
 *   window.ChineseTextIndent.apply()
 *   window.ChineseTextIndent.getConfig()
 *   window.ChineseTextIndent.getTextStats(text)
 *
 * Notes:
 *   This script injects its own small CSS rule.
 *   It skips lists, tables, blockquotes, code blocks, details, and math-rendering blocks.
 *   A paragraph can opt out with class="no-text-indent" or data-no-text-indent.
 */

(function (window, document) {
  "use strict";

  const DEFAULT_CONFIG = {
    containerSelector: ".post-content", // Content container selector.
    paragraphSelector: "p", // Paragraph selector inside the container.
    indentClass: "is-cjk-indent", // Class added to Chinese-dominant paragraphs.
    styleId: "chinese-text-indent-style", // ID for the injected style element.
    indentSize: "2em", // First-line indentation size.
    minHanRatio: 0.45, // Minimum Han-character ratio among meaningful characters.
    minHanCount: 2, // Minimum Han-character count required.
    autoApply: true, // Apply automatically after the script is loaded.
    injectStyle: true, // Inject CSS from this script.
    observeMutations: false, // Re-apply when content changes dynamically.
    excludedAncestorSelector: [
      "li",
      "ul",
      "ol",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "blockquote",
      "dl",
      "dt",
      "dd",
      "pre",
      "summary",
      "details",
      ".no-text-indent",
      "[data-no-text-indent]"
    ].join(","), // Ancestors that disable indentation.
    excludedDescendantSelector: [
      ".katex-display",
      ".MathJax_Display",
      "mjx-container",
      ".katex",
      ".MathJax",
      "pre"
    ].join(",") // Descendants that disable indentation.
  };

  let config = Object.assign({}, DEFAULT_CONFIG); // Active runtime configuration.
  let observer = null; // MutationObserver instance.
  let applyTimer = null; // Debounce timer for mutation-based re-apply.

  /* Detects support for Unicode property escapes; params: none. */
  function supportsUnicodePropertyEscapes() {
    try {
      new RegExp("\\p{Script=Han}", "u");
      return true;
    } catch (_) {
      return false;
    }
  }

  const supportsUnicodeProps = supportsUnicodePropertyEscapes(); // Browser capability flag.

  const hanRegex = supportsUnicodeProps
    ? /\p{Script=Han}/u
    : /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/; // Han-character matcher.

  const meaningfulRegex = supportsUnicodeProps
    ? /[\p{Script=Han}\p{Script=Latin}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Number}]/u
    : /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFFA-Za-z0-9\u3040-\u30FF\uAC00-\uD7AF]/; // Characters counted in ratio.

  /* Escapes CSS class names when possible; params: value<string>. */
  function escapeCssClass(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }

    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&"); // Minimal fallback.
  }

  /* Injects or updates the feature CSS; params: activeConfig<object>. */
  function injectStyle(activeConfig) {
    if (!activeConfig.injectStyle) return;

    const className = escapeCssClass(activeConfig.indentClass);
    const css = `.${className}{text-indent:${activeConfig.indentSize};}`; // Small feature-local CSS.
    let style = document.getElementById(activeConfig.styleId);

    if (!style) {
      style = document.createElement("style");
      style.id = activeConfig.styleId;
      document.head.appendChild(style);
    }

    style.textContent = css;
  }

  /* Returns text statistics for Han-ratio decisions; params: text<string>. */
  function getTextStats(text) {
    const characters = Array.from(String(text || "").trim());
    let meaningfulCount = 0;
    let hanCount = 0;

    characters.forEach(function (character) {
      if (!meaningfulRegex.test(character)) return;

      meaningfulCount += 1;

      if (hanRegex.test(character)) {
        hanCount += 1;
      }
    });

    return {
      meaningfulCount: meaningfulCount,
      hanCount: hanCount,
      hanRatio: meaningfulCount > 0 ? hanCount / meaningfulCount : 0
    };
  }

  /* Checks whether a paragraph should be ignored; params: paragraph<Element>, activeConfig<object>. */
  function shouldSkipParagraph(paragraph, activeConfig) {
    if (!paragraph) return true;
    if (paragraph.closest(activeConfig.excludedAncestorSelector)) return true;
    if (paragraph.querySelector(activeConfig.excludedDescendantSelector)) return true;
    if (paragraph.dataset.textIndent === "false") return true;

    return false;
  }

  /* Checks whether a paragraph is Chinese-dominant; params: paragraph<Element>, activeConfig<object>. */
  function isChineseDominantParagraph(paragraph, activeConfig) {
    const text = paragraph.textContent || "";
    const stats = getTextStats(text);

    if (stats.hanCount < activeConfig.minHanCount) return false;

    return stats.hanRatio >= activeConfig.minHanRatio;
  }

  /* Applies indentation classes to matching paragraphs; params: root<Element|Document?>. */
  function apply(root) {
    const scope = root || document;
    const containers = scope.querySelectorAll(config.containerSelector);

    injectStyle(config);

    containers.forEach(function (container) {
      const paragraphs = container.querySelectorAll(config.paragraphSelector);

      paragraphs.forEach(function (paragraph) {
        if (shouldSkipParagraph(paragraph, config)) return;

        if (isChineseDominantParagraph(paragraph, config)) {
          paragraph.classList.add(config.indentClass);
        } else {
          paragraph.classList.remove(config.indentClass);
        }
      });
    });
  }

  /* Debounces apply() for dynamic content changes; params: none. */
  function scheduleApply() {
    window.clearTimeout(applyTimer);

    applyTimer = window.setTimeout(function () {
      apply();
    }, 80); // Keep mutation updates cheap.
  }

  /* Starts mutation observation when enabled; params: none. */
  function startObserver() {
    if (!config.observeMutations || observer) return;

    observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /* Stops mutation observation; params: none. */
  function stopObserver() {
    if (!observer) return;

    observer.disconnect();
    observer = null;
  }

  /* Updates runtime configuration and reapplies; params: nextConfig<object>. */
  function updateConfig(nextConfig) {
    config = Object.assign({}, config, nextConfig || {});

    injectStyle(config);
    apply();

    if (config.observeMutations) {
      startObserver();
    } else {
      stopObserver();
    }

    return getConfig();
  }

  /* Returns a copy of the active configuration; params: none. */
  function getConfig() {
    return Object.assign({}, config);
  }

  /* Runs default behavior after DOM is ready; params: none. */
  function onReady() {
    if (!config.autoApply) return;

    apply();

    if (config.observeMutations) {
      startObserver();
    }
  }

  window.ChineseTextIndent = {
    apply: apply,
    updateConfig: updateConfig,
    getConfig: getConfig,
    getTextStats: getTextStats
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})(window, document);