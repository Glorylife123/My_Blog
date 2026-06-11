# Echo's Blog

基于 Hexo 8 + AnZhiYu 主题搭建的个人博客仓库，用来记录技术学习、复试整理、设备体验和日常内容。

- 线上地址: [https://glorylife123.github.io/My_Blog/](https://glorylife123.github.io/My_Blog/)
- 仓库地址: [https://github.com/Glorylife123/My_Blog](https://github.com/Glorylife123/My_Blog)
- 默认分支: `main`
- 发布分支: `gh-pages`

## 项目现状

这个仓库已经不是空白模板，而是正在持续维护中的博客项目。

- 框架版本: `Hexo 8.1.1`
- 主题: `anzhiyu`
- 部署方式: `hexo-deployer-git` 发布到 GitHub Pages
- 已配置能力: 分类、标签、归档、站内搜索、留言板、友链、相册、音乐馆、设备页、每日照片、即刻短文、RSS 与站点地图输出等
- 内容目录下已经包含多篇正式文章，主题集中在博客搭建、考研复试、C++ 学习和个人设备记录

## 目录说明

```text
.
├─source/
│  ├─_posts/          博客文章
│  ├─_data/           页面数据源，如相册、友链、设备清单、即刻
│  ├─about/           关于页
│  ├─ai-tools/        AI 编程工具专题页
│  ├─album/           相册页
│  ├─categories/      分类页
│  ├─comments/        留言板
│  ├─dailyPhoto/      每日照片
│  ├─equipment/       设备页
│  ├─essay/           即刻短文
│  ├─link/            友链页
│  ├─music/           音乐馆
│  ├─tags/            标签页
│  └─wordScenery/     文字风景页
├─scripts/helpers/    自定义 Hexo 辅助脚本
├─themes/anzhiyu/     主题源码
├─public/             生成后的静态文件
├─_config.yml         站点配置
├─_config.anzhiyu.yml 主题配置
└─package.json        项目脚本与依赖
```

## 本地开发

### 环境要求

- Node.js 18 及以上
- npm
- Git

### 安装依赖

```bash
npm install
```

### 启动本地预览

```bash
npm run server
```

默认访问地址:

```text
http://localhost:4000/My_Blog/
```

### 常用命令

```bash
# 清理缓存和生成目录
npm run clean

# 生成静态文件
npm run build

# 发布到 GitHub Pages
npm run deploy
```

如果只是日常写作，最常用的流程通常是:

```bash
npm run clean
npm run build
npm run server
```

## 内容维护

### 新建文章

```bash
npx hexo new post "文章标题"
```

### 新建页面

```bash
npx hexo new page "页面名称"
```

### 常改文件

- `source/_posts/`: 新文章与正文内容
- `source/_data/`: 友链、相册、设备、即刻等页面数据
- `_config.yml`: 站点地址、路由、部署配置
- `_config.anzhiyu.yml`: 主题导航、样式、评论、页脚等主题配置

## 部署说明

当前仓库采用 Hexo 的 git 部署方案:

1. 日常内容和配置维护在 `main`
2. 执行 `npm run deploy` 后，将生成后的站点推送到 `gh-pages`
3. GitHub Pages 从 `gh-pages` 分支提供静态页面

仓库中的核心部署配置如下:

```yaml
url: https://Glorylife123.github.io/My_Blog
root: /My_Blog/

deploy:
  type: git
  repo: https://github.com/Glorylife123/My_Blog.git
  branch: gh-pages
```

## 依赖与扩展

当前项目主要依赖包括:

- `hexo`
- `hexo-deployer-git`
- `hexo-generator-feed`
- `hexo-generator-searchdb`
- `hexo-generator-sitemap`
- `hexo-server`
- `hexo-butterfly-envelope`

此外，仓库内还包含 `scripts/helpers/wordcount.js`，用于扩展 Hexo 的辅助能力。

## 说明

- `public/` 是构建产物目录，可重新生成
- `themes/anzhiyu/` 已直接放在仓库内，方便继续做主题级定制
- README 会随着项目继续演进而更新，建议以当前配置文件和目录结构为准
