/*!
 * matrix-background.js
 *
 * Lightweight Matrix-style falling text background.
 *
 * Usage:
 *   <script>
 *     window.MatrixBackgroundConfig = {
 *       fps: 20,
 *       densityFactor: 0.8,
 *       speedFactor: 0.9,
 *       errorText: ["ERROR", "FATAL", "FAULT"]
 *     };
 *   </script>
 *   <script src="/path/to/matrix-background.js" defer></script>
 *
 * API:
 *   window.MatrixBackground.start(config)
 *   window.MatrixBackground.stop()
 *   window.MatrixBackground.toggle()
 *   window.MatrixBackground.updateConfig(config)
 *   window.MatrixBackground.getConfig()
 */

(function (window, document) {
  "use strict";

  if (!window || !document) return;
  if (window.MatrixBackground) return;

  const DEFAULT_CONFIG = {
    text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ01",
    fallbackText: "ABCDEFGHIJKLMNOPQRSTUVWXYZ01",
    fontSize: 16,
    fps: 24,
    densityFactor: 1.2,
    speedFactor: 1,
    maxColumns: 180,
    columnScale: 1,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
    fontWeight: 500,
    greenColor: "#23ef23",
    whiteColor: "#E6EDF3",
    whiteChance: 0.1,
    errorColor: "#cb2037",
    errorText: ["ERROR", "FATAL", "ALERT", "PANIC", "RESET", "ABORT"]
  };

  const INTERNAL = {
    layerId: "matrix-bg",
    canvasId: "matrix-bg-canvas",
    background: "#000",
    zIndex: -1,
    dprMax: 1.25,
    trailAlpha: 0.09,
    headWhiteChance: 0.18,
    minSpeed: 0.5,
    maxSpeed: 1.15,
    errorMinDelay: 1400,
    errorMaxDelay: 5200,
    errorFrames: 5,
    resizeDelay: 160
  };

  let config = sanitizeConfig(assign({}, DEFAULT_CONFIG, window.MatrixBackgroundConfig || {}));
  let runtime = null;

  function assign(target) {
    for (let i = 1; i < arguments.length; i += 1) {
      const source = arguments[i] || {};
      Object.keys(source).forEach(function (key) {
        target[key] = source[key];
      });
    }
    return target;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function number(value, fallback, min, max) {
    const n = Number(value);
    return Number.isFinite(n) ? clamp(n, min, max) : fallback;
  }

  function sanitizeConfig(input) {
    const output = {};

    output.text = String(input.text || "");
    output.fallbackText = String(input.fallbackText || DEFAULT_CONFIG.fallbackText);
    output.fontSize = number(input.fontSize, DEFAULT_CONFIG.fontSize, 8, 64);
    output.fps = Math.round(number(input.fps, DEFAULT_CONFIG.fps, 1, 60));
    output.densityFactor = number(input.densityFactor, DEFAULT_CONFIG.densityFactor, 0.25, 3);
    output.speedFactor = number(input.speedFactor, DEFAULT_CONFIG.speedFactor, 0.1, 4);
    output.maxColumns = Math.round(number(input.maxColumns, DEFAULT_CONFIG.maxColumns, 0, 1000));
    output.columnScale = number(input.columnScale, DEFAULT_CONFIG.columnScale, 0.25, 8);
    output.fontFamily = String(input.fontFamily || DEFAULT_CONFIG.fontFamily);
    output.fontWeight = number(input.fontWeight, DEFAULT_CONFIG.fontWeight, 100, 900);
    output.greenColor = String(input.greenColor || DEFAULT_CONFIG.greenColor);
    output.whiteColor = String(input.whiteColor || DEFAULT_CONFIG.whiteColor);
    output.whiteChance = number(input.whiteChance, DEFAULT_CONFIG.whiteChance, 0, 1);
    output.errorColor = String(input.errorColor || DEFAULT_CONFIG.errorColor);

    if (Array.isArray(input.errorText)) {
      output.errorText = input.errorText.map(String).filter(Boolean);
    } else if (typeof input.errorText === "string" && input.errorText.trim()) {
      output.errorText = [input.errorText.trim()];
    } else {
      output.errorText = DEFAULT_CONFIG.errorText.slice();
    }

    if (!output.errorText.length) output.errorText = DEFAULT_CONFIG.errorText.slice();

    return output;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function randInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getChars() {
    const source = config.text || config.fallbackText || "01";
    const chars = Array.from(source);
    return chars.length ? chars : ["0", "1"];
  }

  function createRuntime() {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    root.id = INTERNAL.layerId;
    root.setAttribute("aria-hidden", "true");

    canvas.id = INTERNAL.canvasId;

    root.style.position = "fixed";
    root.style.inset = "0";
    root.style.zIndex = String(INTERNAL.zIndex);
    root.style.pointerEvents = "none";
    root.style.overflow = "hidden";
    root.style.background = INTERNAL.background;
    root.style.contain = "strict";

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    root.appendChild(canvas);
    document.body.appendChild(root);

    return {
      root: root,
      canvas: canvas,
      ctx: ctx,
      width: 0,
      height: 0,
      dpr: 1,
      columnWidth: 16,
      columns: 0,
      chars: getChars(),
      streams: [],
      running: false,
      timerId: 0,
      rafId: 0,
      resizeTimer: 0,
      nextErrorAt: 0
    };
  }

  function makeStream(index) {
    const fontSize = config.fontSize;

    return {
      x: index * runtime.columnWidth,
      y: -rand(0, runtime.height),
      speed: fontSize * rand(INTERNAL.minSpeed, INTERNAL.maxSpeed) * config.speedFactor,
      errorWord: "",
      errorFrames: 0
    };
  }

  function resize() {
    if (!runtime || !runtime.ctx) return;

    runtime.width = window.innerWidth || document.documentElement.clientWidth || 1;
    runtime.height = window.innerHeight || document.documentElement.clientHeight || 1;
    runtime.dpr = Math.min(window.devicePixelRatio || 1, INTERNAL.dprMax);

    const naturalColumnWidth = Math.max(
      1,
      (config.fontSize * config.columnScale) / config.densityFactor
    );

    const cappedColumnWidth =
      config.maxColumns > 0
        ? Math.ceil(runtime.width / config.maxColumns)
        : naturalColumnWidth;

    runtime.columnWidth = Math.max(naturalColumnWidth, cappedColumnWidth);
    runtime.columns = Math.max(1, Math.ceil(runtime.width / runtime.columnWidth));

    runtime.canvas.width = Math.floor(runtime.width * runtime.dpr);
    runtime.canvas.height = Math.floor(runtime.height * runtime.dpr);
    runtime.canvas.style.width = runtime.width + "px";
    runtime.canvas.style.height = runtime.height + "px";

    runtime.ctx.setTransform(runtime.dpr, 0, 0, runtime.dpr, 0, 0);
    runtime.ctx.font = config.fontWeight + " " + config.fontSize + "px " + config.fontFamily;
    runtime.ctx.textBaseline = "top";
    runtime.ctx.fillStyle = INTERNAL.background;
    runtime.ctx.fillRect(0, 0, runtime.width, runtime.height);

    runtime.chars = getChars();
    runtime.streams = new Array(runtime.columns);

    for (let i = 0; i < runtime.columns; i += 1) {
      runtime.streams[i] = makeStream(i);
    }

    runtime.nextErrorAt = performance.now() + rand(INTERNAL.errorMinDelay, INTERNAL.errorMaxDelay);
  }

  function pickChar() {
    return runtime.chars[randInt(runtime.chars.length)];
  }

  function pickErrorWord() {
    return config.errorText[randInt(config.errorText.length)];
  }

  function resetStream(stream) {
    stream.y = -rand(config.fontSize, runtime.height * 0.35 + config.fontSize);
    stream.speed = config.fontSize * rand(INTERNAL.minSpeed, INTERNAL.maxSpeed) * config.speedFactor;
    stream.errorWord = "";
    stream.errorFrames = 0;
  }

  function maybeStartError(now) {
    if (now < runtime.nextErrorAt || !runtime.streams.length) return;

    const stream = runtime.streams[randInt(runtime.streams.length)];
    stream.errorWord = pickErrorWord();
    stream.errorFrames = INTERNAL.errorFrames;

    runtime.nextErrorAt = now + rand(INTERNAL.errorMinDelay, INTERNAL.errorMaxDelay);
  }

  function drawFrame(now) {
    if (!runtime || !runtime.running) return;

    const ctx = runtime.ctx;
    const fontSize = config.fontSize;

    ctx.globalAlpha = INTERNAL.trailAlpha;
    ctx.fillStyle = INTERNAL.background;
    ctx.fillRect(0, 0, runtime.width, runtime.height);
    ctx.globalAlpha = 1;

    maybeStartError(now);

    for (let i = 0; i < runtime.streams.length; i += 1) {
      const stream = runtime.streams[i];

      if (stream.errorFrames > 0) {
        ctx.fillStyle = config.errorColor;
        ctx.fillText(stream.errorWord, stream.x, stream.y);
        stream.errorFrames -= 1;
      } else {
        ctx.fillStyle = Math.random() < config.whiteChance ? config.whiteColor : config.greenColor;
        ctx.fillText(pickChar(), stream.x, stream.y);

        if (Math.random() < INTERNAL.headWhiteChance) {
          ctx.fillStyle = config.whiteColor;
          ctx.fillText(pickChar(), stream.x, stream.y - fontSize);
        }
      }

      stream.y += stream.speed;

      if (stream.y > runtime.height + fontSize) {
        resetStream(stream);
      }
    }

    scheduleNextFrame();
  }

  function scheduleNextFrame() {
    if (!runtime || !runtime.running) return;

    const delay = 1000 / config.fps;

    runtime.timerId = window.setTimeout(function () {
      if (!runtime || !runtime.running || document.hidden) {
        scheduleNextFrame();
        return;
      }

      runtime.rafId = window.requestAnimationFrame(drawFrame);
    }, delay);
  }

  function clearTimers() {
    if (!runtime) return;

    window.clearTimeout(runtime.timerId);
    window.cancelAnimationFrame(runtime.rafId);

    runtime.timerId = 0;
    runtime.rafId = 0;
  }

  function onResize() {
    if (!runtime) return;

    window.clearTimeout(runtime.resizeTimer);
    runtime.resizeTimer = window.setTimeout(resize, INTERNAL.resizeDelay);
  }

  function onVisibilityChange() {
    if (!runtime || !runtime.running) return;

    clearTimers();

    if (!document.hidden) {
      scheduleNextFrame();
    }
  }

  function addListeners() {
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });
  }

  function removeListeners() {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }

  function start(nextConfig) {
    if (nextConfig) {
      config = sanitizeConfig(assign({}, config, nextConfig));
    }

    if (!runtime) {
      if (!document.body) return getConfig();
      runtime = createRuntime();
      resize();
      addListeners();
    }

    if (runtime.running) return getConfig();

    runtime.running = true;
    runtime.nextErrorAt = performance.now() + rand(INTERNAL.errorMinDelay, INTERNAL.errorMaxDelay);
    scheduleNextFrame();

    return getConfig();
  }

  function stop() {
    if (!runtime) return getConfig();

    runtime.running = false;
    clearTimers();

    return getConfig();
  }

  function toggle() {
    if (!runtime || !runtime.running) {
      return start();
    }

    return stop();
  }

  function updateConfig(nextConfig) {
    config = sanitizeConfig(assign({}, config, nextConfig || {}));

    if (runtime) {
      clearTimers();
      resize();

      if (runtime.running && !document.hidden) {
        scheduleNextFrame();
      }
    }

    return getConfig();
  }

  function getConfig() {
    return assign({}, config, {
      errorText: config.errorText.slice()
    });
  }

  window.MatrixBackground = {
    start: start,
    stop: stop,
    toggle: toggle,
    updateConfig: updateConfig,
    getConfig: getConfig
  };

  function ready() {
    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }
})(window, document);