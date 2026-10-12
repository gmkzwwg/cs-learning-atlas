/*!
 * Introduction:
 *   Applies randomized glitch effects to selected text elements.
 *
 * Usage:
 *   Include this file on the page. It starts automatically with DEFAULT_CONFIG.
 *   Default behavior can be customized by editing DEFAULT_CONFIG below.
 *   Runtime behavior can be customized with window.TextGlitchFx.updateConfig().
 *
 * Global API:
 *   window.TextGlitchFx                  Constructor for manual instances.
 *   window.TextGlitchFx.updateConfig()   Update the default auto instance config.
 *   window.TextGlitchFx.start()          Start the default auto instance.
 *   window.TextGlitchFx.stop()           Stop the default auto instance.
 *   window.TextGlitchFx.triggerNow()     Trigger one glitch batch immediately.
 *   window.TextGlitchFx.getConfig()      Get the active auto instance config.
 *
 * Notes:
 *   The script injects its own compact CSS.
 *   The default auto instance respects prefers-reduced-motion.
 *   Elements with data-glitch-disabled="true" are skipped.
 *   This version uses element-level viewport control, not character-level clipping.
 */

(function (window, document) {
  "use strict";

  const DEFAULT_CONFIG = {
    selector:
      "h1, h2, h3, h4, .abstract, .post-abstract, .post-meta__text, .cli-header__label, .cli-header__title, .cli-header__owner, .cli-header__mode",

    interval: 8,
    intervalRange: [6, 10],

    initialDelay: 2000,
    duration: 800,

    effects: ["scramble", "blocks", "blink", "error"],

    errorTexts: [
      "ERROR 418",
      "FATAL: NULL",
      "SYSTEM GLITCH",
      "SIGNAL LOST",
      "404 THOUGHTS",
      "DATA CORRUPTED"
    ],

    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-=?/<>[]{}█▓▒░",

    maxCharChangeRatio: 0.48,

    batchSizeWeights: [
      { count: 1, weight: 25 },
      { count: 2, weight: 45 },
      { count: 3, weight: 15 },
      { count: 4, weight: 15 }
    ],

    skipHidden: true,
    viewportOnly: true,
    pauseWhenPageHidden: true,
    respectReducedMotion: true,

    autoStart: true,

    injectStyle: true,
    styleId: "tgfx-style",

    busyAttribute: "data-glitch-busy",
    disabledAttribute: "data-glitch-disabled",

    blinkClass: "tgfx-blink"
  };

  let autoInstance = null;
  let autoConfig = Object.assign({}, DEFAULT_CONFIG);

  class TextGlitchFx {
    constructor(options = {}) {
      this.options = Object.assign({}, DEFAULT_CONFIG, options);

      this.timer = null;
      this.running = false;

      this.effectTimeouts = new Set();
      this.effectIntervals = new Set();
      this.activeElements = new Map();

      this._injectStyle();
    }

    start() {
      if (this.running) return;
      if (this._shouldRespectReducedMotion()) return;

      this.running = true;
      this._scheduleNext(this.options.initialDelay);
    }

    stop() {
      this.running = false;

      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }

      this._clearAllEffectTimers();
      this._restoreActiveElements();
    }

    updateConfig(nextOptions = {}) {
      const wasRunning = this.running;

      this.stop();

      this.options = Object.assign({}, this.options, nextOptions);
      this._injectStyle();

      if (wasRunning || this.options.autoStart) {
        this.start();
      }

      return this.getConfig();
    }

    getConfig() {
      return Object.assign({}, this.options);
    }

    triggerNow() {
      if (this._shouldSkipTrigger()) return;

      const elements = this._getEligibleElements();

      if (!elements.length) return;

      const batchSize = Math.min(this._getWeightedBatchSize(), elements.length);
      const pickedElements = this._pickRandomElements(elements, batchSize);

      pickedElements.forEach((element) => {
        const effect = this._getRandomEffect();
        this._applyEffect(element, effect);
      });
    }

    _shouldRespectReducedMotion() {
      return (
        this.options.respectReducedMotion &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }

    _shouldSkipTrigger() {
      return Boolean(
        this.options.pauseWhenPageHidden &&
          document.visibilityState &&
          document.visibilityState !== "visible"
      );
    }

    _scheduleNext(customDelay) {
      if (!this.running) return;

      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }

      const delay =
        customDelay === undefined
          ? this._getNextDelay()
          : Math.max(0, Number(customDelay) || 0);

      this.timer = window.setTimeout(() => {
        this.timer = null;

        if (!this.running) return;

        this.triggerNow();
        this._scheduleNext();
      }, delay);
    }

    _getNextDelay() {
      const interval = Number(this.options.interval) || DEFAULT_CONFIG.interval;
      const intervalRange = this.options.intervalRange;

      if (
        Array.isArray(intervalRange) &&
        intervalRange.length === 2 &&
        Number.isFinite(Number(intervalRange[0])) &&
        Number.isFinite(Number(intervalRange[1])) &&
        Number(intervalRange[0]) <= Number(intervalRange[1])
      ) {
        const min = Math.max(0.3, Number(intervalRange[0])) * 1000;
        const max = Math.max(0.3, Number(intervalRange[1])) * 1000;

        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      return Math.max(300, interval * 1000);
    }

    _getEligibleElements() {
      let nodes = [];

      try {
        nodes = Array.from(document.querySelectorAll(this.options.selector));
      } catch (error) {
        return [];
      }

      return nodes.filter((element) => {
        const text = (element.textContent || "").trim();

        if (!text) return false;

        if (element.getAttribute(this.options.disabledAttribute) === "true") {
          return false;
        }

        if (element.getAttribute(this.options.busyAttribute) === "1") {
          return false;
        }

        if (this.options.skipHidden && !this._isVisible(element)) {
          return false;
        }

        if (this.options.viewportOnly && !this._isInViewport(element)) {
          return false;
        }

        return true;
      });
    }

    _isVisible(element) {
      const style = window.getComputedStyle(element);

      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) === 0
      ) {
        return false;
      }

      const rect = element.getBoundingClientRect();

      return rect.width > 0 && rect.height > 0;
    }

    _isInViewport(element) {
      const rect = element.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth;

      return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < viewportHeight &&
        rect.left < viewportWidth
      );
    }

    _getWeightedBatchSize() {
      const weights = Array.isArray(this.options.batchSizeWeights)
        ? this.options.batchSizeWeights
        : DEFAULT_CONFIG.batchSizeWeights;

      const validWeights = weights.filter((item) => {
        return (
          item &&
          Number.isFinite(Number(item.count)) &&
          Number.isFinite(Number(item.weight)) &&
          Number(item.count) > 0 &&
          Number(item.weight) > 0
        );
      });

      if (!validWeights.length) return 1;

      const totalWeight = validWeights.reduce((sum, item) => {
        return sum + Number(item.weight);
      }, 0);

      let roll = Math.random() * totalWeight;

      for (const item of validWeights) {
        roll -= Number(item.weight);

        if (roll <= 0) {
          return Math.max(1, Math.floor(Number(item.count)));
        }
      }

      return 1;
    }

    _pickRandomElements(elements, count) {
      const pool = elements.slice();
      const picked = [];

      while (pool.length && picked.length < count) {
        const index = Math.floor(Math.random() * pool.length);

        picked.push(pool[index]);
        pool.splice(index, 1);
      }

      return picked;
    }

    _getRandomEffect() {
      const effects =
        Array.isArray(this.options.effects) && this.options.effects.length
          ? this.options.effects
          : DEFAULT_CONFIG.effects;

      return effects[Math.floor(Math.random() * effects.length)];
    }

    _applyEffect(element, effect) {
      if (this.activeElements.has(element)) return;

      const original = element.textContent;
      const duration = Math.max(
        80,
        Number(this.options.duration) || DEFAULT_CONFIG.duration
      );

      element.setAttribute(this.options.busyAttribute, "1");
      this.activeElements.set(element, original);

      switch (effect) {
        case "scramble":
          this._effectScramble(element, original, duration);
          break;

        case "blocks":
          this._effectBlocks(element, original, duration);
          break;

        case "blink":
          this._effectBlink(element, original, duration);
          break;

        case "error":
          this._effectError(element, original, duration);
          break;

        default:
          this._effectScramble(element, original, duration);
      }
    }

    _cleanup(element, original) {
      if (!element) return;

      element.textContent = original;
      element.classList.remove(this.options.blinkClass);
      element.removeAttribute(this.options.busyAttribute);

      this.activeElements.delete(element);
    }

    _restoreActiveElements() {
      Array.from(this.activeElements.entries()).forEach(([element, original]) => {
        this._cleanup(element, original);
      });

      this.activeElements.clear();
    }

    _setEffectTimeout(callback, delay) {
      const timerId = window.setTimeout(() => {
        this.effectTimeouts.delete(timerId);
        callback();
      }, delay);

      this.effectTimeouts.add(timerId);

      return timerId;
    }

    _clearEffectTimeout(timerId) {
      if (!timerId) return;

      window.clearTimeout(timerId);
      this.effectTimeouts.delete(timerId);
    }

    _setEffectInterval(callback, delay) {
      const intervalId = window.setInterval(callback, delay);

      this.effectIntervals.add(intervalId);

      return intervalId;
    }

    _clearEffectInterval(intervalId) {
      if (!intervalId) return;

      window.clearInterval(intervalId);
      this.effectIntervals.delete(intervalId);
    }

    _clearAllEffectTimers() {
      this.effectTimeouts.forEach((timerId) => {
        window.clearTimeout(timerId);
      });

      this.effectIntervals.forEach((intervalId) => {
        window.clearInterval(intervalId);
      });

      this.effectTimeouts.clear();
      this.effectIntervals.clear();
    }

    _effectScramble(element, original, duration) {
      const steps = 7;
      let currentStep = 0;
      const stepTime = Math.max(24, Math.floor(duration / steps));

      const intervalId = this._setEffectInterval(() => {
        if (!this.activeElements.has(element)) {
          this._clearEffectInterval(intervalId);
          return;
        }

        currentStep += 1;

        const progress = currentStep / steps;

        element.textContent = this._scrambleText(original, progress);

        if (currentStep >= steps) {
          this._clearEffectInterval(intervalId);
          this._cleanup(element, original);
        }
      }, stepTime);
    }

    _effectBlocks(element, original, duration) {
      element.textContent = this._blockText(original);

      const switchDelay = Math.max(40, duration - 60);

      this._setEffectTimeout(() => {
        if (!this.activeElements.has(element)) return;

        element.textContent = this._scrambleText(original, 0.75);

        this._setEffectTimeout(() => {
          if (!this.activeElements.has(element)) return;

          this._cleanup(element, original);
        }, 60);
      }, switchDelay);
    }

    _effectBlink(element, original, duration) {
      element.classList.add(this.options.blinkClass);

      const firstTimer = this._setEffectTimeout(() => {
        if (!this.activeElements.has(element)) return;

        element.textContent = this._scrambleText(original, 0.55);
      }, 70);

      const secondTimer = this._setEffectTimeout(() => {
        if (!this.activeElements.has(element)) return;

        element.textContent = original;
      }, 150);

      const thirdTimer = this._setEffectTimeout(() => {
        if (!this.activeElements.has(element)) return;

        element.textContent = this._blockText(original);
      }, 220);

      this._setEffectTimeout(() => {
        this._clearEffectTimeout(firstTimer);
        this._clearEffectTimeout(secondTimer);
        this._clearEffectTimeout(thirdTimer);

        if (!this.activeElements.has(element)) return;

        this._cleanup(element, original);
      }, duration);
    }

    _effectError(element, original, duration) {
      const errorText = this._getRandomErrorText();

      element.textContent = errorText;
      element.classList.add(this.options.blinkClass);

      this._setEffectTimeout(() => {
        if (!this.activeElements.has(element)) return;

        element.textContent = this._scrambleText(original, 0.7);
      }, Math.max(80, duration * 0.5));

      this._setEffectTimeout(() => {
        if (!this.activeElements.has(element)) return;

        this._cleanup(element, original);
      }, duration);
    }

    _getRandomErrorText() {
      const errorTexts =
        Array.isArray(this.options.errorTexts) && this.options.errorTexts.length
          ? this.options.errorTexts
          : DEFAULT_CONFIG.errorTexts;

      return errorTexts[Math.floor(Math.random() * errorTexts.length)];
    }

    _scrambleText(text, progress = 0.5) {
      const chars = this.options.chars || DEFAULT_CONFIG.chars;
      const arr = String(text || "").split("");

      const maxRatio =
        Number(this.options.maxCharChangeRatio) ||
        DEFAULT_CONFIG.maxCharChangeRatio;

      const activeRatio = Math.max(0.08, (1 - progress) * maxRatio);

      return arr
        .map((char) => {
          if (char === " ") return char;

          if (Math.random() < activeRatio) {
            return chars[Math.floor(Math.random() * chars.length)];
          }

          return char;
        })
        .join("");
    }

    _blockText(text) {
      const blockChars = ["█", "▓", "▒"];

      const ratio = Math.min(
        0.6,
        Number(this.options.maxCharChangeRatio) + 0.08
      );

      return String(text || "")
        .split("")
        .map((char) => {
          if (char === " ") return char;

          if (Math.random() < ratio) {
            return blockChars[Math.floor(Math.random() * blockChars.length)];
          }

          return char;
        })
        .join("");
    }

    _injectStyle() {
      if (!this.options.injectStyle) return;
      if (document.getElementById(this.options.styleId)) return;

      const style = document.createElement("style");

      style.id = this.options.styleId;
      style.textContent = `
        .${this.options.blinkClass} {
          animation: tgfxBlink 0.08s linear 3;
          will-change: opacity, filter, transform;
          filter: contrast(1.2) saturate(1.1);
        }

        @keyframes tgfxBlink {
          0% { opacity: 1; transform: translateX(0); }
          25% { opacity: 0.2; transform: translateX(-0.5px); }
          50% { opacity: 1; transform: translateX(0.5px); }
          75% { opacity: 0.35; transform: translateX(-0.5px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `;

      document.head.appendChild(style);
    }
  }

  function createAutoInstance() {
    if (autoInstance) return autoInstance;

    autoInstance = new TextGlitchFx(autoConfig);

    return autoInstance;
  }

  function start() {
    const instance = createAutoInstance();

    instance.start();

    return instance;
  }

  function stop() {
    if (!autoInstance) return;

    autoInstance.stop();
  }

  function triggerNow() {
    const instance = createAutoInstance();

    instance.triggerNow();
  }

  function updateConfig(nextConfig = {}) {
    autoConfig = Object.assign({}, autoConfig, nextConfig);

    if (!autoInstance) {
      autoInstance = new TextGlitchFx(autoConfig);
    } else {
      autoInstance.updateConfig(autoConfig);
    }

    return getConfig();
  }

  function getConfig() {
    return Object.assign({}, autoConfig);
  }

  function onReady() {
    if (!autoConfig.autoStart) return;

    start();
  }

  window.TextGlitchFx = TextGlitchFx;
  window.TextGlitchFx.updateConfig = updateConfig;
  window.TextGlitchFx.start = start;
  window.TextGlitchFx.stop = stop;
  window.TextGlitchFx.triggerNow = triggerNow;
  window.TextGlitchFx.getConfig = getConfig;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady, { once: true });
  } else {
    onReady();
  }
})(window, document);