# 文章

基于 Astro / Fuwari 的静态博客。目前只发布网站框架，没有文章、个人简介、账号链接或示例内容。

## 环境

Node.js 24，pnpm 11.25.0（以 package.json 和 pnpm-lock.yaml 为准）。

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:drafts
pnpm build
pnpm preview
```

## 发布

GitHub Pages 地址：https://lin01109.github.io/wangzheng.github.io/

仓库 Settings → Pages → Source 选择 GitHub Actions。main 分支推送后自动检查、构建并发布 dist。构建中 SITE_URL 为 https://lin01109.github.io，BASE_PATH 为 /wangzheng.github.io/。

本地检查线上路径时，先在 PowerShell 设置：

```powershell
$env:SITE_URL = 'https://lin01109.github.io'
$env:BASE_PATH = '/wangzheng.github.io/'
pnpm check
pnpm test:drafts
pnpm build
pnpm preview
```

## 后续写文章

运行 `pnpm new-post article-slug`，仅编辑 `content/articles/article-slug/index.md` 及同目录脱敏图片。标签写在文章 YAML 的 `tags` 数组中，无须编辑组件。

新文章默认 draft: true；只有明确 draft: false 才会生成网站内容。src/content/posts 是生成目录，不编辑、不提交。空的 content/articles 会在内容准备时自动创建。

**公开仓库会公开全部已提交的源文件，包括草稿。** 未准备公开的文章、原稿、截图和附件应留在仓库外。public 内所有文件都会发布。不得提交 .env、密钥、日志、node_modules 或 dist。

主题复用 [Fuwari](https://github.com/saicaca/fuwari)，保留 MIT LICENSE 与页脚署名。
