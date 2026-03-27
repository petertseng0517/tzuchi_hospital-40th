# 開發工具與相依套件

## 系統工具

| 工具 | 版本 | 用途 | 安裝方式 |
|------|------|------|----------|
| cwebp | 1.6.0 | 圖片批次轉換為 WebP 格式 | `brew install webp` |
| Python | 3.13.7 | 本地開發環境 | `brew install python` |
| afconvert | macOS 內建 | 音訊格式轉換（M4A → MP3） | 無需安裝 |
| ffmpeg | — | 音訊重新編碼（壓縮語音檔） | `brew install ffmpeg` |

## 前端套件（本地化，存放於 `libs/`）

| 套件 | 版本 | 用途 | 授權 |
|------|------|------|------|
| jQuery | 1.11.0 | DearFlip 相依套件 | MIT |
| DearFlip | 1.7.3 | PDF 互動翻頁書 | 商業授權 |

> DearFlip 需持有有效授權，請勿將 `libs/` 目錄公開發佈至開源平台。

## 音訊製作

| 工具 | 用途 |
|------|------|
| NotebookLM | 生成 40 周年特刊 AI 導讀音訊（M4A 格式） |

## 圖片處理指令

```bash
# 單檔轉換
cwebp -q 82 input.jpg -o output.webp

# 批次轉換（JPG + TIF）
for f in images/history/*.jpg images/history/*.tif images/history/*.TIF; do
  [ -f "$f" ] || continue
  cwebp -q 82 "$f" -o "${f%.*}.webp"
done
```

## 音訊處理指令

```bash
# M4A 轉 MP3（語音最佳化，96kbps 單聲道，約縮小至 3–5MB）
ffmpeg -i audio/guide-40th.m4a -codec:a libmp3lame -b:a 96k -ac 1 audio/guide-40th.mp3
```

## 本地預覽

```bash
# Python 內建伺服器（需在專案根目錄執行）
python3 -m http.server 8080
# 開啟瀏覽器：http://localhost:8080
```
