# Echo's Blog

> 道阻且长，行则将至

基于 Hexo + AnZhiYu 主题搭建的个人博客，托管于 GitHub Pages。

## 📖 博客简介

这是一个用于记录学习心得、技术笔记和生活点滴的个人博客。

- **博客地址**: [https://glorylife123.github.io/My_Blog](https://glorylife123.github.io/My_Blog)
- **主题**: [AnZhiYu](https://github.com/anzhiyu-c/hexo-theme-anzhiyu)
- **部署方式**: GitHub Pages

## 🛠️ 技术栈

- **框架**: [Hexo 8.1.1](https://hexo.io/)
- **主题**: [AnZhiYu 1.7.1](https://github.com/anzhiyu-c/hexo-theme-anzhiyu)
- **部署**: GitHub Pages
- **评论系统**: Giscus
- **音乐播放器**: APlayer + Meting

## 📁 项目结构

```
Blog/
├── source/               # 源文件目录
│   ├── _posts/          # 博客文章
│   ├── _data/           # 数据文件
│   ├── about/           # 关于页面
│   ├── album/           # 相册页面
│   ├── categories/      # 分类页面
│   ├── comments/        # 留言板
│   ├── essay/           # 即刻短文
│   ├── link/            # 友链页面
│   └── music/           # 音乐馆
├── themes/              # 主题目录
│   └── anzhiyu/        # AnZhiYu 主题
├── _config.yml         # Hexo 配置文件
├── _config.anzhiyu.yml # 主题配置文件
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- Git

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/Glorylife123/My_Blog.git
cd My_Blog

# 安装依赖
npm install
```

### 本地预览

```bash
# 启动本地服务器
npm run server
# 或者
hexo server

# 访问 http://localhost:4000/My_Blog/
```

### 创建新文章

```bash
# 创建新文章
hexo new post "文章标题"

# 创建新页面
hexo new page "页面名称"
```

### 构建与部署

```bash
# 清理生成的文件
npm run clean

# 生成静态文件
npm run build

# 部署到 GitHub Pages
npm run deploy
```

或者直接运行：

```bash
hexo clean && hexo generate && hexo deploy
```

## 📝 写作指南

### 文章模板

在 `scaffolds/post.md` 中定义了文章的默认模板。

创建文章时，Hexo 会自动填充 Front Matter：

```markdown
---
title: 文章标题
date: 2026-04-04 12:00:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类名称
---

文章正文...
```

### 文章分类和标签

- **分类**: 用于文章的层级结构，一篇文章通常属于一个分类
- **标签**: 用于文章的标记，一篇文章可以有多个标签

### 插入图片

将图片放在文章同名的文件夹中，使用相对路径引用：

```markdown
![图片描述](图片名称.jpg)
```

### 插入代码块

支持多种编程语言的语法高亮：

````markdown
```javascript
console.log('Hello, World!');
```
````

## ⚙️ 配置说明

### 站点配置 `_config.yml`

主要配置项：

```yaml
# 站点信息
title: Echo's Blog
description: '道阻且长，行则将至'
author: Echo
language: zh-CN

# URL
url: https://glorylife123.github.io/My_Blog
root: /My_Blog/

# 部署
deploy:
  type: git
  repo: https://github.com/Glorylife123/My_Blog.git
  branch: gh-pages
```

### 主题配置 `_config.anzhiyu.yml`

主题配置文件包含：
- 导航菜单
- 社交链接
- 评论系统
- 音乐播放器
- 页面样式
- 等等...

详细配置请参考 [AnZhiYu 主题文档](https://docs.anheyu.com/)。

## 🎨 功能特性

### 已实现功能

- ✅ 文章发布与归档
- ✅ 分类和标签系统
- ✅ Giscus 评论系统
- ✅ 音乐播放器
- ✅ 相册页面
- ✅ 友链页面
- ✅ 留言板
- ✅ AI 文章摘要
- ✅ 深色模式
- ✅ 响应式设计
- ✅ 搜索功能
- ✅ 文章分享

### 特色页面

- **首页**: 展示最新文章，支持双栏布局
- **分类页**: 按分类浏览文章
- **标签页**: 按标签筛选文章
- **归档页**: 时间线形式展示所有文章
- **友链页**: 展示友情链接
- **留言板**: 读者留言互动
- **音乐馆**: 在线音乐播放
- **相册集**: 图片展示

## 📦 主要依赖

```json
{
  "hexo": "^8.0.0",
  "hexo-deployer-git": "^4.0.0",
  "hexo-generator-archive": "^2.0.0",
  "hexo-generator-category": "^2.0.0",
  "hexo-generator-index": "^4.0.0",
  "hexo-generator-tag": "^2.0.0",
  "hexo-renderer-ejs": "^2.0.0",
  "hexo-renderer-marked": "^7.0.0",
  "hexo-renderer-pug": "^3.0.0",
  "hexo-renderer-stylus": "^3.0.1",
  "hexo-server": "^3.0.0",
  "hexo-butterfly-envelope": "^1.0.15"
}
```

## 🔄 更新日志

### 2026-04-04
- ✨ 创建分类页面
- 📝 发布《博客搭建全记录》
- 🎨 优化主题配置
- 📦 初始化项目

## 🤝 参与贡献

欢迎提出问题和建议！

1. Fork 本仓库
2. 创建新分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。

## 🙏 鸣谢

- [Hexo](https://hexo.io/) - 快速、简洁、高效的博客框架
- [AnZhiYu](https://github.com/anzhiyu-c/hexo-theme-anzhiyu) - 美观大气的 Hexo 主题
- [GitHub Pages](https://pages.github.com/) - 免费的静态网站托管服务

## 📧 联系方式

- GitHub: [@Glorylife123](https://github.com/Glorylife123)
- Bilibili: [个人空间](https://space.bilibili.com/350728573)

---

⭐ 如果这个项目对你有帮助，欢迎 Star 支持！
