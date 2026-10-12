/*!
 * watermark.js
 * Plug-and-play watermark for static websites.
 *
 * Usage:
 * 1. Edit CONFIG at the top of this file.
 * 2. Include this file in the page:
 *    <script src="/js/watermark.js"></script>
 * 3. The watermark renders automatically after DOM is ready.
 *
 * Global API:
 * - Watermark.render()        Rebuild watermark manually
 * - Watermark.destroy()       Remove watermark overlay
 * - Watermark.rebind()        Rebind resize/theme watchers
 * - Watermark.getConfig()     Get a copy of current config
 * - Watermark.updateConfig()  Merge config and re-render
 *
 * Notes:
 * - Visual watermark only, not a security feature.
 * - Uses repeated SVG background instead of many DOM nodes.
 */

(function (window, document) {
  "use strict";

  const CONFIG = {
    text: "垃圾残渣", // Watermark text
    rotate: -24, // Rotation angle in degrees
    opacity: 0.33, // Text opacity
    gapX: 180, // Horizontal tile spacing
    gapY: 120, // Vertical tile spacing
    fontScale: 2, // Watermark font size = main font size * fontScale
    minFontSize: 20, // Minimum watermark font size
    zIndex: 999999, // Overlay z-index
    mainTextSelectors: [
      "main",
      "article",
      ".main-content",
      ".post-content",
      ".post",
      ".article",
      "body"
    ], // Candidate selectors for main text container
    watchResize: true, // Re-render on window resize
    resizeDebounce: 150, // Debounce time for resize re-render
    watchTheme: true, // Re-render on prefers-color-scheme change
    watchDomThemeMutation: true // Re-render on html/body class/style change
  };

  const WATERMARK_ID = "__page_watermark__"; // Overlay element id

  const INTERNAL_STATE = {
    resizeHandler: null, // Bound resize listener
    resizeTimer: null, // Debounce timer id
    mediaQueryList: null, // matchMedia result
    mediaQueryHandler: null, // Theme change listener
    mutationObserver: null // DOM mutation observer
  };

  function getMainTextElement() {
    for (let i = 0; i < CONFIG.mainTextSelectors.length; i += 1) {
      const el = document.querySelector(CONFIG.mainTextSelectors[i]); // Try each selector in order
      if (el) return el; // Use first match
    }
    return document.body; // Fallback if no candidate is found
  }

  function getMainTextStyle() {
    const target = getMainTextElement(); // Main text container
    const style = window.getComputedStyle(target); // Computed typography

    return {
      fontFamily: style.fontFamily || "sans-serif", // Inherit font family
      fontWeight: style.fontWeight || "400", // Inherit font weight
      fontStyle: style.fontStyle || "normal", // Inherit font style
      color: style.color || "rgb(0, 0, 0)", // Inherit text color
      fontSize: parseFloat(style.fontSize) || 16 // Inherit base font size
    };
  }

  function colorToRgba(color, alpha) {
    if (!color) return "rgba(0, 0, 0, " + alpha + ")"; // Safe fallback

    if (color.indexOf("rgba(") === 0) {
      const parts = color.replace("rgba(", "").replace(")", "").split(",").map(function (item) {
        return item.trim();
      }); // Extract rgb channels from rgba string
      return "rgba(" + parts[0] + ", " + parts[1] + ", " + parts[2] + ", " + alpha + ")"; // Replace alpha
    }

    if (color.indexOf("rgb(") === 0) {
      const parts = color.replace("rgb(", "").replace(")", "").split(",").map(function (item) {
        return item.trim();
      }); // Extract rgb channels from rgb string
      return "rgba(" + parts[0] + ", " + parts[1] + ", " + parts[2] + ", " + alpha + ")"; // Add alpha
    }

    return color; // Return original string if format is unsupported
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;") // Escape ampersand
      .replace(/"/g, "&quot;") // Escape double quote
      .replace(/'/g, "&apos;") // Escape single quote
      .replace(/</g, "&lt;") // Escape less-than
      .replace(/>/g, "&gt;"); // Escape greater-than
  }

  function buildWatermarkSvg(options) {
    const tileWidth = options.gapX + 220; // Tile width with extra padding
    const tileHeight = options.gapY + 140; // Tile height with extra padding

    return [
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + tileWidth + '" height="' + tileHeight + '">',
      '<g transform="translate(35,95) rotate(' + options.rotate + ')">', // Position and rotate text
      '<text',
      ' fill="' + escapeXml(options.color) + '"',
      ' font-family="' + escapeXml(options.fontFamily) + '"',
      ' font-size="' + options.fontSize + '"',
      ' font-style="' + escapeXml(options.fontStyle) + '"',
      ' font-weight="' + escapeXml(options.fontWeight) + '"',
      ">",
      escapeXml(options.text),
      "</text>",
      "</g>",
      "</svg>"
    ].join(""); // Return SVG markup string
  }

  function removeWatermark() {
    const existing = document.getElementById(WATERMARK_ID); // Find current overlay
    if (existing) existing.remove(); // Remove overlay before re-render
  }

  function createWatermark() {
    if (!document.body) return; // Body must exist before mounting overlay

    removeWatermark(); // Prevent duplicated overlays

    const baseStyle = getMainTextStyle(); // Read current main text style
    const fontSize = Math.max(baseStyle.fontSize * CONFIG.fontScale, CONFIG.minFontSize); // Compute watermark size
    const color = colorToRgba(baseStyle.color, CONFIG.opacity); // Reuse text color with watermark opacity

    const svg = buildWatermarkSvg({
      text: CONFIG.text,
      rotate: CONFIG.rotate,
      gapX: CONFIG.gapX,
      gapY: CONFIG.gapY,
      fontFamily: baseStyle.fontFamily,
      fontWeight: baseStyle.fontWeight,
      fontStyle: baseStyle.fontStyle,
      fontSize: fontSize,
      color: color
    }); // Build one repeated SVG tile

    const overlay = document.createElement("div"); // Full-page overlay
    overlay.id = WATERMARK_ID;
    overlay.setAttribute("aria-hidden", "true"); // Decorative only

    overlay.style.position = "fixed"; // Stay fixed during scroll
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none"; // Do not block interaction
    overlay.style.zIndex = String(CONFIG.zIndex); // Keep above normal content
    overlay.style.backgroundImage = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")'; // Inline SVG tile
    overlay.style.backgroundRepeat = "repeat"; // Repeat over full page
    overlay.style.backgroundPosition = "0 0";

    document.body.appendChild(overlay); // Mount overlay
  }

  function render() {
    createWatermark(); // Public full rebuild entry
  }

  function unbindWatchers() {
    if (INTERNAL_STATE.resizeHandler) {
      window.removeEventListener("resize", INTERNAL_STATE.resizeHandler); // Remove resize listener
      INTERNAL_STATE.resizeHandler = null;
    }

    if (INTERNAL_STATE.resizeTimer) {
      window.clearTimeout(INTERNAL_STATE.resizeTimer); // Clear pending resize render
      INTERNAL_STATE.resizeTimer = null;
    }

    if (INTERNAL_STATE.mediaQueryList && INTERNAL_STATE.mediaQueryHandler) {
      if (typeof INTERNAL_STATE.mediaQueryList.removeEventListener === "function") {
        INTERNAL_STATE.mediaQueryList.removeEventListener("change", INTERNAL_STATE.mediaQueryHandler); // Modern API
      } else if (typeof INTERNAL_STATE.mediaQueryList.removeListener === "function") {
        INTERNAL_STATE.mediaQueryList.removeListener(INTERNAL_STATE.mediaQueryHandler); // Legacy API
      }

      INTERNAL_STATE.mediaQueryHandler = null;
      INTERNAL_STATE.mediaQueryList = null;
    }

    if (INTERNAL_STATE.mutationObserver) {
      INTERNAL_STATE.mutationObserver.disconnect(); // Stop observing theme-related DOM changes
      INTERNAL_STATE.mutationObserver = null;
    }
  }

  function bindWatchers() {
    unbindWatchers(); // Rebind from a clean state

    if (CONFIG.watchResize) {
      INTERNAL_STATE.resizeHandler = function () {
        if (INTERNAL_STATE.resizeTimer) window.clearTimeout(INTERNAL_STATE.resizeTimer); // Reset debounce timer

        INTERNAL_STATE.resizeTimer = window.setTimeout(function () {
          render(); // Recompute font and rebuild after layout settles
        }, CONFIG.resizeDebounce);
      };

      window.addEventListener("resize", INTERNAL_STATE.resizeHandler); // Watch responsive layout changes
    }

    if (CONFIG.watchTheme && typeof window.matchMedia === "function") {
      INTERNAL_STATE.mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)"); // System theme query
      INTERNAL_STATE.mediaQueryHandler = function () {
        render(); // Recompute color after theme changes
      };

      if (typeof INTERNAL_STATE.mediaQueryList.addEventListener === "function") {
        INTERNAL_STATE.mediaQueryList.addEventListener("change", INTERNAL_STATE.mediaQueryHandler); // Modern API
      } else if (typeof INTERNAL_STATE.mediaQueryList.addListener === "function") {
        INTERNAL_STATE.mediaQueryList.addListener(INTERNAL_STATE.mediaQueryHandler); // Legacy API
      }
    }

    if (CONFIG.watchDomThemeMutation && typeof MutationObserver !== "undefined") {
      INTERNAL_STATE.mutationObserver = new MutationObserver(function (mutationList) {
        for (let i = 0; i < mutationList.length; i += 1) {
          const mutation = mutationList[i]; // Current observed mutation

          if (
            mutation.type === "attributes" &&
            (mutation.attributeName === "class" || mutation.attributeName === "style")
          ) {
            render(); // Rebuild when theme classes or inline styles change
            break;
          }
        }
      });

      if (document.documentElement) {
        INTERNAL_STATE.mutationObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class", "style"]
        }); // Watch html for theme toggles
      }

      if (document.body) {
        INTERNAL_STATE.mutationObserver.observe(document.body, {
          attributes: true,
          attributeFilter: ["class", "style"]
        }); // Watch body for theme toggles
      }
    }
  }

  function rebind() {
    bindWatchers(); // Public watcher rebind entry
  }

  function getConfig() {
    return Object.assign({}, CONFIG); // Return shallow copy to avoid external direct mutation
  }

  function updateConfig(partialConfig) {
    if (!partialConfig || typeof partialConfig !== "object") return; // Ignore invalid input

    Object.assign(CONFIG, partialConfig); // Merge new config
    render(); // Apply changes immediately
    bindWatchers(); // Rebind in case watch options changed
  }

  function init() {
    if (!document.body) return; // Body is required for mount
    render(); // Auto-render after script load
    bindWatchers(); // Start automatic updates
  }

  window.Watermark = {
    render: render, // Manual rebuild
    destroy: removeWatermark, // Remove overlay only
    rebind: rebind, // Rebind internal listeners
    getConfig: getConfig, // Read current config
    updateConfig: updateConfig // Update config and re-render
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init); // Wait for DOM if needed
  } else {
    init(); // Run immediately if DOM is already ready
  }
})(window, document);