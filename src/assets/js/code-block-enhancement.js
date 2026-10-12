/*!
 * Introduction:
 * code-block-enhancement.js
 * A drop-in script that rebuilds standalone code blocks into a unified, compact,
 * theme-aware component. It samples the original block's visual style
 * (border/background/radius/font/line-height/colors), then reconstructs a cleaner
 * container with a compact toolbar, code area, copy, and optional run action.
 *
 * Usage:
 * 1. Load this file on any page containing code blocks.
 * 2. It runs automatically; no manual initialization is required.
 * 3. Customize by editing CONFIG below, or by calling updateConfig({ ... }).
 *
 * Global API:
 * - window.updateConfig(partialConfig): Merge config and rebuild all processed blocks.
 * - window.CodeBlockEnhancement.updateConfig(partialConfig): Same as above.
 * - window.CodeBlockEnhancement.rescan(): Re-scan the page manually.
 *
 * Notes:
 * - Inline markdown code is ignored.
 * - Real block-level code is rebuilt into a unified component for visual consistency.
 * - Original syntax-highlighted DOM is preserved inside the new body when possible.
 * - The original code block node is stored and can be restored during rebuild/reset.
 */

(function () {
  'use strict';

  const CONFIG = {
    CANDIDATE_SELECTORS: [
      'pre',
      '.highlight',
      '.hljs',
      '.codehilite',
      '[class*="highlight-source-"]',
      '[class^="language-"]',
      '[class*=" language-"]'
    ],

    PROCESSED_ATTR: 'data-cbe-processed',
    PLACEHOLDER_ATTR: 'data-cbe-placeholder',
    ROOT_CLASS: 'cbe-block',
    HEADER_CLASS: 'cbe-header',
    BODY_CLASS: 'cbe-body',
    TITLE_CLASS: 'cbe-title',
    ACTIONS_CLASS: 'cbe-actions',
    STYLE_ATTR: 'data-cbe-style',
    STORE_KEY: '__cbe_original__',

    DEFAULT_LANGUAGE_LABEL: 'Text',
    BLOCK_MIN_TEXT_LENGTH: 12,
    SCROLLBAR_SIZE: '4.5px',
    SCROLLBAR_THUMB_ALPHA: 1,
    SCROLLBAR_TRACK_ALPHA: 0.035,

    ENABLE_COPY_BUTTON: true,
    ENABLE_RUN_BUTTON: true,
    OBSERVE_MUTATIONS: true,
    AUTO_STYLE: true,

    COPY_LABEL: 'Copy',
    COPIED_LABEL: 'Copied',
    RUN_LABEL: 'Run',

    // fontawesome version <= "4.6.0"
    TERMINAL_ICON_CLASS: 'fa fa-terminal',
    COPY_ICON_CLASS: 'fa fa-copy',
    RUN_ICON_CLASS: 'fa fa-play',

    // fontawesome version >= "4.6.0"
    // TERMINAL_ICON_CLASS: 'fa-solid fa-terminal',
    // COPY_ICON_CLASS: 'fa-solid fa-copy',
    // RUN_ICON_CLASS: 'fa-solid fa-play',

    HEADER_PADDING_Y: 6,
    HEADER_PADDING_X: 10,
    ACTION_GAP: 8,
    BUTTON_PADDING_Y: 2,
    BUTTON_PADDING_X: 6,
    BUTTON_RADIUS: 6,
    MIN_BORDER_ALPHA: 0.12,
    SEPARATOR_ALPHA: 0.10,
    HEADER_BG_ALPHA: 0.035,
    ACTION_BG_ALPHA: 0.05,
    ACTION_BORDER_ALPHA: 0.12,
    RUN_TARGET: '_blank',

    RUN_URL_BUILDERS: {
      python: (code) => `https://onecompiler.com/python?code=${encodeURIComponent(code)}`,
      javascript: (code) => `https://onecompiler.com/javascript?code=${encodeURIComponent(code)}`,
      typescript: (code) => `https://onecompiler.com/typescript?code=${encodeURIComponent(code)}`,
      java: (code) => `https://onecompiler.com/java?code=${encodeURIComponent(code)}`,
      cpp: (code) => `https://onecompiler.com/cpp?code=${encodeURIComponent(code)}`,
      c: (code) => `https://onecompiler.com/c?code=${encodeURIComponent(code)}`,
      csharp: (code) => `https://onecompiler.com/csharp?code=${encodeURIComponent(code)}`,
      go: (code) => `https://onecompiler.com/go?code=${encodeURIComponent(code)}`,
      rust: (code) => `https://onecompiler.com/rust?code=${encodeURIComponent(code)}`,
      ruby: (code) => `https://onecompiler.com/ruby?code=${encodeURIComponent(code)}`,
      php: (code) => `https://onecompiler.com/php?code=${encodeURIComponent(code)}`,
      swift: (code) => `https://onecompiler.com/swift?code=${encodeURIComponent(code)}`,
      kotlin: (code) => `https://onecompiler.com/kotlin?code=${encodeURIComponent(code)}`,
      scala: (code) => `https://onecompiler.com/scala?code=${encodeURIComponent(code)}`,
      r: (code) => `https://onecompiler.com/r?code=${encodeURIComponent(code)}`,
      sql: (code) => `https://onecompiler.com/mysql?code=${encodeURIComponent(code)}`,
      bash: (code) => `https://onecompiler.com/bash?code=${encodeURIComponent(code)}`,
      shell: (code) => `https://onecompiler.com/bash?code=${encodeURIComponent(code)}`,
      sh: (code) => `https://onecompiler.com/bash?code=${encodeURIComponent(code)}`
    },
    SKIP_LANGUAGES: new Set([
      'mermaid',
      'katex',
      'math'
    ]),

    SKIP_SELECTORS: [
      '.mermaid',
      '.katex',
      '.MathJax',
      '[class*="language-mermaid"]',
      '[class*="lang-mermaid"]',
      '[data-language="mermaid"]',
      '[data-lang="mermaid"]'
    ],
  };

  const state = {
    observer: null,
    scanTimer: null,
    styleInjected: false
  };

  const LANGUAGE_ALIASES = {
    py: 'python',
    python3: 'python',
    js: 'javascript',
    mjs: 'javascript',
    node: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    rb: 'ruby',
    cs: 'csharp',
    'c#': 'csharp',
    'c++': 'cpp',
    cplusplus: 'cpp',
    golang: 'go',
    shell: 'bash',
    zsh: 'bash',
    console: 'bash',
    plaintext: 'text',
    txt: 'text',
    md: 'markdown',
    mmd: 'mermaid',
    yml: 'yaml'
  };

  const LANGUAGE_LABELS = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    csharp: 'C#',
    go: 'Go',
    rust: 'Rust',
    ruby: 'Ruby',
    php: 'PHP',
    swift: 'Swift',
    kotlin: 'Kotlin',
    scala: 'Scala',
    r: 'R',
    sql: 'SQL',
    bash: 'Bash',
    powershell: 'PowerShell',
    html: 'HTML',
    css: 'CSS',
    xml: 'XML',
    json: 'JSON',
    yaml: 'YAML',
    markdown: 'Markdown',
    mermaid: 'Mermaid',
    text: 'Text'
  };

  function updateConfig(partial) {
    if (!partial || typeof partial !== 'object') return;
    deepMerge(CONFIG, partial);
    ensureStyles();
    rescan(true);
  }

  function deepMerge(target, source) {
    Object.keys(source).forEach((key) => {
      const s = source[key];
      const t = target[key];
      if (isPlainObject(t) && isPlainObject(s)) deepMerge(t, s);
      else target[key] = s;
    });
  }

  function isPlainObject(value) {
    return !!value && Object.prototype.toString.call(value) === '[object Object]';
  }

  function init() {
    ensureStyles();
    rescan(false);
    if (CONFIG.OBSERVE_MUTATIONS) startObserver();
  }
  /** Check whether a node or its subtree should be skipped entirely. @param {HTMLElement} node Candidate node. @returns {boolean} Whether to skip. */
  function shouldSkipNode(node) {
    if (!node || !(node instanceof HTMLElement)) return true;
    if (node.matches(CONFIG.SKIP_SELECTORS.join(','))) return true;
    if (node.closest(CONFIG.SKIP_SELECTORS.join(','))) return true;
    return false;
  }
  /** Check whether detected language or markup should be skipped. @param {string} language Normalized language. @param {HTMLElement} root Logical root. @returns {boolean} Whether to skip rebuild. */
  function shouldSkipLanguage(language, root) {
    if (language && CONFIG.SKIP_LANGUAGES.has(language)) return true;
    if (root && root.matches(CONFIG.SKIP_SELECTORS.join(','))) return true;
    if (root && root.querySelector(CONFIG.SKIP_SELECTORS.join(','))) return true;
    return false;
  }
  function rescan(reset) {
    if (reset) resetProcessedBlocks();
    collectStandaloneBlocks().forEach(enhanceBlock);
  }

  function resetProcessedBlocks() {
    document.querySelectorAll(`[${CONFIG.PLACEHOLDER_ATTR}="1"]`).forEach((placeholder) => {
      const original = placeholder[CONFIG.STORE_KEY];
      if (!original || !placeholder.parentNode) return;
      placeholder.parentNode.replaceChild(original, placeholder);
    });

    document.querySelectorAll(`[${CONFIG.PROCESSED_ATTR}="1"]`).forEach((el) => {
      el.removeAttribute(CONFIG.PROCESSED_ATTR);
    });
  }

  function startObserver() {
    if (state.observer) state.observer.disconnect();

    state.observer = new MutationObserver((mutations) => {
      const shouldScan = mutations.some((m) => m.type === 'childList' && m.addedNodes && m.addedNodes.length);
      if (!shouldScan) return;
      clearTimeout(state.scanTimer);
      state.scanTimer = setTimeout(() => rescan(false), 120);
    });

    state.observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function ensureStyles() {
    if (!CONFIG.AUTO_STYLE || state.styleInjected) return;
    if (document.querySelector(`style[${CONFIG.STYLE_ATTR}="1"]`)) {
      state.styleInjected = true;
      return;
    }

    const style = document.createElement('style');
    style.setAttribute(CONFIG.STYLE_ATTR, '1');
    style.textContent = `
      .${CONFIG.ROOT_CLASS} {
        display: block;
        overflow: hidden;
        width: 100%;
        box-sizing: border-box;
      }

      .${CONFIG.HEADER_CLASS} {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${CONFIG.ACTION_GAP}px;
        min-width: 0;
        box-sizing: border-box;
      }

      .${CONFIG.TITLE_CLASS},
      .${CONFIG.ACTIONS_CLASS} {
        display: flex;
        align-items: center;
        min-width: 0;
      }

      .${CONFIG.TITLE_CLASS} {
        gap: ${CONFIG.ACTION_GAP}px;
      }

      .${CONFIG.ACTIONS_CLASS} {
        gap: ${CONFIG.ACTION_GAP}px;
        flex-wrap: wrap;
      }

      .${CONFIG.ROOT_CLASS} .cbe-lang {
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: .86;
      }

      .${CONFIG.ROOT_CLASS} .cbe-button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        text-decoration: none;
        font: inherit;
        line-height: 1.2;
        box-sizing: border-box;
      }

      .${CONFIG.BODY_CLASS} {
        display: block;
        min-width: 0;
        overflow: auto;
        box-sizing: border-box;
      }
      .${CONFIG.BODY_CLASS},
      .${CONFIG.BODY_CLASS} > pre,
      .${CONFIG.BODY_CLASS} pre {
        scrollbar-width: thin;
        scrollbar-color: var(--cbe-scrollbar-thumb) var(--cbe-scrollbar-track);
      }

      .${CONFIG.BODY_CLASS}::-webkit-scrollbar,
      .${CONFIG.BODY_CLASS} > pre::-webkit-scrollbar,
      .${CONFIG.BODY_CLASS} pre::-webkit-scrollbar {
        width: ${CONFIG.SCROLLBAR_SIZE};
        height: ${CONFIG.SCROLLBAR_SIZE};
      }

      .${CONFIG.BODY_CLASS}::-webkit-scrollbar-thumb,
      .${CONFIG.BODY_CLASS} > pre::-webkit-scrollbar-thumb,
      .${CONFIG.BODY_CLASS} pre::-webkit-scrollbar-thumb {
        background: var(--cbe-scrollbar-thumb);
        border-radius: 999px;
      }

      .${CONFIG.BODY_CLASS}::-webkit-scrollbar-track,
      .${CONFIG.BODY_CLASS} > pre::-webkit-scrollbar-track,
      .${CONFIG.BODY_CLASS} pre::-webkit-scrollbar-track {
        background: var(--cbe-scrollbar-track);
        border-radius: 999px;
      }

      .${CONFIG.BODY_CLASS}::-webkit-scrollbar-corner,
      .${CONFIG.BODY_CLASS} > pre::-webkit-scrollbar-corner,
      .${CONFIG.BODY_CLASS} pre::-webkit-scrollbar-corner {
        background: transparent;
      }
      .${CONFIG.BODY_CLASS} > pre,
      .${CONFIG.BODY_CLASS} > .highlight,
      .${CONFIG.BODY_CLASS} > .hljs,
      .${CONFIG.BODY_CLASS} > .codehilite,
      .${CONFIG.BODY_CLASS} > [class*="highlight-source-"] {
        margin: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .${CONFIG.BODY_CLASS} > pre {
        white-space: pre;
      }
    `;
    document.head.appendChild(style);
    state.styleInjected = true;
  }

  function collectStandaloneBlocks() {
    const out = [];
    const seen = new Set();

    document.querySelectorAll(CONFIG.CANDIDATE_SELECTORS.join(',')).forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (shouldSkipNode(node)) return;
      const root = findLogicalRoot(node);
      if (!root) return;
      if (seen.has(root)) return;
      seen.add(root);
      out.push(root);
    });

    return out.filter(isEnhanceableRoot);
  }

  function findLogicalRoot(node) {
    if (!node || !(node instanceof HTMLElement)) return null;
    if (node.closest(`.${CONFIG.ROOT_CLASS}`)) return null;
    if (node.getAttribute(CONFIG.PROCESSED_ATTR) === '1') return null;

    if (node.tagName.toLowerCase() === 'code') {
      const pre = node.closest('pre');
      const codeBox = node.closest('.highlight, .hljs, .codehilite, [class*="highlight-source-"], [class^="language-"], [class*=" language-"]');
      if (!pre && !codeBox) return null;
    }

    let current = node.closest('pre') || node;

    let promoted = true;
    while (promoted) {
      promoted = false;
      const parent = current.parentElement;
      if (!parent) break;
      if (isSameLogicalBlockContainer(parent, current)) {
        current = parent;
        promoted = true;
      }
    }

    return current;
  }

  function isSameLogicalBlockContainer(parent, child) {
    if (!parent || !child) return false;
    if (parent === document.body || parent === document.documentElement) return false;
    if (parent.children.length !== 1) return false;

    const parentTag = parent.tagName.toLowerCase();
    const childTag = child.tagName.toLowerCase();

    if (parentTag === 'pre' && childTag === 'code') return true;
    if (parent.matches('.highlight, .hljs, .codehilite, [class*="highlight-source-"]')) return true;

    if (
      parent.matches('[class^="language-"], [class*=" language-"]') &&
      (parent.classList.contains('highlighter-rouge') || parent.querySelector(':scope > pre, :scope > .highlight, :scope > .hljs, :scope > .codehilite'))
    ) {
      return true;
    }

    return false;
  }

  function isEnhanceableRoot(root) {
    if (!root || !(root instanceof HTMLElement)) return false;
    if (root.getAttribute(CONFIG.PROCESSED_ATTR) === '1') return false;
    if (!isVisible(root)) return false;
    if (!containsRealBlockCode(root)) return false;

    const text = extractCodeText(root);
    if (!text || text.trim().length < CONFIG.BLOCK_MIN_TEXT_LENGTH) return false;

    return true;
  }

  function isVisible(el) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (el.offsetParent === null && style.position !== 'fixed') return false;
    return true;
  }

  function containsRealBlockCode(el) {
    const tag = el.tagName.toLowerCase();

    if (tag === 'pre') return true;
    if (tag === 'code') return false;
    if (el.matches('.highlight, .hljs, .codehilite, [class*="highlight-source-"]')) return true;
    if (el.matches('[class^="language-"], [class*=" language-"]') && el.querySelector('pre, .highlight, .hljs, .codehilite')) return true;
    if (el.querySelector(':scope > pre, :scope > .highlight, :scope > .hljs, :scope > .codehilite')) return true;

    return false;
  }

  function extractCodeText(root) {
    const source = root.matches('pre') ? root : (root.querySelector('pre') || root.querySelector('code'));
    const text = source ? (source.innerText || source.textContent || '') : (root.innerText || root.textContent || '');
    return String(text).replace(/\r\n?/g, '\n').replace(/\s+$/, '');
  }

  function enhanceBlock(root) {
    if (!root || root.getAttribute(CONFIG.PROCESSED_ATTR) === '1') return;

    const codeText = extractCodeText(root);
    if (!codeText) return;

    const visualSource = pickVisualSource(root);
    const theme = sampleTheme(visualSource || root);
    const contentNode = cloneCodeContent(visualSource || root);
    if (!contentNode) return;

    const language = detectLanguage(root, codeText);
    if (shouldSkipLanguage(language, root)) return; // Skip mermaid-like blocks.

    const languageLabel = LANGUAGE_LABELS[language] || toTitleCase(language || CONFIG.DEFAULT_LANGUAGE_LABEL.toLowerCase()) || CONFIG.DEFAULT_LANGUAGE_LABEL;
    const rebuilt = buildUnifiedBlock({
      theme,
      contentNode,
      codeText,
      language,
      languageLabel
    });

    const placeholder = document.createElement('div');
    placeholder.setAttribute(CONFIG.PLACEHOLDER_ATTR, '1');
    placeholder.setAttribute(CONFIG.PROCESSED_ATTR, '1');
    placeholder[CONFIG.STORE_KEY] = root;

    root.setAttribute(CONFIG.PROCESSED_ATTR, '1');
    root.parentNode.replaceChild(placeholder, root);
    placeholder.appendChild(rebuilt);
  }

  function pickVisualSource(root) {
    if (!root || !(root instanceof HTMLElement)) return null;
    return (
      root.querySelector('.highlight, .hljs, .codehilite, [class*="highlight-source-"]') ||
      root.querySelector('pre') ||
      root
    );
  }

  function cloneCodeContent(source) {
    if (!source || !(source instanceof HTMLElement)) return null;

    if (source.tagName.toLowerCase() === 'pre') {
      return source.cloneNode(true);
    }

    const pre = source.querySelector(':scope > pre') || source.querySelector('pre');
    if (pre) return pre.cloneNode(true);

    return source.cloneNode(true);
  }

  function sampleTheme(source) {
    const s = getComputedStyle(source);
    const parent = source.parentElement ? getComputedStyle(source.parentElement) : s;

    const bg = pickFirstVisibleColor([
      s.backgroundColor,
      parent.backgroundColor,
      '#111111'
    ]);

    const fg = pickFirstVisibleColor([
      s.color,
      parent.color,
      '#e6e6e6'
    ]);

    const borderColor = pickFirstVisibleColor([
      s.borderTopColor,
      s.borderColor,
      mixColorWithAlpha(fg, CONFIG.MIN_BORDER_ALPHA),
      'rgba(127,127,127,0.16)'
    ]);

    const radius = firstNonEmpty([
      s.borderTopLeftRadius,
      s.borderRadius,
      parent.borderRadius,
      '8px'
    ]);

    const fontFamily = firstNonEmpty([
      s.fontFamily,
      parent.fontFamily,
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace'
    ]);

    const fontSize = firstNonEmpty([
      s.fontSize,
      parent.fontSize,
      '14px'
    ]);

    const lineHeight = normalizeLineHeight(firstNonEmpty([
      s.lineHeight,
      parent.lineHeight,
      '1.5'
    ]), fontSize);

    const borderWidth = hasVisibleBorder(s) ? firstNonEmpty([s.borderTopWidth, '1px']) : '1px';
    const boxShadow = s.boxShadow && s.boxShadow !== 'none' ? s.boxShadow : 'none';

    return {
      background: bg,
      color: fg,
      borderColor,
      borderWidth,
      borderRadius: radius,
      fontFamily,
      fontSize,
      lineHeight,
      boxShadow
    };
  }

  function buildUnifiedBlock(ctx) {
    const { theme, contentNode, codeText, language, languageLabel } = ctx;

    const root = document.createElement('div');
    root.className = CONFIG.ROOT_CLASS;
    root.setAttribute(CONFIG.PROCESSED_ATTR, '1');

    root.style.background = theme.background;
    root.style.color = theme.color;
    root.style.border = `${theme.borderWidth} solid ${theme.borderColor}`;
    root.style.borderRadius = theme.borderRadius;
    root.style.boxShadow = theme.boxShadow;
    root.style.fontFamily = theme.fontFamily;
    root.style.fontSize = theme.fontSize;
    root.style.lineHeight = theme.lineHeight;

    const header = document.createElement('div');
    header.className = CONFIG.HEADER_CLASS;
    header.style.padding = `${CONFIG.HEADER_PADDING_Y}px ${CONFIG.HEADER_PADDING_X}px`;
    header.style.background = mixColorWithAlpha(theme.color, CONFIG.HEADER_BG_ALPHA);
    header.style.borderBottom = `1px solid ${mixColorWithAlpha(theme.color, CONFIG.SEPARATOR_ALPHA)}`;

    const title = document.createElement('div');
    title.className = CONFIG.TITLE_CLASS;

    const actions = document.createElement('div');
    actions.className = CONFIG.ACTIONS_CLASS;

    title.appendChild(makeIcon(CONFIG.TERMINAL_ICON_CLASS));
    title.appendChild(makeSpan('cbe-lang', languageLabel));

    if (CONFIG.ENABLE_COPY_BUTTON) {
      const copybutton = document.createElement('button');
      copybutton.type = 'button';
      copybutton.className = 'cbe-button';
      copybutton.style.padding = `${CONFIG.BUTTON_PADDING_Y}px ${CONFIG.BUTTON_PADDING_X}px`;
      copybutton.style.borderRadius = `${CONFIG.BUTTON_RADIUS}px`;
      copybutton.style.color = theme.color;
      copybutton.style.background = mixColorWithAlpha(theme.color, CONFIG.ACTION_BG_ALPHA);
      copybutton.style.border = `1px solid ${mixColorWithAlpha(theme.color, CONFIG.ACTION_BORDER_ALPHA)}`;
      copybutton.appendChild(makeIcon(CONFIG.COPY_ICON_CLASS));
      copybutton.appendChild(document.createTextNode(CONFIG.COPY_LABEL));
      copybutton.addEventListener('click', async () => {
        const ok = await copyText(codeText);
        const textNode = copybutton.lastChild;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          textNode.textContent = ok ? CONFIG.COPIED_LABEL : CONFIG.COPY_LABEL;
          setTimeout(() => { textNode.textContent = CONFIG.COPY_LABEL; }, 1200);
        }
      });
      actions.appendChild(copybutton);
    }

    if (CONFIG.ENABLE_RUN_BUTTON) {
      const runUrl = buildRunUrl(language, codeText);
      if (runUrl) {
        const runLink = document.createElement('a');
        runLink.className = 'cbe-button';
        runLink.href = runUrl;
        runLink.target = CONFIG.RUN_TARGET;
        runLink.rel = 'noopener noreferrer';
        runLink.style.padding = `${CONFIG.BUTTON_PADDING_Y}px ${CONFIG.BUTTON_PADDING_X}px`;
        runLink.style.borderRadius = `${CONFIG.BUTTON_RADIUS}px`;
        runLink.style.color = theme.color;
        runLink.style.background = mixColorWithAlpha(theme.color, CONFIG.ACTION_BG_ALPHA);
        runLink.style.border = `1px solid ${mixColorWithAlpha(theme.color, CONFIG.ACTION_BORDER_ALPHA)}`;
        runLink.appendChild(makeIcon(CONFIG.RUN_ICON_CLASS));
        runLink.appendChild(document.createTextNode(CONFIG.RUN_LABEL));
        actions.appendChild(runLink);
      }
    }

    header.appendChild(title);
    header.appendChild(actions);

    const body = document.createElement('div');
    body.className = CONFIG.BODY_CLASS;
    body.style.padding = '0';
    body.style.background = theme.background;
    body.style.color = theme.color;
    body.style.setProperty('--cbe-scrollbar-thumb', theme.borderColor);
    body.style.setProperty('--cbe-scrollbar-track', mixColorWithAlpha(theme.color, CONFIG.SCROLLBAR_TRACK_ALPHA));

    normalizeContentNode(contentNode, theme);
    body.appendChild(contentNode);

    root.appendChild(header);
    root.appendChild(body);

    return root;
  }

  function normalizeContentNode(node, theme) {
    if (!(node instanceof HTMLElement)) return;

    const rootTag = node.tagName.toLowerCase();

    if (rootTag === 'pre') {
      node.style.margin = '0';
      node.style.paddingTop = '10px';
      node.style.paddingRight = '12px';
      node.style.paddingBottom = '12px';
      node.style.paddingLeft = '12px';
      node.style.background = 'transparent';
      node.style.border = '0';
      node.style.borderRadius = '0';
      node.style.boxShadow = 'none';
      node.style.overflow = 'auto';
      node.style.color = 'inherit';
      node.style.fontFamily = theme.fontFamily;
      node.style.fontSize = theme.fontSize;
      node.style.lineHeight = theme.lineHeight;
      return;
    }

    node.style.margin = '0';
    node.style.background = 'transparent';
    node.style.border = '0';
    node.style.borderRadius = '0';
    node.style.boxShadow = 'none';
    node.style.color = 'inherit';

    const pre = node.querySelector('pre');
    if (pre) {
      pre.style.margin = '0';
      pre.style.paddingTop = '10px';
      pre.style.paddingRight = '12px';
      pre.style.paddingBottom = '12px';
      pre.style.paddingLeft = '12px';
      pre.style.background = 'transparent';
      pre.style.border = '0';
      pre.style.borderRadius = '0';
      pre.style.boxShadow = 'none';
      pre.style.overflow = 'auto';
      pre.style.color = 'inherit';
      pre.style.fontFamily = theme.fontFamily;
      pre.style.fontSize = theme.fontSize;
      pre.style.lineHeight = theme.lineHeight;
    } else {
      node.style.paddingTop = '10px';
      node.style.paddingRight = '12px';
      node.style.paddingBottom = '12px';
      node.style.paddingLeft = '12px';
      node.style.fontFamily = theme.fontFamily;
      node.style.fontSize = theme.fontSize;
      node.style.lineHeight = theme.lineHeight;
      node.style.overflow = 'auto';
    }

    node.querySelectorAll('button.copy-code-button, .copy-code-button, [data-copy], [class*="copy"]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.closest(`.${CONFIG.ROOT_CLASS}`)) return;
      el.remove();
    });
  }

  function detectLanguage(root, codeText) {
    const hints = [];
    collectLanguageHints(root).forEach((v) => hints.push(v));
    root.querySelectorAll('pre, code, .highlight, .hljs, .codehilite, [class*="highlight-source-"], [class^="language-"], [class*=" language-"]').forEach((el) => {
      if (el instanceof HTMLElement) collectLanguageHints(el).forEach((v) => hints.push(v));
    });

    for (const hint of hints) {
      const normalized = normalizeLanguage(hint);
      if (normalized) return normalized;
    }

    return guessLanguageFromContent(codeText) || 'text';
  }

  function collectLanguageHints(el) {
    const out = [];
    if (!el) return out;

    const attrs = [
      el.getAttribute('data-language'),
      el.getAttribute('data-lang'),
      el.getAttribute('lang'),
      el.getAttribute('data-code-language')
    ].filter(Boolean);

    out.push(...attrs);

    const className = typeof el.className === 'string' ? el.className : '';
    if (className) {
      const patterns = [
        /language-([a-z0-9+#._-]+)/gi,
        /\blang(?:uage)?-([a-z0-9+#._-]+)/gi,
        /\bbrush:\s*([a-z0-9+#._-]+)/gi,
        /\bhighlight-source-([a-z0-9+#._-]+)/gi
      ];
      patterns.forEach((re) => {
        let m;
        while ((m = re.exec(className))) out.push(m[1]);
      });
    }

    return out;
  }

  function normalizeLanguage(raw) {
    if (!raw) return null;

    let token = String(raw).trim().toLowerCase();
    token = token.replace(/^language-/, '').replace(/^lang-/, '').replace(/^brush:/, '').trim();
    token = token.replace(/[.].*$/, '');
    token = token.replace(/[^a-z0-9+#-]/g, '');

    if (!token) return null;
    if (LANGUAGE_ALIASES[token]) return LANGUAGE_ALIASES[token];
    if (LANGUAGE_LABELS[token]) return token;
    if (token === 'plain' || token === 'none') return 'text';

    return token;
  }

  function guessLanguageFromContent(codeText) {
    const s = codeText || '';

    if (/^\s*#include\s+<.+>/m.test(s) || /\bstd::\w+/.test(s)) return 'cpp';
    if (/\bconsole\.log\s*\(/.test(s) || /\b(?:const|let|var)\s+\w+/.test(s)) return 'javascript';
    if (/\bdef\s+\w+\s*\(/.test(s) || /\bprint\s*\(/.test(s)) return 'python';
    if (/\bpublic\s+class\s+\w+/.test(s) || /\bSystem\.out\.println\s*\(/.test(s)) return 'java';
    if (/\bpackage\s+main\b/.test(s) || /\bfmt\.Println\s*\(/.test(s)) return 'go';
    if (/\bfn\s+\w+\s*\(/.test(s) || /\blet\s+mut\s+/.test(s)) return 'rust';
    if (/<[a-z][\s\S]*>/i.test(s) && /<\/[a-z]+>/i.test(s)) return 'html';
    if (/^\s*[.#]?[a-z0-9_-]+\s*\{[\s\S]*:\s*[^;]+;/mi.test(s)) return 'css';
    if (/^\s*SELECT\b[\s\S]*\bFROM\b/im.test(s)) return 'sql';
    if (/^\s*[{[][\s\S]*[}\]]\s*$/.test(s)) return 'json';
    if (/^\s*[-\w"']+\s*:\s*.+/m.test(s) && !/[{};]/.test(s)) return 'yaml';
    if (/^\s*#!/.test(s) || /\becho\s+/.test(s)) return 'bash';

    return null;
  }

  function buildRunUrl(language, code) {
    const builder = CONFIG.RUN_URL_BUILDERS[language];
    if (typeof builder !== 'function') return null;
    try {
      return builder(code);
    } catch (_) {
      return null;
    }
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { }

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      ta.style.pointerEvents = 'none';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return !!ok;
    } catch (_) {
      return false;
    }
  }

  function makeIcon(className) {
    const i = document.createElement('i');
    i.className = className;
    i.setAttribute('aria-hidden', 'true');
    return i;
  }

  function makeSpan(className, text) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    return span;
  }

  function pickFirstVisibleColor(values) {
    for (const value of values) {
      if (!value) continue;
      const normalized = String(value).trim();
      if (!normalized || normalized === 'transparent' || normalized === 'rgba(0, 0, 0, 0)') continue;
      return normalized;
    }
    return 'rgba(0, 0, 0, 0.85)';
  }

  function hasVisibleBorder(style) {
    const width = parseFloat(style.borderTopWidth || '0');
    const color = style.borderTopColor || style.borderColor || '';
    return width > 0 && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)';
  }

  function firstNonEmpty(values) {
    for (const value of values) {
      if (value != null && String(value).trim()) return String(value).trim();
    }
    return '';
  }

  function normalizeLineHeight(lineHeight, fontSize) {
    if (!lineHeight || lineHeight === 'normal') return '1.5';
    if (/px$/.test(lineHeight) && /px$/.test(fontSize)) {
      const lh = parseFloat(lineHeight);
      const fs = parseFloat(fontSize);
      if (lh > 0 && fs > 0) return String(lh / fs);
    }
    return lineHeight;
  }

  function mixColorWithAlpha(color, alpha) {
    const rgba = parseColor(color);
    if (!rgba) return `rgba(127,127,127,${alpha})`;
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
  }

  function parseColor(color) {
    if (!color) return null;
    const s = String(color).trim();

    let m = s.match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
      const parts = m[1].split(',').map((x) => parseFloat(x.trim()));
      if (parts.length >= 3) return { r: parts[0], g: parts[1], b: parts[2] };
    }

    m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      const hex = m[1];
      if (hex.length === 3) {
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16)
        };
      }
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      };
    }

    return null;
  }

  function toTitleCase(value) {
    return String(value || '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  window.updateConfig = updateConfig;
  window.CodeBlockEnhancement = {
    updateConfig,
    rescan: () => rescan(true)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();