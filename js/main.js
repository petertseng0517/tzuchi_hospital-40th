/**
 * 醫院 40 周年慶大事記網頁
 * js/main.js — 全站互動邏輯
 *
 * 功能清單：
 *   Step 2  │ Header 捲動變色
 *   Step 2  │ 手機版漢堡選單
 *   Step 2  │ 頁尾年份自動更新
 *   Step 3  │ IntersectionObserver 捲動動畫（含 data-delay 錯位進場）
 *   Step 4  │ DearFlip 延遲初始化（預留）
 */

'use strict';

/* =====================================================
   Step 2｜Header：捲動超過 80px 後加上 .scrolled
===================================================== */
(function initScrollHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 80);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 頁面重整時若已捲動，立刻套用
})();


/* =====================================================
   Step 2｜手機版漢堡選單開關
===================================================== */
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // 點選導覽連結後自動收起選單
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* =====================================================
   Step 2｜頁尾年份自動更新
===================================================== */
(function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* =====================================================
   Step 3｜IntersectionObserver 捲動動畫
   ─ 監聽所有 .fade-up 元素
   ─ 讀取 data-delay（ms）設定 transitionDelay，實現同批次錯位進場
   ─ 動畫觸發後立即 unobserve，避免重複計算
===================================================== */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  /**
   * 使用者首選「減少動畫」時，跳過動畫直接顯示
   * （支援前庭功能障礙 / 無障礙規範）
   */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el    = entry.target;
        var delay = parseInt(el.dataset.delay || '0', 10);

        /* 套用錯位延遲後加上 .is-visible，觸發 CSS transition */
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-visible');

        /* 動畫完成後清除 delay，避免影響後續可能的 hover 動畫 */
        el.addEventListener('transitionend', function cleanup() {
          el.style.transitionDelay = '';
          el.removeEventListener('transitionend', cleanup);
        }, { once: true });

        observer.unobserve(el); // 每個元素只播放一次
      });
    },
    {
      threshold: 0.12,          /* 元素露出 12% 即觸發 */
      rootMargin: '0px 0px -40px 0px' /* 底部保留 40px，避免剛出現就觸發 */
    }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();


/* =====================================================
   Step 5｜DearFlip 延遲初始化
   ─ 使用者點擊「開啟互動年冊」後才傳輸 PDF，節省院內頻寬
   ─ 依序顯示：觸發按鈕 → 旋轉動畫 → 翻頁書
   ─ 相依：libs/jquery.min.js 、 libs/dflip.min.js（需手動放入）
===================================================== */
(function initFlipbook() {
  var openBtn   = document.getElementById('open-flipbook-btn');
  var trigger   = document.getElementById('flipbook-trigger');
  var loading   = document.getElementById('flipbook-loading');
  var container = document.getElementById('flipbook-container');

  /* 任一元素缺失（例如手機版 DOM 被 CSS 隱藏前）直接返回 */
  if (!openBtn || !trigger || !loading || !container) return;

  var initialized = false;

  openBtn.addEventListener('click', function () {
    if (initialized) return;
    initialized = true;

    /* ① 切換至載入動畫 */
    trigger.hidden = true;
    loading.hidden = false;

    /* ② 確認 jQuery 與 DearFlip 已載入（防呆）*/
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.flipBook === 'undefined') {
      console.warn(
        '[Flipbook] 相依套件尚未載入。\n' +
        '請確認 libs/jquery.min.js 與 libs/dflip.min.js 已放入 libs/ 目錄。'
      );
      /* 恢復觸發按鈕，讓使用者知道出錯 */
      loading.hidden = true;
      trigger.hidden = false;
      openBtn.textContent = '載入失敗，請確認檔案後重試';
      openBtn.disabled = true;
      initialized = false;
      return;
    }

    /* ③ 設定 dFlipLocation（必須在 flipBook() 之前設定）
         告訴 dFlip 到哪裡尋找 fonts/ images/ 等內部資源 */
    window.dFlipLocation = 'libs/';

    container.hidden = false;

    jQuery(container).flipBook('docs/40th_anniversary.pdf', {
      height:               600,          /* 桌機高度（手機版由 CSS 控制）*/
      webgl:                true,         /* WebGL 加速翻頁動畫 */
      autoEnableOutline:    false,        /* 關閉自動展開目錄面板 */
      autoEnableThumbnail:  false,        /* 關閉自動展開縮圖面板 */
      overwritePDFOutline:  false,

      /* ✅ 正確的 callback 名稱是 onReady（非 loaded）*/
      onReady: function () {
        loading.hidden = true;
      }
    });
  });
})();


/* =====================================================
   歲月留影｜燈箱（Lightbox）
   ─ 點擊 .history-item 顯示原圖
   ─ 左右按鈕 / 方向鍵切換；Esc / 點擊背景關閉
===================================================== */
(function initHistoryLightbox() {
  var items     = Array.from(document.querySelectorAll('.history-item'));
  var lightbox  = document.getElementById('history-lightbox');
  var lbImg     = document.getElementById('lb-img');
  var lbCaption = document.getElementById('lb-caption');
  var btnClose  = document.getElementById('lb-close');
  var btnPrev   = document.getElementById('lb-prev');
  var btnNext   = document.getElementById('lb-next');
  if (!lightbox || !items.length) return;

  var current = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    lbImg.src = item.dataset.full;
    lbImg.alt = item.querySelector('img').alt;
    lbCaption.textContent = item.dataset.year + ' 年';
    lightbox.hidden = false;
    btnClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    lbImg.src = '';
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { show(i); });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(current - 1); });
  btnNext.addEventListener('click', function () { show(current + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
