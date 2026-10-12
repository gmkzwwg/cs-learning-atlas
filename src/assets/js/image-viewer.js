(() => {
  const CONFIG = {
    selector: '.post-content img, .page-content img, article img, main img, .markdown-body img',
    minScale: 0.5,
    maxScale: 4,
    zoomStep: 0.2,
    doubleTapDelay: 300,
    animationDuration: 160
  };

  let overlay = null;
  let imgEl = null;
  let buttonZoomIn = null;
  let buttonZoomOut = null;
  let buttonClose = null;

  let isOpen = false;
  let currentSource = '';

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;

  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let pinchCenterStart = { x: 0, y: 0 };

  let lastTapTime = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getDistance(t1, t2) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  }

  function getMidpoint(t1, t2) {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2
    };
  }

  function createViewer() {
    if (overlay) return;

    const style = document.createElement('style');
    style.textContent = `
      .iv-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.88);
        z-index: 99999;
        display: none;
        overflow: hidden;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .iv-overlay.iv-open {
        display: block;
      }

      .iv-stage {
        position: absolute;
        inset: 0;
        overflow: hidden;
        cursor: grab;
      }

      .iv-stage.iv-dragging {
        cursor: grabbing;
      }

      .iv-image {
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: none;
        max-height: none;
        transform: translate(-50%, -50%) translate(0px, 0px) scale(1);
        transform-origin: center center;
        will-change: transform;
        transition: transform ${CONFIG.animationDuration}ms ease;
        pointer-events: none;
      }

      .iv-toolbar {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        gap: 8px;
        z-index: 2;
      }

      .iv-button {
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
      }

      .iv-button:hover {
        background: rgba(255, 255, 255, 0.22);
      }

      .iv-button:active {
        transform: scale(0.96);
      }

      .iv-button:focus-visible {
        outline: 2px solid rgba(255,255,255,0.7);
        outline-offset: 2px;
      }

      .iv-hint {
        position: absolute;
        left: 50%;
        bottom: 14px;
        transform: translateX(-50%);
        color: rgba(255,255,255,0.72);
        font-size: 12px;
        z-index: 2;
        pointer-events: none;
        text-align: center;
        padding: 6px 10px;
        border-radius: 8px;
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      @media (max-width: 640px) {
        .iv-button {
          width: 44px;
          height: 44px;
          font-size: 24px;
        }

        .iv-toolbar {
          top: 10px;
          right: 10px;
        }

        .iv-hint {
          font-size: 11px;
          bottom: 10px;
          max-width: calc(100vw - 24px);
        }
      }
    `;
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.className = 'iv-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const stage = document.createElement('div');
    stage.className = 'iv-stage';

    imgEl = document.createElement('img');
    imgEl.className = 'iv-image';
    imgEl.alt = '';

    const toolbar = document.createElement('div');
    toolbar.className = 'iv-toolbar';

    buttonZoomOut = document.createElement('button');
    buttonZoomOut.className = 'iv-button';
    buttonZoomOut.type = 'button';
    buttonZoomOut.setAttribute('aria-label', '缩小');
    buttonZoomOut.textContent = '−';

    buttonZoomIn = document.createElement('button');
    buttonZoomIn.className = 'iv-button';
    buttonZoomIn.type = 'button';
    buttonZoomIn.setAttribute('aria-label', '放大');
    buttonZoomIn.textContent = '+';

    buttonClose = document.createElement('button');
    buttonClose.className = 'iv-button';
    buttonClose.type = 'button';
    buttonClose.setAttribute('aria-label', '关闭');
    buttonClose.textContent = '×';

    const hint = document.createElement('div');
    hint.className = 'iv-hint';
    hint.textContent = '滚轮缩放，拖动平移，双击或双指缩放';

    toolbar.appendChild(buttonZoomOut);
    toolbar.appendChild(buttonZoomIn);
    toolbar.appendChild(buttonClose);

    stage.appendChild(imgEl);
    overlay.appendChild(stage);
    overlay.appendChild(toolbar);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);

    buttonZoomIn.addEventListener('click', () => zoomBy(CONFIG.zoomStep));
    buttonZoomOut.addEventListener('click', () => zoomBy(-CONFIG.zoomStep));
    buttonClose.addEventListener('click', closeViewer);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeViewer();
    });

    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') closeViewer();
      if (e.key === '+' || e.key === '=') zoomBy(CONFIG.zoomStep);
      if (e.key === '-') zoomBy(-CONFIG.zoomStep);
    });

    stage.addEventListener('wheel', onWheel, { passive: false });

    stage.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    stage.addEventListener('touchstart', onTouchStart, { passive: false });
    stage.addEventListener('touchmove', onTouchMove, { passive: false });
    stage.addEventListener('touchend', onTouchEnd, { passive: false });
    stage.addEventListener('touchcancel', onTouchEnd, { passive: false });

    window.addEventListener('resize', () => {
      if (!isOpen) return;
      constrainTranslate();
      applyTransform(false);
    });
  }

  function resetState() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    isDragging = false;
    pinchStartDistance = 0;
    pinchStartScale = 1;
    pinchCenterStart = { x: 0, y: 0 };
  }

  function getFittedImageSize() {
    const vw = window.innerWidth * 0.92;
    const vh = window.innerHeight * 0.92;

    const naturalWidth = imgEl.naturalWidth || 1;
    const naturalHeight = imgEl.naturalHeight || 1;

    const ratio = Math.min(vw / naturalWidth, vh / naturalHeight, 1);

    return {
      width: naturalWidth * ratio,
      height: naturalHeight * ratio
    };
  }

  function constrainTranslate() {
    const fitted = getFittedImageSize();
    const scaledWidth = fitted.width * scale;
    const scaledHeight = fitted.height * scale;

    const maxOffsetX = Math.max(0, (scaledWidth - window.innerWidth) / 2);
    const maxOffsetY = Math.max(0, (scaledHeight - window.innerHeight) / 2);

    translateX = clamp(translateX, -maxOffsetX, maxOffsetX);
    translateY = clamp(translateY, -maxOffsetY, maxOffsetY);
  }

  function applyTransform(withTransition = true) {
    if (!imgEl) return;
    imgEl.style.transition = withTransition
      ? `transform ${CONFIG.animationDuration}ms ease`
      : 'none';

    constrainTranslate();

    imgEl.style.width = `${getFittedImageSize().width}px`;
    imgEl.style.height = `${getFittedImageSize().height}px`;
    imgEl.style.transform =
      `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function openViewer(src, alt = '') {
    createViewer();
    resetState();

    currentSource = src;
    imgEl.src = src;
    imgEl.alt = alt || '';

    overlay.classList.add('iv-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    imgEl.onload = () => {
      applyTransform(false);
    };

    if (imgEl.complete) {
      applyTransform(false);
    }

    isOpen = true;
  }

  function closeViewer() {
    if (!overlay) return;

    isOpen = false;
    overlay.classList.remove('iv-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetState();

    imgEl.style.transition = 'none';
    imgEl.style.transform = 'translate(-50%, -50%) translate(0px, 0px) scale(1)';
    imgEl.src = '';
    currentSource = '';
  }

  function zoomTo(newScale, centerX = window.innerWidth / 2, centerY = window.innerHeight / 2) {
    const prevScale = scale;
    scale = clamp(newScale, CONFIG.minScale, CONFIG.maxScale);

    if (scale === prevScale) return;

    const dx = centerX - window.innerWidth / 2 - translateX;
    const dy = centerY - window.innerHeight / 2 - translateY;

    const ratio = scale / prevScale;
    translateX -= dx * (ratio - 1);
    translateY -= dy * (ratio - 1);

    applyTransform(false);
  }

  function zoomBy(delta) {
    zoomTo(scale + delta);
  }

  function onWheel(e) {
    if (!isOpen) return;
    e.preventDefault();

    const delta = e.deltaY < 0 ? CONFIG.zoomStep : -CONFIG.zoomStep;
    zoomTo(scale + delta, e.clientX, e.clientY);
  }

  function onMouseDown(e) {
    if (!isOpen) return;
    if (e.button !== 0) return;

    e.preventDefault();
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOriginX = translateX;
    dragOriginY = translateY;

    const stage = overlay.querySelector('.iv-stage');
    stage.classList.add('iv-dragging');
  }

  function onMouseMove(e) {
    if (!isOpen || !isDragging) return;

    translateX = dragOriginX + (e.clientX - dragStartX);
    translateY = dragOriginY + (e.clientY - dragStartY);

    applyTransform(false);
  }

  function onMouseUp() {
    if (!overlay) return;
    isDragging = false;
    const stage = overlay.querySelector('.iv-stage');
    if (stage) stage.classList.remove('iv-dragging');
  }

  function onTouchStart(e) {
    if (!isOpen) return;

    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapTime < CONFIG.doubleTapDelay) {
        e.preventDefault();
        if (scale > 1) {
          zoomTo(1, e.touches[0].clientX, e.touches[0].clientY);
          translateX = 0;
          translateY = 0;
          applyTransform(false);
        } else {
          zoomTo(2, e.touches[0].clientX, e.touches[0].clientY);
        }
      }
      lastTapTime = now;

      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      dragOriginX = translateX;
      dragOriginY = translateY;
    }

    if (e.touches.length === 2) {
      e.preventDefault();
      isDragging = false;
      pinchStartDistance = getDistance(e.touches[0], e.touches[1]);
      pinchStartScale = scale;
      pinchCenterStart = getMidpoint(e.touches[0], e.touches[1]);
    }
  }

  function onTouchMove(e) {
    if (!isOpen) return;

    if (e.touches.length === 1 && isDragging) {
      e.preventDefault();

      translateX = dragOriginX + (e.touches[0].clientX - dragStartX);
      translateY = dragOriginY + (e.touches[0].clientY - dragStartY);

      applyTransform(false);
    }

    if (e.touches.length === 2) {
      e.preventDefault();

      const distance = getDistance(e.touches[0], e.touches[1]);
      if (!pinchStartDistance) return;

      const center = getMidpoint(e.touches[0], e.touches[1]);
      const newScale = pinchStartScale * (distance / pinchStartDistance);

      zoomTo(newScale, center.x, center.y);
    }
  }

  function onTouchEnd(e) {
    if (!isOpen) return;

    if (e.touches.length === 0) {
      isDragging = false;
      pinchStartDistance = 0;
    }

    if (e.touches.length === 1) {
      pinchStartDistance = 0;
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      dragOriginX = translateX;
      dragOriginY = translateY;
    }
  }

  function bindImages(root = document) {
    const images = root.querySelectorAll(CONFIG.selector);

    images.forEach((img) => {
      if (img.dataset.ivBound === '1') return;
      if (!img.src) return;

      img.dataset.ivBound = '1';
      img.style.cursor = 'zoom-in';

      img.addEventListener('click', (e) => {
        if (e.defaultPrevented) return;
        openViewer(img.currentSrc || img.src, img.alt || '');
      });
    });
  }

  function init() {
    createViewer();
    bindImages(document);

    const observer = new MutationObserver(() => {
      bindImages(document);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();