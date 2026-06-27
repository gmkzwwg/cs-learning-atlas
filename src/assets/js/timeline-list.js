/*!
 * timeline-list.js
 *
 * Introduction:
 *   Converts Markdown lists following a `timeline:` marker into structured timeline blocks.
 *
 * Usage:
 *   Include this file on the page. It runs automatically with DEFAULT_CONFIG.
 *   Default behavior can be customized by editing DEFAULT_CONFIG below.
 *   Runtime behavior can be customized with window.JekyllTimeline.updateConfig().
 *
 * Global API:
 *   window.JekyllTimeline.apply(selectorOrElements, options)
 *   window.JekyllTimeline.init(selectorOrElements, options)
 *   window.JekyllTimeline.updateConfig(config, runtimeOptions)
 *   window.JekyllTimeline.getConfig()
 *
 * Notes:
 *   This script scans configured containers with TreeWalker for better performance.
 *   It accepts plain or inline-formatted timeline markers, such as `timeline:` or `**timeline:**`.
 *   It injects compact CSS and keeps glass blur lightweight by default.
 *   It does not animate backdrop-filter and does not use long-lived will-change.
 */

(function (window, document) {
  "use strict";

  if (!window || !document) return;

  var DEFAULT_CONFIG = {
    selector: ".post-content", // Default content container selector.
    autoApply: true, // Apply automatically after script loading.
    markerPattern: /^(?:timelines?|时间线|时间轴)\s*[:：]\s*$/i, // Marker text placed immediately before a list.
    styleId: "jekyll-timeline-styles", // Injected style element ID.
    instanceClass: "jtimeline", // Root class for generated timelines.
    fallbackTitlePrefix: "Unknown ", // Prefix used when an event title is empty.

    summaryWidth: "11%", // Left summary column width.
    gap: "0.92rem", // Gap between summary, axis, and details.
    axisWidth: "0.3rem", // Axis column width.
    lineWidth: "0.3rem", // Main vertical line width.
    detailRadius: "12px", // Detail box border radius.
    detailPadding: "0.62rem 0.78rem", // Detail box padding.
    detailGroupGap: "0.48rem", // Gap between multiple detail boxes.
    leftTitleMinHeight: "2.2rem", // Minimum summary column height.
    summaryTopLineOffset: "0.2rem", // Top line offset in summary column.
    summaryTopLineGap: "0.36rem", // Gap between top line and summary text.
    summaryTopLineWidth: "1px", // Summary top line thickness.
    boxConnectorWidth: "1px", // Connector line thickness.
    boxConnectorBallSize: "0.6rem", // Connector dot size.
    lineColor: "rgba(120, 150, 180, 0.34)", // Main timeline line color.

    glassEnabled: true, // Enable lightweight glass effect on detail boxes.
    glassBlur: "4px", // Lightweight backdrop blur; keep low for performance.
    glassSaturate: "1.02", // Lightweight saturation for glass effect.
    glassFallbackBackground: "rgba(255, 255, 255, 0.08)", // Fallback when backdrop-filter is unsupported.

    detailColorMode: "random", // Detail color selection mode. candidates: sequential | random
    palette: [
      { name: "lake-blue", accent: "#58b7d8", accentSoft: "rgba(88, 183, 216, 0.10)", accentBgStrong: "rgba(88, 183, 216, 0.14)" },
      { name: "royal-blue", accent: "#5a8dee", accentSoft: "rgba(90, 141, 238, 0.10)", accentBgStrong: "rgba(90, 141, 238, 0.14)" },
      { name: "ink-blue", accent: "#4f7ac8", accentSoft: "rgba(79, 122, 200, 0.10)", accentBgStrong: "rgba(79, 122, 200, 0.14)" },
      { name: "teal-cyan", accent: "#42bfb7", accentSoft: "rgba(66, 191, 183, 0.10)", accentBgStrong: "rgba(66, 191, 183, 0.14)" },
      { name: "deep-cyan", accent: "#3da7c7", accentSoft: "rgba(61, 167, 199, 0.10)", accentBgStrong: "rgba(61, 167, 199, 0.14)" },
      { name: "sea-glass", accent: "#69c3a5", accentSoft: "rgba(105, 195, 165, 0.09)", accentBgStrong: "rgba(105, 195, 165, 0.13)" },
      { name: "emerald-mist", accent: "#54b887", accentSoft: "rgba(84, 184, 135, 0.09)", accentBgStrong: "rgba(84, 184, 135, 0.13)" },
      { name: "olive-sage", accent: "#7ea66a", accentSoft: "rgba(126, 166, 106, 0.09)", accentBgStrong: "rgba(126, 166, 106, 0.13)" },
      { name: "mist-indigo", accent: "#7c9cff", accentSoft: "rgba(124, 156, 255, 0.10)", accentBgStrong: "rgba(124, 156, 255, 0.14)" },
      { name: "aurora-violet", accent: "#a283ff", accentSoft: "rgba(162, 131, 255, 0.09)", accentBgStrong: "rgba(162, 131, 255, 0.13)" },
      { name: "iris-purple", accent: "#8f7ae6", accentSoft: "rgba(143, 122, 230, 0.09)", accentBgStrong: "rgba(143, 122, 230, 0.13)" },
      { name: "orchid", accent: "#b67bd6", accentSoft: "rgba(182, 123, 214, 0.09)", accentBgStrong: "rgba(182, 123, 214, 0.13)" },
      { name: "rose-quartz", accent: "#d684a2", accentSoft: "rgba(214, 132, 162, 0.09)", accentBgStrong: "rgba(214, 132, 162, 0.13)" },
      { name: "berry-rose", accent: "#c96d8f", accentSoft: "rgba(201, 109, 143, 0.09)", accentBgStrong: "rgba(201, 109, 143, 0.13)" },
      { name: "coral-red", accent: "#d97a6c", accentSoft: "rgba(217, 122, 108, 0.09)", accentBgStrong: "rgba(217, 122, 108, 0.13)" },
      { name: "ruby-red", accent: "#c96878", accentSoft: "rgba(201, 104, 120, 0.09)", accentBgStrong: "rgba(201, 104, 120, 0.13)" },
      { name: "amber-gold", accent: "#cfa45f", accentSoft: "rgba(207, 164, 95, 0.09)", accentBgStrong: "rgba(207, 164, 95, 0.13)" },
      { name: "champagne-gold", accent: "#bda36e", accentSoft: "rgba(189, 163, 110, 0.09)", accentBgStrong: "rgba(189, 163, 110, 0.13)" },
      { name: "bronze-copper", accent: "#b88366", accentSoft: "rgba(184, 131, 102, 0.09)", accentBgStrong: "rgba(184, 131, 102, 0.13)" },
      { name: "frost-silver", accent: "#6ea9c7", accentSoft: "rgba(110, 169, 199, 0.09)", accentBgStrong: "rgba(110, 169, 199, 0.13)" },
      { name: "slate-gray", accent: "#7d90a6", accentSoft: "rgba(125, 144, 166, 0.09)", accentBgStrong: "rgba(125, 144, 166, 0.13)" },
      { name: "graphite", accent: "#8391a3", accentSoft: "rgba(131, 145, 163, 0.09)", accentBgStrong: "rgba(131, 145, 163, 0.13)" }
    ] // Accent palette used by detail boxes.
  };

  var activeConfig = merge({}, DEFAULT_CONFIG);
  var styleSignature = "";

  /* Merges objects from left to right; params: ...objects<object>. */
  function merge() {
    var output = {};

    Array.prototype.slice.call(arguments).forEach(function (object) {
      Object.keys(object || {}).forEach(function (key) {
        output[key] = object[key];
      });
    });

    return output;
  }

  /* Converts array-like values into arrays; params: value<ArrayLike>. */
  function toArray(value) {
    return Array.prototype.slice.call(value || []);
  }

  /* Checks whether a value is an element; params: value<any>. */
  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  /* Escapes CSS class names when possible; params: value<string>. */
  function escapeCssClass(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }

    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&"); // Minimal fallback.
  }

  /* Normalizes config values; params: nextConfig<object>. */
  function normalizeConfig(nextConfig) {
    var config = merge(DEFAULT_CONFIG, nextConfig || {});

    config.selector = typeof config.selector === "string" && config.selector.trim()
      ? config.selector.trim()
      : DEFAULT_CONFIG.selector;

    config.instanceClass = typeof config.instanceClass === "string" && config.instanceClass.trim()
      ? config.instanceClass.trim()
      : DEFAULT_CONFIG.instanceClass;

    config.markerPattern = config.markerPattern instanceof RegExp
      ? config.markerPattern
      : DEFAULT_CONFIG.markerPattern;

    config.palette = Array.isArray(config.palette) && config.palette.length
      ? config.palette
      : DEFAULT_CONFIG.palette.slice();

    config.detailColorMode = String(config.detailColorMode || "random").toLowerCase();
    config.glassEnabled = config.glassEnabled !== false;
    config.autoApply = config.autoApply !== false;

    return config;
  }

  /* Builds a stable style signature; params: config<object>. */
  function getStyleSignature(config) {
    return [
      config.instanceClass,
      config.glassBlur,
      config.glassSaturate,
      config.glassFallbackBackground
    ].join("|");
  }

  /* Injects or updates CSS; params: config<object>. */
  function injectStyles(config) {
    var signature = getStyleSignature(config);
    var rootClass = escapeCssClass(config.instanceClass);
    var style = document.getElementById(config.styleId);

    if (style && signature === styleSignature) return;

    if (!style) {
      style = document.createElement("style");
      style.id = config.styleId;
      document.head.appendChild(style);
    }

    styleSignature = signature;

    style.textContent = [
      "." + rootClass + " {",
      "  --jt-summary-width: 11%;",
      "  --jt-gap: 0.92rem;",
      "  --jt-axis-width: 0.3rem;",
      "  --jt-line-width: 0.3rem;",
      "  --jt-detail-radius: 12px;",
      "  --jt-detail-padding: 0.62rem 0.78rem;",
      "  --jt-detail-group-gap: 0.48rem;",
      "  --jt-left-title-min-height: 2.2rem;",
      "  --jt-summary-top-line-offset: 0.2rem;",
      "  --jt-summary-top-line-gap: 0.36rem;",
      "  --jt-summary-top-line-width: 1px;",
      "  --jt-box-connector-width: 1px;",
      "  --jt-box-connector-ball-size: 0.6rem;",
      "  --jt-line-color: rgba(120, 150, 180, 0.34);",
      "  --jt-glass-blur: " + config.glassBlur + ";",
      "  --jt-glass-saturate: " + config.glassSaturate + ";",
      "  --jt-glass-fallback-bg: " + config.glassFallbackBackground + ";",
      "  position: relative;",
      "  display: grid;",
      "  gap: 0.82rem;",
      "  margin: 1.5rem 0;",
      "}",
      "",
      "." + rootClass + "::before {",
      "  content: '';",
      "  position: absolute;",
      "  top: 0.55rem;",
      "  bottom: 0.55rem;",
      "  left: calc(var(--jt-summary-width) + var(--jt-gap) + (var(--jt-axis-width) / 2) - (var(--jt-line-width) / 2));",
      "  width: var(--jt-line-width);",
      "  background: var(--jt-line-color);",
      "  pointer-events: none;",
      "}",
      "",
      "." + rootClass + "__event {",
      "  --jt-event-accent: #58b7d8;",
      "  --jt-event-soft: rgba(88, 183, 216, 0.10);",
      "  --jt-event-bg-strong: rgba(88, 183, 216, 0.14);",
      "  position: relative;",
      "  display: grid;",
      "  grid-template-columns: minmax(4rem, var(--jt-summary-width)) var(--jt-axis-width) minmax(0, 1fr);",
      "  column-gap: var(--jt-gap);",
      "  align-items: stretch;",
      "}",
      "",
      "." + rootClass + "__summary {",
      "  position: relative;",
      "  min-height: var(--jt-left-title-min-height);",
      "  height: 100%;",
      "  display: flex;",
      "  align-items: flex-start;",
      "  justify-content: flex-start;",
      "  align-self: stretch;",
      "  text-align: left;",
      "  font-weight: 700;",
      "  font-size: clamp(0.92rem, 0.88rem + 0.18vw, 1.04rem);",
      "  line-height: 1.45;",
      "  letter-spacing: 0.01em;",
      "  color: var(--jt-event-accent);",
      "  padding-top: calc(var(--jt-summary-top-line-offset) + var(--jt-summary-top-line-gap));",
      "}",
      "",
      "." + rootClass + "__summary::before {",
      "  content: '';",
      "  position: absolute;",
      "  top: var(--jt-summary-top-line-offset);",
      "  left: 0;",
      "  right: 0;",
      "  height: var(--jt-summary-top-line-width);",
      "  background: var(--jt-line-color);",
      "  opacity: 0.9;",
      "}",
      "",
      "." + rootClass + "__summary > *:first-child {",
      "  margin-top: 0;",
      "  margin-bottom: 0;",
      "  width: 100%;",
      "}",
      "",
      "." + rootClass + "__axis {",
      "  position: relative;",
      "  min-height: 100%;",
      "  align-self: stretch;",
      "}",
      "",
      "." + rootClass + "__details {",
      "  min-width: 0;",
      "  display: grid;",
      "  gap: var(--jt-detail-group-gap);",
      "}",
      "",
      "." + rootClass + "__detail-box {",
      "  position: relative;",
      "  min-width: 0;",
      "  padding: var(--jt-detail-padding);",
      "  border: 1px solid var(--jt-event-accent);",
      "  border-radius: var(--jt-detail-radius);",
      "  background: linear-gradient(180deg, var(--jt-event-soft), var(--jt-event-bg-strong));",
      "  color: var(--jt-event-accent);",
      "  box-shadow: 0 0 0 1px rgba(255,255,255,0.035) inset;",
      "  overflow: visible;",
      "}",
      "",
      "." + rootClass + "[data-jt-glass='true'] ." + rootClass + "__detail-box {",
      "  backdrop-filter: blur(var(--jt-glass-blur)) saturate(var(--jt-glass-saturate));",
      "  -webkit-backdrop-filter: blur(var(--jt-glass-blur)) saturate(var(--jt-glass-saturate));",
      "}",
      "",
      "@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {",
      "  ." + rootClass + "[data-jt-glass='true'] ." + rootClass + "__detail-box {",
      "    background: var(--jt-glass-fallback-bg);",
      "  }",
      "}",
      "",
      "." + rootClass + "__detail-box::before {",
      "  content: '';",
      "  position: absolute;",
      "  top: 50%;",
      "  left: calc(-1 * (var(--jt-gap) + (var(--jt-axis-width) / 2)));",
      "  width: calc(var(--jt-gap) + (var(--jt-axis-width) / 2));",
      "  height: var(--jt-box-connector-width);",
      "  transform: translateY(-50%);",
      "  background: var(--jt-line-color);",
      "  opacity: 0.95;",
      "}",
      "",
      "." + rootClass + "__detail-box::after {",
      "  content: '';",
      "  position: absolute;",
      "  top: 50%;",
      "  left: calc(-1 * (var(--jt-gap) + (var(--jt-axis-width) / 2) + (var(--jt-box-connector-ball-size) / 2)));",
      "  width: var(--jt-box-connector-ball-size);",
      "  height: var(--jt-box-connector-ball-size);",
      "  transform: translateY(-50%);",
      "  border-radius: 999px;",
      "  background: var(--jt-line-color);",
      "  box-shadow: 0 0 0 1px rgba(255,255,255,0.04);",
      "  opacity: 0.95;",
      "}",
      "",
      "." + rootClass + "__detail-box > :first-child { margin-top: 0; }",
      "." + rootClass + "__detail-box > :last-child { margin-bottom: 0; }",
      "",
      "." + rootClass + "__detail-root-list {",
      "  margin: 0;",
      "  padding-left: 0;",
      "  list-style: none;",
      "}",
      "",
      "." + rootClass + "__detail-root-item {",
      "  margin: 0;",
      "  list-style: none;",
      "  color: inherit;",
      "  font-weight: 700;",
      "  line-height: 1.62;",
      "}",
      "",
      "." + rootClass + "__detail-root-item::marker { content: ''; }",
      "",
      "." + rootClass + "__detail-root-item > ul,",
      "." + rootClass + "__detail-root-item > ol {",
      "  margin: 0.34rem 0 0 0;",
      "  padding-left: 1.2rem;",
      "  list-style-position: outside;",
      "  font-weight: 400;",
      "}",
      "",
      "." + rootClass + "__detail-root-item > ul > li,",
      "." + rootClass + "__detail-root-item > ol > li {",
      "  margin: 0.24rem 0;",
      "  font-weight: 400;",
      "  line-height: 1.62;",
      "  list-style: inherit;",
      "}",
      "",
      "." + rootClass + "__detail-box p,",
      "." + rootClass + "__detail-box span,",
      "." + rootClass + "__detail-box strong,",
      "." + rootClass + "__detail-box em,",
      "." + rootClass + "__detail-box b,",
      "." + rootClass + "__detail-box i,",
      "." + rootClass + "__detail-box small,",
      "." + rootClass + "__detail-box div,",
      "." + rootClass + "__detail-box h1,",
      "." + rootClass + "__detail-box h2,",
      "." + rootClass + "__detail-box h3,",
      "." + rootClass + "__detail-box h4,",
      "." + rootClass + "__detail-box h5,",
      "." + rootClass + "__detail-box h6 {",
      "  color: inherit;",
      "}",
      "",
      "." + rootClass + "__detail-box a {",
      "  color: inherit;",
      "  text-decoration-color: currentColor;",
      "  text-underline-offset: 0.14em;",
      "  text-decoration-thickness: 1px;",
      "}",
      "",
      "." + rootClass + "__detail-box code {",
      "  color: inherit;",
      "  border: 1px solid currentColor;",
      "  border-radius: 0.36rem;",
      "  background: rgba(255,255,255,0.04);",
      "  padding: 0.06rem 0.34rem;",
      "}",
      "",
      "." + rootClass + "__detail-box pre {",
      "  color: inherit;",
      "  border: 1px solid currentColor;",
      "  border-radius: 0.62rem;",
      "  background: rgba(255,255,255,0.04);",
      "  padding: 0.72rem 0.82rem;",
      "  overflow: auto;",
      "}",
      "",
      "." + rootClass + "__detail-box pre code {",
      "  border: 0;",
      "  background: transparent;",
      "  padding: 0;",
      "}",
      "",
      "." + rootClass + "__detail-box blockquote {",
      "  color: inherit;",
      "  border-left: 3px solid currentColor;",
      "  margin: 0.55rem 0;",
      "  padding-left: 0.7rem;",
      "  opacity: 0.95;",
      "}",
      "",
      "." + rootClass + "__detail-box table {",
      "  width: 100%;",
      "  border-collapse: collapse;",
      "  color: inherit;",
      "}",
      "",
      "." + rootClass + "__detail-box th,",
      "." + rootClass + "__detail-box td {",
      "  color: inherit;",
      "  border: 1px solid currentColor;",
      "  padding: 0.38rem 0.48rem;",
      "}",
      "",
      "." + rootClass + "[data-jt-empty-details='true'] ." + rootClass + "__details {",
      "  display: none;",
      "}",
      "",
      "@media (max-width: 780px) {",
      "  ." + rootClass + "::before {",
      "    left: calc((var(--jt-axis-width) / 2) - (var(--jt-line-width) / 2));",
      "  }",
      "  ." + rootClass + "__event {",
      "    grid-template-columns: var(--jt-axis-width) minmax(0, 1fr);",
      "    row-gap: 0.34rem;",
      "  }",
      "  ." + rootClass + "__summary {",
      "    grid-column: 2;",
      "    grid-row: 1;",
      "    min-height: auto;",
      "  }",
      "  ." + rootClass + "__axis {",
      "    grid-column: 1;",
      "    grid-row: 1 / span 2;",
      "  }",
      "  ." + rootClass + "__details {",
      "    grid-column: 2;",
      "    grid-row: 2;",
      "  }",
      "  ." + rootClass + "__detail-box::before {",
      "    left: calc(-1 * (var(--jt-gap) + (var(--jt-axis-width) / 2)));",
      "    width: calc(var(--jt-gap) + (var(--jt-axis-width) / 2));",
      "  }",
      "  ." + rootClass + "__detail-box::after {",
      "    left: calc(-1 * (var(--jt-gap) + (var(--jt-axis-width) / 2) + (var(--jt-box-connector-ball-size) / 2)));",
      "  }",
      "}"
    ].join("\n");
  }

  /* Normalizes selector, element, NodeList, or array into elements; params: selectorOrElements<any>, config<object>. */
  function normalizeContainers(selectorOrElements, config) {
    if (!selectorOrElements) {
      return toArray(document.querySelectorAll(config.selector));
    }

    if (typeof selectorOrElements === "string") {
      return toArray(document.querySelectorAll(selectorOrElements));
    }

    if (isElement(selectorOrElements)) {
      return [selectorOrElements];
    }

    if (selectorOrElements.length) {
      return toArray(selectorOrElements).filter(isElement);
    }

    return [];
  }

  /* Checks whether an element is a timeline marker; params: element<Element>, config<object>. */
  function isTimelineMarker(element, config) {
    if (!element) return false;

    return config.markerPattern.test((element.textContent || "").trim());
  }

  /* Collects eligible marker/list pairs with TreeWalker; params: container<Element>, config<object>. */
  function getEligibleLists(container, config) {
    var results = [];
    var rootSelector = "." + escapeCssClass(config.instanceClass);
    var walker;
    var node;

    if (!container) return results;

    if (
      (container.tagName === "UL" || container.tagName === "OL") &&
      isTimelineMarker(container.previousElementSibling, config)
    ) {
      results.push({
        marker: container.previousElementSibling,
        list: container
      });

      return results;
    }

    walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);

    while (walker.nextNode()) {
      node = walker.currentNode;

      if (node.closest(rootSelector)) continue;
      if (!isTimelineMarker(node, config)) continue;

      var next = node.nextElementSibling;

      if (!next) continue;
      if (next.dataset.timelineProcessed === "true") continue;
      if (next.tagName !== "UL" && next.tagName !== "OL") continue;

      results.push({
        marker: node,
        list: next
      });
    }

    return results;
  }

  /* Returns direct child lists of an li; params: li<Element>. */
  function getDirectChildLists(li) {
    return toArray(li.children).filter(function (element) {
      return element.tagName === "UL" || element.tagName === "OL";
    });
  }

  /* Removes IDs from cloned content to avoid duplicate IDs; params: root<Node>. */
  function removeDuplicateIds(root) {
    if (!root || !root.querySelectorAll) return;

    if (root.removeAttribute && root.hasAttribute && root.hasAttribute("id")) {
      root.removeAttribute("id");
    }

    toArray(root.querySelectorAll("[id]")).forEach(function (element) {
      element.removeAttribute("id");
    });
  }

  /* Creates a cloned fragment from nodes; params: nodes<Array>. */
  function createFragmentFromNodes(nodes) {
    var fragment = document.createDocumentFragment();

    nodes.forEach(function (node) {
      var cloned = node.cloneNode(true);

      removeDuplicateIds(cloned);
      fragment.appendChild(cloned);
    });

    return fragment;
  }

  /* Returns summary nodes from one root li; params: li<Element>. */
  function getSummaryNodes(li) {
    var summaryNodes = [];

    toArray(li.childNodes).forEach(function (node) {
      if (node.nodeType === 1 && (node.tagName === "UL" || node.tagName === "OL")) return;
      if (node.nodeType === 3 && !node.textContent.trim()) return;

      summaryNodes.push(node);
    });

    return summaryNodes;
  }

  /* Builds summary column; params: li<Element>, index<number>, config<object>. */
  function buildSummary(li, index, config) {
    var summary = document.createElement("div");
    var summaryNodes = getSummaryNodes(li);
    var wrapper;
    var fallback;

    summary.className = config.instanceClass + "__summary";

    if (!summaryNodes.length) {
      fallback = document.createElement("strong");
      fallback.textContent = config.fallbackTitlePrefix + String(index + 1);
      summary.appendChild(fallback);

      return summary;
    }

    wrapper = document.createElement("div");
    wrapper.appendChild(createFragmentFromNodes(summaryNodes));
    summary.appendChild(wrapper);

    return summary;
  }

  /* Builds empty axis column; params: config<object>. */
  function buildAxis(config) {
    var axis = document.createElement("div");

    axis.className = config.instanceClass + "__axis";

    return axis;
  }

  /* Builds detail boxes from nested lists; params: li<Element>, config<object>. */
  function buildDetails(li, config) {
    var details = document.createElement("div");
    var childLists = getDirectChildLists(li);

    details.className = config.instanceClass + "__details";

    if (!childLists.length) return details;

    childLists.forEach(function (list) {
      var childItems = toArray(list.children).filter(function (child) {
        return child.tagName === "LI";
      });

      childItems.forEach(function (item) {
        var box = document.createElement("div");
        var rootBlock = document.createElement("div");
        var paragraph = document.createElement("p");
        var clonedItem = item.cloneNode(true);

        removeDuplicateIds(clonedItem);

        box.className = config.instanceClass + "__detail-box";
        rootBlock.className = config.instanceClass + "__detail-root-list";
        paragraph.className = config.instanceClass + "__detail-root-item";

        toArray(clonedItem.childNodes).forEach(function (node) {
          if (node.nodeType === 1 && (node.tagName === "UL" || node.tagName === "OL")) {
            rootBlock.appendChild(node);
          } else {
            paragraph.appendChild(node);
          }
        });

        if (paragraph.textContent.trim() || paragraph.children.length) {
          rootBlock.insertBefore(paragraph, rootBlock.firstChild);
        }

        box.appendChild(rootBlock);
        details.appendChild(box);
      });
    });

    return details;
  }

  /* Applies root CSS variables; params: root<Element>, config<object>. */
  function applyTimelineVars(root, config) {
    root.style.setProperty("--jt-summary-width", config.summaryWidth);
    root.style.setProperty("--jt-gap", config.gap);
    root.style.setProperty("--jt-axis-width", config.axisWidth);
    root.style.setProperty("--jt-line-width", config.lineWidth);
    root.style.setProperty("--jt-detail-radius", config.detailRadius);
    root.style.setProperty("--jt-detail-padding", config.detailPadding);
    root.style.setProperty("--jt-detail-group-gap", config.detailGroupGap);
    root.style.setProperty("--jt-left-title-min-height", config.leftTitleMinHeight);
    root.style.setProperty("--jt-summary-top-line-offset", config.summaryTopLineOffset);
    root.style.setProperty("--jt-summary-top-line-gap", config.summaryTopLineGap);
    root.style.setProperty("--jt-summary-top-line-width", config.summaryTopLineWidth);
    root.style.setProperty("--jt-box-connector-width", config.boxConnectorWidth);
    root.style.setProperty("--jt-box-connector-ball-size", config.boxConnectorBallSize);
    root.style.setProperty("--jt-line-color", config.lineColor);
    root.style.setProperty("--jt-glass-blur", config.glassBlur);
    root.style.setProperty("--jt-glass-saturate", config.glassSaturate);
    root.style.setProperty("--jt-glass-fallback-bg", config.glassFallbackBackground);
    root.dataset.jtGlass = config.glassEnabled ? "true" : "false";
  }

  /* Applies one event theme; params: event<Element>, theme<object>. */
  function applyEventTheme(event, theme) {
    event.style.setProperty("--jt-event-accent", theme.accent);
    event.style.setProperty("--jt-event-soft", theme.accentSoft || "rgba(88, 183, 216, 0.10)");
    event.style.setProperty("--jt-event-bg-strong", theme.accentBgStrong || "rgba(88, 183, 216, 0.14)");
  }

  /* Picks theme from palette; params: config<object>, state<object>. */
  function pickTheme(config, state) {
    var palette = config.palette || [];
    var mode = String(config.detailColorMode || "sequential").toLowerCase();
    var index;

    if (!palette.length) {
      return {
        accent: "#58b7d8",
        accentSoft: "rgba(88, 183, 216, 0.10)",
        accentBgStrong: "rgba(88, 183, 216, 0.14)"
      };
    }

    if (mode === "random") {
      if (palette.length === 1) {
        index = 0;
      } else {
        do {
          index = Math.floor(Math.random() * palette.length);
        } while (index === state.lastThemeIndex);
      }
    } else {
      index = state.themeCursor % palette.length;
      state.themeCursor += 1;
    }

    state.lastThemeIndex = index;

    return palette[index];
  }

  /* Transforms one list into a timeline; params: list<Element>, marker<Element>, config<object>, state<object>. */
  function transformList(list, marker, config, state) {
    var items;
    var timeline;
    var hasAnyDetails = false;

    if (!list || list.dataset.timelineProcessed === "true") return null;

    items = toArray(list.children).filter(function (child) {
      return child.tagName === "LI";
    });

    if (!items.length) return null;

    list.dataset.timelineProcessed = "true";

    timeline = document.createElement("section");
    timeline.className = config.instanceClass;
    timeline.dataset.timelineProcessed = "true";

    applyTimelineVars(timeline, config);

    items.forEach(function (li, itemIndex) {
      var event = document.createElement("article");
      var summary = buildSummary(li, itemIndex, config);
      var axis = buildAxis(config);
      var details = buildDetails(li, config);
      var theme = pickTheme(config, state);

      event.className = config.instanceClass + "__event";

      applyEventTheme(event, theme);

      if (details.children.length) {
        hasAnyDetails = true;
      }

      event.appendChild(summary);
      event.appendChild(axis);
      event.appendChild(details);
      timeline.appendChild(event);
    });

    timeline.dataset.jtEmptyDetails = hasAnyDetails ? "false" : "true";

    list.replaceWith(timeline);

    if (marker && marker.parentNode) {
      marker.parentNode.removeChild(marker);
    }

    return timeline;
  }

  /* Applies timeline conversion; params: selectorOrElements<any>, userOptions<object>. */
  function apply(selectorOrElements, userOptions) {
    var config = normalizeConfig(merge(activeConfig, userOptions || {}));
    var containers;
    var transformed = [];
    var state = {
      themeCursor: 0,
      lastThemeIndex: -1
    };

    activeConfig = config;

    injectStyles(config);

    containers = normalizeContainers(selectorOrElements || config.selector, config);

    containers.forEach(function (container) {
      var eligible = getEligibleLists(container, config);

      eligible.forEach(function (entry) {
        var timeline = transformList(entry.list, entry.marker, config, state);

        if (timeline) {
          transformed.push(timeline);
        }
      });
    });

    return transformed;
  }

  /* Updates existing timeline CSS variables; params: config<object>. */
  function updateExistingTimelines(config) {
    var selector = "." + escapeCssClass(config.instanceClass);
    var timelines = toArray(document.querySelectorAll(selector));

    timelines.forEach(function (timeline) {
      applyTimelineVars(timeline, config);
    });
  }

  /* Updates runtime config; params: nextConfig<object>, runtimeOptions<object>. */
  function updateConfig(nextConfig, runtimeOptions) {
    var controls = runtimeOptions || {};
    var safeConfig = merge({}, nextConfig || {});

    delete safeConfig.instanceClass;

    activeConfig = normalizeConfig(merge(activeConfig, safeConfig));

    injectStyles(activeConfig);
    updateExistingTimelines(activeConfig);

    if (controls.apply !== false && activeConfig.autoApply) {
      apply(activeConfig.selector);
    }

    return getConfig();
  }

  /* Returns active config copy; params: none. */
  function getConfig() {
    return merge({}, activeConfig);
  }

  /* Runs automatic startup; params: none. */
  function onReady() {
    if (!activeConfig.autoApply) return;

    apply(activeConfig.selector);
  }
  function bindRenderedContentListener() {
    document.addEventListener('content:rendered', function (event) {
      var container = event.detail && event.detail.container;

      if (!container || container.nodeType !== 1) return;

      apply(container);
    });
  }
  activeConfig = normalizeConfig(DEFAULT_CONFIG);

  window.JekyllTimeline = {
    apply: apply,
    init: apply,
    updateConfig: updateConfig,
    getConfig: getConfig,
    defaults: merge({}, DEFAULT_CONFIG)
  };

  bindRenderedContentListener();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady, { once: true });
  } else {
    onReady();
  }
})(window, document);