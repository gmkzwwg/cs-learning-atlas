/*!
 * todo-summary.js
 *
 * Introduction:
 *   Highlights TODO fragments in page content and renders a TODO summary.
 *   The summary can be rendered as a floating glass panel or injected as plain text into a target element.
 *
 * Usage:
 *   Include this file on the page. It runs automatically with DEFAULT_CONFIG.
 *   Default behavior can be customized by editing DEFAULT_CONFIG below.
 *   Runtime behavior can be customized with window.TodoSummary.updateConfig().
 *
 * Global API:
 *   window.TodoSummary.apply(sourceSelectorOrElements, options, outputTarget)
 *   window.TodoSummary.updateConfig(config, runtimeOptions)
 *   window.TodoSummary.getConfig()
 *   window.TodoSummary.clear(options)
 *
 * Notes:
 *   Mode "panel" creates a styled floating panel at the bottom-left corner.
 *   Mode "target" injects plain text into targetSelector and preserves the target element's own styles.
 *   The default border color is currentColor, so it follows the inherited text color.
 *   The glass effect is lightweight by default and can be disabled with glassEnabled: false.
 *   The script skips script, style, code, pre, textarea, inputs, existing marks, and generated UI.
 */

(function (window, document) {
  "use strict";

  if (!window || !document) return;

  const DEFAULT_CONFIG = {
    selector: ".post-content", // Source content container selector.
    autoApply: true, // Apply automatically after script loading.
    todoPattern: /TODO:[^\n\r]*/g, // Pattern used to find TODO fragments.
    headingSelector: "h1, h2, h3, h4, h5, h6", // Headings used for section labels.

    outputMode: "panel", // Summary output mode. candidates: panel | target
    targetSelector: "", // Target element for outputMode "target".
    targetJoiner: "\n", // Plain-text separator used in target mode.
    emptyText: "", // Text injected into target when no TODO exists.
    includeSectionInTarget: true, // Include section title in target-mode text.
    includeIndexInTarget: false, // Prefix target-mode lines with item index.

    panelId: "todo-summary-panel", // Floating panel ID.
    triggerId: "todo-summary-trigger", // Floating reopen trigger ID.
    styleId: "todo-summary-style", // Injected style element ID.

    markClass: "todo-mark", // Class for highlighted TODO text.
    markActiveClass: "todo-mark--active", // Class for active jumped TODO.
    panelClass: "todo-summary", // Class for floating panel.
    panelDraggingClass: "todo-summary--dragging", // Class added while dragging.
    headerClass: "todo-summary__header", // Class for panel header.
    titleClass: "todo-summary__title", // Class for panel title.
    closeClass: "todo-summary__close", // Class for close button.
    bodyClass: "todo-summary__body", // Class for panel body.
    listClass: "todo-summary__list", // Class for panel list.
    triggerClass: "todo-summary__trigger", // Class for reopen button.

    panelTitle: "TODO Summary", // Floating panel title.
    triggerText: "TODOs", // Reopen trigger text.
    closeLabel: "Close TODO summary", // Close button aria-label.
    noSectionText: "Document Start", // Fallback section title.
    todoTextMaxLength: 36, // Maximum TODO text length shown in the panel.
    sectionTitleMaxLength: 28, // Maximum section title length shown in the panel.

    flashDuration: 1600, // Active mark duration in milliseconds.
    scrollBehavior: "smooth", // Scroll behavior when clicking panel item.
    scrollBlock: "center", // Scroll alignment when clicking panel item.
    enableHashUpdate: true, // Update URL hash after jumping.
    enableDragging: true, // Enable panel dragging.
    highlightEnabled: true, // Highlight TODO fragments in source content.
    injectStyle: true, // Inject built-in CSS.

    glassEnabled: true, // Enable lightweight glass effect for panel and trigger.
    backdropBlur: "4px", // Lightweight blur value for better performance.
    backdropSaturate: "1.02", // Lightweight saturation value.
    panelBackground: "rgba(8, 8, 8, 0.56)", // Panel background.
    headerBackground: "rgba(0, 0, 0, 0.42)", // Header background.
    fallbackBackground: "rgba(14, 14, 14, 0.72)", // Fallback background when backdrop-filter is unsupported.
    borderColor: "currentColor", // Floating UI border color; currentColor follows text color.
    panelTextColor: "", // Empty means use the first source container's computed color.
    shadow: "0 12px 28px rgba(0, 0, 0, 0.16)", // Floating UI shadow.
    highlightBackground: "rgba(255, 236, 153, 0.82)", // Inline TODO mark background.
    zIndex: 99999, // Floating UI z-index.

    skipAncestorSelector: [
      "script",
      "style",
      "noscript",
      "textarea",
      "input",
      "select",
      "button",
      "pre",
      "code",
      "[data-todo-ignore]",
      ".todo-summary",
      ".todo-summary__trigger",
      ".todo-mark"
    ].join(",") // Ancestors that disable TODO scanning.
  };

  let config = merge({}, DEFAULT_CONFIG); // Active runtime configuration.
  let todoCounter = 0; // Unique TODO ID counter.
  let panelEl = null; // Floating panel element.
  let listEl = null; // Floating list element.
  let triggerEl = null; // Reopen trigger element.
  let dragOffsetX = 0; // Persistent panel transform X.
  let dragOffsetY = 0; // Persistent panel transform Y.
  let lastTodos = []; // Last collected TODO records.

  /* Merges objects from left to right; params: ...objects<object>. */
  function merge() {
    const output = {};

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

  /* Checks whether a value is an Element; params: value<any>. */
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

  /* Normalizes runtime config; params: runtimeConfig<object>. */
  function normalizeConfig(runtimeConfig) {
    const normalized = merge(DEFAULT_CONFIG, runtimeConfig || {});

    normalized.outputMode = String(normalized.outputMode || "panel").toLowerCase();
    normalized.outputMode = normalized.outputMode === "target" ? "target" : "panel";
    normalized.autoApply = normalized.autoApply !== false;
    normalized.enableDragging = normalized.enableDragging !== false;
    normalized.highlightEnabled = normalized.highlightEnabled !== false;
    normalized.injectStyle = normalized.injectStyle !== false;
    normalized.glassEnabled = normalized.glassEnabled !== false;

    if (!(normalized.todoPattern instanceof RegExp)) {
      normalized.todoPattern = DEFAULT_CONFIG.todoPattern;
    }

    return normalized;
  }

  /* Normalizes selector, element, NodeList, or array into elements; params: selectorOrElements<any>, runtimeConfig<object>. */
  function normalizeElements(selectorOrElements, runtimeConfig) {
    if (!selectorOrElements) {
      return toArray(document.querySelectorAll(runtimeConfig.selector));
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

  /* Resolves a single output target; params: target<any>. */
  function resolveOutputTarget(target) {
    if (!target) return null;
    if (typeof target === "string") return document.querySelector(target);
    if (isElement(target)) return target;

    if (target.length) {
      return toArray(target).filter(isElement)[0] || null;
    }

    return null;
  }

  /* Creates a global regex copy for repeated scanning; params: regex<RegExp>. */
  function createGlobalRegex(regex) {
    let flags = regex.flags || "";

    if (flags.indexOf("g") === -1) {
      flags += "g";
    }

    return new RegExp(regex.source, flags);
  }

  /* Safely tests a regex and resets state; params: regex<RegExp>, text<string>. */
  function regexHasMatch(regex, text) {
    regex.lastIndex = 0;

    const result = regex.test(text);

    regex.lastIndex = 0;

    return result;
  }

  /* Applies TODO highlighting and summary rendering; params: sourceSelectorOrElements<any>, userOptions<object>, outputTarget<any>. */
  function apply(sourceSelectorOrElements, userOptions, outputTarget) {
    const runtimeConfig = normalizeConfig(merge(config, userOptions || {}));
    const containers = normalizeElements(sourceSelectorOrElements || runtimeConfig.selector, runtimeConfig);
    const target = outputTarget || runtimeConfig.targetSelector;
    let todos = [];

    config = runtimeConfig;
    injectStyles(runtimeConfig);

    containers.forEach(function (container, containerIndex) {
      if (runtimeConfig.highlightEnabled) {
        processContainer(container, containerIndex, runtimeConfig);
      }

      todos = todos.concat(collectMarks(container, runtimeConfig));
    });

    todos = dedupeTodos(todos);
    lastTodos = todos.slice();

    if (runtimeConfig.outputMode === "target") {
      renderIntoTarget(todos, target, runtimeConfig);
      removePanelAndTrigger();
      return todos;
    }

    if (todos.length > 0) {
      ensurePanel(runtimeConfig, containers[0] || null);
      renderPanelSummary(todos, runtimeConfig);
      showPanel();
    } else {
      hidePanel();
    }

    return todos;
  }

  /* Processes one container by marking raw TODO text nodes; params: container<Element>, containerIndex<number>, runtimeConfig<object>. */
  function processContainer(container, containerIndex, runtimeConfig) {
    const textNodes = collectTodoTextNodes(container, runtimeConfig);
    const headings = collectHeadings(container, runtimeConfig);

    textNodes.forEach(function (textNode) {
      markTodosInTextNode(textNode, container, containerIndex, headings, runtimeConfig);
    });
  }

  /* Collects headings once per container; params: container<Element>, runtimeConfig<object>. */
  function collectHeadings(container, runtimeConfig) {
    if (!container || !container.querySelectorAll) return [];

    return toArray(container.querySelectorAll(runtimeConfig.headingSelector));
  }

  /* Collects raw text nodes containing TODO fragments; params: container<Element>, runtimeConfig<object>. */
  function collectTodoTextNodes(container, runtimeConfig) {
    const textNodes = [];

    if (!container) return textNodes;

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !regexHasMatch(runtimeConfig.todoPattern, node.nodeValue)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (!node.parentElement) {
          return NodeFilter.FILTER_REJECT;
        }

        if (node.parentElement.closest(runtimeConfig.skipAncestorSelector)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let current = walker.nextNode();

    while (current) {
      textNodes.push(current);
      current = walker.nextNode();
    }

    return textNodes;
  }

  /* Marks TODO fragments inside one text node; params: textNode<Text>, container<Element>, containerIndex<number>, headings<Array>, runtimeConfig<object>. */
  function markTodosInTextNode(textNode, container, containerIndex, headings, runtimeConfig) {
    const text = textNode.nodeValue;
    const regex = createGlobalRegex(runtimeConfig.todoPattern);
    const fragment = document.createDocumentFragment();
    let match = regex.exec(text);
    let lastIndex = 0;
    let hasMatch = false;

    while (match !== null) {
      const todoText = match[0].trim();
      const sectionTitle = getNearestHeadingTitle(textNode, headings, runtimeConfig);
      const displayTitle = sectionTitle
        ? truncateText(sectionTitle, runtimeConfig.sectionTitleMaxLength)
        : runtimeConfig.noSectionText;
      const displayText = truncateText(todoText, runtimeConfig.todoTextMaxLength) + " [" + displayTitle + "]";
      const mark = document.createElement("mark");

      hasMatch = true;
      appendText(fragment, text.slice(lastIndex, match.index));

      mark.className = runtimeConfig.markClass;
      mark.id = "todo-summary-item-" + containerIndex + "-" + (++todoCounter);
      mark.tabIndex = -1;
      mark.textContent = todoText;
      mark.dataset.todoText = todoText;
      mark.dataset.todoSectionTitle = sectionTitle || "";
      mark.dataset.todoDisplayText = displayText;

      fragment.appendChild(mark);

      lastIndex = match.index + match[0].length;
      match = regex.exec(text);
    }

    if (!hasMatch) return;

    appendText(fragment, text.slice(lastIndex));
    textNode.parentNode.replaceChild(fragment, textNode);
  }

  /* Appends a text node when non-empty; params: fragment<DocumentFragment>, text<string>. */
  function appendText(fragment, text) {
    if (text) {
      fragment.appendChild(document.createTextNode(text));
    }
  }

  /* Finds nearest previous heading using a cached heading list; params: textNode<Text>, headings<Array>, runtimeConfig<object>. */
  function getNearestHeadingTitle(textNode, headings, runtimeConfig) {
    const parent = textNode.parentElement;

    if (!parent || !headings.length) return "";

    for (let index = headings.length - 1; index >= 0; index -= 1) {
      const heading = headings[index];

      if (heading === parent || heading.contains(parent)) {
        return cleanText(heading.textContent);
      }

      if (heading.compareDocumentPosition(parent) & Node.DOCUMENT_POSITION_FOLLOWING) {
        return cleanText(heading.textContent);
      }
    }

    return "";
  }

  /* Collects existing TODO marks; params: container<Element>, runtimeConfig<object>. */
  function collectMarks(container, runtimeConfig) {
    const selector = "." + escapeCssClass(runtimeConfig.markClass);

    return toArray(container.querySelectorAll(selector)).map(function (mark) {
      const sectionTitle = mark.dataset.todoSectionTitle || "";
      const displayTitle = sectionTitle
        ? truncateText(sectionTitle, runtimeConfig.sectionTitleMaxLength)
        : runtimeConfig.noSectionText;

      return {
        id: mark.id,
        text: mark.dataset.todoText || mark.textContent || "",
        displayText: mark.dataset.todoDisplayText || truncateText(mark.textContent, runtimeConfig.todoTextMaxLength) + " [" + displayTitle + "]",
        sectionTitle: sectionTitle,
        displayTitle: displayTitle
      };
    });
  }

  /* Removes duplicate TODO records by id; params: todos<Array>. */
  function dedupeTodos(todos) {
    const seen = {};
    const output = [];

    todos.forEach(function (todo) {
      if (!todo.id || seen[todo.id]) return;

      seen[todo.id] = true;
      output.push(todo);
    });

    return output;
  }

  /* Normalizes text whitespace; params: text<string>. */
  function cleanText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  /* Truncates text with ellipsis; params: text<string>, maxLength<number>. */
  function truncateText(text, maxLength) {
    const clean = cleanText(text);
    const limit = Number(maxLength) || 0;

    if (!clean) return "";
    if (limit <= 0 || clean.length <= limit) return clean;

    return clean.slice(0, limit) + "...";
  }

  /* Formats one TODO line for target mode; params: todo<object>, index<number>, runtimeConfig<object>. */
  function formatTargetLine(todo, index, runtimeConfig) {
    const prefix = runtimeConfig.includeIndexInTarget ? String(index + 1) + ". " : "";
    const section = runtimeConfig.includeSectionInTarget
      ? " [" + (todo.sectionTitle || runtimeConfig.noSectionText) + "]"
      : "";

    return prefix + todo.text + section;
  }

  /* Injects plain text into the target element without styling it; params: todos<Array>, target<any>, runtimeConfig<object>. */
  function renderIntoTarget(todos, target, runtimeConfig) {
    const targetElement = resolveOutputTarget(target);

    if (!targetElement) return;

    if (!todos.length) {
      targetElement.textContent = runtimeConfig.emptyText || "";
      return;
    }

    targetElement.textContent = todos.map(function (todo, index) {
      return formatTargetLine(todo, index, runtimeConfig);
    }).join(runtimeConfig.targetJoiner);
  }

  /* Ensures floating panel exists; params: runtimeConfig<object>, sourceElement<Element|null>. */
  function ensurePanel(runtimeConfig, sourceElement) {
    if (panelEl && listEl && triggerEl) return;

    const panel = document.createElement("aside");
    const header = document.createElement("div");
    const title = document.createElement("div");
    const close = document.createElement("button");
    const body = document.createElement("div");
    const list = document.createElement("ol");
    const trigger = document.createElement("button");

    panel.id = runtimeConfig.panelId;
    panel.className = runtimeConfig.panelClass;
    panel.setAttribute("aria-label", runtimeConfig.panelTitle);

    if (runtimeConfig.panelTextColor) {
      panel.style.color = runtimeConfig.panelTextColor;
      trigger.style.color = runtimeConfig.panelTextColor;
    } else if (sourceElement && window.getComputedStyle) {
      const sourceColor = window.getComputedStyle(sourceElement).color;

      panel.style.color = sourceColor;
      trigger.style.color = sourceColor;
    }

    header.className = runtimeConfig.headerClass;
    title.className = runtimeConfig.titleClass;
    title.textContent = runtimeConfig.panelTitle;

    close.type = "button";
    close.className = runtimeConfig.closeClass;
    close.setAttribute("aria-label", runtimeConfig.closeLabel);
    close.textContent = "×";
    close.addEventListener("click", hidePanel);

    body.className = runtimeConfig.bodyClass;
    list.className = runtimeConfig.listClass;

    body.appendChild(list);
    header.appendChild(title);
    header.appendChild(close);
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);

    trigger.id = runtimeConfig.triggerId;
    trigger.type = "button";
    trigger.className = runtimeConfig.triggerClass;
    trigger.textContent = runtimeConfig.triggerText;
    trigger.hidden = true;
    trigger.addEventListener("click", showPanel);
    document.body.appendChild(trigger);

    if (runtimeConfig.enableDragging) {
      makeDraggable(panel, header, runtimeConfig);
    }

    panelEl = panel;
    listEl = list;
    triggerEl = trigger;
    applyPanelTransform();
  }

  /* Hides panel and shows trigger; params: none. */
  function hidePanel() {
    if (panelEl) panelEl.hidden = true;
    if (triggerEl) triggerEl.hidden = false;
  }

  /* Shows panel and hides trigger; params: none. */
  function showPanel() {
    if (panelEl) panelEl.hidden = false;
    if (triggerEl) triggerEl.hidden = true;
  }

  /* Removes panel and trigger; params: none. */
  function removePanelAndTrigger() {
    if (panelEl && panelEl.parentNode) {
      panelEl.parentNode.removeChild(panelEl);
    }

    if (triggerEl && triggerEl.parentNode) {
      triggerEl.parentNode.removeChild(triggerEl);
    }

    panelEl = null;
    listEl = null;
    triggerEl = null;
    dragOffsetX = 0;
    dragOffsetY = 0;
  }

  /* Renders clickable floating summary list; params: todos<Array>, runtimeConfig<object>. */
  function renderPanelSummary(todos, runtimeConfig) {
    if (!listEl) return;

    listEl.innerHTML = "";

    todos.forEach(function (todo) {
      const item = document.createElement("li");
      const link = document.createElement("a");

      link.href = "#" + todo.id;
      link.textContent = todo.displayText;
      link.title = todo.sectionTitle
        ? todo.text + " [" + todo.sectionTitle + "]"
        : todo.text + " [" + runtimeConfig.noSectionText + "]";

      link.addEventListener("click", function (event) {
        event.preventDefault();
        jumpToTodo(todo.id, runtimeConfig);
      });

      item.appendChild(link);
      listEl.appendChild(item);
    });
  }

  /* Jumps to and flashes one TODO mark; params: todoId<string>, runtimeConfig<object>. */
  function jumpToTodo(todoId, runtimeConfig) {
    const target = document.getElementById(todoId);

    if (!target) return;

    target.scrollIntoView({
      behavior: runtimeConfig.scrollBehavior,
      block: runtimeConfig.scrollBlock
    });

    target.focus({ preventScroll: true });
    flashTarget(target, runtimeConfig);

    if (!runtimeConfig.enableHashUpdate) return;

    if (history.pushState) {
      history.pushState(null, "", "#" + todoId);
    } else {
      location.hash = todoId;
    }
  }

  /* Temporarily activates a TODO mark; params: target<Element>, runtimeConfig<object>. */
  function flashTarget(target, runtimeConfig) {
    target.classList.add(runtimeConfig.markActiveClass);

    window.setTimeout(function () {
      target.classList.remove(runtimeConfig.markActiveClass);
    }, runtimeConfig.flashDuration);
  }

  /* Makes a panel draggable via transform; params: panel<Element>, handle<Element>, runtimeConfig<object>. */
  function makeDraggable(panel, handle, runtimeConfig) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;
    let framePending = false;
    let pendingX = 0;
    let pendingY = 0;

    handle.addEventListener("pointerdown", function (event) {
      if (event.target && event.target.closest("." + escapeCssClass(runtimeConfig.closeClass))) return;

      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startOffsetX = dragOffsetX;
      startOffsetY = dragOffsetY;

      panel.classList.add(runtimeConfig.panelDraggingClass);
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener("pointermove", function (event) {
      if (!dragging) return;

      const nextX = startOffsetX + event.clientX - startX;
      const nextY = startOffsetY + event.clientY - startY;
      const rect = panel.getBoundingClientRect();
      const minX = -rect.left + dragOffsetX;
      const maxX = window.innerWidth - rect.right + dragOffsetX;
      const minY = -rect.top + dragOffsetY;
      const maxY = window.innerHeight - rect.bottom + dragOffsetY;

      pendingX = clamp(nextX, minX, maxX);
      pendingY = clamp(nextY, minY, maxY);

      if (framePending) return;

      framePending = true;

      window.requestAnimationFrame(function () {
        dragOffsetX = pendingX;
        dragOffsetY = pendingY;
        framePending = false;
        applyPanelTransform();
      });
    });

    handle.addEventListener("pointerup", function (event) {
      dragging = false;
      panel.classList.remove(runtimeConfig.panelDraggingClass);

      if (handle.hasPointerCapture(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId);
      }
    });

    handle.addEventListener("pointercancel", function () {
      dragging = false;
      panel.classList.remove(runtimeConfig.panelDraggingClass);
    });
  }

  /* Applies the current transform offset to the panel; params: none. */
  function applyPanelTransform() {
    if (!panelEl) return;

    panelEl.style.transform = "translate3d(" + dragOffsetX + "px, " + dragOffsetY + "px, 0)";
  }

  /* Clamps a number into a valid range; params: value<number>, min<number>, max<number>. */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), Math.max(min, max));
  }

  /* Injects or updates built-in CSS; params: runtimeConfig<object>. */
  function injectStyles(runtimeConfig) {
    if (!runtimeConfig.injectStyle) return;

    const panelClass = escapeCssClass(runtimeConfig.panelClass);
    const panelDraggingClass = escapeCssClass(runtimeConfig.panelDraggingClass);
    const headerClass = escapeCssClass(runtimeConfig.headerClass);
    const titleClass = escapeCssClass(runtimeConfig.titleClass);
    const closeClass = escapeCssClass(runtimeConfig.closeClass);
    const bodyClass = escapeCssClass(runtimeConfig.bodyClass);
    const listClass = escapeCssClass(runtimeConfig.listClass);
    const triggerClass = escapeCssClass(runtimeConfig.triggerClass);
    const markClass = escapeCssClass(runtimeConfig.markClass);
    const markActiveClass = escapeCssClass(runtimeConfig.markActiveClass);
    const glassFilter = runtimeConfig.glassEnabled
      ? "blur(" + runtimeConfig.backdropBlur + ") saturate(" + runtimeConfig.backdropSaturate + ")"
      : "none";
    let style = document.getElementById(runtimeConfig.styleId);

    if (!style) {
      style = document.createElement("style");
      style.id = runtimeConfig.styleId;
      document.head.appendChild(style);
    }

    style.textContent = [
      "." + panelClass + " {",
      "  position: fixed;",
      "  left: 16px;",
      "  bottom: 16px;",
      "  width: 360px;",
      "  max-width: calc(100vw - 24px);",
      "  max-height: min(60vh, 520px);",
      "  z-index: " + runtimeConfig.zIndex + ";",
      "  border: 1px solid " + runtimeConfig.borderColor + ";",
      "  background: " + runtimeConfig.panelBackground + ";",
      "  backdrop-filter: " + glassFilter + ";",
      "  -webkit-backdrop-filter: " + glassFilter + ";",
      "  border-radius: 0;",
      "  box-shadow: " + runtimeConfig.shadow + ";",
      "  overflow: hidden;",
      "  font-size: 14px;",
      "  color: inherit;",
      "}",
      "." + panelClass + "[hidden],",
      "." + triggerClass + "[hidden] {",
      "  display: none;",
      "}",
      "." + panelClass + "." + panelDraggingClass + " {",
      "  will-change: transform;",
      "}",
      "." + headerClass + " {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: space-between;",
      "  padding: 10px 12px;",
      "  border-bottom: 1px solid " + runtimeConfig.borderColor + ";",
      "  background: " + runtimeConfig.headerBackground + ";",
      "  cursor: move;",
      "  user-select: none;",
      "  touch-action: none;",
      "}",
      "." + titleClass + " {",
      "  font-weight: 700;",
      "}",
      "." + closeClass + " {",
      "  border: none;",
      "  background: transparent;",
      "  color: inherit;",
      "  font-size: 20px;",
      "  line-height: 1;",
      "  cursor: pointer;",
      "  padding: 0 2px;",
      "}",
      "." + bodyClass + " {",
      "  overflow: auto;",
      "  max-height: calc(min(60vh, 520px) - 48px);",
      "  padding: 10px 12px 12px;",
      "}",
      "." + listClass + " {",
      "  margin: 0;",
      "  padding-left: 20px;",
      "}",
      "." + listClass + " li + li {",
      "  margin-top: 8px;",
      "}",
      "." + listClass + " a {",
      "  text-decoration: underline;",
      "  cursor: pointer;",
      "  color: inherit;",
      "  word-break: break-word;",
      "}",
      "." + triggerClass + " {",
      "  position: fixed;",
      "  left: 16px;",
      "  bottom: 16px;",
      "  z-index: " + runtimeConfig.zIndex + ";",
      "  border: 1px solid " + runtimeConfig.borderColor + ";",
      "  background: " + runtimeConfig.panelBackground + ";",
      "  backdrop-filter: " + glassFilter + ";",
      "  -webkit-backdrop-filter: " + glassFilter + ";",
      "  border-radius: 0;",
      "  box-shadow: " + runtimeConfig.shadow + ";",
      "  padding: 10px 14px;",
      "  font-size: 14px;",
      "  font-weight: 600;",
      "  line-height: 1;",
      "  cursor: pointer;",
      "  color: inherit;",
      "}",
      "." + markClass + " {",
      "  background: " + runtimeConfig.highlightBackground + ";",
      "  color: inherit;",
      "  padding: 0 3px;",
      "  border-radius: 0;",
      "}",
      "." + markActiveClass + " {",
      "  outline: 2px solid currentColor;",
      "  transition: outline 0.2s ease;",
      "}",
      "@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {",
      "  ." + panelClass + ",",
      "  ." + triggerClass + " {",
      "    background: " + runtimeConfig.fallbackBackground + ";",
      "  }",
      "}"
    ].join("\n");
  }

  /* Updates runtime config and optionally reapplies behavior; params: nextConfig<object>, runtimeOptions<object>. */
  function updateConfig(nextConfig, runtimeOptions) {
    const controls = merge({ apply: true }, runtimeOptions || {});

    config = normalizeConfig(merge(config, nextConfig || {}));
    injectStyles(config);

    if (controls.apply && config.autoApply) {
      apply(config.selector);
    }

    return getConfig();
  }

  /* Returns a copy of active config; params: none. */
  function getConfig() {
    return merge({}, config);
  }

  /* Clears floating UI, target content, and optionally unwraps marks; params: options<object>. */
  function clear(options) {
    const opts = merge({ unwrapMarks: false, clearTarget: false }, options || {});

    if (opts.unwrapMarks) {
      unwrapMarks(config);
    }

    if (opts.clearTarget && config.targetSelector) {
      const target = resolveOutputTarget(config.targetSelector);

      if (target) {
        target.textContent = "";
      }
    }

    removePanelAndTrigger();
    lastTodos = [];
  }

  /* Replaces generated marks with plain text; params: runtimeConfig<object>. */
  function unwrapMarks(runtimeConfig) {
    const selector = "." + escapeCssClass(runtimeConfig.markClass);
    const marks = toArray(document.querySelectorAll(selector));

    marks.forEach(function (mark) {
      mark.replaceWith(document.createTextNode(mark.textContent || ""));
    });
  }

  /* Runs plug-and-play behavior when DOM is ready; params: none. */
  function onReady() {
    if (!config.autoApply) return;

    apply(config.selector);
  }

  config = normalizeConfig(merge(DEFAULT_CONFIG, window.TodoSummaryConfig || window.todoSummaryConfig || {}));

  window.TodoSummary = {
    apply: apply,
    updateConfig: updateConfig,
    getConfig: getConfig,
    clear: clear
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady, { once: true });
  } else {
    onReady();
  }
})(window, document);