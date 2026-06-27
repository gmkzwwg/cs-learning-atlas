/*!
 * Introduction:
 *   ASCII Matrix Flow hides matched source elements on eligible wide screens, keeps them
 *   in the DOM for indexing/accessibility, and inserts centered animated ASCII matrix art.
 *
 * Usage:
 *   1. Include this script directly in the page.
 *   2. It runs automatically and targets ".ascii_title" by default.
 *   3. Edit CONFIG below for static customization.
 *   4. Or call updateConfig({ selector: ".other_title" }) after load.
 *
 * Global API:
 *   updateConfig(partialConfig)  -> Merge config, rebuild, rerun.
 *   AsciiMatrixFlow.refresh()    -> Scan and process matching elements again.
 *   AsciiMatrixFlow.restore()    -> Remove generated blocks and restore sources.
 *   AsciiMatrixFlow.getConfig()  -> Get current config.
 *
 * Notes:
 *   - Unicode, including Chinese/CJK, is supported by default.
 *   - Below minReplaceWidth, the source element stays visible and no replacement is made.
 *   - Animation uses one global character at a time, cycling through . + * % * + .
 *   - All generated blocks use one unified font size based on the smallest fit requirement.
 *   - If canvas is unavailable, the effect is skipped gracefully.
 */

(function () {
  "use strict";

  /* =========================
   * Editable configuration
   * ========================= */

  var CONFIG = {
    selector: ".ascii_title, .post_abbreviation",                      // default target
    allowUnicode: true,                            // support Chinese/CJK by default

    charCycle: "·:+#+:",                         // global pulse sequence; one char per frame

    monoFont:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", "Noto Sans Mono CJK SC", "Noto Sans CJK SC", "Source Han Sans SC", "Microsoft YaHei", "PingFang SC", monospace',

    center: true,                                  // center generated area
    minReplaceWidth: 520,                          // below this parent width, do not replace
    fitToParentWidth: true,                        // calculate width-fitting font size
    unifiedScale: true,                            // use one page-wide minimum scale
    fitWidthRatio: 0.90,                           // use 90% of parent width
    maxArtFontPx: 12,                              // maximum generated font size
    minArtFontPx: 1,                               // minimum generated font size

    rowsPerTextLine: 14,                            // target ASCII rows per source text line
    preserveAspectRatio: true,                         // scale sampleX with sampleY
    sampleAspectRatio: 0,                              // 0 = auto by monospace width/line-height
    rasterScale: 7,                                // source rasterization scale
    sampleX: 6,                                    // matrix cell width
    sampleY: 10,                                   // fallback matrix cell height
    canvasPadX: 24,                                // raster x padding
    canvasPadY: 24,                                // raster y padding

    frameMs: 330,                                  // slower pulse interval; increase for slower cycling

    denseCutoff: 0.62,                             // alpha >= dense
    middleCutoff: 0.28,                            // alpha >= middle
    threshold: 0.07,                               // visible alpha threshold

    observeDom: true,                              // auto-process inserted nodes
    watchResize: true,                             // rebuild on resize
    resizeDebounceMs: 140,                         // resize debounce

    skipOffscreen: true,                           // skip offscreen animation updates
    offscreenMargin: 160,                          // viewport expansion for offscreen test
    visibilityPause: true,                         // pause animation when tab is hidden
    observerDebounceMs: 80,                        // mutation refresh debounce

    lineHeight: 1,                                 // ASCII line-height
    letterSpacing: "0",                            // ASCII letter spacing
    dataKey: "asciiMatrixFlowOriginal"             // data attribute key
  };

  var currentConfig = cloneConfig(CONFIG);
  var states = [];
  var rafId = 0;
  var observer = null;
  var resizeTimer = 0;
  var observerTimer = 0;
  var monoRatioCache = 0;
  var canvasSupport = null;

  /**
   * Clone config.
   * @param {object} src - Source config.
   * @returns {object}
   */
  function cloneConfig(src) {
    var out = {};
    var key;

    for (key in src) {
      if (Object.prototype.hasOwnProperty.call(src, key)) {
        out[key] = src[key];
      }
    }

    return out;
  }

  /**
   * Merge config with partial updates.
   * @param {object} base - Current config.
   * @param {object} next - Partial config.
   * @returns {object}
   */
  function mergeConfig(base, next) {
    var out = cloneConfig(base);
    var key;

    next = next || {};

    for (key in next) {
      if (Object.prototype.hasOwnProperty.call(next, key)) {
        out[key] = next[key];
      }
    }

    return out;
  }

  /**
   * Convert camelCase to kebab-case.
   * @param {string} value - Camel-case string.
   * @returns {string}
   */
  function camelToKebab(value) {
    return String(value).replace(/[A-Z]/g, function (m) {
      return "-" + m.toLowerCase();
    });
  }

  /**
   * Return source marker attribute name.
   * @returns {string}
   */
  function getDataAttrName() {
    return "data-" + camelToKebab(currentConfig.dataKey);
  }

  /**
   * Check whether text contains ASCII characters only.
   * @param {string} text - Input text.
   * @returns {boolean}
   */
  function isAsciiOnly(text) {
    return /^[\x00-\x7F]*$/.test(text);
  }

  /**
   * Clamp a number into a closed range.
   * @param {number} value - Input number.
   * @param {number} min - Lower bound.
   * @param {number} max - Upper bound.
   * @returns {number}
   */
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Request animation frame with fallback.
   * @param {Function} fn - Frame callback.
   * @returns {number}
   */
  function requestFrame(fn) {
    var raf = window.requestAnimationFrame || function (cb) {
      return window.setTimeout(function () {
        cb(Date.now());
      }, 16);
    };

    return raf.call(window, fn);
  }

  /**
   * Cancel animation frame with fallback.
   * @param {number} id - Frame id.
   */
  function cancelFrame(id) {
    var caf = window.cancelAnimationFrame || window.clearTimeout;
    caf.call(window, id);
  }

  /**
   * Check whether canvas rendering is available.
   * @returns {boolean}
   */
  function supportsCanvas() {
    var canvas;

    if (canvasSupport !== null) return canvasSupport;

    try {
      canvas = document.createElement("canvas");
      canvasSupport = !!(canvas && canvas.getContext && canvas.getContext("2d"));
    } catch (err) {
      canvasSupport = false;
    }

    return canvasSupport;
  }

  /**
   * Read usable width from the source parent.
   * @param {HTMLElement} source - Original matched element.
   * @returns {number}
   */
  function getAvailableWidth(source) {
    var parent = source.parentElement;
    var parentWidth = parent ? parent.clientWidth : 0;
    var fallbackWidth = document.documentElement.clientWidth || window.innerWidth || 0;

    return Math.max(0, parentWidth || fallbackWidth); // parent first
  }

  /**
   * Decide whether replacement is allowed at current width.
   * @param {HTMLElement} source - Original matched element.
   * @returns {boolean}
   */
  function canReplaceAtCurrentWidth(source) {
    return getAvailableWidth(source) >= currentConfig.minReplaceWidth; // narrow-screen guard
  }

  /**
   * Apply visually-hidden styles while keeping source in DOM.
   * @param {HTMLElement} el - Original matched element.
   */
  function visuallyHide(el) {
    el.style.position = "absolute";
    el.style.width = "1px";
    el.style.height = "1px";
    el.style.padding = "0";
    el.style.margin = "-1px";
    el.style.overflow = "hidden";
    el.style.clip = "rect(0 0 0 0)";
    if ("clipPath" in el.style) el.style.clipPath = "inset(50%)"; // modern enhancement
    el.style.whiteSpace = "nowrap";
    el.style.border = "0";
  }

  /**
   * Restore previous inline style.
   * @param {HTMLElement} el - Original matched element.
   * @param {string|null} cssText - Previous inline CSS snapshot.
   */
  function restoreInlineStyle(el, cssText) {
    if (cssText == null) el.removeAttribute("style");
    else el.style.cssText = cssText;
  }

  /**
   * Read selected computed styles before hiding source.
   * @param {HTMLElement} el - Source element.
   * @returns {object}
   */
  function readSourceStyles(el) {
    var cs = window.getComputedStyle ? getComputedStyle(el) : el.currentStyle;

    return {
      color: cs.color,
      background: cs.background,
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage,
      backgroundPosition: cs.backgroundPosition,
      backgroundSize: cs.backgroundSize,
      backgroundRepeat: cs.backgroundRepeat,
      paddingTop: cs.paddingTop,
      paddingBottom: cs.paddingBottom,
      marginTop: cs.marginTop,
      marginBottom: cs.marginBottom,
      fontStyle: cs.fontStyle,
      fontVariant: cs.fontVariant,
      fontWeight: cs.fontWeight,
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily,
      letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight
    };
  }

  /**
   * Create generated wrapper and ASCII text node.
   * @param {HTMLElement} source - Source element.
   * @param {object} styleInfo - Preserved computed styles.
   * @returns {{wrap: HTMLDivElement, pre: HTMLDivElement}}
   */
  function createRenderBlock(source, styleInfo) {
    var wrap = document.createElement("div");
    var pre = document.createElement("div");

    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "ascii-matrix-flow-wrap";
    pre.className = "ascii-matrix-flow-pre";

    wrap.style.display = "block";
    wrap.style.boxSizing = "border-box";
    wrap.style.width = "100%";
    wrap.style.maxWidth = "100%";
    wrap.style.overflow = "hidden";
    wrap.style.color = styleInfo.color;
    wrap.style.background = styleInfo.background;
    wrap.style.backgroundColor = styleInfo.backgroundColor;
    wrap.style.backgroundImage = styleInfo.backgroundImage;
    wrap.style.backgroundPosition = styleInfo.backgroundPosition;
    wrap.style.backgroundSize = styleInfo.backgroundSize;
    wrap.style.backgroundRepeat = styleInfo.backgroundRepeat;
    wrap.style.paddingTop = styleInfo.paddingTop;
    wrap.style.paddingBottom = styleInfo.paddingBottom;
    wrap.style.marginTop = styleInfo.marginTop;
    wrap.style.marginBottom = styleInfo.marginBottom;
    wrap.style.textAlign = currentConfig.center ? "center" : "left";

    pre.style.display = "inline-block";
    pre.style.whiteSpace = "pre";
    pre.style.textAlign = "left";
    pre.style.fontFamily = currentConfig.monoFont;
    pre.style.lineHeight = String(currentConfig.lineHeight);
    pre.style.letterSpacing = currentConfig.letterSpacing;
    pre.style.color = "inherit";
    pre.style.background = "transparent";
    pre.style.margin = "0";
    pre.style.padding = "0";

    wrap.appendChild(pre);
    source.insertAdjacentElement("afterend", wrap);

    return { wrap: wrap, pre: pre };
  }

  /**
   * Build an offscreen canvas for text rasterization.
   * @param {string[]} lines - Source text lines.
   * @param {object} styleInfo - Source typography.
   * @returns {object|null}
   */
  function createTextCanvas(lines, styleInfo) {
    var sourceFontPx;
    var fontPx;
    var letterSpacingPx;
    var sourceLineHeight;
    var lineHeightPx;
    var drawFont;
    var canvas;
    var ctx;
    var maxTextWidth;
    var i;
    var j;
    var line;
    var width;
    var ch;

    if (!supportsCanvas()) return null;

    sourceFontPx = parseFloat(styleInfo.fontSize || "32") || 32;
    fontPx = Math.max(24, Math.round(sourceFontPx * currentConfig.rasterScale));
    letterSpacingPx = parseFloat(styleInfo.letterSpacing || "0") || 0;
    sourceLineHeight = parseFloat(styleInfo.lineHeight || "0") || 0;
    lineHeightPx = sourceLineHeight
      ? Math.max(fontPx * 1.05, sourceLineHeight * currentConfig.rasterScale)
      : Math.round(fontPx * 1.15);

    drawFont = [
      styleInfo.fontStyle || "normal",
      styleInfo.fontVariant || "normal",
      styleInfo.fontWeight || "700",
      fontPx + "px",
      styleInfo.fontFamily || "sans-serif"
    ].join(" ");

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.font = drawFont;
    maxTextWidth = 0;

    for (i = 0; i < lines.length; i++) {
      line = lines[i];
      width = 0;

      for (j = 0; j < line.length; j++) {
        ch = line.charAt(j);
        width += ctx.measureText(ch).width + letterSpacingPx; // include tracking
      }

      maxTextWidth = Math.max(maxTextWidth, width);
    }

    canvas.width = Math.max(1, Math.ceil(maxTextWidth + currentConfig.canvasPadX * 2));
    canvas.height = Math.max(1, Math.ceil(lines.length * lineHeightPx + currentConfig.canvasPadY * 2));

    return {
      canvas: canvas,
      ctx: ctx,
      drawFont: drawFont,
      fontPx: fontPx,
      lineHeightPx: lineHeightPx,
      letterSpacingPx: letterSpacingPx
    };
  }

  /**
   * Calculate effective x/y sampling sizes with optional aspect-ratio preservation.
   * @param {object} prepared - Prepared canvas data.
   * @returns {{x: number, y: number}}
   */
  function getEffectiveSampleSize(prepared) {
    var effectiveY;
    var effectiveX;
    var lineHeightRatio;
    var autoRatio;
    var ratio;

    if (currentConfig.rowsPerTextLine) {
      effectiveY = Math.max(1, Math.round(prepared.fontPx / currentConfig.rowsPerTextLine)); // target height
    } else {
      effectiveY = Math.max(1, currentConfig.sampleY); // legacy height
    }

    if (!currentConfig.preserveAspectRatio) {
      return {
        x: Math.max(1, currentConfig.sampleX),
        y: effectiveY
      };
    }

    lineHeightRatio = parseFloat(currentConfig.lineHeight) || 1;
    autoRatio = measureMonoRatio() / lineHeightRatio; // visual char width / visual row height
    ratio = currentConfig.sampleAspectRatio || autoRatio || (currentConfig.sampleX / currentConfig.sampleY);

    effectiveX = Math.max(1, Math.round(effectiveY * ratio)); // proportional width reduction

    return {
      x: effectiveX,
      y: effectiveY
    };
  }

  /**
   * Rasterize source text into an alpha matrix.
   * @param {string} text - Source text.
   * @param {object} styleInfo - Source typography.
   * @returns {number[][]|null}
   */
  function rasterizeToAlphaMatrix(text, styleInfo) {
    var lines = String(text).replace(/\r\n/g, "\n").split("\n");
    var prepared = createTextCanvas(lines, styleInfo);
    var canvas;
    var ctx;
    var image;
    var cols;
    var rows;
    var matrix;
    var effectiveSample;
    var row;
    var gx;
    var gy;
    var x;
    var y;
    var i;
    var startX;
    var startY;
    var endX;
    var endY;
    var sum;
    var count;

    if (!prepared) return null;

    canvas = prepared.canvas;
    ctx = prepared.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.textBaseline = "top";
    ctx.font = prepared.drawFont;

    for (y = 0; y < lines.length; y++) {
      x = currentConfig.canvasPadX;

      for (i = 0; i < lines[y].length; i++) {
        ctx.fillText(lines[y].charAt(i), x, currentConfig.canvasPadY + y * prepared.lineHeightPx);
        x += ctx.measureText(lines[y].charAt(i)).width + prepared.letterSpacingPx;
      }
    }

    image = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    effectiveSample = getEffectiveSampleSize(prepared); // proportional x/y sampling

    cols = Math.ceil(canvas.width / effectiveSample.x);
    rows = Math.ceil(canvas.height / effectiveSample.y);
    matrix = [];

    for (gy = 0; gy < rows; gy++) {
      row = [];

      for (gx = 0; gx < cols; gx++) {
        sum = 0;
        count = 0;

        startX = gx * effectiveSample.x;
        startY = gy * effectiveSample.y;
        endX = Math.min(canvas.width, startX + effectiveSample.x);
        endY = Math.min(canvas.height, startY + effectiveSample.y);

        for (y = startY; y < endY; y++) {
          for (x = startX; x < endX; x++) {
            sum += image[(y * canvas.width + x) * 4 + 3] / 255; // alpha only
            count++;
          }
        }

        row.push(count ? sum / count : 0);
      }

      matrix.push(row);
    }

    return trimMatrix(matrix, currentConfig.threshold);
  }

  /**
   * Trim empty outer rows and columns from an alpha matrix.
   * @param {number[][]} matrix - Raw alpha matrix.
   * @param {number} threshold - Visible threshold.
   * @returns {number[][]}
   */
  function trimMatrix(matrix, threshold) {
    var top;
    var bottom;
    var left;
    var right;
    var out;
    var r;

    if (!matrix || !matrix.length || !matrix[0].length) return [[0]];

    top = 0;
    bottom = matrix.length - 1;
    left = 0;
    right = matrix[0].length - 1;

    while (top <= bottom && !rowHasInk(matrix, top, threshold)) top++;
    while (bottom >= top && !rowHasInk(matrix, bottom, threshold)) bottom--;
    while (left <= right && !colHasInk(matrix, left, threshold)) left++;
    while (right >= left && !colHasInk(matrix, right, threshold)) right--;

    if (top > bottom || left > right) return [[0]];

    out = [];

    for (r = top; r <= bottom; r++) {
      out.push(matrix[r].slice(left, right + 1));
    }

    return out;
  }

  /**
   * Check whether a matrix row has ink.
   * @param {number[][]} matrix - Alpha matrix.
   * @param {number} r - Row index.
   * @param {number} threshold - Visible threshold.
   * @returns {boolean}
   */
  function rowHasInk(matrix, r, threshold) {
    var i;

    for (i = 0; i < matrix[r].length; i++) {
      if (matrix[r][i] > threshold) return true;
    }

    return false;
  }

  /**
   * Check whether a matrix column has ink.
   * @param {number[][]} matrix - Alpha matrix.
   * @param {number} c - Column index.
   * @param {number} threshold - Visible threshold.
   * @returns {boolean}
   */
  function colHasInk(matrix, c, threshold) {
    var i;

    for (i = 0; i < matrix.length; i++) {
      if (matrix[i][c] > threshold) return true;
    }

    return false;
  }

  /**
   * Convert alpha matrix into visible/space cells.
   * @param {number[][]} alphaMatrix - Trimmed alpha matrix.
   * @returns {{group: string, alpha: number}[][]}
   */
  function classifyMatrix(alphaMatrix) {
    var rows = alphaMatrix.length;
    var cols = alphaMatrix[0] ? alphaMatrix[0].length : 0;
    var classified = [];
    var y;
    var x;
    var row;
    var alpha;

    for (y = 0; y < rows; y++) {
      row = [];

      for (x = 0; x < cols; x++) {
        alpha = alphaMatrix[y][x];

        if (alpha <= currentConfig.threshold) {
          row.push({ group: "space", alpha: 0 });
        } else if (alpha >= currentConfig.denseCutoff) {
          row.push({ group: "dense", alpha: alpha });
        } else if (alpha >= currentConfig.middleCutoff) {
          row.push({ group: "middle", alpha: alpha });
        } else {
          row.push({
            group: y < rows / 2 ? "upper" : "lower", // weak stroke position
            alpha: alpha
          });
        }
      }

      classified.push(row);
    }

    return classified;
  }

  /**
   * Pick the current global pulse character.
   * Every visible cell uses this same character for the current frame.
   * @param {number} now - Animation timestamp.
   * @returns {string}
   */
  function pickGlobalPulseChar(now) {
    var chars = String(currentConfig.charCycle || ".+*%*+.");
    var frameMs = Math.max(1, currentConfig.frameMs || 420);
    var idx;

    if (!chars.length) return " ";

    idx = Math.floor(now / frameMs) % chars.length;
    return chars.charAt(idx);
  }

  /**
   * Estimate monospace character width ratio.
   * @returns {number}
   */
  function measureMonoRatio() {
    var canvas;
    var ctx;

    if (monoRatioCache) return monoRatioCache;
    if (!supportsCanvas()) return 0.6;

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    if (!ctx) return 0.6;

    ctx.font = "100px " + currentConfig.monoFont;
    monoRatioCache = Math.max(0.3, ctx.measureText("M").width / 100); // width per font px

    return monoRatioCache;
  }

  /**
   * Calculate local font size needed for one block to fit parent.
   * @param {object} state - Element render state.
   * @returns {number}
   */
  function calculateLocalFitFontPx(state) {
    var cols;
    var available;
    var monoRatio;
    var targetFontPx;

    if (!currentConfig.fitToParentWidth) return currentConfig.maxArtFontPx;

    cols = state.matrix[0] ? state.matrix[0].length : 1;
    available = getAvailableWidth(state.source) * currentConfig.fitWidthRatio;
    monoRatio = measureMonoRatio();
    targetFontPx = available / Math.max(1, cols * monoRatio);

    return clamp(targetFontPx, currentConfig.minArtFontPx, currentConfig.maxArtFontPx);
  }

  /**
   * Calculate one page-wide font size using smallest local fit.
   * @returns {number}
   */
  function calculateUnifiedFontPx() {
    var minFontPx = currentConfig.maxArtFontPx;
    var i;

    for (i = 0; i < states.length; i++) {
      minFontPx = Math.min(minFontPx, calculateLocalFitFontPx(states[i])); // minimum standard
    }

    return clamp(minFontPx, currentConfig.minArtFontPx, currentConfig.maxArtFontPx);
  }

  /**
   * Apply one unified page-wide scale to all generated blocks.
   */
  function applyGlobalScale() {
    var sharedFontPx;
    var fontPx;
    var i;

    if (!states.length) return;

    sharedFontPx = currentConfig.unifiedScale ? calculateUnifiedFontPx() : null;

    for (i = 0; i < states.length; i++) {
      fontPx = sharedFontPx == null ? calculateLocalFitFontPx(states[i]) : sharedFontPx;
      states[i].pre.style.fontSize = fontPx + "px"; // unified or local fit
    }
  }

  /**
   * Check whether generated block is near the viewport.
   * @param {object} state - Element render state.
   * @returns {boolean}
   */
  function isStateNearViewport(state) {
    var rect;
    var margin;
    var vh;

    if (!currentConfig.skipOffscreen) return true;
    if (!state.wrap || !state.wrap.getBoundingClientRect) return true;

    rect = state.wrap.getBoundingClientRect();
    margin = currentConfig.offscreenMargin;
    vh = window.innerHeight || document.documentElement.clientHeight || 0;

    return rect.bottom >= -margin && rect.top <= vh + margin; // expanded viewport
  }

  /**
   * Build one animated ASCII frame.
   * @param {object} state - Element render state.
   * @param {number} now - Animation timestamp.
   * @returns {string}
   */
  function buildFrame(state, now) {
    var rows = state.matrix.length;
    var cols = state.matrix[0] ? state.matrix[0].length : 0;
    var activeChar = pickGlobalPulseChar(now);
    var lines = [];
    var y;
    var x;
    var line;
    var cell;

    for (y = 0; y < rows; y++) {
      line = "";

      for (x = 0; x < cols; x++) {
        cell = state.matrix[y][x];

        if (!cell || cell.group === "space") {
          line += " ";
          continue;
        }

        line += activeChar; // one global character at a time
      }

      lines.push(line.replace(/\s+$/g, "")); // trim right tail only
    }

    return lines.join("\n");
  }

  /**
   * Find stored state for a source element.
   * @param {HTMLElement} source - Source element.
   * @returns {object|null}
   */
  function findState(source) {
    var i;

    for (i = 0; i < states.length; i++) {
      if (states[i].source === source) return states[i];
    }

    return null;
  }

  /**
   * Process one matched source element.
   * @param {HTMLElement} source - Matched source element.
   */
  function processElement(source) {
    var text;
    var originalCssText;
    var styleInfo;
    var alphaMatrix;
    var matrix;
    var nodes;
    var state;

    if (findState(source)) return;
    if (!supportsCanvas()) return;                 // graceful fallback
    if (!canReplaceAtCurrentWidth(source)) return; // narrow screens keep original visible

    text = (source.textContent || "").trim();

    if (!text) return;
    if (!currentConfig.allowUnicode && !isAsciiOnly(text)) return; // optional ASCII gate

    originalCssText = source.getAttribute("style");
    styleInfo = readSourceStyles(source);
    alphaMatrix = rasterizeToAlphaMatrix(text, styleInfo);
    if (!alphaMatrix) return;

    matrix = classifyMatrix(alphaMatrix);
    nodes = createRenderBlock(source, styleInfo);

    source.setAttribute(getDataAttrName(), "true");
    visuallyHide(source);

    state = {
      source: source,
      wrap: nodes.wrap,
      pre: nodes.pre,
      originalText: text,
      originalCssText: originalCssText,
      styleInfo: styleInfo,
      matrix: matrix,
      lastFrameAt: 0
    };

    states.push(state);
    nodes.pre.textContent = buildFrame(state, nowMs());
  }

  /**
   * Get current timestamp.
   * @returns {number}
   */
  function nowMs() {
    return window.performance && performance.now ? performance.now() : Date.now();
  }

  /**
   * Restore one processed source element.
   * @param {HTMLElement} source - Source element to restore.
   */
  function restoreOne(source) {
    var i;
    var state;

    for (i = 0; i < states.length; i++) {
      if (states[i].source === source) {
        state = states[i];

        if (state.wrap && state.wrap.parentNode) {
          state.wrap.parentNode.removeChild(state.wrap);
        }

        restoreInlineStyle(state.source, state.originalCssText);
        state.source.removeAttribute(getDataAttrName());
        states.splice(i, 1);
        return;
      }
    }
  }

  /**
   * Scan and process all matching elements.
   */
  function refresh() {
    var nodes;
    var i;

    if (!document.querySelectorAll) return;

    nodes = document.querySelectorAll(currentConfig.selector);

    for (i = 0; i < nodes.length; i++) {
      processElement(nodes[i]);
    }

    applyGlobalScale();
    startLoop();
  }

  /**
   * Restore all processed elements.
   */
  function restore() {
    var copy = states.slice();
    var i;

    for (i = 0; i < copy.length; i++) {
      restoreOne(copy[i].source);
    }

    stopLoop();
  }

  /**
   * Rebuild all processed elements after config or selector changes.
   */
  function rebuildAll() {
    restore();
    monoRatioCache = 0; // font stack or layout may have changed
    refresh();
  }

  /**
   * Reconcile processed state against current container width.
   */
  function reconcileResponsiveState() {
    var copy = states.slice();
    var i;

    for (i = 0; i < copy.length; i++) {
      if (!canReplaceAtCurrentWidth(copy[i].source)) {
        restoreOne(copy[i].source); // revert to original
      }
    }

    refresh();
    applyGlobalScale();
  }

  /**
   * Check whether a node is inside generated output.
   * @param {Node} node - DOM node.
   * @returns {boolean}
   */
  function isInsideGeneratedBlock(node) {
    var el = node && node.nodeType === 1 ? node : node && node.parentElement;

    while (el) {
      if (typeof el.className === "string" && el.className.indexOf("ascii-matrix-flow-wrap") !== -1) {
        return true;
      }

      el = el.parentElement;
    }

    return false;
  }

  /**
   * Check whether mutation should trigger refresh.
   * @param {MutationRecord[]} mutations - Mutation records.
   * @returns {boolean}
   */
  function shouldRefreshForMutations(mutations) {
    var i;
    var j;
    var m;

    for (i = 0; i < mutations.length; i++) {
      m = mutations[i];

      if (!isInsideGeneratedBlock(m.target)) {
        for (j = 0; j < m.addedNodes.length; j++) {
          if (!isInsideGeneratedBlock(m.addedNodes[j])) return true; // external node added
        }
      }
    }

    return false;
  }

  /**
   * Schedule a debounced refresh.
   */
  function scheduleRefresh() {
    clearTimeout(observerTimer);

    observerTimer = setTimeout(function () {
      refresh();
    }, currentConfig.observerDebounceMs);
  }

  /**
   * Animation loop for generated blocks.
   * @param {number} now - Animation timestamp.
   */
  function tick(now) {
    var i;
    var state;
    var liveCount = 0;
    var hidden = currentConfig.visibilityPause && typeof document.hidden === "boolean" && document.hidden;

    if (hidden) {
      rafId = requestFrame(tick); // lightweight hidden-tab loop
      return;
    }

    for (i = states.length - 1; i >= 0; i--) {
      state = states[i];

      if (!document.documentElement.contains(state.source)) {
        if (state.wrap && state.wrap.parentNode) state.wrap.parentNode.removeChild(state.wrap);
        states.splice(i, 1);
        continue;
      }

      if (!canReplaceAtCurrentWidth(state.source)) {
        restoreOne(state.source);
        continue;
      }

      if (!isStateNearViewport(state)) {
        liveCount++;
        continue; // skip offscreen frame build
      }

      if (now - state.lastFrameAt >= currentConfig.frameMs) {
        state.pre.textContent = buildFrame(state, now);
        state.lastFrameAt = now;
      }

      liveCount++;
    }

    rafId = liveCount ? requestFrame(tick) : 0;
  }

  /**
   * Start animation loop.
   */
  function startLoop() {
    if (rafId || !states.length) return;
    rafId = requestFrame(tick);
  }

  /**
   * Stop animation loop.
   */
  function stopLoop() {
    if (!rafId) return;
    cancelFrame(rafId);
    rafId = 0;
  }

  /**
   * Start observing added DOM nodes.
   */
  function startObserver() {
    if (!currentConfig.observeDom || observer || !window.MutationObserver) return;

    observer = new MutationObserver(function (mutations) {
      if (shouldRefreshForMutations(mutations)) scheduleRefresh(); // ignore own text updates
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Stop observing added DOM nodes.
   */
  function stopObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
  }

  /**
   * Debounced resize handler.
   */
  function onResize() {
    if (!currentConfig.watchResize) return;

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
      reconcileResponsiveState();
    }, currentConfig.resizeDebounceMs);
  }

  /**
   * Visibility change handler.
   */
  function onVisibilityChange() {
    if (!document.hidden) applyGlobalScale(); // sync after background pause
  }

  /**
   * Merge runtime configuration and rebuild output.
   * @param {object} partialConfig - Partial config object.
   * @returns {object}
   */
  function updateConfig(partialConfig) {
    currentConfig = mergeConfig(currentConfig, partialConfig || {});

    stopObserver();
    rebuildAll();
    startObserver();

    return cloneConfig(currentConfig);
  }

  /**
   * Initialize automatic drop-in behavior.
   */
  function boot() {
    refresh();
    startObserver();

    if (currentConfig.watchResize && window.addEventListener) {
      window.addEventListener("resize", onResize, false);
    }

    if (currentConfig.visibilityPause && document.addEventListener) {
      document.addEventListener("visibilitychange", onVisibilityChange, false);
    }
  }

  window.updateConfig = updateConfig;
  window.AsciiMatrixFlow = {
    updateConfig: updateConfig,
    refresh: refresh,
    restore: restore,
    getConfig: function () {
      return cloneConfig(currentConfig);
    }
  };

  if (document.readyState === "loading" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();