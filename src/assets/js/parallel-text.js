/*!
 * parallel-text.js
 *
 * Introduction:
 *   Rebuilds Markdown/Jekyll content into compact parallel text rows.
 *   One source block followed by one or more blockquotes becomes a multi-column comparison row.
 *
 * Usage:
 *   Include this file on the page. It runs automatically with DEFAULT_CONFIG.
 *   Default behavior can be customized by editing DEFAULT_CONFIG below.
 *   Runtime behavior can be customized with window.parallelTextColumns.updateConfig().
 *
 * Global API:
 *   window.parallelTextColumns.init(options)
 *   window.parallelTextColumns.updateConfig(options, runtimeOptions)
 *   window.parallelTextColumns.enable(target)
 *   window.parallelTextColumns.disable(target)
 *   window.parallelTextColumns.toggle(target)
 *   window.parallelTextColumns.refresh(target)
 *   window.parallelTextColumns.destroy(target)
 *   window.parallelTextColumns.bindToggleButton(buttonTarget, containerTarget)
 *   window.parallelTextColumns.setFontSize(fontSize, target)
 *   window.parallelTextColumns.setVerticalAlign(verticalAlign, target)
 *   window.parallelTextColumns.setColumnRatios(columnRatios, target)
 *   window.parallelTextColumns.setCompactText(compactText, target)
 *   window.parallelTextColumns.setBlockSpacing(blockSpacing, target)
 *   window.parallelTextColumns.getConfig()
 *
 * Notes:
 *   This script scans direct child elements of configured content containers.
 *   It skips tables and their immediately following blockquotes by default.
 *   It injects its own compact CSS unless injectStyle is false.
 *   Vertical dividers and horizontal row rules share one separator style system.
 *   It should usually be loaded only on layouts that need parallel text.
 */

(function (win, doc) {
  "use strict";

  if (!win || !doc) return;

  var DEFAULT_CONFIG = {
    selectors: [".post-content"], // Direct content containers to process.
    autoEnable: true, // Enable parallel layout automatically.
    autoRefresh: false, // Rebuild when dynamic content is inserted.
    autoRefreshDelay: 80, // Debounce delay for dynamic refresh.
    includeHeadings: false, // Do not convert headings into parallel body blocks.
    skipSelectors: ["table"], // Skip tables and their following blockquotes.
    bodyTags: ["P", "UL", "OL", "DL"], // Body block starters.
    headingTags: ["H1", "H2", "H3", "H4", "H5", "H6"], // Optional heading starters.

    fontSize: "14px", // Unified text size inside generated rows.
    compactText: true, // Remove default margin, padding, and borders.
    verticalAlign: "center", // Align column content vertically. candidates: start | center | end
    columnGap: "0.9rem", // Gap between parallel columns.
    mobileColumnGap: "0.45rem", // Gap when columns stack on narrow screens.
    blockSpacing: "1.5rem", // Spacing between generated row blocks.

    separatorColor: "var(--theme-color, var(--accent-color, var(--primary-color, var(--link-color, currentColor))))", // Shared color for vertical and horizontal separators.
    separatorThickness: "1px", // Shared thickness for vertical and horizontal separators.
    separatorOpacity: 0.3, // Shared opacity for vertical and horizontal separators.
    separatorDashLength: "2px", // Shared dash length for separator patterns.
    separatorGapLength: "6px", // Shared gap length for separator patterns.

    dividerInset: "0.2rem", // Vertical divider top and bottom inset.
    rowRuleEnabled: true, // Insert compact row separator between adjacent generated rows.
    rowRuleMargin: "0.22rem 0", // Horizontal row separator margin.

    responsiveBreakpointPx: 900, // Breakpoint where columns stack.
    injectStyle: true, // Inject built-in CSS.
    styleId: "parallel-text-style", // Injected style element ID.
    styleNonce: "", // Optional nonce for strict CSP.
    columnRatios: {
      1: [1],
      2: [1.7, 1],
      3: [1.7, 1, 1.3],
      default: [1.7, 1, 1.3]
    } // Column width ratios by column count.
  };

  var CLASS = {
    scope: "ptc-scope",
    row: "ptc-row",
    col: "ptc-col",
    divider: "ptc-divider",
    rowRule: "ptc-row-rule"
  };

  var ATTR = {
    enabled: "data-ptc-enabled",
    compact: "data-ptc-compact",
    cols: "data-ptc-cols",
    ratios: "data-ptc-ratios"
  };

  var state = {
    initialized: false,
    options: null,
    containers: [],
    resizeBound: false,
    resizeHandler: null,
    loadHandler: null,
    resizeObserver: null,
    mutationObserver: null,
    styleId: null,
    pendingRefresh: [],
    pendingTimer: null
  };

  /* Merges objects into a new object; params: ...sources<object>. */
  function mergeObjects() {
    var out = {};

    for (var i = 0; i < arguments.length; i += 1) {
      var source = arguments[i];

      if (!source) continue;

      Object.keys(source).forEach(function (key) {
        out[key] = source[key]; // Shallow merge is intentional.
      });
    }

    return out;
  }

  /* Converts array-like values to arrays; params: value<ArrayLike>. */
  function toArray(value) {
    return Array.prototype.slice.call(value || []);
  }

  /* Checks whether a value is a DOM element; params: node<any>. */
  function isElement(node) {
    return Boolean(node && node.nodeType === 1);
  }

  /* Returns a safe uppercase tag name; params: node<Node>. */
  function tagName(node) {
    return isElement(node) && node.tagName ? String(node.tagName).toUpperCase() : "";
  }

  /* Checks for a class without requiring classList; params: element<Element>, className<string>. */
  function hasClass(element, className) {
    if (!isElement(element)) return false;

    return (" " + element.className + " ").indexOf(" " + className + " ") !== -1;
  }

  /* Adds a class without requiring classList; params: element<Element>, className<string>. */
  function addClass(element, className) {
    if (!isElement(element) || hasClass(element, className)) return;

    element.className = element.className ? element.className + " " + className : className; // Preserve existing classes.
  }

  /* Removes a class without requiring classList; params: element<Element>, className<string>. */
  function removeClass(element, className) {
    if (!isElement(element)) return;

    element.className = (" " + element.className + " ")
      .replace(" " + className + " ", " ")
      .replace(/^\s+|\s+$/g, "");
  }

  /* Matches an element against a selector with fallbacks; params: element<Element>, selector<string>. */
  function matchesSelector(element, selector) {
    var fn;

    if (!isElement(element) || !selector) return false;

    fn = element.matches ||
      element.webkitMatchesSelector ||
      element.mozMatchesSelector ||
      element.msMatchesSelector;

    if (!fn) return false;

    try {
      return Boolean(fn.call(element, selector));
    } catch (_) {
      return false; // Invalid selectors are ignored.
    }
  }

  /* Queries descendants safely; params: root<Element|Document>, selector<string>. */
  function safeQueryAll(root, selector) {
    if (!root || !selector || !root.querySelectorAll) return [];

    try {
      return toArray(root.querySelectorAll(selector));
    } catch (_) {
      return []; // Invalid selectors should not break the page.
    }
  }

  /* Normalizes a value into a string array; params: value<any>, fallback<Array>. */
  function normalizeStringArray(value, fallback) {
    var list = Array.isArray(value) ? value.slice() : [value];
    var out = [];

    for (var i = 0; i < list.length; i += 1) {
      if (typeof list[i] === "string" && list[i].replace(/^\s+|\s+$/g, "")) {
        out.push(list[i].replace(/^\s+|\s+$/g, ""));
      }
    }

    return out.length ? out : fallback.slice();
  }

  /* Normalizes tag names into uppercase strings; params: value<any>, fallback<Array>. */
  function normalizeTagList(value, fallback) {
    var list = normalizeStringArray(value, fallback);

    for (var i = 0; i < list.length; i += 1) {
      list[i] = list[i].toUpperCase(); // Tag matching uses uppercase names.
    }

    return list;
  }

  /* Normalizes CSS size values; params: value<any>, fallback<string>. */
  function normalizeSize(value, fallback) {
    if (typeof value === "number" && isFinite(value)) return value + "px";
    if (typeof value === "string" && value.replace(/^\s+|\s+$/g, "")) {
      return value.replace(/^\s+|\s+$/g, "");
    }

    return fallback;
  }

  /* Normalizes opacity into 0-1 range; params: value<any>, fallback<number>. */
  function normalizeOpacity(value, fallback) {
    var numberValue = Number(value);

    if (!isFinite(numberValue)) return fallback;
    if (numberValue < 0) return 0;
    if (numberValue > 1) return 1;

    return numberValue;
  }

  /* Normalizes raw CSS color values; params: value<any>, fallback<string>. */
  function normalizeColor(value, fallback) {
    if (typeof value === "string" && value.replace(/^\s+|\s+$/g, "")) {
      return value.replace(/^\s+|\s+$/g, "");
    }

    return fallback;
  }

  /* Returns first defined value; params: values<any[]>. */
  function firstDefined() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (arguments[i] !== undefined && arguments[i] !== null) {
        return arguments[i];
      }
    }

    return undefined;
  }

  /* Normalizes vertical alignment; params: value<any>. */
  function normalizeVerticalAlign(value) {
    var normalized = String(value || "start").replace(/^\s+|\s+$/g, "").toLowerCase();

    if (normalized === "center" || normalized === "middle") return "center";
    if (normalized === "end" || normalized === "bottom" || normalized === "flex-end") return "flex-end";

    return "flex-start";
  }

  /* Sanitizes ratio arrays; params: list<Array>. */
  function sanitizeRatios(list) {
    var out = [];

    if (!Array.isArray(list) || !list.length) return [1];

    for (var i = 0; i < list.length; i += 1) {
      var value = Number(list[i]);

      out.push(isFinite(value) && value > 0 ? value : 1);
    }

    return out.length ? out : [1];
  }

  /* Normalizes ratio map; params: input<object|Array>. */
  function normalizeRatioMap(input) {
    var result = {};
    var key;

    if (Array.isArray(input)) {
      result.default = sanitizeRatios(input);
    } else if (input && typeof input === "object") {
      for (key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          result[key] = sanitizeRatios(input[key]);
        }
      }
    }

    if (!result.default) result.default = [1, 1, 1];
    if (!result[1]) result[1] = [1];
    if (!result[2]) result[2] = [1, 1];
    if (!result[3]) result[3] = [1, 1, 1];

    return result;
  }

  /* Resolves column ratios for a row; params: count<number>, options<object>. */
  function getRatiosForCount(count, options) {
    var map = options.columnRatios || {};
    var ratios = sanitizeRatios(map[count] || map[String(count)] || map.default || [1]);
    var out = ratios.slice(0, count);

    while (out.length < count) {
      out.push(1); // Missing ratios become equal-weight columns.
    }

    return out;
  }

  /* Returns optional pre-load global config; params: none. */
  function getPreloadConfig() {
    return win.ParallelTextColumnsConfig || win.parallelTextColumnsConfig || null;
  }

  /* Normalizes all configuration; params: input<object>. */
  function normalizeConfig(input) {
    var config = mergeObjects(DEFAULT_CONFIG, input || {});
    var legacyThickness = firstDefined(config.separatorThickness, config.dividerThickness, config.rowRuleThickness);
    var legacyOpacity = firstDefined(config.separatorOpacity, config.dividerOpacity, config.rowRuleOpacity);

    config.selectors = normalizeStringArray(config.selectors, DEFAULT_CONFIG.selectors);
    config.skipSelectors = normalizeStringArray(config.skipSelectors, DEFAULT_CONFIG.skipSelectors);
    config.bodyTags = normalizeTagList(config.bodyTags, DEFAULT_CONFIG.bodyTags);
    config.headingTags = normalizeTagList(config.headingTags, DEFAULT_CONFIG.headingTags);

    config.fontSize = normalizeSize(config.fontSize, DEFAULT_CONFIG.fontSize);
    config.columnGap = normalizeSize(config.columnGap, DEFAULT_CONFIG.columnGap);
    config.mobileColumnGap = normalizeSize(config.mobileColumnGap, DEFAULT_CONFIG.mobileColumnGap);
    config.blockSpacing = normalizeSize(config.blockSpacing, DEFAULT_CONFIG.blockSpacing);

    config.separatorColor = normalizeColor(config.separatorColor, DEFAULT_CONFIG.separatorColor);
    config.separatorThickness = normalizeSize(legacyThickness, DEFAULT_CONFIG.separatorThickness);
    config.separatorOpacity = normalizeOpacity(legacyOpacity, DEFAULT_CONFIG.separatorOpacity);
    config.separatorDashLength = normalizeSize(config.separatorDashLength, DEFAULT_CONFIG.separatorDashLength);
    config.separatorGapLength = normalizeSize(config.separatorGapLength, DEFAULT_CONFIG.separatorGapLength);

    config.dividerInset = normalizeSize(config.dividerInset, DEFAULT_CONFIG.dividerInset);
    config.rowRuleMargin = normalizeSize(config.rowRuleMargin, DEFAULT_CONFIG.rowRuleMargin);

    config.responsiveBreakpointPx = Math.max(
      1,
      parseInt(config.responsiveBreakpointPx, 10) || DEFAULT_CONFIG.responsiveBreakpointPx
    );
    config.autoRefreshDelay = Math.max(
      20,
      parseInt(config.autoRefreshDelay, 10) || DEFAULT_CONFIG.autoRefreshDelay
    );

    config.verticalAlign = normalizeVerticalAlign(config.verticalAlign);
    config.columnRatios = normalizeRatioMap(config.columnRatios);
    config.autoEnable = config.autoEnable !== false;
    config.autoRefresh = config.autoRefresh === true;
    config.includeHeadings = config.includeHeadings === true;
    config.compactText = config.compactText !== false;
    config.rowRuleEnabled = config.rowRuleEnabled !== false;
    config.injectStyle = config.injectStyle !== false;
    config.styleId = typeof config.styleId === "string" && config.styleId.replace(/^\s+|\s+$/g, "")
      ? config.styleId.replace(/^\s+|\s+$/g, "")
      : DEFAULT_CONFIG.styleId;
    config.styleNonce = typeof config.styleNonce === "string" ? config.styleNonce : "";

    return config;
  }

  /* Runs a callback after DOM parse-ready; params: callback<Function>. */
  function onReady(callback) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", callback, false);
      return;
    }

    callback();
  }

  /* Builds compact-mode selectors; params: selector<string>. */
  function compactSelector(selector) {
    return "." + CLASS.scope + "[" + ATTR.compact + '="true"] ' + selector;
  }

  /* Builds separator pattern CSS; params: direction<string>. */
  function separatorPattern(direction) {
    return "repeating-linear-gradient(" +
      direction +
      ", var(--ptc-separator-color) 0 var(--ptc-separator-dash), transparent var(--ptc-separator-dash) var(--ptc-separator-gap))";
  }

  /* Builds injected CSS text; params: options<object>. */
  function buildCSS(options) {
    var breakpoint = options.responsiveBreakpointPx + "px";

    return [
      "." + CLASS.scope + " {",
      "  --ptc-font-size: " + options.fontSize + ";",
      "  --ptc-gap: " + options.columnGap + ";",
      "  --ptc-mobile-gap: " + options.mobileColumnGap + ";",
      "  --ptc-block-spacing: " + options.blockSpacing + ";",
      "  --ptc-divider-inset: " + options.dividerInset + ";",
      "  --ptc-row-rule-margin: " + options.rowRuleMargin + ";",
      "  --ptc-separator-color: " + options.separatorColor + ";",
      "  --ptc-separator-thickness: " + options.separatorThickness + ";",
      "  --ptc-separator-opacity: " + options.separatorOpacity + ";",
      "  --ptc-separator-dash: " + options.separatorDashLength + ";",
      "  --ptc-separator-gap: " + options.separatorGapLength + ";",
      "  --ptc-col-justify: " + options.verticalAlign + ";",
      "}",
      "." + CLASS.scope + " p, ." +
      CLASS.scope + " ul, ." +
      CLASS.scope + " ol, ." +
      CLASS.scope + " dl, ." +
      CLASS.scope + " li, ." +
      CLASS.scope + " blockquote {",
      "  font-size: var(--ptc-font-size) !important;",
      "}",
      compactSelector("p") + ", " +
      compactSelector("ul") + ", " +
      compactSelector("ol") + ", " +
      compactSelector("dl") + ", " +
      compactSelector("li") + ", " +
      compactSelector("blockquote") + " {",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "  border: 0 !important;",
      "}",
      compactSelector("ul") + ", " +
      compactSelector("ol") + " {",
      "  list-style-position: inside;",
      "}",
      compactSelector("li > ul") + ", " +
      compactSelector("li > ol") + ", " +
      compactSelector("li > dl") + " {",
      "  margin-top: 0 !important;",
      "  margin-bottom: 0 !important;",
      "}",
      compactSelector("blockquote > :first-child") + " {",
      "  margin-top: 0 !important;",
      "}",
      compactSelector("blockquote > :last-child") + " {",
      "  margin-bottom: 0 !important;",
      "}",
      "." + CLASS.row + " {",
      "  display: grid;",
      "  gap: var(--ptc-gap);",
      "  align-items: stretch;",
      "  position: relative;",
      "  margin: 0 !important;",
      "}",
      "." + CLASS.col + " {",
      "  min-width: 0;",
      "  position: relative;",
      "  display: flex;",
      "  flex-direction: column;",
      "  justify-content: var(--ptc-col-justify);",
      "  align-self: stretch;",
      "}",
      "." + CLASS.col + " > :first-child {",
      "  margin-top: 0 !important;",
      "}",
      "." + CLASS.col + " > :last-child {",
      "  margin-bottom: 0 !important;",
      "}",
      "." + CLASS.divider + " {",
      "  position: absolute;",
      "  pointer-events: none;",
      "  opacity: var(--ptc-separator-opacity);",
      "  background: " + separatorPattern("to bottom") + ";",
      "}",
      "." + CLASS.scope + " > * + * {",
      "  margin-top: var(--ptc-block-spacing) !important;",
      "}",
      "." + CLASS.rowRule + " {",
      "  display: block;",
      "  position: relative;",
      "  width: 100%;",
      "  height: var(--ptc-separator-thickness);",
      "  padding: 0;",
      "  margin: var(--ptc-row-rule-margin) !important;",
      "  opacity: var(--ptc-separator-opacity);",
      "  background: " + separatorPattern("to right") + ";",
      "  pointer-events: none;",
      "}",
      "." + CLASS.scope + " > ." + CLASS.row + " + ." + CLASS.rowRule + " {",
      "  margin: var(--ptc-row-rule-margin) !important;",
      "}",
      "." + CLASS.scope + " > ." + CLASS.rowRule + " + ." + CLASS.row + " {",
      "  margin-top: 0 !important;",
      "}",
      "@media (max-width: " + breakpoint + ") {",
      "  ." + CLASS.row + " {",
      "    grid-template-columns: 1fr !important;",
      "    gap: var(--ptc-mobile-gap);",
      "  }",
      "  ." + CLASS.divider + " {",
      "    background: " + separatorPattern("to right") + ";",
      "  }",
      "}"
    ].join("\n");
  }

  /* Inserts or updates CSS; params: options<object>. */
  function upsertStyle(options) {
    var stale;
    var oldStyle;
    var style;
    var css;

    if (state.styleId && state.styleId !== options.styleId) {
      stale = doc.getElementById(state.styleId);

      if (stale && stale.parentNode) {
        stale.parentNode.removeChild(stale); // Remove stale style when styleId changes.
      }
    }

    state.styleId = options.styleId;
    oldStyle = doc.getElementById(options.styleId);

    if (!options.injectStyle) {
      if (oldStyle && oldStyle.parentNode) {
        oldStyle.parentNode.removeChild(oldStyle); // External CSS mode.
      }

      return;
    }

    css = buildCSS(options);
    style = oldStyle || doc.createElement("style");
    style.id = options.styleId;
    style.type = "text/css";

    if (options.styleNonce) {
      style.setAttribute("nonce", options.styleNonce); // CSP-compatible style tag.
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      while (style.firstChild) {
        style.removeChild(style.firstChild);
      }

      style.appendChild(doc.createTextNode(css));
    }

    if (!oldStyle) {
      (doc.head || doc.getElementsByTagName("head")[0]).appendChild(style);
    }
  }

  /* Applies visual CSS variables to one container; params: container<Element>, options<object>. */
  function applyContainerOptions(container, options) {
    if (!isElement(container)) return;

    addClass(container, CLASS.scope);
    container.style.setProperty("--ptc-font-size", options.fontSize);
    container.style.setProperty("--ptc-gap", options.columnGap);
    container.style.setProperty("--ptc-mobile-gap", options.mobileColumnGap);
    container.style.setProperty("--ptc-block-spacing", options.blockSpacing);
    container.style.setProperty("--ptc-divider-inset", options.dividerInset);
    container.style.setProperty("--ptc-row-rule-margin", options.rowRuleMargin);
    container.style.setProperty("--ptc-separator-color", options.separatorColor);
    container.style.setProperty("--ptc-separator-thickness", options.separatorThickness);
    container.style.setProperty("--ptc-separator-opacity", String(options.separatorOpacity));
    container.style.setProperty("--ptc-separator-dash", options.separatorDashLength);
    container.style.setProperty("--ptc-separator-gap", options.separatorGapLength);
    container.style.setProperty("--ptc-col-justify", options.verticalAlign);
    container.setAttribute(ATTR.compact, options.compactText ? "true" : "false");
  }

  /* Removes visual markers from one container; params: container<Element>. */
  function clearContainerOptions(container) {
    if (!isElement(container)) return;

    removeClass(container, CLASS.scope);
    container.removeAttribute(ATTR.compact);
    container.style.removeProperty("--ptc-font-size");
    container.style.removeProperty("--ptc-gap");
    container.style.removeProperty("--ptc-mobile-gap");
    container.style.removeProperty("--ptc-block-spacing");
    container.style.removeProperty("--ptc-divider-inset");
    container.style.removeProperty("--ptc-row-rule-margin");
    container.style.removeProperty("--ptc-separator-color");
    container.style.removeProperty("--ptc-separator-thickness");
    container.style.removeProperty("--ptc-separator-opacity");
    container.style.removeProperty("--ptc-separator-dash");
    container.style.removeProperty("--ptc-separator-gap");
    container.style.removeProperty("--ptc-col-justify");
  }

  /* Collects containers matching configured selectors; params: options<object>. */
  function collectContainers(options) {
    var found = [];

    for (var i = 0; i < options.selectors.length; i += 1) {
      var nodes = safeQueryAll(doc, options.selectors[i]);

      for (var j = 0; j < nodes.length; j += 1) {
        if (found.indexOf(nodes[j]) === -1) {
          found.push(nodes[j]); // Avoid duplicate selector matches.
        }
      }
    }

    return found;
  }

  /* Normalizes target input to containers; params: target<any>. */
  function normalizeContainerInput(target) {
    var out = [];

    if (!target) return state.containers.slice();
    if (typeof target === "string") return safeQueryAll(doc, target);
    if (isElement(target)) return [target];

    if (Array.isArray(target) || typeof target.length === "number") {
      for (var i = 0; i < target.length; i += 1) {
        if (isElement(target[i])) out.push(target[i]);
      }
    }

    return out;
  }

  /* Checks whether a node is blockquote; params: node<Node>. */
  function isBlockquote(node) {
    return tagName(node) === "BLOCKQUOTE";
  }

  /* Checks whether a node is a list; params: node<Node>. */
  function isList(node) {
    var tag = tagName(node);

    return tag === "UL" || tag === "OL" || tag === "DL";
  }

  /* Checks whether a node should be skipped; params: node<Node>, options<object>. */
  function isSkippedElement(node, options) {
    if (!isElement(node)) return false;
    if (tagName(node) === "TABLE") return true;

    for (var i = 0; i < options.skipSelectors.length; i += 1) {
      if (matchesSelector(node, options.skipSelectors[i])) return true;
    }

    return false;
  }

  /* Checks whether a node can start a body block; params: node<Node>, options<object>. */
  function isBodyStarter(node, options) {
    var tag = tagName(node);

    if (options.bodyTags.indexOf(tag) !== -1) return true;

    return options.includeHeadings && options.headingTags.indexOf(tag) !== -1;
  }

  /* Collects one body block from direct children; params: children<Array>, startIndex<number>, options<object>. */
  function collectBodyBlock(children, startIndex, options) {
    var collected = [];
    var start = children[startIndex];
    var index = startIndex + 1;

    if (!isBodyStarter(start, options)) return collected;

    collected.push(start);

    while (index < children.length && isList(children[index])) {
      collected.push(children[index]); // Paragraph/list chains are treated as one source block.
      index += 1;
    }

    return collected;
  }

  /* Creates a column element and moves nodes into it; params: nodes<Array>. */
  function createColumn(nodes) {
    var column = doc.createElement("div");

    column.className = CLASS.col;

    for (var i = 0; i < nodes.length; i += 1) {
      column.appendChild(nodes[i]);
    }

    return column;
  }

  /* Creates an internal column divider; params: none. */
  function createDivider() {
    var divider = doc.createElement("div");

    divider.className = CLASS.divider;
    divider.setAttribute("aria-hidden", "true");

    return divider;
  }

  /* Creates a compact horizontal separator; params: options<object>. */
  function createRowRule(options) {
    var separator = doc.createElement("div");

    separator.className = CLASS.rowRule;
    separator.setAttribute("aria-hidden", "true");
    separator.setAttribute("role", "presentation");

    if (!options.rowRuleEnabled) {
      separator.style.display = "none"; // Keeps DOM predictable when disabled.
    }

    return separator;
  }

  /* Creates a parallel row from column groups; params: groups<Array>, options<object>. */
  function createRow(groups, options) {
    var row = doc.createElement("div");
    var ratios = getRatiosForCount(groups.length, options);
    var columns = [];

    row.className = CLASS.row;
    row.setAttribute(ATTR.cols, String(groups.length));
    row.setAttribute(ATTR.ratios, ratios.join(","));

    for (var i = 0; i < ratios.length; i += 1) {
      columns.push("minmax(0, " + ratios[i] + "fr)");
    }

    row.style.gridTemplateColumns = columns.join(" "); // Inline grid columns allow per-row ratios.

    for (var j = 0; j < groups.length; j += 1) {
      row.appendChild(createColumn(groups[j]));
    }

    for (var k = 1; k < groups.length; k += 1) {
      row.appendChild(createDivider());
    }

    return row;
  }

  /* Returns direct row columns; params: row<Element>. */
  function getDirectColumns(row) {
    var out = [];
    var children = toArray(row.children);

    for (var i = 0; i < children.length; i += 1) {
      if (hasClass(children[i], CLASS.col)) out.push(children[i]);
    }

    return out;
  }

  /* Returns direct row dividers; params: row<Element>. */
  function getDirectDividers(row) {
    var out = [];
    var children = toArray(row.children);

    for (var i = 0; i < children.length; i += 1) {
      if (hasClass(children[i], CLASS.divider)) out.push(children[i]);
    }

    return out;
  }

  /* Resolves rendered gap in px; params: row<Element>. */
  function getGapPx(row) {
    var styles = win.getComputedStyle ? win.getComputedStyle(row) : null;
    var columnGap;
    var gap;

    if (!styles) return 0;

    columnGap = parseFloat(styles.columnGap || styles.gridColumnGap);

    if (isFinite(columnGap)) return columnGap;

    gap = parseFloat(styles.gap);

    return isFinite(gap) ? gap : 0;
  }

  /* Checks whether columns are stacked by responsive CSS; params: columns<Array>. */
  function isStackedLayout(columns) {
    if (columns.length < 2) return false;

    return Math.round(columns[1].offsetTop) > Math.round(columns[0].offsetTop);
  }

  /* Updates divider geometry for one row; params: row<Element>. */
  function updateRowDividers(row) {
    var columns;
    var dividers;
    var gapPx;
    var stacked;
    var rowStyles;
    var thickness;
    var inset;

    if (!isElement(row) || !(doc.documentElement || doc.body).contains(row)) return;

    columns = getDirectColumns(row);
    dividers = getDirectDividers(row);

    if (columns.length <= 1) {
      for (var d = 0; d < dividers.length; d += 1) {
        dividers[d].style.display = "none";
      }

      return;
    }

    gapPx = getGapPx(row);
    stacked = isStackedLayout(columns);
    rowStyles = win.getComputedStyle ? win.getComputedStyle(row) : null;
    thickness = rowStyles ? rowStyles.getPropertyValue("--ptc-separator-thickness").replace(/^\s+|\s+$/g, "") : "1px";
    inset = rowStyles ? rowStyles.getPropertyValue("--ptc-divider-inset").replace(/^\s+|\s+$/g, "") : "0.2rem";
    thickness = thickness || "1px";
    inset = inset || "0.2rem";

    for (var i = 0; i < dividers.length; i += 1) {
      var divider = dividers[i];

      divider.style.display = "block";

      if (stacked) {
        var nextCol = columns[i + 1];

        divider.style.left = "0";
        divider.style.right = "0";
        divider.style.top = nextCol.offsetTop - gapPx / 2 + "px";
        divider.style.bottom = "auto";
        divider.style.width = "auto";
        divider.style.height = thickness;
      } else {
        var nextColumn = columns[i + 1];

        divider.style.left = nextColumn.offsetLeft - gapPx / 2 + "px";
        divider.style.right = "auto";
        divider.style.top = inset;
        divider.style.bottom = inset;
        divider.style.width = thickness;
        divider.style.height = "auto";
      }
    }
  }

  /* Updates all row dividers in a container; params: container<Element>. */
  function updateContainerDividers(container) {
    var rows;

    if (!isElement(container)) return;

    rows = safeQueryAll(container, "." + CLASS.row);

    for (var i = 0; i < rows.length; i += 1) {
      updateRowDividers(rows[i]);
    }
  }

  /* Schedules divider updates after layout; params: container<Element>. */
  function scheduleDividerUpdate(container) {
    var raf = win.requestAnimationFrame || function (callback) {
      return win.setTimeout(callback, 16);
    };

    raf(function () {
      updateContainerDividers(container); // Wait for layout to settle.
    });
  }

  /* Observes one row for size changes; params: row<Element>. */
  function observeRow(row) {
    if (!("ResizeObserver" in win)) return;

    if (!state.resizeObserver) {
      state.resizeObserver = new win.ResizeObserver(function (entries) {
        for (var i = 0; i < entries.length; i += 1) {
          updateRowDividers(entries[i].target);
        }
      });
    }

    state.resizeObserver.observe(row);
  }

  /* Stops observing one row; params: row<Element>. */
  function unobserveRow(row) {
    if (state.resizeObserver && row) {
      state.resizeObserver.unobserve(row);
    }
  }

  /* Binds global layout refresh events; params: none. */
  function bindGlobalResize() {
    if (state.resizeBound) return;

    state.resizeBound = true;
    state.resizeHandler = function () {
      for (var i = 0; i < state.containers.length; i += 1) {
        scheduleDividerUpdate(state.containers[i]);
      }
    };
    state.loadHandler = state.resizeHandler;

    win.addEventListener("resize", state.resizeHandler, false);
    win.addEventListener("load", state.loadHandler, false);
  }

  /* Unbinds global layout refresh events; params: none. */
  function unbindGlobalResize() {
    if (!state.resizeBound) return;

    win.removeEventListener("resize", state.resizeHandler, false);
    win.removeEventListener("load", state.loadHandler, false);

    state.resizeBound = false;
    state.resizeHandler = null;
    state.loadHandler = null;
  }

  /* Finds configured containers related to a node; params: node<Node>. */
  function findContainersForNode(node) {
    var out = [];

    if (!isElement(node)) {
      node = node && node.parentNode;
    }

    if (!isElement(node) || !state.options) return out;

    for (var i = 0; i < state.options.selectors.length; i += 1) {
      var selector = state.options.selectors[i];
      var cursor = node;
      var descendants;

      if (matchesSelector(cursor, selector) && out.indexOf(cursor) === -1) {
        out.push(cursor);
      }

      while (cursor && cursor !== doc && isElement(cursor)) {
        if (matchesSelector(cursor, selector) && out.indexOf(cursor) === -1) {
          out.push(cursor);
        }

        cursor = cursor.parentNode;
      }

      descendants = safeQueryAll(node, selector);

      for (var j = 0; j < descendants.length; j += 1) {
        if (out.indexOf(descendants[j]) === -1) {
          out.push(descendants[j]);
        }
      }
    }

    return out;
  }

  /* Adds containers to the debounced refresh queue; params: containers<Array>. */
  function queueRefresh(containers) {
    for (var i = 0; i < containers.length; i += 1) {
      if (state.pendingRefresh.indexOf(containers[i]) === -1) {
        state.pendingRefresh.push(containers[i]);
      }
    }

    if (state.pendingTimer) {
      win.clearTimeout(state.pendingTimer);
    }

    state.pendingTimer = win.setTimeout(function () {
      var pending = state.pendingRefresh.slice();

      state.pendingRefresh = [];
      state.pendingTimer = null;

      for (var j = 0; j < pending.length; j += 1) {
        refresh(pending[j]);
      }
    }, state.options.autoRefreshDelay);
  }

  /* Starts dynamic-content observation; params: none. */
  function startAutoRefresh() {
    stopAutoRefresh();

    if (!state.options || !state.options.autoRefresh || !("MutationObserver" in win) || !doc.body) return;

    state.mutationObserver = new win.MutationObserver(function (records) {
      var containers = [];

      for (var i = 0; i < records.length; i += 1) {
        var added = records[i].addedNodes || [];

        for (var j = 0; j < added.length; j += 1) {
          var node = added[j];
          var related;

          if (!isElement(node) || hasClass(node, CLASS.row) || hasClass(node, CLASS.rowRule)) continue;

          related = findContainersForNode(node);

          for (var k = 0; k < related.length; k += 1) {
            if (containers.indexOf(related[k]) === -1) {
              containers.push(related[k]);
            }
          }
        }
      }

      if (containers.length) {
        queueRefresh(containers);
      }
    });

    state.mutationObserver.observe(doc.body, {
      childList: true,
      subtree: true
    });
  }

  /* Stops dynamic-content observation; params: none. */
  function stopAutoRefresh() {
    if (state.mutationObserver) {
      state.mutationObserver.disconnect();
    }

    state.mutationObserver = null;

    if (state.pendingTimer) {
      win.clearTimeout(state.pendingTimer);
    }

    state.pendingTimer = null;
    state.pendingRefresh = [];
  }

  /* Runs DOM mutation work while observer is paused; params: callback<Function>. */
  function withAutoRefreshPaused(callback) {
    var shouldRestart = Boolean(state.options && state.options.autoRefresh && state.mutationObserver);

    if (shouldRestart) {
      stopAutoRefresh();
    }

    try {
      callback();
    } finally {
      if (shouldRestart) {
        startAutoRefresh();
      }
    }
  }

  /* Rebuilds a container into parallel rows; params: container<Element>, options<object>. */
  function rebuildContainer(container, options) {
    var children;
    var fragment;
    var index;
    var previousWasGeneratedRow;
    var generatedRows = 0;

    if (!isElement(container)) return;

    applyContainerOptions(container, options);

    children = toArray(container.children);
    fragment = doc.createDocumentFragment();
    index = 0;
    previousWasGeneratedRow = false;

    while (index < children.length) {
      var current = children[index];

      if (!isElement(current)) {
        index += 1;
        continue;
      }

      if (hasClass(current, CLASS.rowRule)) {
        index += 1;
        continue; // Old generated rules are discarded on rebuild.
      }

      if (hasClass(current, CLASS.row)) {
        previousWasGeneratedRow = true;
        fragment.appendChild(current);
        index += 1;
        continue;
      }

      if (isSkippedElement(current, options)) {
        fragment.appendChild(current);
        previousWasGeneratedRow = false;
        index += 1;

        while (index < children.length && isBlockquote(children[index])) {
          fragment.appendChild(children[index]); // Preserve table-related blockquotes.
          index += 1;
        }

        continue;
      }

      if (!isBodyStarter(current, options)) {
        fragment.appendChild(current);
        previousWasGeneratedRow = false;
        index += 1;
        continue;
      }

      var bodyNodes = collectBodyBlock(children, index, options);
      var groups = [bodyNodes];

      index += bodyNodes.length;

      while (index < children.length && isBlockquote(children[index])) {
        groups.push([children[index]]);
        index += 1;
      }

      if (groups.length <= 1) {
        for (var single = 0; single < bodyNodes.length; single += 1) {
          fragment.appendChild(bodyNodes[single]);
        }

        previousWasGeneratedRow = false;
        continue;
      }

      if (previousWasGeneratedRow && options.rowRuleEnabled) {
        fragment.appendChild(createRowRule(options)); // Compact HR between adjacent generated rows.
      }

      fragment.appendChild(createRow(groups, options));
      generatedRows += 1;
      previousWasGeneratedRow = true;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild); // Drop whitespace and stale generated nodes.
    }

    container.appendChild(fragment);
    container.setAttribute(ATTR.enabled, "true");

    var rows = safeQueryAll(container, "." + CLASS.row);

    for (var r = 0; r < rows.length; r += 1) {
      observeRow(rows[r]);
    }

    if (generatedRows > 0) {
      scheduleDividerUpdate(container);
    }
  }

  /* Restores a processed container to original document order; params: container<Element>. */
  function restoreContainer(container) {
    var nodes;
    var fragment;

    if (!isElement(container) || !container.hasAttribute(ATTR.enabled)) return;

    nodes = toArray(container.childNodes);
    fragment = doc.createDocumentFragment();

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];

      if (isElement(node) && hasClass(node, CLASS.row)) {
        unobserveRow(node);

        var children = toArray(node.children);

        for (var j = 0; j < children.length; j += 1) {
          if (isElement(children[j]) && hasClass(children[j], CLASS.col)) {
            while (children[j].firstChild) {
              fragment.appendChild(children[j].firstChild); // Move original content back.
            }
          }
        }
      } else if (isElement(node) && hasClass(node, CLASS.rowRule)) {
        continue; // Generated <hr> separators are not source content.
      } else {
        fragment.appendChild(node);
      }
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(fragment);
    container.removeAttribute(ATTR.enabled);
  }

  /* Ensures API calls have initialized state; params: none. */
  function ensureInitialized() {
    if (!state.initialized) {
      init();
    }
  }

  /* Enables parallel layout; params: target<any>. */
  function enable(target) {
    ensureInitialized();

    var containers = normalizeContainerInput(target);

    if (!containers.length) {
      containers = state.containers.slice();
    }

    withAutoRefreshPaused(function () {
      for (var i = 0; i < containers.length; i += 1) {
        if (!isElement(containers[i])) continue;

        applyContainerOptions(containers[i], state.options);

        if (!containers[i].hasAttribute(ATTR.enabled)) {
          rebuildContainer(containers[i], state.options);
        }
      }
    });

    return api;
  }

  /* Disables parallel layout and restores source order; params: target<any>. */
  function disable(target) {
    ensureInitialized();

    var containers = normalizeContainerInput(target);

    if (!containers.length) {
      containers = state.containers.slice();
    }

    withAutoRefreshPaused(function () {
      for (var i = 0; i < containers.length; i += 1) {
        restoreContainer(containers[i]);
      }
    });

    return api;
  }

  /* Toggles parallel layout; params: target<any>. */
  function toggle(target) {
    ensureInitialized();

    var containers = normalizeContainerInput(target);

    if (!containers.length) {
      containers = state.containers.slice();
    }

    for (var i = 0; i < containers.length; i += 1) {
      if (containers[i].hasAttribute(ATTR.enabled)) {
        disable(containers[i]);
      } else {
        enable(containers[i]);
      }
    }

    return api;
  }

  /* Refreshes and rebuilds layout; params: target<any>. */
  function refresh(target) {
    ensureInitialized();

    var containers = normalizeContainerInput(target);

    if (!containers.length) {
      state.containers = collectContainers(state.options);
      containers = state.containers.slice();
    }

    withAutoRefreshPaused(function () {
      for (var i = 0; i < containers.length; i += 1) {
        if (!isElement(containers[i])) continue;

        if (containers[i].hasAttribute(ATTR.enabled)) {
          restoreContainer(containers[i]);
        }

        rebuildContainer(containers[i], state.options);
      }
    });

    return api;
  }

  /* Initializes the script; params: userOptions<object>. */
  function init(userOptions) {
    if (state.initialized) {
      return updateConfig(userOptions || {}, { rebuild: true });
    }

    state.options = normalizeConfig(mergeObjects(getPreloadConfig(), userOptions || {}));
    upsertStyle(state.options);
    bindGlobalResize();
    state.containers = collectContainers(state.options);

    for (var i = 0; i < state.containers.length; i += 1) {
      applyContainerOptions(state.containers[i], state.options);
    }

    state.initialized = true;

    if (state.options.autoEnable) {
      enable();
    }

    startAutoRefresh();

    return api;
  }

  /* Updates runtime configuration; params: options<object>, runtimeOptions<object>. */
  function updateConfig(options, runtimeOptions) {
    var controls = runtimeOptions || {};
    var rebuild = controls.rebuild !== false;
    var oldContainers;
    var enabled = [];

    if (!state.initialized) {
      return init(options || {});
    }

    oldContainers = state.containers.slice();

    for (var i = 0; i < oldContainers.length; i += 1) {
      if (oldContainers[i].hasAttribute(ATTR.enabled)) {
        enabled.push(oldContainers[i]);
      }
    }

    state.options = normalizeConfig(mergeObjects(state.options, options || {}));
    upsertStyle(state.options);
    state.containers = collectContainers(state.options);

    for (var a = 0; a < state.containers.length; a += 1) {
      applyContainerOptions(state.containers[a], state.options);
    }

    if (rebuild) {
      withAutoRefreshPaused(function () {
        for (var b = 0; b < enabled.length; b += 1) {
          restoreContainer(enabled[b]);
        }

        var targetContainers = state.options.autoEnable ? state.containers : enabled;

        for (var c = 0; c < targetContainers.length; c += 1) {
          rebuildContainer(targetContainers[c], state.options);
        }
      });
    }

    startAutoRefresh();

    return api;
  }

  /* Destroys generated layout and listeners; params: target<any>. */
  function destroy(target) {
    ensureInitialized();

    var scoped = Boolean(target);
    var containers = normalizeContainerInput(target);

    if (!containers.length) {
      containers = state.containers.slice();
    }

    withAutoRefreshPaused(function () {
      for (var i = 0; i < containers.length; i += 1) {
        restoreContainer(containers[i]);
        clearContainerOptions(containers[i]);
      }
    });

    if (!scoped) {
      stopAutoRefresh();
      unbindGlobalResize();

      if (state.resizeObserver) {
        state.resizeObserver.disconnect();
      }

      state.resizeObserver = null;
      state.containers = [];
      state.options = null;
      state.initialized = false;
    }

    return api;
  }

  /* Binds click handlers to toggles; params: buttonTarget<any>, containerTarget<any>. */
  function bindToggleButton(buttonTarget, containerTarget) {
    ensureInitialized();

    var buttons = normalizeContainerInput(buttonTarget);

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener("click", function () {
        toggle(containerTarget);
      }, false);
    }

    return api;
  }

  /* Sets body/list/blockquote font size; params: fontSize<string|number>, target<any>. */
  function setFontSize(fontSize, target) {
    ensureInitialized();

    var containers = normalizeContainerInput(target);

    state.options.fontSize = normalizeSize(fontSize, state.options.fontSize);

    if (!containers.length) {
      containers = state.containers.slice();
    }

    for (var i = 0; i < containers.length; i += 1) {
      addClass(containers[i], CLASS.scope);
      containers[i].style.setProperty("--ptc-font-size", state.options.fontSize);
      scheduleDividerUpdate(containers[i]);
    }

    return api;
  }

  /* Sets vertical column alignment; params: verticalAlign<string>, target<any>. */
  function setVerticalAlign(verticalAlign, target) {
    ensureInitialized();

    var containers = normalizeContainerInput(target);

    state.options.verticalAlign = normalizeVerticalAlign(verticalAlign);

    if (!containers.length) {
      containers = state.containers.slice();
    }

    for (var i = 0; i < containers.length; i += 1) {
      addClass(containers[i], CLASS.scope);
      containers[i].style.setProperty("--ptc-col-justify", state.options.verticalAlign);
      scheduleDividerUpdate(containers[i]);
    }

    return api;
  }

  /* Sets column ratios and rebuilds enabled containers; params: columnRatios<object|Array>, target<any>. */
  function setColumnRatios(columnRatios, target) {
    ensureInitialized();

    state.options.columnRatios = normalizeRatioMap(columnRatios);
    refresh(target);

    return api;
  }

  /* Sets compact text mode; params: compactText<boolean>, target<any>. */
  function setCompactText(compactText, target) {
    ensureInitialized();

    var containers = normalizeContainerInput(target);

    state.options.compactText = compactText !== false;

    if (!containers.length) {
      containers = state.containers.slice();
    }

    for (var i = 0; i < containers.length; i += 1) {
      containers[i].setAttribute(ATTR.compact, state.options.compactText ? "true" : "false");
      scheduleDividerUpdate(containers[i]);
    }

    return api;
  }

  /* Sets direct-child block spacing; params: blockSpacing<string|number>, target<any>. */
  function setBlockSpacing(blockSpacing, target) {
    ensureInitialized();

    var containers = normalizeContainerInput(target);

    state.options.blockSpacing = normalizeSize(blockSpacing, state.options.blockSpacing);

    if (!containers.length) {
      containers = state.containers.slice();
    }

    for (var i = 0; i < containers.length; i += 1) {
      addClass(containers[i], CLASS.scope);
      containers[i].style.setProperty("--ptc-block-spacing", state.options.blockSpacing);
      scheduleDividerUpdate(containers[i]);
    }

    return api;
  }

  /* Returns a copy of the active config; params: none. */
  function getConfig() {
    ensureInitialized();

    return mergeObjects(state.options);
  }

  var api = {
    init: init,
    updateConfig: updateConfig,
    enable: enable,
    disable: disable,
    toggle: toggle,
    refresh: refresh,
    destroy: destroy,
    bindToggleButton: bindToggleButton,
    setFontSize: setFontSize,
    setVerticalAlign: setVerticalAlign,
    setColumnRatios: setColumnRatios,
    setCompactText: setCompactText,
    setBlockSpacing: setBlockSpacing,
    getConfig: getConfig,
    classes: mergeObjects(CLASS),
    defaults: mergeObjects(DEFAULT_CONFIG)
  };

  win.parallelTextColumns = api;

  onReady(function () {
    if (!state.initialized) {
      init(); // Plug-and-play default behavior.
    }
  });
})(window, document);
