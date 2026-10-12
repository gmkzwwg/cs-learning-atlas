/*!
 * matrix-letter-bomb.v3-lite.js
 *
 * Introduction:
 *   Lightweight full-screen matrix-style falling glyphs with fixed-delay multi-burst explosions.
 *   This rewrite removes chomper, SVG sprites, debris, pathing, and collision logic.
 *
 * Usage:
 *   Include this file on the page. It starts automatically when autoStart is true.
 *   Use window.MatrixLetterRain.toggle(active) to sync it with a UI button.
 *
 * Global API:
 *   window.MatrixLetterRain.start(config?)
 *   window.MatrixLetterRain.toggle(force?, config?)
 *   window.MatrixLetterRain.updateConfig(config)
 *   window.MatrixLetterRain.getConfig()
 *
 * Notes:
 *   toggle(false) removes the canvas. start()/toggle(true) are idempotent.
 *   multiBurstScaleStep is removed. Burst delay is fixed with multiBurstDelaySeconds.
 */
(function (window, document) {
  "use strict";

  if (!window || !document) return;

  const DEFAULT_CONFIG = {
    autoStart: true,
    respectReducedMotion: true,

    waitForSplash: true,
    splashFaceLayerId: "hacked-face-layer",
    splashFlashLayerId: "hacked-flash-layer",
    splashWaitTimeoutMs: 6000,
    splashPollMs: 80,

    startDelaySeconds: 3,
    intervalSeconds: 5,
    immediateStart: true,

    text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ01",
    fallbackText: "ABCDEFGHIJKLMNOPQRSTUVWXYZ01",

    greenColor: "#0fca1c",
    whiteColor: "#E6EDF3",
    errorColor: "#cb2037",
    yellowColor: "#FF9F43",
    color: null,

    fontSize: 15,
    fontFamily: null,
    fontWeight: 700,

    zIndex: 1,
    canvasClass: "matrix-letter-rain",
    canvasId: "matrix-letter-rain-canvas",

    dprMax: 1,

    mobilePerformanceMode: true,
    mobileBreakpoint: 800,
    mobileDprMax: 1,
    mobileMaxDrops: 2,
    mobileMaxParticles: 48,
    mobileGlow: false,

    minSpeed: 250,
    maxSpeed: 400,
    speedMultiplier: 3,
    maxDrops: 3,

    minExplodeLetters: 5,
    maxExplodeLetters: 9,
    minExplodeHeightRatio: 0.22,
    maxExplodeHeightRatio: 0.82,

    burstCountWeights: [0.25, 0.45, 0.15, 0.15],
    multiBurstDelaySeconds: 0.5,
    multiBurstLetterStep: 1,

    minParticleLife: 0.35,
    maxParticleLife: 0.75,
    minParticleSpeed: 260,
    maxParticleSpeed: 620,
    maxParticles: 80,

    explosionPatterns: ["ring", "cone", "burst", "cross"],

    glow: false,
    dropShadowBlur: 8,
    particleShadowBlur: 6,

    maxFrameDelta: 0.033,
    pauseWhenHidden: true,
    resizeDebounceMs: 120
  };

  let activeConfig = mergeNested({}, DEFAULT_CONFIG);
  let instance = null;
  let waitTimer = 0;
  let manuallyStopped = false;

  /** Deep-merges plain config objects. */
  function mergeNested(base, override) {
    const output = Object.assign({}, base || {});
    Object.keys(override || {}).forEach(function (key) {
      const value = override[key];
      const current = output[key];
      if (isPlainObject(value) && isPlainObject(current)) output[key] = mergeNested(current, value);
      else output[key] = value;
    });
    return output;
  }

  /** Checks plain object values. */
  function isPlainObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  /** Reads finite numeric config values. */
  function toNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  /** Clamps a numeric value. */
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /** Detects mobile viewport for cheaper defaults. */
  function isMobileViewport(config) {
    const width = window.innerWidth || document.documentElement.clientWidth || 1024;
    return width <= Math.max(1, toNumber(config.mobileBreakpoint, 800));
  }

  /** Applies runtime/mobile performance normalization. */
  function runtimeConfig(config) {
    const next = mergeNested(DEFAULT_CONFIG, config || {});

    next.dprMax = Math.max(1, toNumber(next.dprMax, 1));
    next.maxDrops = Math.max(1, Math.floor(toNumber(next.maxDrops, 3)));
    next.maxParticles = Math.max(1, Math.floor(toNumber(next.maxParticles, 80)));
    next.maxFrameDelta = Math.max(0.016, toNumber(next.maxFrameDelta, 0.033));
    next.intervalSeconds = Math.max(0.05, toNumber(next.intervalSeconds, 8));
    next.multiBurstDelaySeconds = Math.max(0, toNumber(next.multiBurstDelaySeconds, 0.5));

    if (next.mobilePerformanceMode && isMobileViewport(next)) {
      next.dprMax = Math.min(next.dprMax, Math.max(1, toNumber(next.mobileDprMax, 1)));
      next.maxDrops = Math.min(next.maxDrops, Math.max(1, Math.floor(toNumber(next.mobileMaxDrops, 2))));
      next.maxParticles = Math.min(next.maxParticles, Math.max(1, Math.floor(toNumber(next.mobileMaxParticles, 48))));
      next.glow = Boolean(next.mobileGlow);
    }

    if (!next.glow) {
      next.dropShadowBlur = 0;
      next.particleShadowBlur = 0;
    }

    return next;
  }

  /** Checks reduced-motion preference. */
  function shouldReduceMotion(config) {
    return Boolean(
      config.respectReducedMotion &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /** Clears splash waiting timer. */
  function clearWaitTimer() {
    if (waitTimer) window.clearTimeout(waitTimer);
    waitTimer = 0;
  }

  /** Returns the canvas parent. */
  function parentNode() {
    return document.body || document.documentElement;
  }

  class MatrixLetterBombEffect {
    /** Creates a canvas animation instance. */
    constructor(config) {
      this.options = runtimeConfig(config);
      this.chars = this.normalizeChars(this.options.text, this.options.fallbackText);

      this.canvas = null;
      this.ctx = null;
      this.width = 1;
      this.height = 1;
      this.dpr = 1;

      this.drops = [];
      this.particles = [];
      this.pendingBursts = [];

      this.running = false;
      this.disposed = false;
      this.rafId = 0;
      this.lastTime = 0;
      this.spawnElapsed = 0;
      this.delayRemaining = Math.max(0, toNumber(this.options.startDelaySeconds, 0));
      this.startedSpawning = false;
      this.resizeTimer = 0;

      this.pageFontSize = 16;
      this.pageFontFamily = "monospace";
      this.fontFamilyCache = "monospace";

      this.handleResize = this.handleResize.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      this.loop = this.loop.bind(this);

      this.createCanvas();
      this.resolvePageFont();
      this.resizeNow();

      window.addEventListener("resize", this.handleResize, { passive: true });
      document.addEventListener("visibilitychange", this.handleVisibilityChange, { passive: true });
    }

    /** Normalizes glyph candidate text. */
    normalizeChars(text, fallbackText) {
      const value = typeof text === "string" && text ? text : fallbackText;
      const chars = Array.from(value || "ABCDEFGHIJKLMNOPQRSTUVWXYZ01").filter(Boolean);
      return chars.length ? chars : ["0", "1"];
    }

    /** Random float helper. */
    rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    /** Random integer helper. */
    randInt(min, max) {
      return Math.floor(this.rand(min, max + 1));
    }

    /** Picks one item from a list. */
    pick(list) {
      return list[this.randInt(0, list.length - 1)];
    }

    /** Shuffles a small list. */
    shuffled(list) {
      const copy = list.slice();
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = this.randInt(0, i);
        const value = copy[i];
        copy[i] = copy[j];
        copy[j] = value;
      }
      return copy;
    }

    /** Creates and inserts the canvas. */
    createCanvas() {
      const old = document.getElementById(this.options.canvasId);
      if (old && old.parentNode) old.parentNode.removeChild(old);

      this.canvas = document.createElement("canvas");
      this.canvas.id = this.options.canvasId;
      this.canvas.className = this.options.canvasClass || DEFAULT_CONFIG.canvasClass;
      this.canvas.setAttribute("aria-hidden", "true");

      Object.assign(this.canvas.style, {
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100vh",
        display: "block",
        pointerEvents: "none",
        zIndex: String(this.options.zIndex)
      });

      parentNode().appendChild(this.canvas);

      try {
        this.ctx = this.canvas.getContext("2d", { alpha: true }) || this.canvas.getContext("2d");
      } catch (error) {
        this.ctx = this.canvas.getContext("2d");
      }
    }

    /** Resolves page font defaults. */
    resolvePageFont() {
      const html = window.getComputedStyle(document.documentElement);
      const body = document.body ? window.getComputedStyle(document.body) : null;
      const htmlSize = parseFloat(html.fontSize);
      const bodySize = body ? parseFloat(body.fontSize) : NaN;

      this.pageFontSize = Number.isFinite(bodySize) && bodySize > 0
        ? bodySize
        : Number.isFinite(htmlSize) && htmlSize > 0
          ? htmlSize
          : 16;

      this.pageFontFamily = body && body.fontFamily ? body.fontFamily : html.fontFamily || "monospace";
      this.fontFamilyCache = this.options.fontFamily || this.pageFontFamily || "monospace";
    }

    /** Resizes canvas and reapplies DPR transform. */
    resizeNow() {
      if (!this.canvas || !this.ctx) return;

      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, this.options.dprMax));
      this.dpr = dpr;
      this.width = window.innerWidth || document.documentElement.clientWidth || 1;
      this.height = window.innerHeight || document.documentElement.clientHeight || 1;

      this.canvas.width = Math.max(1, Math.floor(this.width * dpr));
      this.canvas.height = Math.max(1, Math.floor(this.height * dpr));
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      this.resolvePageFont();
      this.trimAll();
    }

    /** Debounced resize handler. */
    handleResize() {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => {
        if (this.disposed) return;
        this.options = runtimeConfig(this.options);
        this.resizeNow();
      }, Math.max(0, toNumber(this.options.resizeDebounceMs, 120)));
    }

    /** Pauses RAF while page is hidden. */
    handleVisibilityChange() {
      if (!this.options.pauseWhenHidden) return;

      if (document.hidden) {
        if (this.rafId) window.cancelAnimationFrame(this.rafId);
        this.rafId = 0;
        this.lastTime = 0;
        return;
      }

      if (this.running && !this.rafId) this.rafId = window.requestAnimationFrame(this.loop);
    }

    /** Returns current font size. */
    fontSize() {
      const size = Number(this.options.fontSize);
      return Number.isFinite(size) && size > 0 ? size : this.pageFontSize;
    }

    /** Returns primary glyph color. */
    mainColor() {
      return this.options.color || this.options.greenColor || "#23ef23";
    }

    /** Returns current speed multiplier. */
    speedMultiplier() {
      return Math.max(0.01, toNumber(this.options.speedMultiplier, 1));
    }

    /** Trims all runtime arrays. */
    trimAll() {
      this.trim(this.drops, this.options.maxDrops);
      this.trim(this.particles, this.options.maxParticles);
    }

    /** Trims one runtime array. */
    trim(list, max) {
      const overflow = list.length - max;
      if (overflow > 0) list.splice(0, overflow);
    }

    /** Picks one random glyph. */
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)] || "0";
    }

    /** Creates one falling glyph. */
    createDrop() {
      const size = this.fontSize();
      return {
        x: this.rand(size, Math.max(size, this.width - size)),
        y: -size,
        size: size,
        speed: this.rand(this.options.minSpeed, this.options.maxSpeed) * this.speedMultiplier(),
        char: this.randomChar(),
        changeIn: this.rand(0.04, 0.12),
        angle: this.rand(-0.1, 0.1),
        rotation: this.rand(-0.08, 0.08),
        explodeY: this.rand(this.height * this.options.minExplodeHeightRatio, this.height * this.options.maxExplodeHeightRatio)
      };
    }

    /** Adds one falling glyph, respecting maxDrops. */
    spawnDrop() {
      this.drops.push(this.createDrop());
      this.trim(this.drops, this.options.maxDrops);
    }

    /** Picks burst count from weights. */
    burstCount() {
      const weights = Array.isArray(this.options.burstCountWeights) ? this.options.burstCountWeights : DEFAULT_CONFIG.burstCountWeights;
      const roll = Math.random();
      let total = 0;

      for (let i = 0; i < 4; i += 1) {
        total += Number(weights[i]) || 0;
        if (roll < total) return i + 1;
      }

      return 4;
    }

    /** Builds the burst color sequence. */
    burstColors(count) {
      const colors = this.shuffled([this.options.errorColor, this.options.yellowColor, this.options.whiteColor]);
      return [this.mainColor()].concat(colors.slice(0, Math.max(0, count - 1)));
    }

    /** Schedules fixed-delay multi-burst explosions. */
    explode(x, y, baseSize) {
      const count = this.burstCount();
      const colors = this.burstColors(count);
      const fixedDelay = this.options.multiBurstDelaySeconds;

      for (let i = 0; i < count; i += 1) {
        this.pendingBursts.push({
          x: x,
          y: y,
          baseSize: baseSize,
          burstIndex: i,
          color: colors[i],
          delay: i * fixedDelay
        });
      }
    }

    /** Updates pending burst timers. */
    updatePendingBursts(dt) {
      let write = 0;

      for (let i = 0; i < this.pendingBursts.length; i += 1) {
        const burst = this.pendingBursts[i];
        burst.delay -= dt;

        if (burst.delay <= 0) this.explodeOnce(burst);
        else this.pendingBursts[write++] = burst;
      }

      this.pendingBursts.length = write;
    }

    /** Creates one burst of particles. */
    explodeOnce(burst) {
      const baseCount = this.randInt(this.options.minExplodeLetters, this.options.maxExplodeLetters);
      const count = Math.max(1, baseCount + burst.burstIndex * this.options.multiBurstLetterStep);
      const patterns = Array.isArray(this.options.explosionPatterns) && this.options.explosionPatterns.length
        ? this.options.explosionPatterns
        : DEFAULT_CONFIG.explosionPatterns;
      const pattern = this.pick(patterns);
      const baseAngle = this.rand(0, Math.PI * 2);

      for (let i = 0; i < count; i += 1) {
        const motion = this.particleMotion(pattern, i, count, baseAngle);
        const life = this.rand(this.options.minParticleLife, this.options.maxParticleLife);
        const speed = motion.speed * this.speedMultiplier();

        this.particles.push({
          x: burst.x,
          y: burst.y,
          px: burst.x,
          py: burst.y,
          vx: Math.cos(motion.angle) * speed,
          vy: Math.sin(motion.angle) * speed,
          size: burst.baseSize,
          color: burst.color,
          char: this.randomChar(),
          alpha: 1,
          life: life,
          maxLife: life,
          drag: this.rand(0.92, 0.975),
          spin: this.rand(-7, 7),
          rotation: this.rand(0, Math.PI * 2),
          changeIn: this.rand(0.03, 0.1),
          streak: this.rand(8, 22)
        });
      }

      this.trim(this.particles, this.options.maxParticles);
    }

    /** Returns particle angle and speed for a pattern. */
    particleMotion(pattern, index, count, baseAngle) {
      if (pattern === "ring") {
        return {
          angle: baseAngle + (Math.PI * 2 * index) / count + this.rand(-0.18, 0.18),
          speed: this.rand(340, 700)
        };
      }

      if (pattern === "cone") {
        return {
          angle: baseAngle + this.rand(-0.45, 0.45),
          speed: this.rand(380, 780)
        };
      }

      if (pattern === "cross") {
        const set = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
        return {
          angle: set[index % 4] + this.rand(-0.22, 0.22),
          speed: this.rand(400, 760)
        };
      }

      return {
        angle: this.rand(0, Math.PI * 2),
        speed: this.rand(this.options.minParticleSpeed, this.options.maxParticleSpeed)
      };
    }

    /** Updates one falling glyph. */
    updateDrop(drop, dt) {
      drop.y += drop.speed * dt;
      drop.angle += drop.rotation * dt * 60;
      drop.changeIn -= dt;

      if (drop.changeIn <= 0) {
        drop.char = this.randomChar();
        drop.changeIn = this.rand(0.04, 0.12);
      }

      if (drop.y >= drop.explodeY || drop.y >= this.height - drop.size * 0.5) {
        this.explode(drop.x, Math.min(drop.y, this.height - drop.size * 0.5), drop.size);
        return false;
      }

      return true;
    }

    /** Updates one explosion particle. */
    updateParticle(particle, dt) {
      particle.px = particle.x;
      particle.py = particle.y;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= Math.pow(particle.drag, dt * 60);
      particle.vy *= Math.pow(particle.drag, dt * 60);
      particle.rotation += particle.spin * dt * 0.05;
      particle.life -= dt;
      particle.alpha = Math.max(0, particle.life / particle.maxLife);
      particle.changeIn -= dt;

      if (particle.changeIn <= 0) {
        particle.char = this.randomChar();
        particle.changeIn = this.rand(0.03, 0.1);
      }

      return particle.life > 0;
    }

    /** Updates an array in place, compacting dead items. */
    compact(list, updater, dt) {
      let write = 0;

      for (let i = 0; i < list.length; i += 1) {
        if (updater.call(this, list[i], dt)) list[write++] = list[i];
      }

      list.length = write;
    }

    /** Clears the canvas for this frame. */
    clear() {
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /** Draws one falling glyph. */
    drawDrop(drop) {
      const ctx = this.ctx;
      const color = this.mainColor();

      ctx.save();
      ctx.translate(drop.x, drop.y);
      ctx.rotate(drop.angle);
      ctx.font = String(this.options.fontWeight || 700) + " " + drop.size + "px " + this.fontFamilyCache;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;

      if (this.options.glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = this.options.dropShadowBlur;
      }

      ctx.fillText(drop.char, 0, 0);
      ctx.restore();
    }

    /** Draws one explosion particle. */
    drawParticle(p) {
      const ctx = this.ctx;
      const dx = p.x - p.px;
      const dy = p.y - p.py;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(1, p.size * 0.08);

      if (this.options.glow) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = this.options.particleShadowBlur;
      }

      ctx.beginPath();
      ctx.moveTo(p.x - (dx / len) * p.streak, p.y - (dy / len) * p.streak);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = String(this.options.fontWeight || 700) + " " + p.size + "px " + this.fontFamilyCache;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = p.color;
      ctx.fillText(p.char, 0, 0);
      ctx.restore();
    }

    /** Spawns falling glyphs on the configured schedule. */
    updateSpawning(dt) {
      if (!this.startedSpawning) {
        this.delayRemaining -= dt;

        if (this.delayRemaining <= 0) {
          this.startedSpawning = true;
          this.spawnElapsed = 0;
          if (this.options.immediateStart) this.spawnDrop();
        }

        return;
      }

      this.spawnElapsed += dt;

      if (this.spawnElapsed >= this.options.intervalSeconds) {
        this.spawnElapsed -= this.options.intervalSeconds;
        this.spawnDrop();
      }
    }

    /** Main RAF loop. */
    loop(timestamp) {
      if (!this.running || this.disposed) return;

      if (this.options.pauseWhenHidden && document.hidden) {
        this.rafId = 0;
        this.lastTime = 0;
        return;
      }

      if (!this.lastTime) this.lastTime = timestamp;

      const dt = Math.min(this.options.maxFrameDelta, (timestamp - this.lastTime) / 1000);
      this.lastTime = timestamp;

      this.clear();
      this.updateSpawning(dt);
      this.updatePendingBursts(dt);
      this.compact(this.drops, this.updateDrop, dt);
      this.compact(this.particles, this.updateParticle, dt);

      for (let i = 0; i < this.drops.length; i += 1) this.drawDrop(this.drops[i]);
      for (let i = 0; i < this.particles.length; i += 1) this.drawParticle(this.particles[i]);

      this.rafId = window.requestAnimationFrame(this.loop);
    }

    /** Starts this instance. */
    start() {
      if (this.running || this.disposed) return;

      this.running = true;
      this.lastTime = 0;
      this.spawnElapsed = 0;
      this.delayRemaining = Math.max(0, toNumber(this.options.startDelaySeconds, 0));
      this.startedSpawning = this.delayRemaining <= 0;

      if (this.startedSpawning && this.options.immediateStart) this.spawnDrop();

      this.rafId = window.requestAnimationFrame(this.loop);
    }

    /** Destroys this instance and removes canvas. */
    destroy() {
      this.running = false;
      this.disposed = true;

      if (this.rafId) window.cancelAnimationFrame(this.rafId);
      window.clearTimeout(this.resizeTimer);
      window.removeEventListener("resize", this.handleResize);
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);

      if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);

      this.canvas = null;
      this.ctx = null;
      this.drops = [];
      this.particles = [];
      this.pendingBursts = [];
    }

    /** Updates live config. */
    updateConfig(nextConfig) {
      if (this.disposed) return this.getConfig();

      this.options = runtimeConfig(mergeNested(this.options, nextConfig || {}));

      if (Object.prototype.hasOwnProperty.call(nextConfig || {}, "text") || Object.prototype.hasOwnProperty.call(nextConfig || {}, "fallbackText")) {
        this.chars = this.normalizeChars(this.options.text, this.options.fallbackText);
      }

      this.resizeNow();
      this.trimAll();
      return this.getConfig();
    }

    /** Returns current instance config. */
    getConfig() {
      return mergeNested({}, this.options);
    }
  }

  /** Returns whether an instance or splash wait is active. */
  function active() {
    return Boolean(instance || waitTimer);
  }

  /** Destroys current instance. */
  function destroyInstance() {
    if (instance) instance.destroy();
    instance = null;
  }

  /** Starts immediately. */
  function startNow(config) {
    if (instance) return instance;

    manuallyStopped = false;
    clearWaitTimer();
    activeConfig = mergeNested(activeConfig, config || {});

    if (shouldReduceMotion(activeConfig)) {
      destroyInstance();
      return null;
    }

    instance = new MatrixLetterBombEffect(activeConfig);
    instance.start();
    return instance;
  }

  /** Checks whether splash layers are gone. */
  function splashGone() {
    return !document.getElementById(activeConfig.splashFaceLayerId) && !document.getElementById(activeConfig.splashFlashLayerId);
  }

  /** Waits for splash layers before starting. */
  function waitThenStart(config) {
    if (active()) return instance;

    manuallyStopped = false;
    clearWaitTimer();
    activeConfig = mergeNested(activeConfig, config || {});

    if (shouldReduceMotion(activeConfig)) return null;

    const startedAt = Date.now();
    const timeout = Math.max(0, toNumber(activeConfig.splashWaitTimeoutMs, 6000));
    const poll = Math.max(16, toNumber(activeConfig.splashPollMs, 80));

    function check() {
      if (manuallyStopped) return;

      if (splashGone() || Date.now() - startedAt >= timeout) {
        waitTimer = 0;
        startNow();
        return;
      }

      waitTimer = window.setTimeout(check, poll);
    }

    check();
    return null;
  }

  /** Starts the effect. */
  function start(config) {
    if (active()) return instance;
    activeConfig = mergeNested(activeConfig, config || {});
    return activeConfig.waitForSplash ? waitThenStart() : startNow();
  }

  /** Stops the effect. */
  function stopNow() {
    manuallyStopped = true;
    clearWaitTimer();
    destroyInstance();
    return null;
  }

  /** Toggles the effect. */
  function toggle(force, config) {
    if (config && typeof config === "object") activeConfig = mergeNested(activeConfig, config);

    const shouldStart = typeof force === "boolean" ? force : !active();

    if (shouldStart && active()) return instance;
    if (!shouldStart && !active()) return null;

    return shouldStart ? start() : stopNow();
  }

  /** Updates global and live config. */
  function updateConfig(config) {
    activeConfig = mergeNested(activeConfig, config || {});
    if (instance) instance.updateConfig(activeConfig);
    return getConfig();
  }

  /** Returns current config. */
  function getConfig() {
    return mergeNested({}, activeConfig);
  }

  window.MatrixLetterRain = {
    start: start,
    toggle: toggle,
    updateConfig: updateConfig,
    getConfig: getConfig
  };

  /** Auto-start entry. */
  function boot() {
    if (activeConfig.autoStart) start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})(window, document);
