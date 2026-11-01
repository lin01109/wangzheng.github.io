/* This is a script to create a new post markdown file with front-matter */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

function getDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`)
  process.exit(1) // Terminate the script and return error code 1
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args[0])) {
  console.error('名称仅使用小写英文字母、数字和连字符。')
  process.exit(1)
}
let fileName = `${args[0]}/index.md`

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const targetDir = fileURLToPath(new URL('../content/articles/', import.meta.url))
const fullPath = path.join(targetDir, fileName)

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

const content = `---
title: "待填写标题"
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: true
lang: ''
---
`

fs.writeFileSync(fullPath, content + '\n<!-- 【待确认】：公开范围、事实依据、图片元数据。仅保存脱敏草稿；原始资料留在仓库外。 -->\n', { flag: 'wx' })

console.log(`Post ${fullPath} created`)
