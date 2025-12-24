# 部署说明

## 项目概述

这个音乐播放器是一个完全静态的单页应用程序(SPA)，可以直接部署到 Cloudflare Pages 上，无需任何后端服务。

## 部署到 Cloudflare Pages

### 准备工作

1. 确保你已经创建了 Cloudflare 账户
2. 准备好要部署的文件：
   - `index.html` - 主页面文件
   - `404.html` - 自定义404页面
   - `README.md` - 项目说明文档
   - `_routes.json` - 路由配置文件

### 部署步骤

#### 方法一：通过 Git 集成部署（推荐）

1. 将项目文件推送到 GitHub、GitLab 或 Bitbucket 仓库
2. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 在左侧菜单中选择 "Pages"
4. 点击 "Create a project"
5. 选择你的 Git 提供商并授权访问
6. 选择包含音乐播放器代码的仓库
7. 配置项目设置：
   - **Project name**: 给你的项目起一个名字（例如：music-player）
   - **Production branch**: 选择你的主分支（通常是 main 或 master）
   - **Build command**: 留空（这是静态网站，不需要构建）
   - **Build output directory**: `/` （根目录）
8. 点击 "Save and Deploy"
9. 等待部署完成，Cloudflare 会提供一个 `.pages.dev` 的临时域名

#### 方法二：直接上传文件部署

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在左侧菜单中选择 "Pages"
3. 点击 "Create a project"
4. 选择 "Upload assets"
5. 将以下文件拖拽到上传区域：
   - `index.html`
   - `404.html`
   - `README.md`
   - `_routes.json`
6. 点击 "Deploy site"
7. 等待部署完成

### 自定义域名（可选）

如果你有自己的域名，可以按照以下步骤设置：

1. 在 Cloudflare Pages 项目设置中找到 "Custom domains"
2. 点击 "Add custom domain"
3. 输入你的域名（例如：music.yourdomain.com）
4. 按照提示在你的 DNS 提供商处添加相应的 DNS 记录
5. 等待 DNS 传播完成

## 配置说明

### _routes.json

这个文件告诉 Cloudflare Pages 如何处理路由：

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}
```

- `include`: 定义哪些路径应该由 Cloudflare Pages 处理
- `exclude`: 定义哪些路径应该被排除

### 404.html

自定义的 404 页面会在用户访问不存在的页面时显示。

## 性能优化建议

1. **启用自动压缩**：Cloudflare Pages 默认会启用 Brotli 和 Gzip 压缩
2. **使用 Cloudflare CDN**：部署后自动使用 Cloudflare 的全球 CDN 网络
3. **启用 HTTP/3**：在 Cloudflare 仪表板中启用 HTTP/3 以获得更好的性能

## 故障排除

### 部署失败

如果部署失败，请检查：

1. 确保所有文件都已正确上传
2. 检查 `index.html` 是否存在语法错误
3. 确保 `_routes.json` 格式正确

### 音乐无法播放

如果音乐无法播放：

1. 检查浏览器控制台是否有错误信息
2. 确保通过 HTTPS 访问网站（某些浏览器限制 HTTP 下的音频播放）
3. 某些移动浏览器可能需要用户交互才能开始播放音频

### 页面加载缓慢

如果页面加载缓慢：

1. 检查网络连接
2. 确保使用的 API 服务正常运行
3. 考虑使用 Cloudflare 的性能优化功能

## 更新部署

### 通过 Git 部署的项目

1. 将更改推送到你的 Git 仓库
2. Cloudflare Pages 会自动检测到更改并开始新的部署

### 通过文件上传部署的项目

1. 在 Cloudflare Pages 项目页面点击 "Create deployment"
2. 重新上传更新后的文件
3. 点击 "Deploy site"

## 支持的浏览器

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

1. 由于浏览器安全策略，本地文件协议（file://）无法正常使用此播放器，必须通过 HTTP 服务器访问
2. 某些功能在 HTTPS 环境下运行得更好
3. 移动端可能需要用户手动点击播放按钮才能开始播放音频
4. 此播放器依赖第三方音乐 API，API 的可用性会影响功能