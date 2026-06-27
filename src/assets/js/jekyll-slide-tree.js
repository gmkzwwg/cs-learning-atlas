(function () {
  'use strict';

  const CONFIG = {
    mode: 'tree',
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
    widgetSize: { width: 260, mapHeight: 120 },
    mapMajorGap: 34,
    wikiMaxEntriesPerRow: 3,
    opacityIdle: 0.2,
    opacityHover: 0.7,
    mobileBreakpoint: 768,
    headingPadding: { top: 16, right: 24, bottom: 12, left: 24 },
    bodyPadding: { top: 0, right: 48, bottom: 0, left: 48 },
    animationMs: 260,
    titleScale: 1.8,
    indexPage: {
      enabled: true,
      position: 'last',
      menuTitle: 'Index',
      headingText: "Here's Index"
    },
    labels: {
      index: '≣',
      prevMajor: '<<',
      prevSlide: '<',
      nextSlide: '>',
      nextMajor: '>>'
    }
  };

  const state = {
    config: deepClone(CONFIG),
    target: null,
    data: null,
    currentGlobal: 0,
    dom: {},
    drag: null,
    originalHTML: '',
    customIndexPosition: false,
    resizeTimer: null
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

  function getWikiMaxEntriesPerRow(count) {
    const raw = Number(state.config.wikiMaxEntriesPerRow);
    const max = Number.isFinite(raw) ? Math.floor(raw) : CONFIG.wikiMaxEntriesPerRow;
    const safeMax = Math.max(1, max || CONFIG.wikiMaxEntriesPerRow);
    if (!count) return safeMax;
    return Math.max(1, Math.min(safeMax, count));
  }

  function getEffectiveIndexPageConfig() {
    const indexPage = merge(deepClone(CONFIG.indexPage), state.config.indexPage || {});
    if (state.config.mode === 'wiki') {
      indexPage.enabled = indexPage.enabled !== false;
      if (!state.customIndexPosition) indexPage.position = 'first';
    }
    if (indexPage.position === 'none') indexPage.enabled = false;
    if (indexPage.position !== 'first' && indexPage.position !== 'last') {
      indexPage.position = 'last';
    }
    return indexPage;
  }

  function injectStyle() {
    const existing = document.getElementById('jsd-tree-style');
    if (existing) existing.remove();

    const mobile = isMobile();
    const style = document.createElement('style');
    style.id = 'jsd-tree-style';
    style.textContent = `
      .jsd-tree-root {
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
        animation: jsdTreeFade ${state.config.animationMs}ms ease;
      }
      .jsd-slide-anim-up {
        animation: jsdTreeUp ${state.config.animationMs}ms ease;
      }
      .jsd-slide-anim-zoom {
        animation: jsdTreeZoom ${state.config.animationMs}ms ease;
      }
      @keyframes jsdTreeFade {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes jsdTreeUp {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes jsdTreeZoom {
        from { opacity: 0; transform: scale(0.985); }
        to { opacity: 1; transform: scale(1); }
      }
      .jsd-tree-widget {
        position: fixed;
        right: ${state.config.widgetPosition.right}px;
        bottom: ${state.config.widgetPosition.bottom}px;
        width: ${state.config.widgetSize.width}px;
        box-sizing: border-box;
        opacity: ${state.config.opacityIdle};
        transition: opacity 180ms ease;
        z-index: 9999;
        border: 1px solid currentColor;
        background: inherit;
        color: inherit;
        user-select: none;
      }
      .jsd-tree-widget:hover,
      .jsd-tree-widget.is-active {
        opacity: ${state.config.opacityHover};
      }
      .jsd-tree-widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 8px;
        border-bottom: 1px solid currentColor;
        cursor: move;
        font-size: 0.95em;
      }
      .jsd-tree-widget-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 700;
      }
      .jsd-tree-widget-count {
        flex: 0 0 auto;
        font-size: 0.85em;
      }
      .jsd-tree-map {
        display: block;
        width: 100%;
        height: ${state.config.widgetSize.mapHeight}px;
        border-bottom: 1px solid currentColor;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: currentColor rgba(127, 127, 127, 0.08);
      }
      .jsd-tree-map::-webkit-scrollbar {
        width: 4.5px;
        height: 4.5px;
      }
      .jsd-tree-map::-webkit-scrollbar-thumb {
        background-color: currentColor;
        border-radius: 999px;
      }
      .jsd-tree-map::-webkit-scrollbar-track {
        background-color: rgba(127, 127, 127, 0.08);
        border-radius: 999px;
      }
      .jsd-tree-map::-webkit-scrollbar-corner {
        background: transparent;
      }
      .jsd-tree-buttons {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 4px;
        padding: 6px;
      }
      .jsd-tree-buttons.has-index {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
      .jsd-tree-button {
        appearance: none;
        -webkit-appearance: none;
        border: 1px solid currentColor;
        background: transparent;
        color: inherit;
        padding: 4px 0;
        line-height: 1;
        cursor: pointer;
        font: inherit;
      }
      .jsd-tree-button:focus-visible,
      .jsd-tree-index-button:focus-visible {
        outline: 1px solid currentColor;
        outline-offset: 2px;
      }
      .jsd-tree-index {
        box-sizing: border-box;
        width: min(100%, 860px);
        margin: 0 auto;
        display: grid;
        gap: 1.1em;
      }
      .jsd-tree-index-major {
        display: grid;
        gap: 0.45em;
      }
      .jsd-tree-index-major-button,
      .jsd-tree-index-sub-button {
        appearance: none;
        -webkit-appearance: none;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        text-align: left;
        padding: 0;
      }
      .jsd-tree-index-major-button {
        font-weight: 700;
        font-size: 1.05em;
        line-height: 1.35;
      }
      .jsd-tree-index-sublist {
        display: grid;
        grid-template-columns: repeat(var(--jsd-tree-wiki-entry-cols, ${getWikiMaxEntriesPerRow(0)}), minmax(0, 1fr));
        gap: 0.35em 0.9em;
        padding-left: 1.25em;
        align-items: start;
      }
      @media (max-width: ${state.config.mobileBreakpoint}px) {
        .jsd-tree-index-sublist {
          grid-template-columns: 1fr;
          padding-left: 0;
        }
      }
      .jsd-tree-index-sub-button {
        line-height: 1.35;
        opacity: 0.88;
        overflow-wrap: anywhere;
      }
      .jsd-tree-index-major-button:hover,
      .jsd-tree-index-sub-button:hover {
        opacity: 0.68;
        text-decoration: underline;
        text-underline-offset: 0.18em;
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

  function parseSlides(target) {
    const nodes = Array.from(target.childNodes);
    const majors = [];

    function createMajor(title) {
      return {
        title: (title || '').trim(),
        seenFirstH2: false,
        subs: []
      };
    }

    function createSub(title) {
      return {
        title: (title || '').trim(),
        nodes: []
      };
    }

    let currentMajor = null;
    let currentSub = null;

    nodes.forEach(function (node) {
      const isElement = node.nodeType === Node.ELEMENT_NODE;
      const tag = isElement ? node.tagName.toUpperCase() : '';

      if (tag === 'H1') {
        currentMajor = createMajor(node.textContent || '');
        majors.push(currentMajor);
        currentSub = null;
        return;
      }

      if (tag === 'H2') {
        if (!currentMajor) return;
        currentMajor.seenFirstH2 = true;
        currentSub = createSub(node.textContent || '');
        currentMajor.subs.push(currentSub);
        return;
      }

      if (!currentMajor || !currentMajor.seenFirstH2 || !currentSub) return;
      currentSub.nodes.push(node.cloneNode(true));
    });

    const validMajors = majors.filter(function (major) {
      return major.subs.length > 0;
    }).map(function (major) {
      return {
        title: major.title,
        subs: major.subs
      };
    });

    const contentSlides = [];
    validMajors.forEach(function (major, majorIndex) {
      major.subs.forEach(function (sub, subIndex) {
        contentSlides.push({
          type: 'content',
          majorIndex: majorIndex,
          subIndex: subIndex,
          majorTitle: major.title,
          heading: sub.title,
          nodes: sub.nodes
        });
      });
    });

    const indexPage = getEffectiveIndexPageConfig();
    const slides = contentSlides.slice();
    if (indexPage.enabled && validMajors.length) {
      const indexSlide = {
        type: 'index',
        majorIndex: null,
        subIndex: null,
        majorTitle: indexPage.menuTitle || 'Index',
        heading: typeof indexPage.headingText === 'string' ? indexPage.headingText : '',
        nodes: []
      };
      if (indexPage.position === 'first') slides.unshift(indexSlide);
      else slides.push(indexSlide);
    }

    return {
      majors: validMajors,
      contentSlides: contentSlides,
      slides: slides,
      totalSlides: slides.length
    };
  }

  function randomAnimClass() {
    const names = ['jsd-slide-anim-fade', 'jsd-slide-anim-up', 'jsd-slide-anim-zoom'];
    return names[Math.floor(Math.random() * names.length)];
  }

  function getSlideCountInMajor(majorIndex) {
    const major = state.data.majors[majorIndex];
    return major ? major.subs.length : 0;
  }

  function getCurrentSlide() {
    return state.data.slides[state.currentGlobal];
  }

  function normalizeGlobalIndex(globalIndex) {
    const total = state.data.totalSlides;
    if (!total) return 0;
    let normalized = globalIndex % total;
    if (normalized < 0) normalized += total;
    return normalized;
  }

  function setByGlobalIndex(globalIndex) {
    state.currentGlobal = normalizeGlobalIndex(globalIndex);
  }

  function getContentGlobalIndex(majorIndex, subIndex) {
    for (let i = 0; i < state.data.slides.length; i += 1) {
      const slide = state.data.slides[i];
      if (slide.type === 'content' && slide.majorIndex === majorIndex && slide.subIndex === subIndex) {
        return i;
      }
    }
    return -1;
  }

  function getIndexGlobalIndex() {
    if (!state.data || !state.data.slides) return -1;
    for (let i = 0; i < state.data.slides.length; i += 1) {
      if (state.data.slides[i].type === 'index') return i;
    }
    return -1;
  }

  function goToContent(majorIndex, subIndex) {
    const globalIndex = getContentGlobalIndex(majorIndex, subIndex);
    if (globalIndex < 0) return;
    state.currentGlobal = globalIndex;
    render();
  }

  function goToIndex() {
    const globalIndex = getIndexGlobalIndex();
    if (globalIndex < 0) return;
    state.currentGlobal = globalIndex;
    render();
  }

  function goPrevSlide() {
    setByGlobalIndex(state.currentGlobal - 1);
    render();
  }

  function goNextSlide() {
    setByGlobalIndex(state.currentGlobal + 1);
    render();
  }

  function goPrevMajor() {
    const current = getCurrentSlide();
    const totalMajors = state.data.majors.length;
    if (!totalMajors) return;
    let nextMajor = current && current.type === 'content'
      ? (current.majorIndex - 1 + totalMajors) % totalMajors
      : totalMajors - 1;
    goToContent(nextMajor, 0);
  }

  function goNextMajor() {
    const current = getCurrentSlide();
    const totalMajors = state.data.majors.length;
    if (!totalMajors) return;
    let nextMajor = current && current.type === 'content'
      ? (current.majorIndex + 1) % totalMajors
      : 0;
    goToContent(nextMajor, 0);
  }

  function makeNodeFragment(nodes) {
    const fragment = document.createDocumentFragment();
    nodes.forEach(function (node) {
      fragment.appendChild(node.cloneNode(true));
    });
    return fragment;
  }

  function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
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

  function renderIndexBody() {
    const wrap = document.createElement('div');
    wrap.className = 'jsd-tree-index';

    state.data.majors.forEach(function (major, majorIndex) {
      const majorBlock = document.createElement('div');
      majorBlock.className = 'jsd-tree-index-major';

      const majorbutton = document.createElement('button');
      majorbutton.type = 'button';
      majorbutton.className = 'jsd-tree-index-button jsd-tree-index-major-button';
      majorbutton.textContent = major.title || 'Untitled';
      majorbutton.addEventListener('click', function () {
        goToContent(majorIndex, 0);
        scrollToPageTop();
      });
      majorBlock.appendChild(majorbutton);

      const subList = document.createElement('div');
      subList.className = 'jsd-tree-index-sublist';
      subList.style.setProperty('--jsd-tree-wiki-entry-cols', String(getWikiMaxEntriesPerRow(major.subs.length)));
      major.subs.forEach(function (sub, subIndex) {
        const subbutton = document.createElement('button');
        subbutton.type = 'button';
        subbutton.className = 'jsd-tree-index-button jsd-tree-index-sub-button';
        subbutton.textContent = sub.title || 'Untitled';
        subbutton.addEventListener('click', function () {
          goToContent(majorIndex, subIndex);
          scrollToPageTop();
        });
        subList.appendChild(subbutton);
      });
      majorBlock.appendChild(subList);
      wrap.appendChild(majorBlock);
    });

    return wrap;
  }

  function renderMap() {
    const map = state.dom.map;
    const width = state.config.widgetSize.width;
    const visibleHeight = state.config.widgetSize.mapHeight;
    const padX = 16;
    const padY = 18;
    const majorGap = Math.max(20, Number(state.config.mapMajorGap || 34));
    const contentHeight = Math.max(visibleHeight, padY * 2 + Math.max(0, state.data.majors.length - 1) * majorGap);
    const current = getCurrentSlide();

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + contentHeight);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', String(contentHeight));

    function makeNode(majorIndex, subIndex, x, y, isCurrent) {
      const group = document.createElementNS(svgNS, 'g');
      group.setAttribute('role', 'button');
      group.setAttribute('tabindex', '0');
      group.setAttribute('data-major-index', String(majorIndex));
      group.setAttribute('data-sub-index', String(subIndex));
      group.setAttribute('aria-label', (state.data.majors[majorIndex].title || 'Section') + ' - ' + (state.data.majors[majorIndex].subs[subIndex].title || 'Slide'));
      group.style.cursor = 'pointer';

      const hit = document.createElementNS(svgNS, 'circle');
      hit.setAttribute('cx', x);
      hit.setAttribute('cy', y);
      hit.setAttribute('r', '10');
      hit.setAttribute('fill', 'transparent');
      group.appendChild(hit);

      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('stroke', 'currentColor');
      circle.setAttribute('vector-effect', 'non-scaling-stroke');

      if (subIndex === 0) {
        circle.setAttribute('r', isCurrent ? '6.5' : '5.2');
        circle.setAttribute('fill', 'transparent');
        circle.setAttribute('stroke-width', isCurrent ? '2' : '1.4');
      } else {
        circle.setAttribute('r', isCurrent ? '4.8' : '3.4');
        circle.setAttribute('fill', 'currentColor');
        circle.setAttribute('stroke-width', isCurrent ? '1.6' : '1');
      }
      circle.setAttribute('opacity', isCurrent ? '1' : '0.8');
      group.appendChild(circle);

      return group;
    }

    state.data.majors.forEach(function (major, mIndex) {
      const y = padY + majorGap * mIndex;
      const slideCount = major.subs.length > 0 ? major.subs.length : 1;
      const usableWidth = width - padX * 2;
      const step = slideCount > 1 ? usableWidth / (slideCount - 1) : 0;

      if (mIndex < state.data.majors.length - 1) {
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', padX);
        line.setAttribute('y1', y);
        line.setAttribute('x2', padX);
        line.setAttribute('y2', y + majorGap);
        line.setAttribute('stroke', 'currentColor');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', '0.65');
        svg.appendChild(line);
      }

      if (slideCount > 1) {
        const hLine = document.createElementNS(svgNS, 'line');
        hLine.setAttribute('x1', padX);
        hLine.setAttribute('y1', y);
        hLine.setAttribute('x2', padX + step * (slideCount - 1));
        hLine.setAttribute('y2', y);
        hLine.setAttribute('stroke', 'currentColor');
        hLine.setAttribute('stroke-width', '1');
        hLine.setAttribute('opacity', '0.4');
        svg.appendChild(hLine);
      }

      for (let sIndex = 0; sIndex < slideCount; sIndex += 1) {
        const x = padX + step * sIndex;
        const isCurrent = current && current.type === 'content' && mIndex === current.majorIndex && sIndex === current.subIndex;
        svg.appendChild(makeNode(mIndex, sIndex, x, y, isCurrent));
      }
    });

    map.innerHTML = '';
    map.appendChild(svg);

    if (current && current.type === 'content') {
      const targetY = padY + majorGap * current.majorIndex;
      const maxScroll = Math.max(0, contentHeight - visibleHeight);
      const nextTop = Math.max(0, Math.min(maxScroll, targetY - visibleHeight / 2));
      map.scrollTop = nextTop;
    }
  }

  function findMapNode(target) {
    let node = target;
    while (node && node !== state.dom.map) {
      if (node.getAttribute && node.getAttribute('data-major-index') !== null && node.getAttribute('data-sub-index') !== null) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  function activateMapNode(node) {
    if (!node) return;
    const majorIndex = Number(node.getAttribute('data-major-index'));
    const subIndex = Number(node.getAttribute('data-sub-index'));
    if (!Number.isFinite(majorIndex) || !Number.isFinite(subIndex)) return;
    goToContent(majorIndex, subIndex);
  }

  function onMapClick(event) {
    activateMapNode(findMapNode(event.target));
  }

  function onMapKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const node = findMapNode(event.target);
    if (!node) return;
    event.preventDefault();
    activateMapNode(node);
  }

  function renderWidgetTitle(slide) {
    if (!slide) return;
    if (slide.type === 'index') {
      state.dom.widgetTitle.textContent = slide.majorTitle || 'Index';
      state.dom.widgetCount.textContent = state.currentGlobal + 1 + '/' + state.data.totalSlides;
      return;
    }
    state.dom.widgetTitle.textContent = slide.majorTitle || 'Section';
    state.dom.widgetCount.textContent = slide.subIndex + 1 + '/' + getSlideCountInMajor(slide.majorIndex);
  }

  function render() {
    if (!state.data || !state.dom.root || !state.dom.body) return;

    const slide = getCurrentSlide();
    clearElement(state.dom.root);
    ensureTopAnchor();

    if (slide.type !== 'index' || slide.heading) {
      state.dom.heading.textContent = slide.heading || '';
      state.dom.root.appendChild(state.dom.heading);
    }

    state.dom.body.innerHTML = '';
    if (slide.type === 'index') {
      state.dom.body.appendChild(renderIndexBody());
    } else {
      state.dom.body.appendChild(makeNodeFragment(slide.nodes));
    }
    state.dom.root.appendChild(state.dom.body);

    const animClass = randomAnimClass();
    state.dom.body.classList.remove('jsd-slide-anim-fade', 'jsd-slide-anim-up', 'jsd-slide-anim-zoom');
    void state.dom.body.offsetWidth;
    state.dom.body.classList.add(animClass);

    renderWidgetTitle(slide);
    renderMap();
  }

  function onKeyDown(event) {
    if (!state.data) return;
    const tag = event.target && event.target.tagName ? event.target.tagName.toUpperCase() : '';
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (event.target && event.target.isContentEditable);
    if (isInput) return;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      goPrevMajor();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrevSlide();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNextSlide();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      goNextMajor();
    }
  }

  function startDrag(event) {
    if (event.button !== 0 && event.pointerType !== 'touch') return;
    const widget = state.dom.widget;
    const rect = widget.getBoundingClientRect();
    state.drag = {
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top
    };
    widget.classList.add('is-active');
    widget.style.left = rect.left + 'px';
    widget.style.top = rect.top + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
    try { state.dom.widgetHeader.setPointerCapture(event.pointerId); } catch (e) { /* ignore */ }
  }

  function duringDrag(event) {
    if (!state.drag) return;
    const dx = event.clientX - state.drag.startX;
    const dy = event.clientY - state.drag.startY;
    state.dom.widget.style.left = state.drag.left + dx + 'px';
    state.dom.widget.style.top = state.drag.top + dy + 'px';
  }

  function endDrag(event) {
    if (!state.drag) return;
    try { state.dom.widgetHeader.releasePointerCapture(event.pointerId); } catch (e) { /* ignore */ }
    state.drag = null;
    state.dom.widget.classList.remove('is-active');
  }

  function buildDOM(target) {
    state.originalHTML = target.innerHTML;
    target.innerHTML = '';

    const root = document.createElement('div');
    root.className = 'jsd-tree-root';

    const heading = document.createElement('div');
    heading.className = 'jsd-heading';

    const body = document.createElement('div');
    body.className = 'jsd-slide-body';

    root.appendChild(heading);
    root.appendChild(body);
    target.appendChild(root);

    const widget = document.createElement('div');
    widget.className = 'jsd-tree-widget';

    const widgetHeader = document.createElement('div');
    widgetHeader.className = 'jsd-tree-widget-header';

    const widgetTitle = document.createElement('div');
    widgetTitle.className = 'jsd-tree-widget-title';

    const widgetCount = document.createElement('div');
    widgetCount.className = 'jsd-tree-widget-count';

    widgetHeader.appendChild(widgetTitle);
    widgetHeader.appendChild(widgetCount);

    const map = document.createElement('div');
    map.className = 'jsd-tree-map';
    map.addEventListener('click', onMapClick);
    map.addEventListener('keydown', onMapKeyDown);

    const buttons = document.createElement('div');
    buttons.className = 'jsd-tree-buttons';

    const showIndexButton = getIndexGlobalIndex() >= 0;
    if (showIndexButton) buttons.classList.add('has-index');

    const indexbutton = document.createElement('button');
    indexbutton.type = 'button';
    indexbutton.className = 'jsd-tree-button';
    indexbutton.textContent = state.config.labels.index;
    indexbutton.addEventListener('click', goToIndex);

    const prevMajorbutton = document.createElement('button');
    prevMajorbutton.type = 'button';
    prevMajorbutton.className = 'jsd-tree-button';
    prevMajorbutton.textContent = state.config.labels.prevMajor;
    prevMajorbutton.addEventListener('click', goPrevMajor);

    const prevSlidebutton = document.createElement('button');
    prevSlidebutton.type = 'button';
    prevSlidebutton.className = 'jsd-tree-button';
    prevSlidebutton.textContent = state.config.labels.prevSlide;
    prevSlidebutton.addEventListener('click', goPrevSlide);

    const nextSlidebutton = document.createElement('button');
    nextSlidebutton.type = 'button';
    nextSlidebutton.className = 'jsd-tree-button';
    nextSlidebutton.textContent = state.config.labels.nextSlide;
    nextSlidebutton.addEventListener('click', goNextSlide);

    const nextMajorbutton = document.createElement('button');
    nextMajorbutton.type = 'button';
    nextMajorbutton.className = 'jsd-tree-button';
    nextMajorbutton.textContent = state.config.labels.nextMajor;
    nextMajorbutton.addEventListener('click', goNextMajor);

    if (showIndexButton) buttons.appendChild(indexbutton);
    buttons.appendChild(prevMajorbutton);
    buttons.appendChild(prevSlidebutton);
    buttons.appendChild(nextSlidebutton);
    buttons.appendChild(nextMajorbutton);

    widget.appendChild(widgetHeader);
    widget.appendChild(map);
    widget.appendChild(buttons);
    document.body.appendChild(widget);

    widgetHeader.addEventListener('pointerdown', startDrag);
    window.addEventListener('pointermove', duringDrag);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    state.dom = {
      root: root,
      heading: heading,
      body: body,
      widget: widget,
      widgetHeader: widgetHeader,
      widgetTitle: widgetTitle,
      widgetCount: widgetCount,
      map: map,
      buttons: buttons,
      indexbutton: indexbutton,
      prevMajorbutton: prevMajorbutton,
      prevSlidebutton: prevSlidebutton,
      nextSlidebutton: nextSlidebutton,
      nextMajorbutton: nextMajorbutton
    };
  }

  function cleanupDOM() {
    clearTimeout(state.resizeTimer);
    state.resizeTimer = null;
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('pointermove', duringDrag);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
    if (state.dom.widget && state.dom.widget.parentNode) {
      state.dom.widget.parentNode.removeChild(state.dom.widget);
    }
    const style = document.getElementById('jsd-tree-style');
    if (style) style.remove();
    state.dom = {};
  }

  function restoreOriginalIfNeeded() {
    if (state.target && typeof state.originalHTML === 'string' && state.originalHTML !== '') {
      state.target.innerHTML = state.originalHTML;
    }
  }

  function rebuild(nextConfig) {
    if (nextConfig && nextConfig.indexPage && Object.prototype.hasOwnProperty.call(nextConfig.indexPage, 'position')) {
      state.customIndexPosition = true;
    }
    if (nextConfig) merge(state.config, nextConfig);
    cleanupDOM();
    restoreOriginalIfNeeded();

    state.target = findTarget();
    if (!state.target) return false;

    state.data = parseSlides(state.target);
    if (!state.data || !state.data.majors.length || !state.data.totalSlides) {
      state.data = null;
      return false;
    }

    state.currentGlobal = 0;

    injectStyle();
    buildDOM(state.target);
    render();
    window.addEventListener('keydown', onKeyDown);
    return true;
  }

  function destroy() {
    cleanupDOM();
    restoreOriginalIfNeeded();
    state.target = null;
    state.data = null;
  }

  function updateTreeConfig(nextConfig) {
    return rebuild(nextConfig);
  }

  window.JSDTreeSlides = {
    rebuild: rebuild,
    destroy: destroy,
    getState: function () {
      const slide = state.data ? getCurrentSlide() : null;
      return {
        mode: state.config.mode,
        currentGlobal: state.currentGlobal,
        currentType: slide ? slide.type : null,
        currentMajor: slide && slide.type === 'content' ? slide.majorIndex : null,
        currentSlide: slide && slide.type === 'content' ? slide.subIndex : null,
        totalMajors: state.data ? state.data.majors.length : 0,
        totalSlides: state.data ? state.data.totalSlides : 0,
        contentSlides: state.data ? state.data.contentSlides.length : 0
      };
    },
    getConfig: function () {
      return deepClone(state.config);
    }
  };

  window.updateTreeConfig = updateTreeConfig;

  function boot() {
    rebuild();
    window.addEventListener('resize', function () {
      if (!state.data) return;
      clearTimeout(state.resizeTimer);
      state.resizeTimer = setTimeout(function () {
        if (!state.data) return;
        injectStyle();
        render();
      }, 120);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
