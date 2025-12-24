# Favicon 说明

本项目包含一个简单的音乐播放器应用。为了获得最佳的用户体验，建议添加一个 favicon.ico 文件到项目根目录。

## 如何创建 favicon

### 方法一：使用在线工具

1. 访问 [favicon.io](https://favicon.io/) 或 [realfavicongenerator.net](https://realfavicongenerator.net/)
2. 上传一个图片或使用提供的图标生成器
3. 下载生成的 favicon 文件包
4. 将 `favicon.ico` 文件放置在项目根目录

### 方法二：使用图像编辑软件

1. 创建一个 16x16 或 32x32 像素的图像
2. 设计一个简单的音乐相关图标
3. 保存为 `.ico` 格式
4. 将文件命名为 `favicon.ico` 并放置在项目根目录

### 方法三：使用文本编辑器创建简单 favicon

创建一个 `favicon.svg` 文件：

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="#0c0c0c"/>
  <path d="M5 4L5 12" stroke="#ff6b6b" stroke-width="1" stroke-linecap="round"/>
  <path d="M8 3L8 12" stroke="#ff6b6b" stroke-width="1" stroke-linecap="round"/>
  <path d="M11 5L11 10" stroke="#ff6b6b" stroke-width="1" stroke-linecap="round"/>
</svg>
```

然后在 `index.html` 的 `<head>` 部分添加：

```html
<link rel="icon" href="favicon.svg" type="image/svg+xml">
```

## 在 index.html 中添加 favicon 引用

编辑 `index.html` 文件，在 `<head>` 部分添加以下代码：

```html
<link rel="icon" href="favicon.ico" type="image/x-icon">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
```

这样可以确保在不同浏览器和设备上都能正确显示 favicon。