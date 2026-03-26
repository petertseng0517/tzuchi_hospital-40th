# 花蓮慈濟醫院・建院 40 周年紀念網站 規格書 (SDD)

## 一、 專案目標

開發一個獨立、高效能的單頁式（Single Page）紀念網頁，完整呈現醫院 40 年的建院歷程、大事記、歷史影像與歷年週年手冊。

---

## 二、 視覺規範 (UI/UX)

| 項目 | 規格 |
|------|------|
| 主色 | `#005689`（信任藍） |
| 輔助色 | `#C5A059`（慶典金） |
| 背景色 | `#f7f9fb`（頁面淺灰）/ `#eef2f7`（交錯 section） |
| 文字色 | `#1a2733`（主文字）/ `#5a6e7f`（次要文字） |
| 字型 | Noto Sans TC、Microsoft JhengHei（繁體中文優先） |
| 風格 | 簡潔大氣，微陰影增加層次感 |
| 動畫 | 捲動觸發動畫（IntersectionObserver 驅動） |

---

## 三、 功能模組

### 1. Header（固定頂部導覽列）
- 固定於頁面頂部，初始透明；捲動超過 80px 後背景轉深藍（`.scrolled`）
- 手機版：漢堡選單按鈕展開／收合導覽連結
- 導覽項目：首頁 / 大事記 / 週年手冊 / 歲月留影 / 典藏特刊

### 2. Hero Section
- 全幅院景背景圖（WebP + JPEG fallback）
- 深色漸層遮罩確保文字可讀性
- 大標語「四十載守護，初心如一」、副標、CTA 按鈕

### 3. 四十年大事記（Timeline Section）
- 垂直交錯時間軸，奇偶卡片左右交錯
- 每個節點含：年份徽章、事件標題、說明文字、配圖
- 手機版改為單欄靠左排列
- 捲動進場動畫（`.fade-up` + `data-delay` 錯位效果）

### 4. 歲月留影（History Photo Strip）
- 水平捲軸照片帶（CSS `scroll-snap`），展示 1983–1998 年建築老照片共 41 張
- 各年份前置藍色年份旗標
- 點擊任一照片開啟全螢幕燈箱（Lightbox）
- 燈箱支援：前後切換、鍵盤方向鍵、Esc 關閉、點擊背景關閉

### 5. 40 周年手冊（Flipbook Section）
- 導讀音訊播放器（HTML5 `<audio>`，MP3 + M4A 雙格式，`preload="none"`）
- DearFlip 互動翻頁書（本地版本，不依賴 CDN）
- 使用者點擊後才初始化，節省院內頻寬
- 桌機：翻頁書 + 下載 PDF 按鈕
- 手機：隱藏翻頁書，改顯示下載按鈕

### 6. 歷年典藏特刊（Archive Section）
- 卡片式排列，展示 20、25、30、35 周年特刊
- 每張卡片含：封面圖、年份標題、說明文字、PDF 下載按鈕
- 桌機 2 欄 Grid；手機單欄置中

### 7. Footer
- 版權聲明，年份自動更新

---

## 四、 技術規格

| 項目 | 規格 |
|------|------|
| 架構 | 純靜態（HTML5 / CSS3 / Vanilla JS） |
| 相依套件 | jQuery 1.11.0、DearFlip 1.7.3（均本地化） |
| 樣式架構 | 單一樣式表 `css/style.css`，CSS 自訂變數（Design Tokens） |
| 互動邏輯 | 單一腳本 `js/main.js` |
| 不使用 | CDN、前端框架（React / Vue 等）、後端服務 |

---

## 五、 院內網路效能優化

| 策略 | 實作方式 |
|------|----------|
| 圖片延遲載入 | 非首屏 `<img>` 加 `loading="lazy"` |
| 圖片格式優化 | WebP 優先（`<picture>` + JPEG fallback），老照片各檔 < 1MB |
| PDF 延遲初始化 | Flipbook 點擊後才載入，頁面初始不傳輸 26MB PDF |
| 音訊不預載 | `<audio preload="none">` |
| 動畫節流 | `IntersectionObserver` 取代 scroll event，減少主執行緒負擔 |
| 歷史照片懶載 | 41 張老照片全部 `loading="lazy"` |

---

## 六、 行動裝置優化（RWD）

| 斷點 | 範圍 | 調整項目 |
|------|------|----------|
| 桌機 | ≥ 1024px | 完整版面，時間軸左右交錯，翻頁書顯示 |
| 平板 | 768–1023px | 時間軸軸心縮小，卡片維持雙欄 |
| 手機 | < 768px | 時間軸單欄、翻頁書改下載按鈕、照片帶縮小、典藏卡片單欄 |

- 按鈕最小點擊區域：44 × 44 px
- 內文最小字體：16px
- 捲動提示文字引導使用者水平滑動照片帶

---

## 七、 無障礙規範

- 所有 `<img>` 具備 `alt` 屬性
- 燈箱具備 `role="dialog"`、`aria-modal`、`aria-label`
- 漢堡按鈕具備 `aria-expanded` 狀態
- 燈箱可全鍵盤操作（方向鍵切換、Esc 關閉）
- 裝飾性元素加上 `aria-hidden="true"`
- 支援 `prefers-reduced-motion`：偵測到使用者偏好減少動畫時，跳過捲動動畫直接顯示

---

## 八、 檔案組織

```
ai_hospital-40th/
├── index.html
├── css/style.css
├── js/main.js
├── libs/                    # 第三方套件（本地化）
├── images/
│   ├── hero-panorama.jpg / .webp
│   ├── cover-20th / 25th / 30th / 35th .jpg
│   └── history/             # 老照片 41 張（1983–1998）
├── docs/                    # 週年特刊 PDF（git 不追蹤）
├── audio/                   # 導讀音訊（git 不追蹤）
├── README.md
├── DEPENDENCIES.md
├── .gitignore
└── sdd.md
```

---

## 九、 版本控制策略

- 程式碼（HTML / CSS / JS / 圖片）推送至 GitHub
- 大型二進位檔（PDF、音訊）列於 `.gitignore`，另存雲端硬碟並於 README 附下載連結
- `libs/` 含 DearFlip 商業授權套件，建議設為 **Private Repository**
