# Photo Portfolio

一个使用原生 HTML、CSS 和 JavaScript 构建的响应式摄影作品集。

## 功能

- 响应式摄影作品墙
- 作品分类筛选
- 点击图片打开灯箱预览
- 适配手机、平板和桌面屏幕
- SVG 占位作品，方便后续替换成真实照片

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 替换照片

把你的照片放到 `images` 目录中，然后修改 `index.html` 里对应的：

```html
<img src="./images/sunset.svg" alt="图片说明">
```

建议使用压缩后的 `.webp` 或 `.jpg` 文件，不要把原始 RAW 文件直接上传到 Git 仓库。

## 项目结构

```text
.
├── images/
├── index.html
├── style.css
├── script.js
└── README.md
```