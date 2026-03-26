# 花蓮慈濟醫院・建院 40 周年紀念網站

靜態網頁，無需伺服器框架，直接以瀏覽器開啟 `index.html` 即可預覽。

---

## 頁面結構

| Section | ID | 說明 |
|---|---|---|
| 主視覺 | `#hero` | 全幅院景背景圖 + 大標語 |
| 四十年大事記 | `#timeline` | 垂直交錯時間軸（1986 / 2006 / 2026） |
| 歲月留影 | `#history` | 水平捲軸老照片帶（1983–1998，共 41 張） |
| 40 周年手冊 | `#flipbook` | 導讀音訊播放器 + DearFlip 互動翻頁書 |
| 歷年典藏特刊 | `#archive` | 20、25、30、35 周年特刊封面卡片與 PDF 下載 |

---

## 檔案結構

```
ai_hospital-40th/
├── index.html                  # 唯一 HTML 頁面
├── css/
│   └── style.css               # 全站樣式表（含 RWD）
├── js/
│   └── main.js                 # 全站互動邏輯
├── libs/                       # 第三方套件（本地，不依賴 CDN）
│   ├── jquery.min.js
│   ├── dflip.min.js            # DearFlip 翻頁書
│   ├── dflip.min.css
│   ├── cmaps/                  # PDF.js 字元映射表
│   ├── fonts/
│   ├── images/
│   └── js/libs/                # PDF.js、Three.js 等相依套件
├── images/
│   ├── hero-panorama.jpg       # 主視覺（同目錄有 .webp）
│   ├── cover-20th.jpg          # 歷年特刊封面（20/25/30/35 周年）
│   ├── cover-25th.jpg
│   ├── cover-30th.jpg
│   ├── cover-35th.jpg
│   └── history/                # 老照片（41 張 .webp，命名格式 YYYYMMNNNN）
├── docs/
│   ├── 40th_anniversary.pdf    # 40 周年手冊（翻頁書來源）
│   ├── 35th_anniversary.pdf
│   ├── 30th_anniversary.pdf
│   ├── 25th_anniversary.pdf
│   └── 20th_anniversary.pdf
└── audio/
    ├── guide-40th.mp3          # 40 周年特刊導讀音訊
    └── guide-40th.m4a          # 備用格式（Safari / iOS）
```

---

## 技術規格

- **純靜態**：HTML5 / CSS3 / Vanilla JS，無需 Node.js 或後端
- **無 CDN 相依**：所有套件均本地化（`libs/`）
- **圖片格式**：WebP 優先，`<picture>` + JPEG fallback
- **RWD 斷點**：桌機 ≥ 1024px｜平板 768–1023px｜手機 < 768px
- **效能**：圖片 `loading="lazy"`、音訊 `preload="none"`、翻頁書點擊後才初始化
- **無障礙**：ARIA label、`role`、鍵盤可操作燈箱（方向鍵 / Esc）

### 主要功能模組（`js/main.js`）

| 功能 | 說明 |
|---|---|
| Header 捲動變色 | 捲動超過 80px 後套用 `.scrolled`，背景轉深藍 |
| 手機漢堡選單 | 展開 / 收合 `.main-nav` |
| 捲動進場動畫 | `IntersectionObserver` 驅動 `.fade-up`，支援 `data-delay` 錯位進場 |
| DearFlip 翻頁書 | 點擊按鈕後才初始化，節省頻寬 |
| 歲月留影燈箱 | 點擊老照片全螢幕放大，支援前後切換與鍵盤操作 |

---

## 內容更新指引

### 新增大事記項目
在 `index.html` 的 `#timeline-track` 內複製一個 `<article class="timeline-item">` 並修改年份、標題、內文、圖片路徑。

### 新增老照片
1. 將 WebP 圖檔（建議 300KB 以內）放入 `images/history/`
2. 在 `index.html` 的對應年份區塊內新增：
```html
<figure class="history-item" role="listitem"
        data-full="images/history/檔名.webp"
        data-year="YYYY">
  <img src="images/history/檔名.webp" alt="YYYY 年建院照片" loading="lazy">
</figure>
```

### 替換音訊導讀
將新音檔覆蓋 `audio/guide-40th.mp3`（及 `.m4a`）即可，HTML 不需修改。

### 新增典藏特刊
在 `index.html` 的 `#archive` `.archive-grid` 內複製一個 `.archive-card` 並修改封面圖路徑、年份文字、PDF 連結。

---

## 圖片批次轉換（WebP）

需先安裝 `cwebp`：`brew install webp`

```bash
# 批次轉換資料夾內的 JPG + TIF
for f in images/history/*.jpg images/history/*.tif images/history/*.TIF; do
  [ -f "$f" ] || continue
  cwebp -q 82 "$f" -o "${f%.*}.webp"
done
```

---

## 第三方套件授權

| 套件 | 版本 | 授權 |
|---|---|---|
| jQuery | 3.x | MIT |
| DearFlip | — | 商業授權（需持有有效 License） |
