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
   開場動畫 Intro Splash
   ─ 取材自 40 周年特刊書封分層素材（images/intro/）
   ─ 第一幕（0–5s）：封底全景 + 小船滑行
   ─ 轉場（5–6s）：全暗
   ─ 第二幕（6–11s）：封面場景，醫院淡入 → 大船航向大海
   ─ 每個瀏覽階段（sessionStorage）只播放一次；
     index.html 內已有一段行內 script 在 CSS/其餘 JS 載入前
     先行隱藏，避免換頁時閃現
   ─ 可點擊「略過動畫」或按任意鍵跳過
   ─ 偵測 prefers-reduced-motion 時完全不播放（CSS 亦有防呆）
===================================================== */
(function initIntroSplash() {
  var splash = document.getElementById('intro-splash');
  if (!splash) return;

  /* 本階段已播放過，或使用者偏好減少動畫 → 直接移除，不執行動畫 */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sessionStorage.getItem('introShown') || prefersReduced) {
    splash.remove();
    return;
  }

  var act1     = document.getElementById('intro-act-1');
  var act2     = document.getElementById('intro-act-2');
  var boat     = document.getElementById('intro-boat');
  var blackout = document.getElementById('intro-blackout');
  var hospital = document.getElementById('intro-hospital');
  var ship     = document.getElementById('intro-ship');
  var skipBtn  = document.getElementById('intro-skip');
  if (!act1 || !act2 || !boat || !blackout || !hospital || !ship || !skipBtn) {
    splash.remove();
    return;
  }

  document.body.classList.add('intro-active');

  var timers  = [];
  var finished = false;

  function at(ms, fn) {
    timers.push(setTimeout(fn, ms));
  }

  function finish() {
    if (finished) return;
    finished = true;

    timers.forEach(clearTimeout);
    sessionStorage.setItem('introShown', '1');
    document.body.classList.remove('intro-active');

    splash.classList.add('is-hidden');
    splash.addEventListener('transitionend', function onEnd() {
      splash.remove();
    }, { once: true });

    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown() {
    finish();
  }

  /* ── 第一幕：封底全景淡入 + 小船滑行（0s–5s）── */
  act1.classList.add('is-visible');
  at(150, function () { boat.classList.add('is-sailing'); });

  /* ── 轉場：全暗（5s 開始，維持到 6s）── */
  at(5000, function () { blackout.classList.add('is-visible'); });

  /* ── 第二幕：封面場景，黑幕淡出（6s）── */
  at(6000, function () {
    act1.classList.remove('is-visible');
    act2.classList.add('is-visible');
    blackout.classList.remove('is-visible');
  });
  at(6600, function () { hospital.classList.add('is-visible'); });
  at(7400, function () { ship.classList.add('is-visible'); });

  /* ── 全劇終：11s 後淡出整個開場動畫 ── */
  at(11000, finish);

  skipBtn.addEventListener('click', finish);
  document.addEventListener('keydown', onKeydown);
  skipBtn.focus();
})();


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
   Timeline Accordion｜折疊式時間軸開關
   ─ 點擊年代標題展開／收合對應里程碑列表
   ─ 可同時開啟多個年代（非互斥）
===================================================== */
(function initTimelineAccordion() {
  var eras = document.querySelectorAll('.tl-era');
  if (!eras.length) return;

  eras.forEach(function (era) {
    var btn = era.querySelector('.tl-era__header');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = era.classList.contains('is-open');

      // 關閉所有已開啟的 era
      eras.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.tl-era__header').setAttribute('aria-expanded', 'false');
      });

      // 若原本是關閉的，才展開（點已開啟的項目則收合）
      if (!isOpen) {
        era.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* =====================================================
   Step 5｜DearFlip 延遲初始化
   ─ 使用者點擊「開啟互動特刊」後才傳輸 PDF，節省院內頻寬
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

    /* ⓪ 以 file:// 直接開啟 index.html 時，瀏覽器會擋掉讀取 PDF 的請求
         （Cannot access file! 404），翻頁書會卡在「載入中」動畫不會結束。
         這裡先偵測協定，直接給出明確提示，而非讓使用者誤以為功能壞掉。 */
    if (window.location.protocol === 'file:') {
      openBtn.textContent = '請透過本機伺服器開啟本頁（見 README）';
      openBtn.disabled = true;
      return;
    }

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


/* =====================================================
   歲月留影｜自動向左緩慢捲動
   ─ 進入視窗後才開始播放（IntersectionObserver），離開視窗即暫停
   ─ 使用者以滑鼠 hover／觸控／滾輪手動瀏覽時暫停，停止互動一段時間後才恢復
   ─ 捲到底自動回到開頭，循環播放
   ─ 支援 prefers-reduced-motion：偏好減少動畫者不啟動自動捲動
===================================================== */
(function initHistoryAutoScroll() {
  var wrap = document.querySelector('.history-strip-wrap');
  if (!wrap) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SPEED        = 28;   /* 每秒捲動像素數，數字越小越慢 */
  var RESUME_DELAY = 2500; /* 使用者停止互動後，幾毫秒才恢復自動捲動 */

  var rafId       = null;
  var lastTime    = null;
  var paused      = false;
  var resumeTimer = null;
  var inView      = false;
  /* 用獨立浮點數累積捲動位置，不要每幀讀回 wrap.scrollLeft ——
     瀏覽器會把 scrollLeft 四捨五入成整數像素，這個速度下每幀增量不到 0.5px，
     若直接讀回會被整數化吃掉，永遠捲不動。 */
  var scrollPos   = wrap.scrollLeft;

  function step(time) {
    if (lastTime === null) lastTime = time;
    var delta = (time - lastTime) / 1000;
    lastTime = time;

    if (!paused) {
      var maxScroll = wrap.scrollWidth - wrap.clientWidth;
      if (maxScroll > 0) {
        scrollPos += SPEED * delta;
        if (scrollPos >= maxScroll) scrollPos = 0; /* 捲到底回到開頭 */
        wrap.scrollLeft = scrollPos;
      }
    }

    rafId = inView ? requestAnimationFrame(step) : null;
  }

  /* 滑鼠移入：暫停直到移出（不希望使用者細看照片時被自動捲動打斷）*/
  function pauseIndefinitely() {
    paused = true;
    if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
  }

  /* 觸控／滾輪／滑鼠移出：暫停，並在停止互動一段時間後自動恢復 */
  function pauseThenResume() {
    paused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () {
      scrollPos = wrap.scrollLeft; /* 同步使用者手動捲動後的位置 */
      lastTime = null;             /* 避免恢復瞬間因時間差過大而跳動 */
      paused = false;
    }, RESUME_DELAY);
  }

  wrap.addEventListener('mouseenter', pauseIndefinitely, { passive: true });
  wrap.addEventListener('mouseleave', pauseThenResume, { passive: true });
  ['pointerdown', 'wheel', 'touchstart'].forEach(function (evt) {
    wrap.addEventListener(evt, pauseThenResume, { passive: true });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      inView = entry.isIntersecting;
      if (inView && rafId === null) {
        lastTime = null;
        rafId = requestAnimationFrame(step);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(wrap);
})();
