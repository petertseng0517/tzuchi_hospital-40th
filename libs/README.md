# /libs — 第三方程式庫存放目錄

請將以下套件解壓縮至對應子目錄：

| 套件        | 建議路徑                    | 用途                     |
|-------------|----------------------------|--------------------------|
| jQuery      | `libs/jquery/jquery.min.js` | DearFlip 相依             |
| DearFlip    | `libs/dearflip/`            | PDF 翻頁書元件            |

## 引入方式

在 `index.html` 的 `</body>` 之前，依序取消以下兩行的註解：

```html
<script src="libs/jquery/jquery.min.js"></script>
<script src="libs/dearflip/js/dearflip.min.js"></script>
```

DearFlip 的 CSS 請在 `<head>` 中加入：

```html
<link rel="stylesheet" href="libs/dearflip/css/dearflip.min.css">
```
