# ccblog

终端风格的个人博客与小实验场 —— Markdown 笔记、站内搜索，以及完全在浏览器中运行的 C/C++ Playground。

在线站点：[crazycloud.cc](https://crazycloud.cc)

[English](README.md)

---

## 项目简介

**ccblog** 是一个模仿 macOS 终端会话的 Next.js 站点。文章以 Markdown 文件存放；界面用 `cd`、`cat`、`grep` 和面板样式组织内容，而不是传统博客布局。

项目面向 fork 自用：改 `ccblog.config.ts`，在 `content/notes/` 写自己的笔记，然后部署即可。

### 功能概览

| 模块 | 说明 |
|------|------|
| **博客** | Markdown + frontmatter，标签与系列筛选，阅读时长，上一篇/下一篇，相关文章 |
| **搜索** | [Pagefind](https://pagefind.app/) 静态索引，`postbuild` 时生成 |
| **Playground** | 基于 [browsercc](https://www.npmjs.com/package/browsercc) WASM 的 C11 / C++17 编译运行 — Monaco 编辑器、stdin、分享链接、编译阶段可视化 |
| **Apps** | 可选：构建时从 iTunes Lookup API 同步 App Store 应用列表 |
| **内容块** | 文章内支持 `:::trace`、`:::bench`、`:::annotate`、`:::playground` 等指令 |
| **元数据** | RSS、sitemap、JSON-LD、Open Graph 图片 |

首页有一段简短的启动动效（笔记逐行打出后落位）。主题支持浅色 / 深色 / 跟随系统，并尊重 `prefers-reduced-motion`。

---

## 技术栈

- [Next.js 16](https://nextjs.org)（App Router）· React 19 · TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [gray-matter](https://github.com/jonschlinkert/gray-matter) 解析文章 frontmatter
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) + browsercc 驱动 `/playground`
- Pagefind 客户端全文搜索

---

## 快速开始

**环境要求：** Node.js 20+，npm 9+

```bash
git clone https://github.com/crazycloudcc/ccblog.git
cd ccblog
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

### 配置

编辑根目录的 `ccblog.config.ts`——站点名称、作者、社交链接、功能开关和 App Store ID 全都在这里。fork 后只需改这一个文件即可完成品牌替换。想从空白开始？`cp ccblog.config.example.ts ccblog.config.ts` 可得到一份带注释的干净模板；`npm run build` 会校验配置，字段缺失或非法时快速失败并给出清晰报错。生产环境需设置站点 URL：

```bash
# .env.local（不提交到 git）
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

| 变量 | 场景 | 用途 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 生产环境 | RSS、sitemap、Open Graph 的规范 URL |
| `NEXT_PUBLIC_CCBLOG_BRANCH` | 可选 | 终端状态栏显示的 Git 分支 |
| `APPLE_DEVELOPER_ID` | 可选 | 覆盖 `apps.developerId`，用于 `/apps` 同步 |
| `NEXT_PUBLIC_TOOLCHAIN_BASE` | 可选 | 生产环境 Playground WASM CDN 覆盖地址 |

`ccblog.config.ts` 中的功能开关（`features.blog`、`features.apps`、`features.playground`、`features.about`）可整条路由开关。`/apps` 默认**关闭**——当 `features.apps` 为 false 时，导航项、sitemap 条目和 prebuild 的 App Store 同步都会跳过，不发布 iOS 应用的 fork 无需额外清理。

完整的 fork → 部署指南见站内文章 **Start Up**（`content/notes/nextjs-blog-setup.md`）。

---

## 常用脚本

```bash
npm run dev          # 本地开发（webpack）
npm run build        # 同步 apps → 构建 → 生成 pagefind 索引
npm run start        # 生产环境启动
npm run lint         # ESLint
npm run sync:apps    # 从 iTunes API 刷新 lib/apps.ts
```

`npm run build` 依次执行：

1. **prebuild** — 同步 App Store 元数据（若已配置）
2. **build** — Next.js 静态构建
3. **postbuild** — 将 Pagefind 索引写入 `public/pagefind/`

`/blog` 的搜索依赖 production build；仅 `next dev` 不会生成索引。

---

## 路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 — 启动动效 + 近期笔记 |
| `/blog` | 笔记列表、标签/系列筛选、搜索 |
| `/blog/[slug]` | 文章详情 |
| `/playground` | 浏览器内 C/C++ 编辑与运行 |
| `/apps` | App Store 应用（可选） |
| `/about` | 关于与联系方式 |
| `/feed.xml` | RSS |

---

## Playground 工具链

| 环境 | 来源 |
|------|------|
| **开发** | `/api/toolchain` — 从 `node_modules/browsercc` 提供 WASM |
| **生产** | [unpkg](https://unpkg.com) CDN（`browsercc@0.1.1`），可通过 `NEXT_PUBLIC_TOOLCHAIN_BASE` 覆盖 |

工具链不打进部署包（避免 Vercel Hobby 体积超限）。浏览器首次加载后会缓存。

---

## 写文章

在 `content/notes/` 下新增 Markdown 文件：

```yaml
---
title: 我的文章
excerpt: 列表和 RSS 用的一句话摘要。
date: 2026-07-08
tags:
  - nextjs
series: my-series        # 可选
difficulty: intermediate # 可选
---
```

正文支持标准 Markdown、代码块、图片，以及自定义块（`:::trace`、`:::bench`、`:::annotate`、`:::playground` 等）。示例见 `content/notes/monospace-on-the-web.md`。

---

## 部署

CI（`.github/workflows/ci.yml`）在 push 和 PR 时执行 lint + build。[Vercel](https://vercel.com) 最省事；任何能跑 `next start` 的主机均可。

首次生产部署前，在主机环境变量中设置 `NEXT_PUBLIC_SITE_URL`。

---

## 目录结构

```
app/              # Next.js 路由与 API
components/       # UI（终端外壳、博客、Playground 等）
content/notes/    # Markdown 文章
lib/              # 站点配置、解析器、Playground 核心
public/           # 静态资源（pagefind 索引在构建时生成）
scripts/          # 构建辅助脚本（apps 同步、工具链发布）
```

---

## 作者

由 [crazycloudcc](https://github.com/crazycloudcc) 构建与维护。

欢迎 fork 与交流 — 联系方式见在线站点的 `/about`。

---

## 许可证

本项目采用 [MIT License](LICENSE) 开源。

Copyright (c) 2026 crazycloudcc
