/*!
 * anticopy.js
 * Plug-and-play anti-copy protection for static websites.
 *
 * Usage:
 * 1. Edit CONFIG at the top of this file.
 * 2. Include this file in the page:
 *    <script src="/js/anticopy.js"></script>
 * 3. Protection is enabled automatically after DOM is ready.
 *
 * Customizing:
 * - Edit CONFIG at the top of this file
 * - Or call AntiCopy.updateConfig({...}) after load
 *
 * Global API:
 * - AntiCopy.enable()             Enable protection manually
 * - AntiCopy.disable()            Disable protection and restore page state
 * - AntiCopy.isEnabled()          Return current enabled state
 * - AntiCopy.getConfig()          Get a copy of current config
 * - AntiCopy.updateConfig(obj)    Merge config and re-apply protection
 *
 * Notes:
 * - This raises the barrier against casual copying, not determined extraction.
 * - Best for preview pages, gated content, educational material, and soft-protection use cases.
 * - Absolute security is not possible in client-side JavaScript.
 */

(function (window, document) {
  'use strict';

  const CONFIG = {
    disableCopy: true, // Block copy event
    disableCut: true, // Block cut event
    disablePaste: false, // Usually not needed, kept configurable
    disableSelection: true, // Block text selection
    disableContextMenu: true, // Block right click menu
    disableDrag: true, // Block dragstart on text/images
    disableSaveShortcut: true, // Block Ctrl/Cmd+S
    disableViewSourceShortcut: true, // Block Ctrl/Cmd+U
    disableSelectAllShortcut: true, // Block Ctrl/Cmd+A
    disableCopyShortcuts: true, // Block Ctrl/Cmd+C and Ctrl/Cmd+X
    disableDevtoolsShortcut: false, // Optional: block F12 and Ctrl/Cmd+Shift+I/J
    protectImages: true, // Make images harder to drag/save casually
    noSelectClassName: 'ac-no-select', // CSS class applied to root
    imageSelector: 'img', // Images to harden when protectImages is enabled
    observeMutations: true // Re-apply image hardening to newly inserted nodes
  };

  let enabled = false; // Current protection state
  let styleEl = null; // Injected CSS node
  let observer = null; // Mutation observer for new images
  let restoreQueue = []; // Reversible DOM mutations
  let handlers = null; // Bound event handlers

  /* Return true if the keyboard event uses Ctrl on Windows/Linux or Cmd on macOS. @param {KeyboardEvent} e Keyboard event. */
  function hasCommandModifier(e) {
    return !!(e.ctrlKey || e.metaKey); // Support both control and command
  }

  /* Return lowercase key string for stable shortcut matching. @param {KeyboardEvent} e Keyboard event. */
  function getKey(e) {
    return String(e.key || '').toLowerCase(); // Normalize empty or mixed-case keys
  }

  /* Prevent event default and stop propagation. @param {Event} e Any DOM event. */
  function blockEvent(e) {
    e.preventDefault(); // Cancel browser default action
    e.stopPropagation(); // Stop further bubbling
    return false;
  }

  /* Check whether a keyboard event should be blocked. @param {KeyboardEvent} e Keyboard event. */
  function shouldBlockKeydown(e) {
    const key = getKey(e); // Normalized key value
    const hasCmd = hasCommandModifier(e); // Ctrl/Cmd presence
    const hasShift = !!e.shiftKey; // Shift presence

    if (CONFIG.disableCopyShortcuts && hasCmd && (key === 'c' || key === 'x')) return true; // Copy or cut
    if (CONFIG.disableSelectAllShortcut && hasCmd && key === 'a') return true; // Select all
    if (CONFIG.disableSaveShortcut && hasCmd && key === 's') return true; // Save page
    if (CONFIG.disableViewSourceShortcut && hasCmd && key === 'u') return true; // View source

    if (CONFIG.disableDevtoolsShortcut) {
      if (key === 'f12') return true; // Common devtools key
      if (hasCmd && hasShift && (key === 'i' || key === 'j')) return true; // Common devtools shortcuts
    }

    return false;
  }

  /* Inject or refresh anti-select CSS. */
  function applyStyles() {
    removeStyles(); // Keep a single style node

    styleEl = document.createElement('style');
    styleEl.setAttribute('data-anticopy-style', '1');
    styleEl.textContent = `
      html.${CONFIG.noSelectClassName},
      html.${CONFIG.noSelectClassName} * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    if (CONFIG.disableSelection) {
      document.documentElement.classList.add(CONFIG.noSelectClassName); // Activate no-select mode
    }
  }

  /* Remove injected CSS and root class. */
  function removeStyles() {
    document.documentElement.classList.remove(CONFIG.noSelectClassName); // Restore selection class state

    if (styleEl) {
      styleEl.remove(); // Remove style node
      styleEl = null;
    }
  }

  /* Add reversible hardening attributes/styles to matching images. @param {ParentNode} root Search root. */
  function hardenImages(root) {
    if (!CONFIG.protectImages) return; // Image hardening disabled

    const scope = root || document;
    const images = scope.querySelectorAll(CONFIG.imageSelector); // Find target images

    images.forEach(function (img) {
      if (img.dataset.acProtected === '1') return; // Skip already processed images

      img.dataset.acProtected = '1'; // Mark as protected

      const previousDraggable = img.getAttribute('draggable'); // Preserve previous draggable state
      const previousUserDrag = img.style.webkitUserDrag; // Preserve inline drag style
      const previousPointerCursor = img.style.cursor; // Preserve cursor only if changed

      restoreQueue.push(function () {
        delete img.dataset.acProtected; // Remove protection marker

        if (previousDraggable === null) {
          img.removeAttribute('draggable');
        } else {
          img.setAttribute('draggable', previousDraggable);
        }

        img.style.webkitUserDrag = previousUserDrag; // Restore vendor style
        img.style.cursor = previousPointerCursor; // Restore cursor
      });

      img.setAttribute('draggable', 'false'); // Reduce easy dragging
      img.style.webkitUserDrag = 'none'; // Safari/WebKit drag suppression

      if (!img.style.cursor) {
        img.style.cursor = 'default'; // Avoid drag-like affordance
      }
    });
  }

  /* Restore reversible DOM changes applied during protection. */
  function restoreProtectedDom() {
    for (let i = restoreQueue.length - 1; i >= 0; i -= 1) {
      restoreQueue[i](); // Undo in reverse order
    }
    restoreQueue = [];
  }

  /* Start observing DOM mutations for late-added images. */
  function startObserver() {
    stopObserver(); // Keep one observer only
    if (!CONFIG.observeMutations || !CONFIG.protectImages) return; // Observer not needed
    if (!document.body || typeof MutationObserver === 'undefined') return;

    observer = new MutationObserver(function () {
      hardenImages(document); // Re-scan when new nodes arrive
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /* Stop mutation observer if active. */
  function stopObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
  }

  /* Build all event handlers once using current config checks. */
  function createHandlers() {
    return {
      onCopy: function (e) {
        if (!enabled || !CONFIG.disableCopy) return;
        return blockEvent(e);
      },

      onCut: function (e) {
        if (!enabled || !CONFIG.disableCut) return;
        return blockEvent(e);
      },

      onPaste: function (e) {
        if (!enabled || !CONFIG.disablePaste) return;
        return blockEvent(e);
      },

      onSelectStart: function (e) {
        if (!enabled || !CONFIG.disableSelection) return;
        return blockEvent(e);
      },

      onContextMenu: function (e) {
        if (!enabled || !CONFIG.disableContextMenu) return;
        return blockEvent(e);
      },

      onDragStart: function (e) {
        if (!enabled || !CONFIG.disableDrag) return;
        return blockEvent(e);
      },

      onKeyDown: function (e) {
        if (!enabled) return;
        if (!shouldBlockKeydown(e)) return;
        return blockEvent(e);
      }
    };
  }

  /* Bind all protection event listeners. */
  function bindEvents() {
    unbindEvents(); // Avoid duplicate listeners
    handlers = createHandlers();

    document.addEventListener('copy', handlers.onCopy, true); // Capture early
    document.addEventListener('cut', handlers.onCut, true);
    document.addEventListener('paste', handlers.onPaste, true);
    document.addEventListener('selectstart', handlers.onSelectStart, true);
    document.addEventListener('contextmenu', handlers.onContextMenu, true);
    document.addEventListener('dragstart', handlers.onDragStart, true);
    document.addEventListener('keydown', handlers.onKeyDown, true);
  }

  /* Unbind all protection event listeners. */
  function unbindEvents() {
    if (!handlers) return;

    document.removeEventListener('copy', handlers.onCopy, true);
    document.removeEventListener('cut', handlers.onCut, true);
    document.removeEventListener('paste', handlers.onPaste, true);
    document.removeEventListener('selectstart', handlers.onSelectStart, true);
    document.removeEventListener('contextmenu', handlers.onContextMenu, true);
    document.removeEventListener('dragstart', handlers.onDragStart, true);
    document.removeEventListener('keydown', handlers.onKeyDown, true);

    handlers = null;
  }

  /* Enable protection and apply DOM/UI changes. */
  function enable() {
    if (enabled) return; // Already enabled

    enabled = true;
    applyStyles();
    bindEvents();
    hardenImages(document);
    startObserver();
  }

  /* Disable protection and restore page state. */
  function disable() {
    if (!enabled) return; // Already disabled

    enabled = false;
    unbindEvents();
    stopObserver();
    removeStyles();
    restoreProtectedDom();
  }

  /* Return current enabled state. */
  function isEnabled() {
    return enabled;
  }

  /* Return a shallow copy of current config. */
  function getConfig() {
    return Object.assign({}, CONFIG);
  }

  /* Merge config and re-apply protection. @param {Object} partialConfig Partial config override. */
  function updateConfig(partialConfig) {
    if (!partialConfig || typeof partialConfig !== 'object') return; // Ignore invalid input

    Object.assign(CONFIG, partialConfig); // Merge new config

    if (enabled) {
      disable(); // Reset current bindings and DOM changes
      enable(); // Re-apply with new config
    }
  }

  window.AntiCopy = {
    enable: enable, // Manual enable
    disable: disable, // Manual disable
    isEnabled: isEnabled, // Read current state
    getConfig: getConfig, // Read config copy
    updateConfig: updateConfig // Runtime config update
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enable); // Auto-run after DOM is ready
  } else {
    enable(); // Auto-run immediately if DOM is already ready
  }
})(window, document);