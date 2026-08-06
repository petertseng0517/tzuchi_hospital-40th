# 花蓮慈濟醫院・建院 40 周年紀念網站

靜態網頁，無需伺服器框架。

⚠️ **請勿直接雙擊 `index.html` 開啟**：40 周年手冊的互動翻頁書需要透過 HTTP(S) 讀取 `docs/40th_anniversary.pdf`，若以 `file://` 協定直接開啟，瀏覽器會擋掉這個讀取請求，翻頁書會卡在載入中無法開啟（其餘區塊不受影響）。

本機預覽請在專案根目錄啟動一個簡易伺服器，例如：
```bash
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

---

## 開場動畫（Intro Splash）

首次進站會先播放約 11 秒的開場動畫，取材自 40 周年特刊書封分層素材（`images/intro/`）：

1. 第一幕（5s）：封底全景，小船緩緩滑行
2. 轉場（1s）：全暗
3. 第二幕（5s）：封面場景，醫院淡入 → 大船航向大海

同一瀏覽階段（分頁）只播放一次（`sessionStorage`），可點擊「略過動畫」或按任意鍵跳過，且偵測到 `prefers-reduced-motion` 時完全不播放。播放邏輯見 `js/main.js`｜`initIntroSplash`，時間軸與版面見 `css/style.css`｜「4b. 開場動畫」。

---

## 頁面結構

| Section | ID | 說明 |
|---|---|---|
| 主視覺 | `#hero` | 全幅院景背景圖 + 大標語 |
| 數字看 40 年 | `#stats` | 實績亮點統計卡片（獎項、排名、累計數據） |
| 上人開示 | `#wisdom` | 開示金句摘錄，大事記前的精神引言 |
| 四十年大事記 | `#timeline` | 垂直交錯時間軸（1986 / 2006 / 2026） |
| 歲月留影 | `#history` | 水平捲軸老照片帶（1983–1998，共 41 張） |
| 黃金人口 | `#staff` | 資深員工人物誌卡片，摘自 40 周年特刊 |
| 生命奇蹟 | `#stories` | 精選真實搶救故事卡片，摘自 40 周年特刊 |
| 40 周年手冊 | `#flipbook` | Podcast 專區（2 集）+ DearFlip 互動翻頁書 |
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
│   ├── history/                 # 老照片（41 張 .webp，命名格式 YYYYMMNNNN）
│   ├── stories/                 # 生命奇蹟配圖，擷取自 40 周年特刊內頁（記者會／公開活動照）
│   └── intro/                   # 開場動畫素材，取材自特刊書封分層圖檔（背景 × 2、物件 × 3）
├── docs/
│   ├── 40th_anniversary.pdf    # 40 周年手冊（翻頁書來源）
│   ├── 35th_anniversary.pdf
│   ├── 30th_anniversary.pdf
│   ├── 25th_anniversary.pdf
│   └── 20th_anniversary.pdf
└── audio/
    ├── podcast01.m4a           # Podcast EP01：盤山過嶺的醫療奇蹟
    └── podcast02.m4a           # Podcast EP02：越南阿福重生記
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

### 新增／替換 Podcast 集數
- 替換現有集數：將新音檔覆蓋 `audio/podcast01.m4a`（或 `podcast02.m4a`）即可，HTML 不需修改。
- 新增集數：在 `index.html` 的 `#flipbook` `.podcast-grid` 內複製一個 `.podcast-card`，修改 `EP` 編號、標題與音檔路徑。

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
