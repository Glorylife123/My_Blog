---
title: 记一次 Hexo 博客损坏后的全栈恢复与深度修复
date: 2026-04-05 01:00:00
tags:
  - Hexo
  - 博客
  - 教程
  - AnZhiYu
categories:
  - 技术教程
---

## 缘起：本地项目的突然损坏

写博客最怕遇到什么？毫无疑问是本地源码的突然损坏或丢失。
近日，我遭遇了本地 Hexo 博客源码文件夹受损的尴尬局面。更要命的是，早前虽然将项目同步到了 GitHub，但当我要从云端拉取 `clone` 下来重新构建时，才发现拉取下来的只是个千疮百孔的“半成品”。

不仅很多自定义样式失效了，大量的核心组件，诸如“音乐馆”、“随便逛逛”等，也全都报废罢工。在此，我将这次从**抢救项目**到**深度修补 BUG** 的完整踩坑历程记录下来，既是复盘，也希望能为其他使用 Hexo (尤其搭配 AnZhiYu 主题) 的博主提供避坑指南。

---

## 避雷核心：主题文件夹原来是 Submodule！

刚 Clone 下来的项目，最显著的问题是 `themes/anzhiyu` 文件夹里的自定义文件全丢了。
**根源排查：** 
因为 AnZhiYu 原版主题克隆时自带了内部的 `.git` 版本控制文件夹！这意味着在我们 `git push` 到自己的仓库时，GitHub 默认把它当成了 [Git Submodule （子模块）]，它只存了一个 Hash 指针，根本不管我在本地对主题 `source/css/` 或者 `scripts/` 做了多少魔改。

**解决方案：**
1. 重新从官方拉取最新版的主题源码覆盖进去。
2. **重点操作**：删除 `themes/anzhiyu/.git` 文件夹！彻底切除它作为子模块的独立性。
3. 把所有的依赖通过 `npm install`（比如丢失的 `hexo-tag-aplayer`）补齐。
4. 执行 `git rm --cached themes/anzhiyu` 后重新 `git add .`。将其完全转化为普通的本地源码目录跟随博客主体提交！

---

## 深度修复篇：那些悄悄崩掉的组件

在重构代码后，我发现虽然网页跑起来了，但几个核心模块在托管到 GitHub Pages 的子目录（`/My_Blog/`）下时全面崩溃。以下是硬核排查过程：

### BUG 1：控制台文字消失术
**现象**：右上角的博客侧边控制台中，在浅色模式下文字犹如隐身，彻底和背景融为一体。
**修复**：并非配置出错，纯粹是样式优先级被吞没。我们在主题的 stylus 源码层创建了 `_custom_overrides.styl` 来精准覆盖：
```css
[data-theme='light'] #console .item-headline,
[data-theme='light'] #console .console-card-title,
[data-theme='light'] #console .card-tag-cloud a {
    color: #000000 !important;
}
```
**附带优化**：为了让这套绿色的自定义配色更聚焦，我在所有的覆盖类前加上了 `.post` 父选择器限制，保证这些个性化样式**仅在浏览文章本身**时展示！

### BUG 2：“随便逛逛”点击后跳转 404
**现象**：点击“随便逛逛”不仅按钮没反应，有时候跳转也是报错 Not Found。
**根源排查**：
首先是底层 Node 脚本崩溃。Hexo 的 `random.js` 在遍历 `link.yml` 友链时，未考虑到极个别空类目（没有 `link_list` 数组），导致整个生成器悄悄抛出 TypeError，导致 `/anzhiyu/random.js` 压根没生成出静态文件！
其次是硬编码错误。JS 生成出来的跳转语句被写死了跳向网站根目录（'/' + URL）。而我们的博客是挂靠在 `/My_Blog/` 子路径下的！
**修复**：
找到 `themes/anzhiyu/scripts/helpers/random.js`：
1. 增加数组容错截断：`(element.link_list || []).forEach(...)`
2. 将强制跳转根目录的代码结合 Hexo 全局环境拼接：`${hexo.config.root} + posts[...]`。Pjax 及原生跳转至此重新焕发生机。

### BUG 3：音乐馆歌单“离谱”隐藏与切换瘫痪
**现象**：`/music/` 完全是黑屏，Aplayer 播放器毫无踪影。即使左下角控制球存在且能播，但在音乐馆右下角点击“更换歌单”依然没反应！
**根源排查**：
这也是由于子目录挂载引发的路径错乱血案！打开 `themes/anzhiyu/source/js/utils.js` 侦破源码：
1. **隐藏真凶**：主题强行判断 `window.location.pathname.startsWith("/music/")` 才渲染音乐页面。但在实际环境中该路径前缀为 `/My_Blog/music/` ！
2. **切歌瘫痪真凶**：更新歌单时，JS 调用了 `fetch("/json/music.json")`。同样没有考虑子目录配置，导致拉取到了根站点的 404 页并引发 JSON 解析异常！
**修复**：
将 `startsWith` 统统优化为 `.includes("/music/")`，并将 Ajax 拉取配置替换为调用全局根目录变量：`fetch(GLOBAL_CONFIG.root + "json/music.json")`。
清理后执行 `hexo clean` 重塑映射，音乐馆界面再次完美回归！

## 结语

折腾完这一圈深刻感觉到：**所有硬编码（Hardcode）绝对路径的前端框架，在遇上二级子域名/子目录托管部署时都会经历严重的阵痛。** 
好在我们剥开表象切入了构建器与执行 JS 的脉络底层，彻底扫除了这颗定时炸弹。这次不仅补全了依赖，我还将所有完美魔改版的主题源文件 100% 同步推送到了 GitHub。以此存档，希望下一次即便遇到电脑罢工，咱们也能随时随地满血复活！
