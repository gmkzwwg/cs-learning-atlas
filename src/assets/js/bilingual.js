/*!
 * bilingual.js
 *
 * Introduction:
 *   A plug-and-play bilingual content toggler. It scans configured page elements,
 *   collapses or hides them by default, and optionally inserts accessible toggle
 *   buttons before each target element. The script is designed for static pages,
 *   documentation sites, Markdown-rendered pages, and controlled dynamic content.
 *
 * Usage:
 *   1. Edit DEFAULT_CONFIG below for site-wide behavior.
 *   2. Optionally define window.BilingualToggleConfig before this file is loaded.
 *   3. Include this file with <script src="/assets/bilingual.js" defer></script>.
 *   4. Optional runtime updates: window.BilingualToggle.updateConfig({ showButton: true }).
 *
 * Global API:
 *   window.BilingualToggle.getConfig()
 *   window.BilingualToggle.updateConfig(partialConfig, options)
 *   window.BilingualToggle.refresh(root)
 *   window.BilingualToggle.toggle(elementOrSelector)
 *   window.BilingualToggle.expandAll(selectorOverride)
 *   window.BilingualToggle.collapseAll(selectorOverride)
 *   window.BilingualToggle.toggleAll(selectorOverride, expandIfMixed)
 *   window.BilingualToggle.destroy()
 *
 * Notes:
 *   - No manual initialization is required for default behavior.
 *   - Elements can opt out with data-bt="0" or data-bt-skip="1".
 *   - Per-element defaults can use data-bt-default="expanded" or "collapsed".
 *   - Per-element buttons can be disabled with data-bt-button="0".
 *   - Per-element button labels can use data-bt-label="translated paragraph".
 *   - wrapperTagName must be valid for the target's parent structure; div is safe for blockquote.
 *   - Strict CSP sites can use styleNonce or injectStyle:false plus an external stylesheet.
 *   - The syntax is ES5-compatible, but modern DOM APIs such as querySelectorAll are required.
 */

(function bilingualToggleFactory(global, doc) {
  "use strict";

  if (!global || !doc) return;

  var DEFAULT_CONFIG = {
    selector: "blockquote",                 // Target elements for bilingual content.
    defaultCollapsed: true,                  // Initial collapsed state when no element override exists.
    showButton: false,                       // False hides targets without inserting toggle buttons.
    collapsedText: "▸",                     // Button text when the target is collapsed.
    expandedText: "▾",                      // Button text when the target is expanded.
    expandLabel: "Expand bilingual content",// Accessible label for collapsed buttons.
    collapseLabel: "Collapse bilingual content", // Accessible label for expanded buttons.
    buttonTitle: "",                        // Optional title attribute for toggle buttons.
    buttonIndentEm: 1.4,                     // Left padding reserved for an absolutely positioned button.
    wrapperTagName: "div",                  // Wrapper tag; use div for block targets such as blockquote.
    wrapperDisplay: "block",                // Allowed values: block, inline-block, inline.
    stripStyleWhenCollapsed: true,           // Collapse wrapper spacing when only the button remains.
    autoRefresh: false,                      // Observe DOM changes and process new targets automatically.
    autoRefreshDebounceMs: 100,              // Debounce interval for mutation-driven refresh.
    injectStyle: true,                       // False disables runtime style injection for strict CSP sites.
    styleNonce: "",                         // Optional CSP nonce copied to the injected style element.
    styleId: "bilingual-toggle-style",      // ID used for the injected stylesheet.
    targetIdPrefix: "bt-target-",           // Prefix for generated target IDs used by aria-controls.
    extraWrapperClass: "",                  // Extra class names applied to generated wrappers.
    extraButtonClass: "",                   // Extra class names applied to generated buttons.
    extraTargetClass: ""                    // Extra class names applied to processed targets.
  };

  var CLASS = {
    wrap: "bt-wrap",
    hasButton: "bt-has-button",
    target: "bt-target",
    toggle: "bt-toggle",
    collapsed: "bt-collapsed",
    hidden: "bt-fully-hidden"
  };

  var ATTR = {
    processed: "data-bt-processed",
    state: "data-bt-state",
    generatedId: "data-bt-generated-id",
    skip: "data-bt-skip",
    enabled: "data-bt",
    defaultState: "data-bt-default",
    button: "data-bt-button",
    label: "data-bt-label"
  };

  var state = {
    inited: false,
    config: null,
    observer: null,
    refreshTimer: null,
    pendingRoots: [],
    ignoreMutations: false,
    uid: 0
  };

  /** Merge plain objects; @param {Object} base; @param {Object=} patch; @returns {Object}. */
  function merge(base, patch) {
    var out = {};
    var key;

    base = base || {};
    patch = patch || {};

    for (key in base) {
      if (Object.prototype.hasOwnProperty.call(base, key)) out[key] = base[key];
    }
    for (key in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) out[key] = patch[key];
    }

    return out;
  }

  /** Convert a value to a finite number; @param {*} value; @param {number} fallback; @returns {number}. */
  function toFiniteNumber(value, fallback) {
    var num = Number(value);
    return isFinite(num) ? num : fallback;
  }

  /** Convert a value to a boolean; @param {*} value; @param {boolean} fallback; @returns {boolean}. */
  function toBoolean(value, fallback) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  /** Normalize a tag name for generated wrappers; @param {*} value; @returns {string}. */
  function normalizeTagName(value) {
    var tag = String(value || DEFAULT_CONFIG.wrapperTagName).toLowerCase();
    return /^[a-z][a-z0-9-]*$/.test(tag) ? tag : DEFAULT_CONFIG.wrapperTagName;
  }

  /** Normalize wrapper display to safe CSS values; @param {*} value; @returns {string}. */
  function normalizeWrapperDisplay(value) {
    var display = String(value || DEFAULT_CONFIG.wrapperDisplay).toLowerCase();
    if (display === "block" || display === "inline-block" || display === "inline") return display;
    return DEFAULT_CONFIG.wrapperDisplay;
  }

  /** Normalize user configuration; @param {Object} config; @returns {Object}. */
  function normalizeConfig(config) {
    var normalized = merge(DEFAULT_CONFIG, config || {});

    normalized.selector = String(normalized.selector || DEFAULT_CONFIG.selector);
    normalized.defaultCollapsed = toBoolean(normalized.defaultCollapsed, DEFAULT_CONFIG.defaultCollapsed);
    normalized.showButton = toBoolean(normalized.showButton, DEFAULT_CONFIG.showButton);
    normalized.collapsedText = String(normalized.collapsedText);
    normalized.expandedText = String(normalized.expandedText);
    normalized.expandLabel = String(normalized.expandLabel || DEFAULT_CONFIG.expandLabel);
    normalized.collapseLabel = String(normalized.collapseLabel || DEFAULT_CONFIG.collapseLabel);
    normalized.buttonTitle = String(normalized.buttonTitle || "");
    normalized.buttonIndentEm = Math.max(0, toFiniteNumber(normalized.buttonIndentEm, DEFAULT_CONFIG.buttonIndentEm));
    normalized.wrapperTagName = normalizeTagName(normalized.wrapperTagName);
    normalized.wrapperDisplay = normalizeWrapperDisplay(normalized.wrapperDisplay);
    normalized.stripStyleWhenCollapsed = toBoolean(normalized.stripStyleWhenCollapsed, DEFAULT_CONFIG.stripStyleWhenCollapsed);
    normalized.autoRefresh = toBoolean(normalized.autoRefresh, DEFAULT_CONFIG.autoRefresh);
    normalized.autoRefreshDebounceMs = Math.max(0, toFiniteNumber(normalized.autoRefreshDebounceMs, DEFAULT_CONFIG.autoRefreshDebounceMs));
    normalized.injectStyle = toBoolean(normalized.injectStyle, DEFAULT_CONFIG.injectStyle);
    normalized.styleNonce = String(normalized.styleNonce || "");
    normalized.styleId = String(normalized.styleId || DEFAULT_CONFIG.styleId);
    normalized.targetIdPrefix = String(normalized.targetIdPrefix || DEFAULT_CONFIG.targetIdPrefix);
    normalized.extraWrapperClass = String(normalized.extraWrapperClass || "");
    normalized.extraButtonClass = String(normalized.extraButtonClass || "");
    normalized.extraTargetClass = String(normalized.extraTargetClass || "");

    return normalized;
  }

  /** Normalize update options; @param {Object=} options; @returns {Object}. */
  function normalizeUpdateOptions(options) {
    options = options || {};

    return {
      rebuild: options.rebuild !== false,            // Rebuild wrappers and button state by default.
      preserveState: options.preserveState !== false // Keep current collapsed states by default.
    };
  }

  /** Return true when the DOM tree is stable enough to scan; @returns {boolean}. */
  function isDomReady() {
    return doc.readyState === "interactive" || doc.readyState === "complete";
  }

  /** Run a callback when the DOM is queryable; @param {Function} callback. */
  function onReady(callback) {
    if (isDomReady()) {
      callback();
      return;
    }

    if (doc.addEventListener) {
      doc.addEventListener("DOMContentLoaded", callback, false);
    } else if (global.attachEvent) {
      global.attachEvent("onload", callback); // Legacy fallback for older host pages.
    }
  }

  /** Check whether a value is an Element; @param {*} value; @returns {boolean}. */
  function isElement(value) {
    return !!value && value.nodeType === 1;
  }

  /** Check whether a value can be scanned by querySelectorAll; @param {*} value; @returns {boolean}. */
  function isScannableRoot(value) {
    return !!value && (value.nodeType === 1 || value.nodeType === 9 || value.nodeType === 11) && !!value.querySelectorAll;
  }

  /** Check whether an element has a class; @param {Element} el; @param {string} name; @returns {boolean}. */
  function hasClass(el, name) {
    var className;

    if (!isElement(el) || !name) return false;
    if (el.classList) return el.classList.contains(name);

    className = typeof el.className === "string" ? el.className : "";
    return (" " + className + " ").indexOf(" " + name + " ") !== -1;
  }

  /** Add one class name; @param {Element} el; @param {string} name. */
  function addClass(el, name) {
    var className;

    if (!isElement(el) || !name || hasClass(el, name)) return;
    if (el.classList) {
      el.classList.add(name);
      return;
    }

    className = typeof el.className === "string" ? el.className : "";
    el.className = className ? className + " " + name : name;
  }

  /** Remove one class name; @param {Element} el; @param {string} name. */
  function removeClass(el, name) {
    var className;
    var pattern;

    if (!isElement(el) || !name || !hasClass(el, name)) return;
    if (el.classList) {
      el.classList.remove(name);
      return;
    }

    className = typeof el.className === "string" ? el.className : "";
    pattern = new RegExp("(^|\\s+)" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s+|$)", "g");
    el.className = className.replace(pattern, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
  }

  /** Toggle one class name without classList.toggle(force); @param {Element} el; @param {string} name; @param {boolean} enabled. */
  function setClass(el, name, enabled) {
    if (enabled) addClass(el, name);
    else removeClass(el, name);
  }

  /** Add multiple class names to an element; @param {Element} el; @param {string} names. */
  function addClassNames(el, names) {
    var parts;
    var i;

    if (!el || !names) return;

    parts = String(names).split(/\s+/);
    for (i = 0; i < parts.length; i++) {
      if (parts[i]) addClass(el, parts[i]);
    }
  }

  /** Remove multiple class names from an element; @param {Element} el; @param {string} names. */
  function removeClassNames(el, names) {
    var parts;
    var i;

    if (!el || !names) return;

    parts = String(names).split(/\s+/);
    for (i = 0; i < parts.length; i++) {
      if (parts[i]) removeClass(el, parts[i]);
    }
  }

  /** Match an element against a selector; @param {Element} el; @param {string} selector; @returns {boolean}. */
  function matchesSelector(el, selector) {
    var fn;

    if (!isElement(el)) return false;

    fn = el.matches || el.msMatchesSelector || el.webkitMatchesSelector;
    if (!fn) return false;

    try {
      return fn.call(el, selector);
    } catch (err) {
      return false;
    }
  }

  /** Query elements safely; @param {ParentNode} root; @param {string} selector; @returns {Element[]}. */
  function queryAll(root, selector) {
    var nodes;
    var out = [];
    var i;

    root = root || doc;
    if (!isScannableRoot(root)) return out;

    if (isElement(root) && matchesSelector(root, selector)) out.push(root); // Include root when refresh(root) points at a target.

    try {
      nodes = root.querySelectorAll(selector);
    } catch (err) {
      return out;
    }

    for (i = 0; i < nodes.length; i++) out.push(nodes[i]);
    return out;
  }

  /** Query one element safely; @param {string} selector; @returns {?Element}. */
  function queryOne(selector) {
    try {
      return doc.querySelector(selector);
    } catch (err) {
      return null;
    }
  }

  /** Get a direct child by class name; @param {Element} parent; @param {string} className; @returns {?Element}. */
  function getDirectChildByClass(parent, className) {
    var children;
    var i;

    if (!isElement(parent)) return null;

    children = parent.children;
    for (i = 0; i < children.length; i++) {
      if (hasClass(children[i], className)) return children[i];
    }

    return null;
  }

  /** Resolve a wrapper/target pair from an element; @param {Element} el; @returns {?Object}. */
  function getTargetInfo(el) {
    var target;
    var parent;

    if (!isElement(el)) return null;

    if (hasClass(el, CLASS.wrap)) {
      target = getDirectChildByClass(el, CLASS.target);
      return target ? { wrap: el, target: target } : null;
    }

    if (hasClass(el, CLASS.target)) {
      parent = el.parentElement;
      return parent && hasClass(parent, CLASS.wrap)
        ? { wrap: parent, target: el }
        : { wrap: null, target: el };
    }

    return null;
  }

  /** Resolve an API target from an element or selector; @param {Element|string} value; @returns {?Element}. */
  function resolveApiElement(value) {
    if (typeof value === "string") return queryOne(value);
    return isElement(value) ? value : null;
  }

  /** Get the initial config from constants and pre-load global config; @returns {Object}. */
  function getInitialConfig() {
    return normalizeConfig(merge(DEFAULT_CONFIG, global.BilingualToggleConfig || {}));
  }

  /** Clone public config to prevent external mutation; @returns {Object}. */
  function getConfig() {
    return merge({}, state.config || getInitialConfig());
  }

  /** Build injected CSS for the current config; @param {Object} config; @returns {string}. */
  function buildStyleText(config) {
    var css = "";

    css += "/* bilingual-toggle injected css */\n";
    css += "." + CLASS.wrap + "{position:relative;display:" + config.wrapperDisplay + ";}\n";
    css += "." + CLASS.wrap + " ." + CLASS.toggle + "{";
    css += "appearance:none;-webkit-appearance:none;border:0;background:transparent;";
    css += "padding:0;margin:0;cursor:pointer;font:inherit;line-height:1;display:inline-block;";
    css += "}\n";
    css += "." + CLASS.wrap + " ." + CLASS.toggle + ":focus{outline:2px solid currentColor;outline-offset:2px;}\n";
    css += "." + CLASS.wrap + "." + CLASS.hasButton + ">." + CLASS.toggle + "{position:absolute;left:0;top:0;}\n";
    css += "." + CLASS.wrap + "." + CLASS.hasButton + ">." + CLASS.target + "{padding-left:" + config.buttonIndentEm + "em !important;}\n";
    css += "." + CLASS.target + "." + CLASS.collapsed + "{display:none !important;}\n";
    css += "." + CLASS.wrap + "." + CLASS.collapsed + ">." + CLASS.target + "{display:none !important;}\n";
    css += "." + CLASS.target + "." + CLASS.hidden + "{display:none !important;}\n";

    if (config.stripStyleWhenCollapsed) {
      css += "." + CLASS.wrap + "." + CLASS.collapsed + "{margin:0 !important;padding:0 !important;}\n";
      css += "." + CLASS.wrap + "." + CLASS.collapsed + ">." + CLASS.toggle + "{position:static !important;}\n";
    }

    return css;
  }

  /** Set CSS text on a style element; @param {HTMLStyleElement} style; @param {string} cssText. */
  function setStyleText(style, cssText) {
    if ("textContent" in style) style.textContent = cssText;
    else if (style.styleSheet) style.styleSheet.cssText = cssText;
  }

  /** Insert or update the stylesheet; @param {Object} config. */
  function upsertStyle(config) {
    var style;

    if (!doc.head) return;

    if (!config.injectStyle) {
      removeStyle(config); // External CSS mode for strict CSP sites.
      return;
    }

    style = doc.getElementById(config.styleId);
    if (!style) {
      style = doc.createElement("style");
      style.id = config.styleId;
      style.type = "text/css";
      if (config.styleNonce) style.setAttribute("nonce", config.styleNonce); // CSP-compatible style injection.
      doc.head.appendChild(style);
    } else if (config.styleNonce) {
      style.setAttribute("nonce", config.styleNonce);
    } else {
      style.removeAttribute("nonce");
    }

    setStyleText(style, buildStyleText(config)); // Replacing text keeps updateConfig deterministic.
  }

  /** Remove the injected stylesheet; @param {Object} config. */
  function removeStyle(config) {
    var style = config && doc.getElementById(config.styleId);
    if (style && style.parentNode) style.parentNode.removeChild(style);
  }

  /** Generate a unique target ID; @param {Object} config; @returns {string}. */
  function createUniqueTargetId(config) {
    var id;

    do {
      state.uid += 1;
      id = config.targetIdPrefix + state.uid;
    } while (doc.getElementById(id));

    return id;
  }

  /** Assign an ID for aria-controls; @param {Element} target; @param {Object} config; @returns {string}. */
  function ensureTargetId(target, config) {
    var id;

    if (target.id) return target.id;

    id = createUniqueTargetId(config);
    target.id = id;
    target.setAttribute(ATTR.generatedId, id); // Cleanup removes only this generated ID value.

    return id;
  }

  /** Create a toggle button; @param {Element} target; @param {Object} config; @returns {HTMLButtonElement}. */
  function createButton(target, config) {
    var button = doc.createElement("button");
    var targetId = ensureTargetId(target, config);

    button.type = "button";
    button.className = CLASS.toggle;
    button.setAttribute("aria-controls", targetId);
    addClassNames(button, config.extraButtonClass);

    if (config.buttonTitle) button.title = config.buttonTitle;

    return button;
  }

  /** Decide whether a target should be skipped; @param {Element} target; @returns {boolean}. */
  function shouldSkipTarget(target) {
    return !isElement(target) ||
      target.getAttribute(ATTR.enabled) === "0" ||
      target.getAttribute(ATTR.skip) === "1";
  }

  /** Resolve a target's initial collapsed state; @param {Element} target; @param {Object} config; @returns {boolean}. */
  function resolveInitialCollapsed(target, config) {
    var override = target.getAttribute(ATTR.defaultState);

    if (override === "expanded") return false;
    if (override === "collapsed") return true;

    return !!config.defaultCollapsed;
  }

  /** Determine whether a target is collapsed; @param {Element} target; @returns {boolean}. */
  function isTargetCollapsed(target) {
    return !!target && (
      hasClass(target, CLASS.collapsed) ||
      target.getAttribute(ATTR.state) === "collapsed"
    );
  }

  /** Build an ARIA label for a button; @param {Element} target; @param {boolean} collapsed; @param {Object} config; @returns {string}. */
  function getButtonLabel(target, collapsed, config) {
    var custom = target && target.getAttribute(ATTR.label);
    if (custom) return (collapsed ? "Expand " : "Collapse ") + custom;
    return collapsed ? config.expandLabel : config.collapseLabel;
  }

  /** Update toggle button text and ARIA state; @param {?Element} button; @param {Element} target; @param {boolean} collapsed; @param {Object} config. */
  function setButtonState(button, target, collapsed, config) {
    if (!button) return;

    button.textContent = collapsed ? config.collapsedText : config.expandedText;
    button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    button.setAttribute("aria-label", getButtonLabel(target, collapsed, config));
  }

  /** Set collapsed state on a processed target; @param {Element} target; @param {boolean} collapsed; @param {Object} config. */
  function setCollapsed(target, collapsed, config) {
    var info = getTargetInfo(target);
    var wrap;
    var button;
    var hiddenWithoutButton;

    if (!info) return;

    wrap = info.wrap;
    target = info.target;
    hiddenWithoutButton = !wrap && (!config.showButton || target.getAttribute(ATTR.button) === "0"); // No visible control exists.

    setClass(target, CLASS.collapsed, !!collapsed);
    setClass(target, CLASS.hidden, !!collapsed && hiddenWithoutButton);
    target.setAttribute(ATTR.state, collapsed ? "collapsed" : "expanded");

    if (wrap) {
      setClass(wrap, CLASS.collapsed, !!collapsed);
      button = getDirectChildByClass(wrap, CLASS.toggle);
      setButtonState(button, target, !!collapsed, config);
    }
  }

  /** Handle a button click; @param {Event} event; @param {Object} config. */
  function handleButtonClick(event, config) {
    var info;

    if (event && event.preventDefault) event.preventDefault();
    info = getTargetInfo(event.currentTarget.parentElement);
    if (!info) return;

    setCollapsed(info.target, !isTargetCollapsed(info.target), config);
  }

  /** Wrap and process one target; @param {Element} target; @param {Object} config; @param {boolean=} forcedCollapsed. */
  function processTarget(target, config, forcedCollapsed) {
    var startCollapsed;
    var wrap;
    var button;
    var parent;
    var showButtonForTarget;

    if (shouldSkipTarget(target)) return;
    if (target.getAttribute(ATTR.processed) === "1") return;

    startCollapsed = typeof forcedCollapsed === "boolean" ? forcedCollapsed : resolveInitialCollapsed(target, config);
    showButtonForTarget = !!config.showButton && target.getAttribute(ATTR.button) !== "0";

    target.setAttribute(ATTR.processed, "1");
    addClass(target, CLASS.target);
    addClassNames(target, config.extraTargetClass);

    if (!showButtonForTarget) {
      setCollapsed(target, startCollapsed, config); // Hides the target when collapsed and no button exists.
      return;
    }

    parent = target.parentNode;
    if (!parent) return;

    wrap = doc.createElement(config.wrapperTagName);
    wrap.className = CLASS.wrap + " " + CLASS.hasButton;
    addClassNames(wrap, config.extraWrapperClass);

    button = createButton(target, config);
    parent.insertBefore(wrap, target);
    wrap.appendChild(button);
    wrap.appendChild(target);

    if (button.addEventListener) {
      button.addEventListener("click", function onClick(event) {
        handleButtonClick(event, state.config || config); // Uses latest runtime config after updateConfig.
      }, false);
    }

    setCollapsed(target, startCollapsed, config);
  }

  /** Scan a root and process matching targets; @param {ParentNode=} root; @param {Object} config. */
  function scan(root, config) {
    var targets = queryAll(root || doc, config.selector);
    var i;

    for (i = 0; i < targets.length; i++) processTarget(targets[i], config);
  }

  /** Return processed targets; @param {string=} selectorOverride; @returns {Element[]}. */
  function getProcessedTargets(selectorOverride) {
    var targets = selectorOverride
      ? queryAll(doc, selectorOverride)
      : queryAll(doc, "." + CLASS.target + "[" + ATTR.processed + "='1']");
    var out = [];
    var i;

    for (i = 0; i < targets.length; i++) {
      if (targets[i].getAttribute(ATTR.processed) === "1") out.push(targets[i]);
    }

    return out;
  }

  /** Capture collapsed states before rebuild; @param {Element[]} targets; @returns {Object}. */
  function captureStates(targets) {
    var store = { map: null, list: [] };
    var i;

    if (typeof global.WeakMap === "function") store.map = new global.WeakMap();

    for (i = 0; i < targets.length; i++) {
      if (store.map) store.map.set(targets[i], isTargetCollapsed(targets[i]));
      else store.list.push({ target: targets[i], collapsed: isTargetCollapsed(targets[i]) });
    }

    return store;
  }

  /** Find a captured state for a target; @param {Object} store; @param {Element} target; @returns {Object}. */
  function findCapturedState(store, target) {
    var i;

    if (!store) return { found: false, collapsed: false };

    if (store.map) {
      if (store.map.has(target)) return { found: true, collapsed: store.map.get(target) };
      return { found: false, collapsed: false };
    }

    for (i = 0; i < store.list.length; i++) {
      if (store.list[i].target === target) return { found: true, collapsed: store.list[i].collapsed };
    }

    return { found: false, collapsed: false };
  }

  /** Remove generated wrapper/classes from one target; @param {Element} target; @param {Object} config. */
  function cleanupTarget(target, config) {
    var info = getTargetInfo(target);
    var wrap;
    var parent;
    var generatedId;

    if (!info) return;

    target = info.target;
    wrap = info.wrap;

    if (wrap && wrap.parentNode) {
      parent = wrap.parentNode;
      parent.insertBefore(target, wrap);
      parent.removeChild(wrap);
    }

    removeClass(target, CLASS.target);
    removeClass(target, CLASS.collapsed);
    removeClass(target, CLASS.hidden);
    removeClassNames(target, config.extraTargetClass);
    target.removeAttribute(ATTR.processed);
    target.removeAttribute(ATTR.state);

    generatedId = target.getAttribute(ATTR.generatedId);
    if (generatedId && target.id === generatedId) target.removeAttribute("id"); // Do not delete later business IDs.
    target.removeAttribute(ATTR.generatedId);
  }

  /** Rebuild all processed nodes and rescan; @param {Object} options. */
  function rebuild(options) {
    var config = state.config;
    var processed = getProcessedTargets();
    var states = options.preserveState ? captureStates(processed) : null;
    var candidates;
    var remembered;
    var i;

    for (i = 0; i < processed.length; i++) cleanupTarget(processed[i], config);

    candidates = queryAll(doc, config.selector);
    for (i = 0; i < candidates.length; i++) {
      remembered = findCapturedState(states, candidates[i]);
      processTarget(candidates[i], config, remembered.found ? remembered.collapsed : undefined);
    }
  }

  /** Queue a root for mutation-driven scanning; @param {*} root. */
  function queuePendingRoot(root) {
    if (!isScannableRoot(root)) return;
    if (state.pendingRoots.indexOf(root) === -1) state.pendingRoots.push(root); // Deduplicate roots cheaply.
  }

  /** Scan pending mutation roots only; @param {Object} config. */
  function flushPendingRefresh(config) {
    var roots = state.pendingRoots.slice(0);
    var i;

    state.pendingRoots = [];
    state.refreshTimer = null;
    state.ignoreMutations = true;

    if (roots.length) {
      for (i = 0; i < roots.length; i++) refresh(roots[i]); // O(new nodes) for typical dynamic inserts.
    } else {
      refresh(doc); // Conservative fallback.
    }

    state.ignoreMutations = false;
    configureObserver(config); // Reconnect after internal DOM changes are ignored.
  }

  /** Debounce refresh calls from MutationObserver; @param {Object} config; @param {Array=} roots. */
  function scheduleRefresh(config, roots) {
    var i;

    if (roots) {
      for (i = 0; i < roots.length; i++) queuePendingRoot(roots[i]);
    }

    if (state.refreshTimer) global.clearTimeout(state.refreshTimer);

    state.refreshTimer = global.setTimeout(function onRefreshTimer() {
      flushPendingRefresh(config);
    }, config.autoRefreshDebounceMs);
  }

  /** Extract scannable roots from mutation records; @param {MutationRecord[]} mutations; @returns {Array}. */
  function getMutationRoots(mutations) {
    var roots = [];
    var mutation;
    var node;
    var i;
    var j;

    for (i = 0; i < mutations.length; i++) {
      mutation = mutations[i];
      for (j = 0; j < mutation.addedNodes.length; j++) {
        node = mutation.addedNodes[j];
        if (isScannableRoot(node)) roots.push(node);
      }
    }

    return roots;
  }

  /** Start or stop MutationObserver based on config; @param {Object} config. */
  function configureObserver(config) {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }

    if (!config.autoRefresh || !global.MutationObserver || !doc.body) return;

    state.observer = new global.MutationObserver(function onMutations(mutations) {
      var roots;

      if (state.ignoreMutations) return;
      roots = getMutationRoots(mutations);
      if (roots.length) scheduleRefresh(config, roots);
    });
    state.observer.observe(doc.body, { childList: true, subtree: true });
  }

  /** Initialize the script once; @param {Object=} userConfig. */
  function init(userConfig) {
    if (!isDomReady()) {
      onReady(function initWhenReady() { init(userConfig); });
      return;
    }

    if (state.inited) {
      if (userConfig) updateConfig(userConfig);
      return;
    }

    state.config = normalizeConfig(merge(state.config || getInitialConfig(), userConfig || {}));
    upsertStyle(state.config);
    scan(doc, state.config);
    configureObserver(state.config);
    state.inited = true;
  }

  /** Ensure the script has initialized before API work; @returns {boolean}. */
  function ensureInit() {
    if (!state.inited) init();
    return state.inited;
  }

  /** Refresh matching targets under a root; @param {ParentNode=} root. */
  function refresh(root) {
    if (!ensureInit()) return;
    scan(root || doc, state.config);
  }

  /** Toggle one processed or matching target; @param {Element|string} elementOrSelector. */
  function toggle(elementOrSelector) {
    var el;
    var info;

    if (!ensureInit()) return;

    el = resolveApiElement(elementOrSelector);
    if (!el) return;

    if (matchesSelector(el, state.config.selector) && el.getAttribute(ATTR.processed) !== "1") {
      processTarget(el, state.config); // Allows direct toggling of a newly inserted target.
    }

    info = getTargetInfo(el);
    if (!info) return;

    setCollapsed(info.target, !isTargetCollapsed(info.target), state.config);
  }

  /** Expand all processed targets; @param {string=} selectorOverride. */
  function expandAll(selectorOverride) {
    var targets;
    var i;

    if (!ensureInit()) return;

    targets = getProcessedTargets(selectorOverride);
    for (i = 0; i < targets.length; i++) setCollapsed(targets[i], false, state.config);
  }

  /** Collapse all processed targets; @param {string=} selectorOverride. */
  function collapseAll(selectorOverride) {
    var targets;
    var i;

    if (!ensureInit()) return;

    targets = getProcessedTargets(selectorOverride);
    for (i = 0; i < targets.length; i++) setCollapsed(targets[i], true, state.config);
  }

  /** Toggle all processed targets; @param {string=} selectorOverride; @param {boolean=} expandIfMixed. */
  function toggleAll(selectorOverride, expandIfMixed) {
    var targets;
    var anyCollapsed = false;
    var anyExpanded = false;
    var shouldCollapse;
    var i;

    if (!ensureInit()) return;

    targets = getProcessedTargets(selectorOverride);

    for (i = 0; i < targets.length; i++) {
      if (isTargetCollapsed(targets[i])) anyCollapsed = true;
      else anyExpanded = true;
    }

    shouldCollapse = anyCollapsed && anyExpanded ? expandIfMixed !== true : !anyCollapsed;

    for (i = 0; i < targets.length; i++) setCollapsed(targets[i], shouldCollapse, state.config);
  }

  /** Update runtime config and optionally rebuild DOM; @param {Object} partialConfig; @param {Object=} options; @returns {Object}. */
  function updateConfig(partialConfig, options) {
    var updateOptions = normalizeUpdateOptions(options);
    var previousConfig = state.config || getInitialConfig();
    var base = state.config || previousConfig;

    state.config = normalizeConfig(merge(base, partialConfig || {}));

    if (previousConfig.styleId !== state.config.styleId || !state.config.injectStyle) {
      removeStyle(previousConfig); // Avoid stale style elements after styleId/injectStyle changes.
    }

    if (!isDomReady()) return getConfig();

    upsertStyle(state.config);

    if (!state.inited) {
      init();
      return getConfig();
    }

    if (updateOptions.rebuild) rebuild(updateOptions);
    else refresh(doc);

    configureObserver(state.config);
    return getConfig();
  }

  /** Remove generated DOM/CSS and stop observers; no params. */
  function destroy() {
    var config = state.config || getInitialConfig();
    var targets = getProcessedTargets();
    var i;

    if (state.refreshTimer) {
      global.clearTimeout(state.refreshTimer);
      state.refreshTimer = null;
    }

    state.pendingRoots = [];

    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }

    for (i = 0; i < targets.length; i++) cleanupTarget(targets[i], config);

    removeStyle(config);
    state.inited = false;
  }

  global.BilingualToggle = {
    getConfig: getConfig,
    updateConfig: updateConfig,
    refresh: refresh,
    toggle: toggle,
    expandAll: expandAll,
    collapseAll: collapseAll,
    toggleAll: toggleAll,
    destroy: destroy
  };

  onReady(function autoInit() {
    init(); // Plug-and-play default behavior.
  });

})(window, document);
