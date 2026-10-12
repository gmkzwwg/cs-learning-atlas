/*!
 * hacked-splash.js
 *
 * Introduction:
 *   Renders two independent effects:
 *   1. ASCII face splash on canvas.
 *   2. Floating flash words with special final disappearance.
 *
 * Usage:
 *   Include this script after the optional critical layer:
 *
 *   <div id="hacked-face-layer" aria-hidden="true"></div>
 *
 * Global API:
 *   window.HackedSplash.start(config?)
 *   window.HackedSplash.startFace(config?)
 *   window.HackedSplash.startFlash(config?)
 *   window.HackedSplash.stop()
 *   window.HackedSplash.destroy()
 *   window.HackedSplash.updateConfig(config)
 *   window.HackedSplash.getConfig()
 *
 * Notes:
 *   No <pre> fallback.
 *   No Android animation-scale probing.
 *   Face and flash are independent modules.
 *   Critical cleanup is timer-based, not animation-event-based.
 */

(function (window, document) {
  "use strict";

  if (!window || !document) return;

  const FACE_LIBRARY = [
    [
      "                                                                                ",
      "                -:-                           :-:                           -:- ",
      "                :::                     ..    :::                           ::: ",
      "                                    .---+=--:                                   ",
      "                                  :-==++++=+::::.                               ",
      "                                .=++***+++++-:...                               ",
      "                               :=+*##+***+#*+-::                                ",
      "                              :+*+***++==+**=-::....                            ",
      "                              =+***+++++=+**+-::.-::                            ",
      " :=:                         =*@@@#**++*#+++*=::-:           :=:                ",
      " -::            .            %#@@%**#%#%%%%%@#*=:.  .        -::            .   ",
      "                            *=*@@@@%+**+*+++*++%#-.                             ",
      "                           +*%%@#%#**%#++++=+*+***+                             ",
      "                          .#@######+-.         :++*+                            ",
      "                          #@**+#=            .. .=+*-                           ",
      "                         -#**-              .::-. -*+:                          ",
      "                         =*:       .=:-....::   .  =+:                          ",
      "   .            --:      :+..    -      -.    -#+   +-.        .            --: ",
      "               .::-  -++***+-  .  -:   -#+. .=#+:   =:     ...             .::- ",
      "                  .=**#**#+#=-:.   -++=-**=*++-     :.     :::.                 ",
      "                 =###***+*##%=-     .++*=====:      +        .:::.              ",
      "                :*%#**=*=-=+=**-      +*++-+      .*:         :--:              ",
      "               .=*#*=++*+=-*-=.--:.            ::=:          .--:::             ",
      "              :+*###+++#+**#+=+=:-:  .      -=-:            . :..:::.           ",
      "              :=-++----+----=-+++*.       -.   :             :=  :-:.           ",
      "             .++=+*= .-+==+%+=+**# .... -:     +-       .    .:---::::        . ",
      " -:-.       :**=++=-  .--::-:-**#@.. ...-:    .%  . ..:..    *+*+-.::-          ",
      "           :=*+==-=-  .-:.:-:-==++ :.::.:=:-=--#   .:...     :=---:::-.         ",
      "          .==**+=--:   ..::-:-==++ :::::-+:==:-*  ..::=-:    .==--:::-:.        ",
      "         =++-=+==:-.   ..--=----== :::::-*--=:-#    .:  .   .--+=-:::=-.        ",
      "         -.=+++*=..      ::=.:=-+= -: .--*:-=::#.   .-.      :==--:::=-         ",
      "        :=+===*#=..      ::-.:===-:==-:--*--=::#.     .. .:..:--::::  -.        ",
      "       -::-:..:-:.       .:::%@@@@%@+: .:*--=:-#  ...-:       :-: .-=--::       ",
      "     .=+:-==**--::        .*@@@@+*@@: . -%:.: :#.   ..         -. . .::::.      ",
      "     ==+-*#*#%@@@%@##@@% =@@@@@+@@*%*:  -##..+@@@@#-.:    -==:-.:***+=-=-  .::- ",
      "     -++##***#%#@**%#%=+@@@@@*%@@= .=-. .-:@+:=@%*%%=#+=%%%#+=-++++*==+-:   ::  ",
      "     .=++*+*+--:-+**#*=@@@=.=#%-         :*= =+..#-=#:. :=++#-:..:. :::-.       ",
      "      .-++==-:::-++=+=.-=.  :---==++*%#%%%+ -+ .#.-+        ==    ..            ",
      "                 ..  ..    - .:..       :+     =  :         =.                  ",
      "                                                                                ",
      "                                                                                ",
      "                   .                                                           .",
      " -:-                          .:::                           -:-                ",
      "-++=-::::::::::---::::::::::::-++=-::::::::::--:::::::::::::-++=-::::::::::--:::",
      "#######%@####################################################%%%%%%%%%%%%%#%####",
      "#%%%%%%%%%%%%%##################################################################"
    ],
    [
      "                                 :+##########*-                                 ",
      "                            =#%%%%%%%%%%%%%%%%%%%%%*                            ",
      "                         *%%%%%%%%%%%%%%%%%%%%%%%%%%%%#                         ",
      "                      =%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#                       ",
      "                   :#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%+                     ",
      "                  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#                    ",
      "                -%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                   ",
      "               =%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#                  ",
      "              .%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                 ",
      "              %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#                ",
      "             -%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%=               ",
      "             #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#               ",
      "            .%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:              ",
      "            =%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*              ",
      "            +%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%              ",
      "            =%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%              ",
      "             %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%              ",
      "             #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%              ",
      "             :%%%%%# #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#*%%%:              ",
      "              %%%%#  #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -%%#               ",
      "              :%%- .#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%+ %%+               ",
      "               :+#%%%%%%+:. :+%%%%%%%%%%%%%%%%#-.      :+%%%%#==                ",
      "              %%%%%%%=           #%%%%%%%%%%#             .%%%%%#               ",
      "              %%%%%*              +%%%%%%%%%                %%%%*               ",
      "              -%%%+                %%%%%%%%#                *%%%=               ",
      "               %%%:                %%%%%%%%#                +%%%*               ",
      "               #%%+              =%%%%%%%%%%%*              #%%%%               ",
      "               %%%%*         .+%%%%%%%##%%%%%%%%+        :*%%%%%#               ",
      "              =%%%%%%*=--=*%%%%%%%%%%-.+ %%%%%%%%%%%%%%%%%%%%%%#                ",
      "              :%%%%%%%%%%%%%%%%%%%%%# :+ =%%%%%%%%%%%%%%%%%%%%*                 ",
      "               +%%%%%%%%%%%%%%%%%%%%  =#  #%%%%%%%%%%%%%%%%%%#                  ",
      "                 =#%%%%%%%%%%%%%%%%#  %%  =%%%%%%%%%%%%%%%%%%*                  ",
      "        +%*                =%%%%%%%%+:%%+-%%%%%%%%%+-+%%%%%%*       :##*%%*    ",
      "      %%%%%-               *%%%%%%%%%%%%%%%%%%%%%%%                #%%%%%%%     ",
      "     +%%%%%%+              %%%%%%%%%%%%%%%%%%%%%%%%:              +%%%%%%%%     ",
      "   #%%%%%%%%%%%#-          *%%%%%%%%%%%%%%%%%%%%%%%:           :*%%%%%%%%%%%%-  ",
      "   %%%%%%%%%%%%%%%%#=       -%%%%%%%%%%%%%%%%%#%*        :*%%%%%%%%%%%%%%%%%%#  ",
      "   %%%%%%%%%%%%%%%%%%%%%=      *%*=%%%*#%%#=%#       =%%%%%%%%%%%%%%%%%%%%%%%=  ",
      "   =#%%%%%%%%%%%%%%%%%%%%%%%+.                   +%%%%%%%%%%%%%#*+=:.           ",
      "               .=*#%%%%%%%%%%%%%*.          -#%%%%%%%%%#+-                      ",
      "                      =*%%%%%%%%%%%%#=.=#%%%%%%%%%%+.                           ",
      "                           =#%%%%%%%%%%%%%%%%%%+.                               ",
      "                           .*%%%%%%%%%%%%%%%%%%*-                                ",
      "                     .+%%%%%%%%%%%%%%#%%%%%%%%%%%%%%%%#=.                       ",
      "   .            =#%%%%%%%%%%%%%#+:       =*%%%%%%%%%%%%%%%%%%%+:          -     ",
      ":%%%%%+   :*%%%%%%%%%%%%%%#+.                 =*%%%%%%%%%%%%%%%%%%%%%%#%%%%%#.  ",
      "%%%%%%%%%%%%%%%%%%%%%#+                            +#%%%%%%%%%%%%%%%%%%%%%%%%*  ",
      "=%%%%%%%%%%%%%%%#=                                      =*#%%%%%%%%%%%%%%%%%%   ",
      "  #%%%%%%%%%%%                                                :*#%%%%%%%%%%%%=  ",
      "  #%%%%%%%%%#                                                      =#%%%%%%%%%%=",
      "  #%%%%%%%#.                                                          :#%%%%%%%#",
      "   *#%%%#:                                                               :#%%%# ",
      "                                                                                "
    ],
    [
      "             . :                                                  .             ",
      "            :  :                                                :  .            ",
      "           .   :                                                :  :            ",
      "           .                                                    .   .           ",
      "           .  .                                                 .   -           ",
      "          :   .:                                                :   ::          ",
      "          -    :                                                .   :=          ",
      "          -.   :                 .           :                  .   -=          ",
      "         .++:  :-                =:          -=                =. .-+*          ",
      "          +-    .                *=          =+                ..  :++:         ",
      "          ==    :=              .+-          ++:              -.  .:++          ",
      "          +*++-  ...           =+*:    -     :++.           :...:+++*+          ",
      "           ++===:-=-          .:.-            :.-.         .:: .-=+**.          ",
      "           +++++++=:.-         .-             ::. .       :  .-=+=+*+           ",
      "           :++===..:+=.          ..:... .:.::.           :.=+.:.-***:           ",
      "            .**+***+= ==:    ...   .-.. .:-:. ...:.    . -===+*****             ",
      "             .+***++==++= .. .....   ::.-:.   ::.::.:.:= :==+=**#*.             ",
      "              +#****+=-.:- ---=::     ..-:    :.-=--=  : ..-*****=              ",
      "              :+**#**#=**--==-.+.     : =-      = ::+.-**=*####*+-              ",
      "                :*##*****=+:.... ...  = :=  ..  .   :==***####*=                ",
      "    :    .       -*#####*##*+    :=     :.   =    -+*##+*#*##*+       :    :    ",
      "    =.      -:----=+**###+..:+:. -     :=     =.:-+-.:*###**+:==+===:      =    ",
      "    :=       :-=*+.:-*##*=+- .==-:  :  .=  =  =-++. =**###=-..**++-       =:    ",
      "     +-      .=+=+::-=**+=++: .+*=:   ==+-  .=**+..=*++**+--.:*+*+:      -+:    ",
      "     =+:        ++=+--+++= =+=+:-+: ::+=*+:-:-+==*++*:++*+==+=++  .     :++     ",
      "     .+=         ++- :=-=+=---=+= :.  ==+-: :- +*+==:++:==- -++       . -*:     ",
      "      .+=. .     -#+ .:-.:+=. .++-++=-*=*+-++==++ .-++:.-- .+#=     -::=+-      ",
      "       .*+=:..---+**: ::=. =:+: .+: :.-=+--.:=+: -+-+ .---.=#*+=+++=+++*=       ",
      "        .**++==+*+==:++=: ::   -  ==: :++- -=- -:  .=:.-+*=:*+*********:        ",
      "          :==++*+=-.=#####+ .   ..=. =*+#*: .= :   :.*#####-==*****++-          ",
      "            *+====.:####%%%#+        ==:++-   .   -#%%%%###*-:*+++**            ",
      "             .-:=+ =####%%%%%#=   .-=+*###+-=    #%%%%%%####- #++:              ",
      "                -+ =+.*#%%%%%%%#*****#= .-#*+**##%%%%%%%%*-*-=*-                ",
      "                  :++-#%%%%%%%%%%%###*= .*####%%%%%%%%%%#+=+*..                 ",
      "                 =+=:=-####%#%%%%%##*++=#***##%%%%%#%##%#==-+++                 ",
      "               :-==:.--.*######%#*+***%%%#+**+*#%%%####+.-=:-==-:               ",
      "                -=-:-:  .:-   :+++=+*%%#%%%++++++-  :=-   -=-===                ",
      "                .**++*+=-=+*+- .+*=+#%%#%%%#++#+.:=***+=+**+*#*                 ",
      "                   =**######**=*+***%%%*%%%%****#+*########*-                   ",
      "                   :*#**###*+*=+=+**###=*####**=*+#*#####*#*-                   ",
      "                      ++#%%%*-==:.==:-+*++=:++ .+*-#%%%#+-                      ",
      "                       -*#%%#+-=..=:**+##**+.= -==*%%%%*-                       ",
      "                        *#%%%#++- +=  ++*= .=+ +=##%%%*+                        ",
      "                        .*###= . =++:--=-=+ *++   #%%#*                         ",
      "                         ++*#= . *+  =.==    += :-+#*++                         ",
      "                         +*=*==+.*-    :     =*:++**=++                         ",
      "                        =##+**::-#%##*+#++**#%*::-***##:                        ",
      "                           *-*+   -.=#####** -   +*=+                           ",
      "                            =#+=-==.   = . : +-==*#*                            ",
      "                            +*#**#*#*+++*++##*#**#+:                            ",
      "                            -.++*##############+*=..                            ",
      "                              =*+*############*+*+                              ",
      "                               -*#***#***##**###.                               ",
      "                                %#.:.+**#*-.-.#%                                ",
      "                                .  .*******#:  .                                ",
      "                                   -  *##* ..                                   ",
      "                                       *=                                       ",
      "                                                                                ",
      "                                                                                "
    ]
  ];

  const DEFAULT_CONFIG = {
    autoStart: true,
    injectStyle: true,
    styleId: "hacked-splash-style",
    createLayers: true,
    layerParent: "body",
    removeLayersOnFinish: true,

    dprMax: 2,
    mobileDprMax: 1.25,
    canvasPixelMax: 2500000,

    face: {
      enabled: true,
      layerId: "hacked-face-layer",
      canvasId: "hacked-splash-canvas",

      zIndex: 999998,
      duration: 1000,
      fadeDuration: 500,
      fadeSteps: 18,

      dissolveStartRatio: 0.42,
      dissolveEndRatio: 0.92,

      mobileBreakpoint: 800,
      mobileCellScale: 0.7,
      cellMin: 12,
      cellMinMobile: 8,
      cellMax: 25,
      targetGridWidth: 155,
      targetGridHeight: 82,
      minCols: 52,
      minRows: 30,

      backgroundColor: "#000",
      faceBaseColor: "rgba(245,255,245,",
      faceNoiseColor: "rgba(110,255,150,",
      backgroundNoiseColor: "rgba(30,170,70,",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace"
    },

    flash: {
      enabled: true,
      layerId: "hacked-flash-layer",
      zIndex: 999999,

      startDelay: 0,
      spawnDuration: 600,
      holdDuration: 200,
      regularDecayDuration: 1000,

      count: null,
      densityDivisor: 9800,
      minCount: 32,
      maxCount: 220,

      spawnIntervalMin: 28,
      spawnIntervalMax: 56,
      batchMin: 3,
      batchMax: 6,

      outMin: 260,
      outMax: 460,

      finalCountMin: 1,
      finalCountMax: 2,
      finalDurationMin: 2000,
      finalDurationMax: 3000,
      finalBlinkMin: 6,
      finalBlinkMax: 12,
      finalHideMin: 80,
      finalHideMax: 260,
      finalShowMin: 90,
      finalShowMax: 320,
      finalReskinChance: 0.5,
      finalSwitchMin: 1,
      finalSwitchMax: 5,

      mobileBreakpoint: 800,
      mobileScale: 0.7,

      largeChance: 0.06,
      mediumChance: 0.22,

      smallRatioMin: 0.01,
      smallRatioMax: 0.03,
      mediumRatioMin: 0.03,
      mediumRatioMax: 0.04,
      largeRatioMin: 0.06,
      largeRatioMax: 0.08,

      smallClampMin: 14,
      smallClampMax: 22,
      mediumClampMin: 20,
      mediumClampMax: 32,
      largeClampMin: 32,
      largeClampMax: 46,

      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
      deriveGlowFromColor: true,
      glowAlpha: 0.98,

      words: [
        { text: "[ALERT] INJECTION DETECTED", color: "#0fca1c", glow: "rgba(15,202,28,0.98)" },
        { text: "[CRITICAL] CORE DUMPED", color: "#E71D36", glow: "rgba(231,29,54,0.98)" },
        { text: "[WARNING] MEMORY RUPTURED", color: "#f8ca00", glow: "rgba(248,202,0,0.98)" },
        { text: "[BREACH] CONTROL LOST", color: "#d2cccc", glow: "rgba(210,204,204,0.98)" },
        { text: "[FAULT] SESSION SEIZED", color: "#E71D36", glow: "rgba(231,29,54,0.98)" },
        { text: "[SYS] ROOT PERMISSION TAKEN", color: "#0fca1c", glow: "rgba(15,202,28,0.98)" }
      ]
    }
  };

  const ASCII_PALETTE = Array.from({ length: 94 }, function (_, index) {
    return String.fromCharCode(index + 33);
  });

  let config = normalizeConfig(merge({}, DEFAULT_CONFIG, getPreloadConfig()));

  const faceState = {
    running: false,
    ending: false,
    layer: null,
    canvas: null,
    ctx: null,
    raf: 0,
    timers: [],
    startedAt: 0,
    lastFrameAt: 0,
    width: 0,
    height: 0,
    dpr: 1,
    cellW: 10,
    cellH: 14,
    cols: 0,
    rows: 0,
    cells: []
  };

  const flashState = {
    running: false,
    layer: null,
    timers: [],
    spawnTimer: 0,
    startedAt: 0,
    decayStarted: false,
    activeWords: []
  };

  let destroyed = false;

  if (window.HackedSplash && typeof window.HackedSplash.destroy === "function") {
    try {
      window.HackedSplash.destroy();
    } catch (error) {
      reportError("previous instance destroy failed", error);
    }
  }

  function reportError(message, error) {
    if (window.console && window.console.error) {
      window.console.error("[HackedSplash] " + message, error);
    }
  }

  function merge() {
    const output = {};

    Array.prototype.slice.call(arguments).forEach(function (source) {
      Object.keys(source || {}).forEach(function (key) {
        const value = source[key];
        const current = output[key];

        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          current &&
          typeof current === "object" &&
          !Array.isArray(current)
        ) {
          output[key] = merge(current, value);
        } else if (Array.isArray(value)) {
          output[key] = value.slice();
        } else if (value && typeof value === "object") {
          output[key] = merge({}, value);
        } else {
          output[key] = value;
        }
      });
    });

    return output;
  }

  function normalizeConfig(nextConfig) {
    const normalized = merge({}, nextConfig || {});
    const flash = normalized.flash || {};
    const words = Array.isArray(flash.words) ? flash.words : [];
    const alpha = Number.isFinite(Number(flash.glowAlpha)) ? Number(flash.glowAlpha) : 0.98;

    flash.words = words.map(function (word) {
      const nextWord = merge({}, word || {});
      const color = nextWord.color || "#ffffff";

      if (flash.deriveGlowFromColor || !nextWord.glow) {
        nextWord.glow = colorToGlow(color, alpha);
      }

      return nextWord;
    });

    normalized.flash = flash;
    return normalized;
  }

  function getPreloadConfig() {
    return window.HackedSplashConfig || window.hackedSplashConfig || {};
  }

  function now() {
    return window.performance && typeof window.performance.now === "function"
      ? window.performance.now()
      : Date.now();
  }

  function requestFrame(callback) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(callback);
    }

    return window.setTimeout(function () {
      callback(now());
    }, 16);
  }

  function cancelFrame(id) {
    if (!id) return;

    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(id);
    } else {
      window.clearTimeout(id);
    }
  }

  function setTimer(state, callback, delay) {
    const id = window.setTimeout(function () {
      removeTimer(state, id);
      callback();
    }, Math.max(0, Number(delay) || 0));

    state.timers.push(id);
    return id;
  }

  function removeTimer(state, id) {
    const index = state.timers.indexOf(id);

    if (index !== -1) {
      state.timers.splice(index, 1);
    }
  }

  function clearTimers(state) {
    state.timers.forEach(function (id) {
      window.clearTimeout(id);
    });

    state.timers = [];
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sample(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function shuffle(array) {
    const copy = array.slice();

    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];

      copy[i] = copy[j];
      copy[j] = temp;
    }

    return copy;
  }

  function randomAscii() {
    return ASCII_PALETTE[Math.floor(Math.random() * ASCII_PALETTE.length)];
  }

  function hexToRgb(color) {
    let value = String(color || "").trim();

    if (value.charAt(0) === "#") {
      value = value.slice(1);
    }

    if (value.length === 3) {
      value = value.split("").map(function (char) {
        return char + char;
      }).join("");
    }

    if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;

    const number = parseInt(value, 16);

    return {
      r: (number >> 16) & 255,
      g: (number >> 8) & 255,
      b: number & 255
    };
  }

  function colorToGlow(color, alpha) {
    const rgb = hexToRgb(color);

    if (!rgb) {
      return color || "rgba(255,255,255," + alpha + ")";
    }

    return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + alpha + ")";
  }

  function getParent() {
    const parent = config.layerParent;

    if (parent && parent.nodeType === 1) return parent;

    if (typeof parent === "string" && parent !== "body") {
      return document.querySelector(parent) || document.body || document.documentElement;
    }

    return document.body || document.documentElement;
  }

  function getOrCreateElement(tagName, id) {
    let element = document.getElementById(id);

    if (element) return element;
    if (!config.createLayers) return null;

    element = document.createElement(tagName);
    element.id = id;
    element.setAttribute("aria-hidden", "true");
    getParent().appendChild(element);

    return element;
  }

  function hideOrRemove(element, remove) {
    if (!element) return;

    if (remove && element.isConnected) {
      element.remove();
      return;
    }

    element.style.opacity = "0";
    element.style.visibility = "hidden";
    element.style.pointerEvents = "none";
  }

  function fadeOutThenRemove(state, element, duration, steps, onFinish) {
    const total = Math.max(0, Number(duration) || 0);
    const totalSteps = Math.max(1, Math.floor(Number(steps) || 18));
    const interval = total / totalSteps;
    let currentStep = 0;

    if (!element || !element.isConnected) {
      if (onFinish) onFinish();
      return;
    }

    element.style.opacity = "1";
    element.style.visibility = "visible";
    element.style.pointerEvents = "none";

    if (total <= 0) {
      element.remove();
      if (onFinish) onFinish();
      return;
    }

    function tick() {
      if (!element.isConnected) {
        if (onFinish) onFinish();
        return;
      }

      currentStep += 1;

      const progress = clamp(currentStep / totalSteps, 0, 1);
      element.style.opacity = String(1 - progress);

      if (progress >= 1) {
        if (element.isConnected) {
          element.remove();
        }

        if (onFinish) onFinish();
        return;
      }

      setTimer(state, tick, interval);
    }

    setTimer(state, tick, interval);

    setTimer(state, function () {
      if (element && element.isConnected) {
        element.remove();
      }

      if (onFinish) onFinish();
    }, total + 120);
  }

  function injectStyle() {
    if (!config.injectStyle) return;

    let style = document.getElementById(config.styleId);

    if (!style) {
      style = document.createElement("style");
      style.id = config.styleId;
      document.head.appendChild(style);
    }

    style.textContent = [
      "#" + config.face.layerId + " {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: " + config.face.zIndex + ";",
      "  display: block;",
      "  overflow: hidden;",
      "  pointer-events: none;",
      "  background: " + config.face.backgroundColor + ";",
      "  opacity: 1;",
      "  visibility: visible;",
      "}",
      "#" + config.face.canvasId + " {",
      "  position: absolute;",
      "  inset: 0;",
      "  width: 100%;",
      "  height: 100%;",
      "  display: block;",
      "}",
      "#" + config.flash.layerId + " {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: " + config.flash.zIndex + ";",
      "  display: block;",
      "  overflow: hidden;",
      "  pointer-events: none;",
      "}",
      ".hacked-splash__word {",
      "  position: absolute;",
      "  left: var(--x);",
      "  top: var(--y);",
      "  transform: translate(-50%, -50%) rotate(var(--r)) scale(var(--s));",
      "  transform-origin: center;",
      "  font-family: " + config.flash.fontFamily + ";",
      "  font-size: var(--size);",
      "  font-weight: 900;",
      "  line-height: 1;",
      "  letter-spacing: 0.08em;",
      "  text-transform: uppercase;",
      "  white-space: nowrap;",
      "  padding: 0.1em 0.4em;",
      "  border: 1px solid currentColor;",
      "  background: rgba(0, 0, 0, 0.22);",
      "  color: var(--color);",
      "  text-shadow: 0 0 0.4em var(--glow), 0 0 1.2em var(--glow);",
      "  box-shadow: 0 0 0.5em var(--glow), inset 0 0 0.5em rgba(255,255,255,0.04);",
      "  opacity: 1;",
      "  visibility: visible;",
      "  pointer-events: none;",
      "  user-select: none;",
      "  will-change: opacity, transform;",
      "  transition: opacity var(--outdur) ease, transform var(--outdur) ease;",
      "}",
      ".hacked-splash__word.is-decaying {",
      "  opacity: 0;",
      "}"
    ].join("\n");
  }

  function pickFaceLines() {
    if (!FACE_LIBRARY.length) return [""];

    const raw = sample(FACE_LIBRARY);
    const width = Math.max.apply(null, raw.map(function (line) {
      return line.length;
    }));

    return raw.map(function (line) {
      return line.padEnd(width, " ");
    });
  }

  function setupFace() {
    const face = faceState;

    face.layer = getOrCreateElement("div", config.face.layerId);
    if (!face.layer) return false;

    face.layer.textContent = "";

    face.canvas = document.createElement("canvas");
    face.canvas.id = config.face.canvasId;
    face.layer.appendChild(face.canvas);

    try {
      face.ctx = face.canvas.getContext("2d", { alpha: false });
    } catch (error) {
      face.ctx = face.canvas.getContext("2d");
    }

    return Boolean(face.ctx);
  }

  function resizeFace() {
    const face = faceState;
    const faceConfig = config.face;
    const width = window.innerWidth || document.documentElement.clientWidth || 1024;
    const height = window.innerHeight || document.documentElement.clientHeight || 768;
    const viewportDpr = window.devicePixelRatio || 1;
    const mobileCap = width < faceConfig.mobileBreakpoint ? config.mobileDprMax : config.dprMax;
    const pixelMax = Math.max(1, Number(config.canvasPixelMax) || 2500000);
    const areaDpr = Math.sqrt(pixelMax / Math.max(1, width * height));
    const dpr = Math.max(1, Math.min(viewportDpr, mobileCap, areaDpr));
    const scale = width < faceConfig.mobileBreakpoint ? faceConfig.mobileCellScale : 1;
    const minCell = width < faceConfig.mobileBreakpoint ? faceConfig.cellMinMobile : faceConfig.cellMin;

    face.width = width;
    face.height = height;
    face.dpr = dpr;

    face.canvas.width = Math.ceil(width * dpr);
    face.canvas.height = Math.ceil(height * dpr);
    face.canvas.style.width = width + "px";
    face.canvas.style.height = height + "px";

    face.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    face.ctx.textAlign = "left";
    face.ctx.textBaseline = "top";

    face.cellW = clamp(
      Math.min(width / faceConfig.targetGridWidth, height / faceConfig.targetGridHeight) * scale,
      minCell,
      faceConfig.cellMax
    );

    face.cellH = face.cellW * 1.4;
    face.cols = Math.max(faceConfig.minCols, Math.floor(width / face.cellW));
    face.rows = Math.max(faceConfig.minRows, Math.floor(height / face.cellH));

    buildFaceCells();
  }

  function buildFaceCells() {
    const face = faceState;
    const lines = pickFaceLines();
    const faceH = lines.length;
    const faceW = lines[0] ? lines[0].length : 0;
    const offsetX = Math.floor((face.cols - faceW) / 2);
    const offsetY = Math.floor((face.rows - faceH) / 2);

    face.cells = [];

    for (let y = 0; y < face.rows; y += 1) {
      for (let x = 0; x < face.cols; x += 1) {
        face.cells.push({
          x: x,
          y: y,
          face: false,
          base: " ",
          char: randomAscii(),
          gone: false,
          nextFlip: rand(0, 80)
        });
      }
    }

    for (let fy = 0; fy < faceH; fy += 1) {
      for (let fx = 0; fx < faceW; fx += 1) {
        const char = lines[fy][fx];
        const x = offsetX + fx;
        const y = offsetY + fy;

        if (char === " ") continue;
        if (x < 0 || y < 0 || x >= face.cols || y >= face.rows) continue;

        const cell = face.cells[y * face.cols + x];

        cell.face = true;
        cell.base = char;
        cell.char = Math.random() < 0.78 ? char : randomAscii();
        cell.gone = false;
        cell.nextFlip = rand(0, 24);
      }
    }
  }

  function updateFace(elapsed, delta) {
    const face = faceState;
    const faceConfig = config.face;
    const dissolveStart = faceConfig.duration * faceConfig.dissolveStartRatio;
    const dissolveEnd = faceConfig.duration * faceConfig.dissolveEndRatio;
    const dissolve = elapsed <= dissolveStart
      ? 0
      : clamp((elapsed - dissolveStart) / Math.max(1, dissolveEnd - dissolveStart), 0, 1);
    const frameFactor = clamp(delta / 16.67, 0.35, 2.25);

    face.cells.forEach(function (cell) {
      if (cell.gone) return;

      if (elapsed >= cell.nextFlip) {
        if (cell.face) {
          cell.char = elapsed < 170
            ? randomAscii()
            : Math.random() < 0.66 ? cell.base : randomAscii();
          cell.nextFlip += rand(18, 64);
        } else {
          cell.char = randomAscii();
          cell.nextFlip += rand(50, 150);
        }
      }

      if (dissolve > 0) {
        const chance = cell.face
          ? (0.0035 + dissolve * 0.064) * frameFactor
          : (0.0007 + dissolve * 0.011) * frameFactor;

        if (Math.random() < chance) {
          cell.gone = true;
        }
      }
    });
  }

  function drawFace() {
    const face = faceState;
    const faceConfig = config.face;
    const ctx = face.ctx;

    if (!ctx) return;

    ctx.clearRect(0, 0, face.width, face.height);
    ctx.fillStyle = faceConfig.backgroundColor;
    ctx.fillRect(0, 0, face.width, face.height);
    ctx.font = "700 " + face.cellW + "px " + faceConfig.fontFamily;

    face.cells.forEach(function (cell) {
      if (cell.gone) return;

      const x = cell.x * face.cellW;
      const y = cell.y * face.cellH;

      if (cell.face) {
        const isBase = cell.char === cell.base;
        const alpha = isBase ? rand(0.88, 1) : rand(0.52, 0.82);

        ctx.fillStyle = (isBase ? faceConfig.faceBaseColor : faceConfig.faceNoiseColor) + alpha + ")";
      } else {
        ctx.fillStyle = faceConfig.backgroundNoiseColor + rand(0.05, 0.16) + ")";
      }

      ctx.fillText(cell.char, x, y);
    });
  }

  function tickFace(time) {
    const face = faceState;

    if (!face.running || face.ending || destroyed) return;

    if (!face.startedAt) {
      face.startedAt = time;
      face.lastFrameAt = time;
    }

    const elapsed = time - face.startedAt;
    const delta = face.lastFrameAt ? time - face.lastFrameAt : 16.67;

    face.lastFrameAt = time;

    updateFace(elapsed, delta);
    drawFace();

    if (elapsed < config.face.duration) {
      face.raf = requestFrame(tickFace);
    } else {
      endFace();
    }
  }

  function endFace() {
    const face = faceState;

    if (!face.running || face.ending) return;

    face.ending = true;
    face.running = false;

    cancelFrame(face.raf);
    face.raf = 0;

    window.removeEventListener("resize", handleFaceResize);
    window.removeEventListener("orientationchange", handleFaceResize);

    fadeOutThenRemove(
      face,
      face.layer,
      config.face.fadeDuration,
      config.face.fadeSteps,
      resetFaceState
    );
  }

  function handleFaceResize() {
    const face = faceState;

    window.clearTimeout(face.resizeTimer);

    face.resizeTimer = window.setTimeout(function () {
      if (!face.running || !face.canvas || !face.ctx) return;

      resizeFace();
      drawFace();
    }, 80);
  }

  function resetFaceState() {
    clearTimers(faceState);
    cancelFrame(faceState.raf);
    window.clearTimeout(faceState.resizeTimer);

    faceState.running = false;
    faceState.ending = false;
    faceState.layer = null;
    faceState.canvas = null;
    faceState.ctx = null;
    faceState.raf = 0;
    faceState.startedAt = 0;
    faceState.lastFrameAt = 0;
    faceState.width = 0;
    faceState.height = 0;
    faceState.cells = [];
  }

  function startFace(nextConfig) {
    if (nextConfig) {
      updateConfig(nextConfig);
    }

    stopFace(true);

    if (!config.face.enabled) return getConfig();

    injectStyle();

    if (!setupFace()) {
      stopFace(true);
      return getConfig();
    }

    try {
      resizeFace();
      drawFace();
    } catch (error) {
      reportError("face setup failed", error);
      stopFace(true);
      return getConfig();
    }

    destroyed = false;
    faceState.running = true;
    faceState.ending = false;
    faceState.startedAt = 0;
    faceState.lastFrameAt = 0;

    window.addEventListener("resize", handleFaceResize, { passive: true });
    window.addEventListener("orientationchange", handleFaceResize, { passive: true });

    faceState.raf = requestFrame(tickFace);

    return getConfig();
  }

  function stopFace(remove) {
    const shouldRemove = remove !== false;
    const layer = faceState.layer || document.getElementById(config.face.layerId);

    clearTimers(faceState);
    cancelFrame(faceState.raf);
    window.clearTimeout(faceState.resizeTimer);

    window.removeEventListener("resize", handleFaceResize);
    window.removeEventListener("orientationchange", handleFaceResize);

    hideOrRemove(layer, shouldRemove);
    resetFaceState();

    return getConfig();
  }

  function setupFlash() {
    flashState.layer = getOrCreateElement("div", config.flash.layerId);
    if (!flashState.layer) return false;

    flashState.layer.textContent = "";
    flashState.layer.setAttribute("aria-hidden", "true");

    return true;
  }

  function getFlashLimit() {
    const fixed = config.flash.count;

    if (fixed !== null && fixed !== undefined && fixed !== "") {
      const value = Number(fixed);

      if (Number.isFinite(value) && value >= 0) {
        return Math.floor(clamp(value, 0, config.flash.maxCount));
      }
    }

    const width = window.innerWidth || document.documentElement.clientWidth || 1024;
    const height = window.innerHeight || document.documentElement.clientHeight || 768;
    const limit = Math.floor((width * height) / config.flash.densityDivisor);

    return Math.min(config.flash.maxCount, Math.max(config.flash.minCount, limit));
  }

  function getFlashScale() {
    const width = window.innerWidth || document.documentElement.clientWidth || 1024;

    return width < config.flash.mobileBreakpoint ? config.flash.mobileScale : 1;
  }

  function pickFlashWord() {
    const words = Array.isArray(config.flash.words) && config.flash.words.length
      ? config.flash.words
      : DEFAULT_CONFIG.flash.words;

    return sample(words);
  }

  function decorateFlashText(text) {
    return sample([
      "//// " + text + " ////",
      "//// " + text + " :: " + randInt(0, 9999).toString(16).toUpperCase() + " ////",
      "//// " + text + " :: 0x" + randInt(0, 65535).toString(16).toUpperCase() + " ////",
      "//// " + text + " :: /SYS/CORE ////",
      "//// " + text + " :: PROC-FAIL ////"
    ]);
  }

  function applyFlashStyle(element, word) {
    const picked = word || pickFlashWord();
    const color = picked.color || "#ffffff";
    const glow = picked.glow || colorToGlow(color, config.flash.glowAlpha || 0.98);

    element.textContent = decorateFlashText(picked.text || "[SYS] SIGNAL LOST");
    element.style.setProperty("--color", color);
    element.style.setProperty("--glow", glow);
  }

  function createFlashWord() {
    const flash = flashState;
    const flashConfig = config.flash;

    if (!flash.running || !flash.layer || !flash.layer.isConnected) return null;
    if (flash.decayStarted) return null;
    if (flash.activeWords.length >= getFlashLimit()) return null;

    const width = window.innerWidth || document.documentElement.clientWidth || 1024;
    const scale = getFlashScale();
    const large = Math.random() < flashConfig.largeChance;
    const medium = !large && Math.random() < flashConfig.mediumChance;
    const element = document.createElement("span");
    let size;

    if (large) {
      size = clamp(width * rand(flashConfig.largeRatioMin, flashConfig.largeRatioMax) * scale, flashConfig.largeClampMin, flashConfig.largeClampMax);
    } else if (medium) {
      size = clamp(width * rand(flashConfig.mediumRatioMin, flashConfig.mediumRatioMax) * scale, flashConfig.mediumClampMin, flashConfig.mediumClampMax);
    } else {
      size = clamp(width * rand(flashConfig.smallRatioMin, flashConfig.smallRatioMax) * scale, flashConfig.smallClampMin, flashConfig.smallClampMax);
    }

    element.className = "hacked-splash__word";
    element.style.setProperty("--x", rand(1, 99) + "%");
    element.style.setProperty("--y", rand(2, 98) + "%");
    element.style.setProperty("--r", rand(-20, 20) + "deg");
    element.style.setProperty("--s", String(rand(0.55, 0.95)));
    element.style.setProperty("--size", size + "px");
    element.style.setProperty("--outdur", rand(flashConfig.outMin, flashConfig.outMax) + "ms");

    applyFlashStyle(element);
    flash.activeWords.push(element);

    return element;
  }

  function addFlashBatch() {
    const fragment = document.createDocumentFragment();
    const count = randInt(config.flash.batchMin, config.flash.batchMax);

    for (let i = 0; i < count; i += 1) {
      const word = createFlashWord();

      if (word) {
        fragment.appendChild(word);
      }
    }

    if (fragment.childNodes.length && flashState.layer && flashState.layer.isConnected) {
      flashState.layer.appendChild(fragment);
    }
  }

  function scheduleFlashSpawn() {
    const flash = flashState;

    if (!flash.running || flash.decayStarted || destroyed) return;

    const elapsed = now() - flash.startedAt;
    const spawnEnd = config.flash.startDelay + config.flash.spawnDuration;

    if (elapsed >= config.flash.startDelay && elapsed <= spawnEnd) {
      addFlashBatch();
    }

    if (elapsed <= spawnEnd && flash.activeWords.length < getFlashLimit()) {
      flash.spawnTimer = window.setTimeout(
        scheduleFlashSpawn,
        rand(config.flash.spawnIntervalMin, config.flash.spawnIntervalMax)
      );
    }
  }

  function decayFlashWord(element) {
    if (!element || !element.isConnected) return;

    element.classList.add("is-decaying");

    const index = flashState.activeWords.indexOf(element);

    if (index !== -1) {
      flashState.activeWords.splice(index, 1);
    }

    const outDuration = parseFloat(element.style.getPropertyValue("--outdur")) || config.flash.outMax;

    setTimer(flashState, function () {
      if (element.isConnected) {
        element.remove();
      }
    }, outDuration + 40);
  }

  function reskinFlashWord(element) {
    if (!element || !element.isConnected) return;

    applyFlashStyle(element);
  }

  function finalGlitchThenDecay(element, duration) {
    const flashConfig = config.flash;
    const total = clamp(duration, flashConfig.finalDurationMin, flashConfig.finalDurationMax);
    const cycles = randInt(flashConfig.finalBlinkMin, flashConfig.finalBlinkMax);
    const forcedSwitches = randInt(flashConfig.finalSwitchMin, flashConfig.finalSwitchMax);
    const switchSteps = [];
    let elapsed = 0;

    if (!element || !element.isConnected) return;

    element.classList.remove("is-decaying");
    element.style.opacity = "1";
    element.style.visibility = "visible";
    element.style.transition = "none";
    element.style.filter = "contrast(1.15) saturate(1.15)";

    for (let i = 0; i < forcedSwitches; i += 1) {
      switchSteps.push(randInt(0, Math.max(0, cycles - 1)));
    }

    for (let cycle = 0; cycle < cycles; cycle += 1) {
      const remaining = Math.max(0, total - elapsed);
      const average = remaining / Math.max(1, cycles - cycle);
      const hideDuration = Math.min(rand(flashConfig.finalHideMin, flashConfig.finalHideMax), average * 0.65);
      const showDuration = Math.min(rand(flashConfig.finalShowMin, flashConfig.finalShowMax), average * 0.85);
      const hideAt = elapsed;
      const showAt = elapsed + hideDuration;
      const shouldSwitch = switchSteps.indexOf(cycle) !== -1 || Math.random() < flashConfig.finalReskinChance;

      setTimer(flashState, function () {
        if (!element || !element.isConnected) return;

        element.style.opacity = "0";
        element.style.visibility = "hidden";
      }, hideAt);

      setTimer(flashState, function () {
        if (!element || !element.isConnected) return;

        if (shouldSwitch) {
          reskinFlashWord(element);
        }

        element.style.opacity = "1";
        element.style.visibility = "visible";
        element.style.filter = Math.random() < 0.5
          ? "contrast(1.35) saturate(1.35)"
          : "contrast(1.1) saturate(1.15)";
        element.style.transform =
          "translate(-50%, -50%) rotate(var(--r)) scale(" +
          rand(0.92, 1.06).toFixed(3) +
          ")";
      }, showAt);

      elapsed += hideDuration + showDuration;

      if (elapsed >= total) break;
    }

    setTimer(flashState, function () {
      if (!element || !element.isConnected) return;

      element.style.filter = "";
      element.style.transition = "";
      decayFlashWord(element);
    }, Math.max(total, elapsed) + rand(80, 180));
  }

  function beginFlashDecay() {
    const flash = flashState;
    const flashConfig = config.flash;

    if (!flash.running || flash.decayStarted) return;

    flash.decayStarted = true;
    window.clearTimeout(flash.spawnTimer);
    flash.spawnTimer = 0;

    const queue = shuffle(flash.activeWords);

    if (!queue.length) {
      setTimer(flash, finishFlash, flashConfig.regularDecayDuration);
      return;
    }

    const finalCount = Math.min(queue.length, randInt(flashConfig.finalCountMin, flashConfig.finalCountMax));
    const finalWords = queue.slice(-finalCount);
    const normalWords = queue.slice(0, Math.max(0, queue.length - finalCount));
    const finalDuration = rand(flashConfig.finalDurationMin, flashConfig.finalDurationMax);
    const finalStartDelay = flashConfig.regularDecayDuration + flashConfig.outMax + rand(180, 420);

    normalWords.forEach(function (element) {
      const delay = Math.pow(Math.random(), 0.78) * flashConfig.regularDecayDuration + rand(0, 90);

      setTimer(flash, function () {
        decayFlashWord(element);
      }, delay);
    });

    finalWords.forEach(function (element, index) {
      const stagger = index * rand(160, 360);

      setTimer(flash, function () {
        finalGlitchThenDecay(element, finalDuration + rand(-260, 260));
      }, finalStartDelay + stagger);
    });

    setTimer(
      flash,
      finishFlash,
      finalStartDelay + finalDuration + flashConfig.outMax + 1200
    );
  }

  function finishFlash() {
    if (!flashState.running) return;

    stopFlash(config.removeLayersOnFinish !== false);
  }

  function resetFlashState() {
    clearTimers(flashState);
    window.clearTimeout(flashState.spawnTimer);

    flashState.running = false;
    flashState.layer = null;
    flashState.spawnTimer = 0;
    flashState.startedAt = 0;
    flashState.decayStarted = false;
    flashState.activeWords = [];
  }

  function startFlash(nextConfig) {
    if (nextConfig) {
      updateConfig(nextConfig);
    }

    stopFlash(true);

    if (!config.flash.enabled) return getConfig();

    injectStyle();

    if (!setupFlash()) {
      stopFlash(true);
      return getConfig();
    }

    destroyed = false;
    flashState.running = true;
    flashState.startedAt = now();
    flashState.decayStarted = false;
    flashState.activeWords = [];

    scheduleFlashSpawn();

    setTimer(
      flashState,
      beginFlashDecay,
      config.flash.startDelay + config.flash.spawnDuration + config.flash.holdDuration
    );

    return getConfig();
  }

  function stopFlash(remove) {
    const shouldRemove = remove !== false;
    const layer = flashState.layer || document.getElementById(config.flash.layerId);

    resetFlashState();

    if (layer) {
      layer.textContent = "";
      hideOrRemove(layer, shouldRemove);
    }

    return getConfig();
  }

  function start(nextConfig) {
    if (nextConfig) {
      updateConfig(nextConfig);
    } else {
      injectStyle();
    }

    destroyed = false;

    if (config.face.enabled) {
      startFace();
    }

    if (config.flash.enabled) {
      startFlash();
    }

    return getConfig();
  }

  function stop() {
    stopFace(true);
    stopFlash(true);

    return getConfig();
  }

  function destroy() {
    stop();

    destroyed = true;

    const style = document.getElementById(config.styleId);

    if (style && style.isConnected) {
      style.remove();
    }

    return getConfig();
  }

  function updateConfig(nextConfig) {
    config = normalizeConfig(merge(config, nextConfig || {}));
    injectStyle();

    return getConfig();
  }

  function getConfig() {
    return normalizeConfig(merge({}, config));
  }

  function onReady() {
    if (config.autoStart) {
      start();
    }
  }

  window.HackedSplash = {
    start: start,
    startFace: startFace,
    startFlash: startFlash,
    stop: stop,
    destroy: destroy,
    updateConfig: updateConfig,
    getConfig: getConfig
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady, { once: true });
  } else {
    onReady();
  }
})(window, document);
