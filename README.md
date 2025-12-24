# 云音乐播放器 - Cloudflare Pages 部署版本

这是一个基于 HTML、CSS 和 JavaScript 的在线音乐播放器，可以轻松部署到 Cloudflare Pages 上。
音乐源来自……（自行查看，严禁商业以及非法用途）
## 功能特性

- 搜索多个音乐平台的歌曲（网易云音乐、QQ音乐、酷我音乐等）
- 播放音乐和显示歌词
- 创建和管理播放列表
- 响应式设计，支持移动端
- 音频可视化效果
- 支持多种音质选择

## 部署到 Cloudflare Pages

### 方法一：通过 Git 部署（推荐）

1. 将此项目推送到 GitHub、GitLab 或 Bitbucket 仓库
2. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 选择 "Pages" 服务
4. 点击 "Create a project"
5. 选择你的 Git 仓库
6. 配置以下设置：
   - **Project name**: music-player
   - **Production branch**: cf-pages (或你的主分支名称)
   - **Build command**: (留空，因为这是静态网站)
   - **Build output directory**: / (根目录)
7. 点击 "Save and Deploy"

### 方法二：直接上传部署

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 "Pages" 服务
3. 点击 "Create a project" 然后选择 "Upload assets"
4. 将 [index.html](index.html) 文件拖放到上传区域
5. 点击 "Deploy site"

## 本地开发

要本地运行此项目，可以使用任何静态文件服务器：

### 使用 Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### 使用 Node.js

```bash
# 安装 serve（如果尚未安装）
npm install -g serve

# 运行服务器
serve -s .
```

然后在浏览器中访问 http://localhost:8000

## 技术栈

- HTML5
- CSS3 (包含响应式设计和动画效果)
- JavaScript (ES6+)
- FontAwesome 图标库
- Cloudflare Pages 静态托管

## API 说明

本播放器使用第三方音乐 API 服务，所有音乐资源均来自合法渠道。

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 注意事项

1. 由于浏览器安全策略，文件协议（file://）无法正常使用，必须通过 HTTP 服务器访问
2. 某些功能可能需要 HTTPS 环境才能正常工作
3. 移动端使用时，可能需要用户手动点击播放按钮才能开始播放音频

## 许可证

本项目仅供个人学习和研究使用，请遵守相关法律法规，不要用于商业用途。