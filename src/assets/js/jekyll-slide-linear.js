(function () {
  'use strict';

  const CONFIG = {
    mode: 'linear',
    targetSelectors: [
      '#main-content',
      '.post-content',
      '.page-content',
      'article',
      'main',
      '.markdown-body',
      '.content',
      '#content'
    ],
    widgetPosition: { right: 20, bottom: 20 },
    opacityIdle: 0.4,
    opacityHover: 0.7,
    dragHandleLabel: '✥',
    buttonFontScale: 1.22,
    mobileBreakpoint: 768,
    titleScale: 1.8,
    headingPadding: { top: 16, right: 24, bottom: 12, left: 24 },
    bodyPadding: { top: 0, right: 48, bottom: 0, left: 48 },
    indexPage: {
      enabled: true,
      position: 'last',
      menuTitle: 'Index',
      headingText: "Here's Index"
    },
    animationMs: 260,
    autoplayInterval: 5,
    menuMaxHeight: 240,
    controls: {
      menu: { show: false, label: '≣' },
      first: { show: false, label: '«' },
      prev: { show: true, label: '‹' },
      next: { show: true, label: '›' },
      last: { show: false, label: '»' },
      autoplay: { show: false, label: '▸' }
    },
    labels: {
      languageMenu: 'Language',
      annotationOriginal: 'Original',
      annotationNext: 'Annotation'
    }
  };

  const state = {
    userConfig: {},
    config: deepClone(CONFIG),
    target: null,
    originalHTML: '',
    slides: [],
    currentIndex: 0,
    dom: {},
    drag: null,
    autoplayTimer: null,
    resizeTimer: null,
    menuSignature: '',
    resizeBound: false,
    keyBound: false,
    outsideClickBound: false,
    dragCleanup: null
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function merge(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach(function (key) {
      const value = source[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
          target[key] = {};
        }
        merge(target[key], value);
      } else {
        target[key] = value;
      }
    });
    return target;
  }

  function buildConfig() {
    const conf = deepClone(CONFIG);
    merge(conf, state.userConfig || {});
    applyModePreset(conf);
    if (state.userConfig && state.userConfig.controls) merge(conf.controls, state.userConfig.controls);
    return conf;
  }

  function applyModePreset(conf) {
    if (conf.mode === 'simple') {
      conf.controls = {
        menu: { show: false, label: '≣' },
        first: { show: false, label: '«' },
        prev: { show: true, label: '‹' },
        next: { show: true, label: '›' },
        last: { show: false, label: '»' },
        autoplay: { show: false, label: '▸' }
      };
      return;
    }
    if (conf.mode === 'language') {
      conf.controls = {
        menu: { show: true, label: conf.labels.languageMenu || 'Language' },
        first: { show: false, label: '«' },
        prev: { show: false, label: '‹' },
        next: { show: false, label: '›' },
        last: { show: false, label: '»' },
        autoplay: { show: false, label: '▸' }
      };
      return;
    }
    if (conf.mode === 'annotation') {
      conf.controls = {
        menu: { show: false, label: '≣' },
        first: { show: true, label: conf.labels.annotationOriginal || 'Original' },
        prev: { show: false, label: '‹' },
        next: { show: true, label: conf.labels.annotationNext || 'Annotation' },
        last: { show: false, label: '»' },
        autoplay: { show: false, label: '▸' }
      };
      return;
    }
    conf.controls = {
      menu: { show: false, label: '≣' },
      first: { show: false, label: '«' },
      prev: { show: true, label: '‹' },
      next: { show: true, label: '›' },
      last: { show: false, label: '»' },
      autoplay: { show: false, label: '▸' }
    };
  }

  function isMobile() {
    return window.matchMedia('(max-width: ' + state.config.mobileBreakpoint + 'px)').matches;
  }

  function getPaddingString(obj, forceZero) {
    if (forceZero) return '0px';
    const top = Number(obj.top || 0);
    const right = Number(obj.right || 0);
    const bottom = Number(obj.bottom || 0);
    const left = Number(obj.left || 0);
    return top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px';
  }

  function injectStyle() {
    const existing = document.getElementById('jsd-linear-style');
    if (existing) existing.remove();

    const mobile = isMobile();
    const style = document.createElement('style');
    style.id = 'jsd-linear-style';
    style.textContent = `
      .jsd-linear-root {
        width: 100%;
        min-height: inherit;
      }
      .jsd-slide-top-anchor {
        display: block;
        width: 100%;
        height: 0;
        overflow: hidden;
        scroll-margin-top: 0px;
      }
      .jsd-heading {
        display: block;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
        font-weight: 700;
        font-size: calc(1em * ${state.config.titleScale});
        line-height: 1.25;
        padding: ${getPaddingString(state.config.headingPadding, mobile)};
      }
      .jsd-slide-body {
        width: 100%;
        box-sizing: border-box;
        padding: ${getPaddingString(state.config.bodyPadding, mobile)};
      }
      .jsd-slide-anim-fade {
        animation: jsdLinearFade ${state.config.animationMs}ms ease;
      }
      .jsd-slide-anim-up {
        animation: jsdLinearUp ${state.config.animationMs}ms ease;
      }
      .jsd-slide-anim-zoom {
        animation: jsdLinearZoom ${state.config.animationMs}ms ease;
      }
      @keyframes jsdLinearFade {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes jsdLinearUp {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes jsdLinearZoom {
        from { opacity: 0; transform: scale(0.985); }
        to { opacity: 1; transform: scale(1); }
      }
      .jsd-linear-toolbar {
        position: fixed;
        right: ${state.config.widgetPosition.right}px;
        bottom: ${state.config.widgetPosition.bottom}px;
        display: inline-flex;
        align-items: stretch;
        gap: 0;
        box-sizing: border-box;
        opacity: ${state.config.opacityIdle};
        transition: opacity 180ms ease;
        z-index: 9999;
        border: 1px solid currentColor;
        background: inherit;
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        color: inherit;
        user-select: none;
      }
      .jsd-linear-toolbar:hover,
      .jsd-linear-toolbar.is-active,
      .jsd-linear-toolbar.is-open,
      .jsd-linear-toolbar.is-playing {
        opacity: ${state.config.opacityHover};
      }
      .jsd-linear-drag {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        padding: 0 4px;
        border-right: 1px solid currentColor;
        cursor: move;
        touch-action: none;
        line-height: 1;
        font-size: 1.05em;
      }
      .jsd-linear-controls {
        display: inline-flex;
        align-items: stretch;
        position: relative;
      }
      .jsd-linear-button {
        appearance: none;
        -webkit-appearance: none;
        border: 0;
        border-left: 1px solid currentColor;
        background: transparent;
        color: inherit;
        padding: 6px 10px;
        min-height: 30px;
        line-height: 1;
        cursor: pointer;
        font-family: inherit;
        font-weight: inherit;
        font-size: calc(1em * ${state.config.buttonFontScale});
        white-space: nowrap;
      }
      .jsd-linear-controls .jsd-linear-button:first-child {
        border-left: 0;
      }
      .jsd-linear-button:focus-visible {
        outline: 1px solid currentColor;
        outline-offset: -1px;
      }
      .jsd-linear-button.is-active {
        font-weight: 700;
      }
      .jsd-linear-menu {
        position: absolute;
        right: 0;
        bottom: calc(100% + 6px);
        min-width: 180px;
        max-height: ${Number(state.config.menuMaxHeight || 240)}px;
        overflow: auto;
        border: 1px solid currentColor;
        background: inherit;
        color: inherit;
        display: none;
        scrollbar-width: thin;
        scrollbar-color: currentColor rgba(127, 127, 127, 0.1);
      }
      .jsd-linear-menu::-webkit-scrollbar {
        width: 4.5px;
        height: 4.5px;
      }
      .jsd-linear-menu::-webkit-scrollbar-thumb {
        background-color: currentColor;
        border-radius: 999px;
      }
      .jsd-linear-menu::-webkit-scrollbar-track {
        background-color: rgba(127, 127, 127, 0.1);
        border-radius: 999px;
      }
      .jsd-linear-menu::-webkit-scrollbar-corner {
        background: transparent;
      }
      .jsd-linear-menu.is-open {
        display: block;
        background: inherit;
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }
      .jsd-linear-menu-item {
        width: 100%;
        display: block;
        border: 0;
        border-bottom: 1px solid currentColor;
        background: rgba(0, 0, 0, 1);
        color: inherit;
        padding: 8px 10px;
        text-align: left;
        cursor: pointer;
        font: inherit;
      }
      .jsd-linear-menu-item:last-child {
        border-bottom: 0;
      }
      .jsd-linear-menu-item.is-current {
        font-weight: 700;
      }
      .jsd-index-list {
        display: flex;
        flex-direction: column;
        gap: 0;
        width: 100%;
        box-sizing: border-box;
      }
      .jsd-index-item {
        display: block;
        width: 100%;
      }
      .jsd-index-button {
        width: 100%;
        display: block;
        text-align: left;
        box-sizing: border-box;
        border: none;
        background: transparent;
        color: inherit;
        padding: 10px 12px;
        font: inherit;
        cursor: pointer;
      }
      .jsd-index-button:focus-visible {
        outline: 1px solid currentColor;
        outline-offset: -1px;
      }
      .jsd-index-button-num {
        display: inline-block;
        min-width: 2.6em;
        font-weight: 700;
      }
      .jsd-linear-empty {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  function findTarget() {
    const selectors = state.config.targetSelectors || [];
    for (let i = 0; i < selectors.length; i += 1) {
      const node = document.querySelector(selectors[i]);
      if (node) return node;
    }
    return null;
  }

  function isDirectHeading(node, level) {
    return node && node.nodeType === 1 && node.tagName && node.tagName.toUpperCase() === 'H' + level;
  }

  function getDirectHeadingLevels(container) {
    return Array.from(container.childNodes)
      .filter(function (node) {
        return node.nodeType === 1 && /^H[1-6]$/.test(node.tagName);
      })
      .map(function (node) {
        return Number(node.tagName.slice(1));
      });
  }

  function getMinHeadingLevel(container) {
    const directLevels = getDirectHeadingLevels(container);
    if (directLevels.length) return Math.min.apply(Math, directLevels);
    return null;
  }

  function parseLinearSlides(container) {
    const level = getMinHeadingLevel(container);
    const nodes = Array.from(container.childNodes);
    const slides = [];
    let current = null;

    if (!level) {
      const fallback = {
        key: 'slide-0',
        menuTitle: '',
        heading: '',
        nodes: nodes.map(function (node) { return node.cloneNode(true); })
      };
      slides.push(fallback);
      return slides;
    }

    nodes.forEach(function (node) {
      if (isDirectHeading(node, level)) {
        current = {
          key: 'slide-' + slides.length,
          menuTitle: node.textContent.trim(),
          heading: node.textContent.trim(),
          nodes: []
        };
        slides.push(current);
        return;
      }
      if (current) current.nodes.push(node.cloneNode(true));
    });

    return slides;
  }

  function parseLanguageSlides(container) {
    const nodes = Array.from(container.childNodes);
    const slides = [];
    let current = null;

    nodes.forEach(function (node) {
      if (isDirectHeading(node, 1)) {
        current = {
          key: 'lang-' + slides.length,
          menuTitle: node.textContent.trim(),
          heading: '',
          nodes: []
        };
        slides.push(current);
        return;
      }
      if (current) current.nodes.push(node.cloneNode(true));
    });

    if (!slides.length) return parseLinearSlides(container);
    return slides;
  }

  function parseSlidesFromOriginal() {
    const scratch = document.createElement('div');
    scratch.innerHTML = state.originalHTML;
    if (state.config.mode === 'language') return parseLanguageSlides(scratch);
    return parseLinearSlides(scratch);
  }

  function shouldAddIndexPage() {
    const cfg = state.config.indexPage || {};
    if (cfg.enabled === false) return false;
    const position = String(cfg.position || 'last').toLowerCase();
    return position === 'first' || position === 'last';
  }

  function getIndexPosition() {
    const cfg = state.config.indexPage || {};
    const position = String(cfg.position || 'last').toLowerCase();
    if (position === 'first') return 'first';
    if (position === 'none') return 'none';
    return 'last';
  }

  function createIndexSlide() {
    const cfg = state.config.indexPage || {};
    const headingText = typeof cfg.headingText === 'string' ? cfg.headingText : '';
    return {
      key: 'index-slide',
      type: 'index',
      menuTitle: String(cfg.menuTitle || 'Index'),
      heading: headingText,
      nodes: []
    };
  }

  function applyIndexPage(slides) {
    const nextSlides = Array.isArray(slides) ? slides.slice() : [];
    if (!shouldAddIndexPage()) return nextSlides;
    const indexSlide = createIndexSlide();
    if (getIndexPosition() === 'first') nextSlides.unshift(indexSlide);
    else nextSlides.push(indexSlide);
    return nextSlides;
  }

  function clearAutoplay() {
    if (state.autoplayTimer) {
      window.clearInterval(state.autoplayTimer);
      state.autoplayTimer = null;
    }
    if (state.dom.toolbar) state.dom.toolbar.classList.remove('is-playing');
    if (state.dom.autoplaybutton) state.dom.autoplaybutton.classList.remove('is-active');
  }

  function startAutoplay() {
    clearAutoplay();
    const seconds = Number(state.config.autoplayInterval || 0);
    if (!(seconds > 0) || state.slides.length < 2) return;
    state.autoplayTimer = window.setInterval(function () {
      nextSlide();
    }, seconds * 1000);
    if (state.dom.toolbar) state.dom.toolbar.classList.add('is-playing');
    if (state.dom.autoplaybutton) state.dom.autoplaybutton.classList.add('is-active');
  }

  function toggleAutoplay() {
    if (state.autoplayTimer) {
      clearAutoplay();
    } else {
      startAutoplay();
    }
  }

  function closeMenu() {
    if (state.dom.menu) state.dom.menu.classList.remove('is-open');
    if (state.dom.toolbar) state.dom.toolbar.classList.remove('is-open');
  }

  function openMenu() {
    if (!state.dom.menu) return;
    state.dom.menu.classList.add('is-open');
    if (state.dom.toolbar) state.dom.toolbar.classList.add('is-open');
  }

  function toggleMenu() {
    if (!state.dom.menu) return;
    if (state.dom.menu.classList.contains('is-open')) closeMenu();
    else openMenu();
  }

  function getMenuItemTitle(slide, index) {
    const title = (slide.menuTitle || slide.heading || '').trim();
    if (title) return title;
    return 'Page ' + (index + 1);
  }

  function getMenuSignature() {
    return state.slides.map(function (slide, index) {
      return slide.key + ':' + getMenuItemTitle(slide, index);
    }).join('|');
  }

  function updateMenuCurrent() {
    if (!state.dom.menu) return;
    Array.from(state.dom.menu.children).forEach(function (item) {
      const itemIndex = Number(item.getAttribute('data-index'));
      item.classList.toggle('is-current', itemIndex === state.currentIndex);
    });
  }

  function renderMenu() {
    if (!state.dom.menu) return;
    const signature = getMenuSignature();
    if (state.menuSignature === signature && state.dom.menu.children.length) {
      updateMenuCurrent();
      return;
    }

    state.menuSignature = signature;
    state.dom.menu.innerHTML = '';
    state.slides.forEach(function (slide, index) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'jsd-linear-menu-item' + (index === state.currentIndex ? ' is-current' : '');
      item.textContent = getMenuItemTitle(slide, index);
      item.setAttribute('data-index', String(index));
      state.dom.menu.appendChild(item);
    });
  }

  function getAnimationClass() {
    const classes = ['jsd-slide-anim-fade', 'jsd-slide-anim-up', 'jsd-slide-anim-zoom'];
    return classes[Math.floor(Math.random() * classes.length)];
  }

  function ensureTopAnchor() {
    if (!state.dom.root) return null;
    const anchor = document.createElement('span');
    anchor.className = 'jsd-slide-top-anchor';
    anchor.setAttribute('aria-hidden', 'true');
    anchor.tabIndex = -1;
    state.dom.root.appendChild(anchor);
    state.dom.topAnchor = anchor;
    return anchor;
  }

  function scrollToPageTop() {
    window.requestAnimationFrame(function () {
      const anchor = state.dom.topAnchor || (state.dom.root ? state.dom.root.querySelector('.jsd-slide-top-anchor') : null);
      if (!anchor) return;
      try {
        anchor.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
      } catch (e) {
        const top = anchor.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, Math.max(0, top));
      }
    });
  }

  function renderIndexBody(body) {
    const list = document.createElement('div');
    list.className = 'jsd-index-list';

    let contentNumber = 0;

    state.slides.forEach(function (slide, index) {
      if (slide.type === 'index') return;
      contentNumber += 1;

      const item = document.createElement('div');
      item.className = 'jsd-index-item';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'jsd-index-button';

      const num = document.createElement('span');
      num.className = 'jsd-index-button-num';
      num.textContent = String(contentNumber) + '.';

      const title = document.createElement('span');
      title.className = 'jsd-index-button-title';
      const rawTitle = (slide.menuTitle || slide.heading || '').trim();
      title.textContent = rawTitle || 'Page ' + contentNumber;

      button.appendChild(num);
      button.appendChild(title);
      button.addEventListener('click', function () {
        goTo(index);
        scrollToPageTop();
      });

      item.appendChild(button);
      list.appendChild(item);
    });

    body.appendChild(list);
  }
function notifyContentRendered(container) {
  if (!container) return;

  document.dispatchEvent(new CustomEvent('content:rendered', {
    detail: {
      container: container,
      source: 'jsd-linear-slides'
    }
  }));
}
  function renderCurrent() {
    const slide = state.slides[state.currentIndex];
    if (!slide || !state.dom.root) return;

    state.dom.root.innerHTML = '';
    ensureTopAnchor();

    const showHeading = slide.type === 'index'
      ? Boolean((slide.heading || '').trim())
      : state.config.mode !== 'language' && Boolean((slide.heading || '').trim());

    let heading = null;
    if (showHeading) {
      heading = document.createElement('div');
      heading.className = 'jsd-heading';
      heading.textContent = slide.heading || '';
      state.dom.root.appendChild(heading);
    }

    const body = document.createElement('div');
    body.className = 'jsd-slide-body ' + getAnimationClass();

    if (slide.type === 'index') {
      renderIndexBody(body);
    } else {
      slide.nodes.forEach(function (node) {
        body.appendChild(node.cloneNode(true));
      });
    }

    state.dom.root.appendChild(body);
    state.dom.heading = heading;
    state.dom.body = body;
    renderMenu();

    notifyContentRendered(body);
  }

  function normalizeIndex(index) {
    const total = state.slides.length;
    if (!total) return 0;
    let next = index % total;
    if (next < 0) next += total;
    return next;
  }

  function goTo(index) {
    if (!state.slides.length) return;
    state.currentIndex = normalizeIndex(index);
    renderCurrent();
  }

  function firstSlide() {
    goTo(0);
  }

  function prevSlide() {
    goTo(state.currentIndex - 1);
  }

  function nextSlide() {
    goTo(state.currentIndex + 1);
  }

  function lastSlide() {
    if (!state.slides.length) return;
    goTo(state.slides.length - 1);
  }

  function updateToolbarState() {
    if (!state.dom.toolbar) return;
    if (state.autoplayTimer) state.dom.toolbar.classList.add('is-playing');
    else state.dom.toolbar.classList.remove('is-playing');
  }

  function createButton(key, text, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'jsd-linear-button jsd-linear-button-' + key;
    button.textContent = text;
    button.addEventListener('click', handler);
    return button;
  }

  function attachDragging(toolbar, handle) {
    if (typeof state.dragCleanup === 'function') state.dragCleanup();

    const onPointerDown = function (event) {
      if (event.button !== undefined && event.button !== 0 && event.pointerType !== 'touch') return;
      const rect = toolbar.getBoundingClientRect();
      state.drag = {
        pointerId: event.pointerId,
        pointerX: event.clientX,
        pointerY: event.clientY,
        startLeft: rect.left,
        startTop: rect.top
      };
      toolbar.classList.add('is-active');
      toolbar.style.left = rect.left + 'px';
      toolbar.style.top = rect.top + 'px';
      toolbar.style.right = 'auto';
      toolbar.style.bottom = 'auto';
      try { handle.setPointerCapture(event.pointerId); } catch (e) { /* ignore */ }
      event.preventDefault();
    };

    const onPointerMove = function (event) {
      if (!state.drag || state.drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - state.drag.pointerX;
      const dy = event.clientY - state.drag.pointerY;
      toolbar.style.left = state.drag.startLeft + dx + 'px';
      toolbar.style.top = state.drag.startTop + dy + 'px';
    };

    const onPointerEnd = function (event) {
      if (!state.drag || state.drag.pointerId !== event.pointerId) return;
      try { handle.releasePointerCapture(event.pointerId); } catch (e) { /* ignore */ }
      state.drag = null;
      toolbar.classList.remove('is-active');
    };

    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerEnd);
    handle.addEventListener('pointercancel', onPointerEnd);

    state.dragCleanup = function () {
      handle.removeEventListener('pointerdown', onPointerDown);
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', onPointerEnd);
      handle.removeEventListener('pointercancel', onPointerEnd);
    };
  }

  function buildToolbar() {
    if (state.dom.toolbar) state.dom.toolbar.remove();

    const toolbar = document.createElement('div');
    toolbar.className = 'jsd-linear-toolbar';

    const drag = document.createElement('div');
    drag.className = 'jsd-linear-drag';
    drag.textContent = state.config.dragHandleLabel || '✥';

    const controls = document.createElement('div');
    controls.className = 'jsd-linear-controls';

    const menu = document.createElement('div');
    menu.className = 'jsd-linear-menu';
    menu.addEventListener('click', function (event) {
      const item = event.target && event.target.closest ? event.target.closest('.jsd-linear-menu-item') : null;
      if (!item || !menu.contains(item)) return;
      const index = Number(item.getAttribute('data-index'));
      if (Number.isNaN(index)) return;
      goTo(index);
      closeMenu();
    });

    controls.appendChild(menu);

    if (state.config.controls.menu.show) {
      const menubutton = createButton('menu', state.config.controls.menu.label, toggleMenu);
      controls.appendChild(menubutton);
      state.dom.menubutton = menubutton;
    } else {
      state.dom.menubutton = null;
    }

    if (state.config.controls.first.show) {
      controls.appendChild(createButton('first', state.config.controls.first.label, function () {
        firstSlide();
      }));
    }

    if (state.config.controls.prev.show) {
      controls.appendChild(createButton('prev', state.config.controls.prev.label, function () {
        prevSlide();
      }));
    }

    if (state.config.controls.next.show) {
      controls.appendChild(createButton('next', state.config.controls.next.label, function () {
        nextSlide();
      }));
    }

    if (state.config.controls.last.show) {
      controls.appendChild(createButton('last', state.config.controls.last.label, function () {
        lastSlide();
      }));
    }

    if (state.config.controls.autoplay.show) {
      const autoplaybutton = createButton('autoplay', state.config.controls.autoplay.label, function () {
        toggleAutoplay();
        updateToolbarState();
      });
      controls.appendChild(autoplaybutton);
      state.dom.autoplaybutton = autoplaybutton;
    } else {
      state.dom.autoplaybutton = null;
    }

    toolbar.appendChild(drag);
    toolbar.appendChild(controls);
    document.body.appendChild(toolbar);

    state.dom.toolbar = toolbar;
    state.dom.controls = controls;
    state.dom.menu = menu;
    state.menuSignature = '';

    attachDragging(toolbar, drag);
  }

  function mountRoot() {
    const root = document.createElement('div');
    root.className = 'jsd-linear-root';
    state.target.innerHTML = '';
    state.target.appendChild(root);
    state.dom.root = root;
  }

  function onResize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(function () {
      if (!state.slides.length || !state.dom.root) return;
      injectStyle();
      renderCurrent();
    }, 120);
  }

  function onKeydown(event) {
    const tag = event.target && event.target.tagName ? event.target.tagName.toUpperCase() : '';
    const editable = event.target && (event.target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');
    if (editable) return;

    if (event.key === 'ArrowLeft') {
      prevSlide();
      return;
    }
    if (event.key === 'ArrowRight') {
      nextSlide();
      return;
    }
    if (event.key === 'Home') {
      firstSlide();
      return;
    }
    if (event.key === 'End') {
      lastSlide();
      return;
    }
    if (event.key === 'Escape') {
      closeMenu();
    }
  }

  function onOutsideClick(event) {
    if (!state.dom.toolbar || !state.dom.toolbar.contains(event.target)) closeMenu();
  }

  function bindGlobals() {
    if (!state.resizeBound) {
      window.addEventListener('resize', onResize);
      state.resizeBound = true;
    }
    if (!state.keyBound) {
      document.addEventListener('keydown', onKeydown);
      state.keyBound = true;
    }
    if (!state.outsideClickBound) {
      document.addEventListener('click', onOutsideClick);
      state.outsideClickBound = true;
    }
  }

  function initState() {
    const nextTarget = findTarget();
    if (!nextTarget) return false;
    if (state.target !== nextTarget) {
      state.target = nextTarget;
      state.originalHTML = nextTarget.innerHTML;
    } else if (!state.originalHTML) {
      state.originalHTML = nextTarget.innerHTML;
    }
    state.slides = applyIndexPage(parseSlidesFromOriginal());
    state.currentIndex = 0;
    return true;
  }

  function rebuild(nextConfig) {
    if (nextConfig && typeof nextConfig === 'object') {
      merge(state.userConfig, nextConfig);
    }
    state.config = buildConfig();

    clearAutoplay();
    closeMenu();

    if (!initState()) return null;

    injectStyle();
    mountRoot();
    buildToolbar();
    bindGlobals();
    renderCurrent();
    return api;
  }

  function destroy() {
    clearAutoplay();
    closeMenu();
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = null;

    if (typeof state.dragCleanup === 'function') state.dragCleanup();
    state.dragCleanup = null;

    if (state.resizeBound) {
      window.removeEventListener('resize', onResize);
      state.resizeBound = false;
    }
    if (state.keyBound) {
      document.removeEventListener('keydown', onKeydown);
      state.keyBound = false;
    }
    if (state.outsideClickBound) {
      document.removeEventListener('click', onOutsideClick);
      state.outsideClickBound = false;
    }

    if (state.dom.toolbar) state.dom.toolbar.remove();

    const style = document.getElementById('jsd-linear-style');
    if (style) style.remove();

    if (state.target && typeof state.originalHTML === 'string') {
      state.target.innerHTML = state.originalHTML;
    }

    state.dom = {};
    state.slides = [];
    state.currentIndex = 0;
    state.menuSignature = '';
  }

  function getState() {
    return {
      currentIndex: state.currentIndex,
      totalSlides: state.slides.length,
      mode: state.config.mode,
      slideTitles: state.slides.map(function (slide, index) {
        return getMenuItemTitle(slide, index);
      }),
      autoplay: Boolean(state.autoplayTimer)
    };
  }

  function getConfig() {
    return deepClone(state.config);
  }

  const api = {
    rebuild: rebuild,
    destroy: destroy,
    getState: getState,
    getConfig: getConfig,
    next: nextSlide,
    prev: prevSlide,
    first: firstSlide,
    last: lastSlide,
    goTo: goTo,
    startAutoplay: startAutoplay,
    stopAutoplay: clearAutoplay,
    toggleAutoplay: toggleAutoplay
  };

  window.updateLinearConfig = function (nextConfig) {
    return rebuild(nextConfig || {});
  };
  window.JSDLinearSlides = api;

  function boot() {
    rebuild({});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
