# english-notes
English grammar notes as a static site — numbered Markdown notes, auto-built search index, hosted on GitHub Pages.
# 📒 英语笔记 (english-notes)

一个纯静态的个人英语笔记网站。笔记以「带编号的 Markdown 文件」存放在仓库中，推送后自动生成搜索索引，由 GitHub Pages 托管，无需数据库和服务器。

在线预览：https://gb233.github.io/english-notes

## ✨ 特点

- **编号即永久链接**：每篇笔记有固定 ID（如 `0001`），标题和文件名可改，链接永不失效。
- **全文搜索**：支持按标题、标签、正文检索，并可按标签筛选。
- **零后端**：纯 HTML/CSS/JS，构建产物为两个 JSON 文件。
- **写完即发布**：往 `notes/` 目录新增 `.md` 文件并推送，GitHub Actions 会自动重建索引。

## 📁 目录结构
├── notes/ # 笔记源文件（手写）
│ └── 0001-are-grammar.md
├── data/ # 自动生成，不要手写
│ ├── index.json # 列表与摘要
│ └── search-index.json # 全文搜索索引
├── scripts/build-index.js # 本地构建脚本
├── index.html / app.js / style.css
└── .github/workflows/build.yml

## 📝 笔记怎么写

```markdown
---
id: "0001"
title: "are 的语法结构"
tags: [be动词, 基础语法]
updated: 2026-09-25
---

## 一、基本用法

`are` 是 be 动词的第二人称及复数形式。

- You **are** a student.
- They **are** happy.