import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

export const root = fileURLToPath(new URL('../', import.meta.url));
export function prepareContent() {
  const source = path.join(root, 'content/articles');
  const target = path.join(root, 'src/content/posts');
  if (target !== path.resolve(root,'src/content/posts')) throw new Error('Invalid staging path');
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target,{ recursive: true });
  fs.mkdirSync(source, { recursive: true });
  let count = 0;
  for (const folder of fs.readdirSync(source, { withFileTypes: true })) {
    if (!folder.isDirectory() || folder.isSymbolicLink() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folder.name)) throw new Error('文章必须使用小写英文 slug 目录');
    const dir = path.join(source,folder.name);
    const text = fs.readFileSync(path.join(dir,'index.md'),'utf8');
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!match) throw new Error(`${folder.name}: 缺少 YAML 元数据`);
    const data = YAML.parse(match[1], { uniqueKeys: true });
    if (!data || (data.draft !== undefined && typeof data.draft !== 'boolean')) throw new Error(`${folder.name}: draft 必须是布尔值`);
    // Fail closed: missing draft field is also treated as a draft. Its assets never enter Astro.
    if (data.draft !== false) continue;
    if (/待填写|【待确认】|TODO|PRIVATE_REVIEW/.test(text)) throw new Error(`${folder.name}: 清理待确认内容后再公开`);
    const dest = path.join(target,folder.name);
    fs.mkdirSync(dest,{recursive:true});
    for (const file of fs.readdirSync(dir,{withFileTypes:true})) {
      if (!file.isFile() || file.isSymbolicLink() || !/^(index\.md|[a-z0-9-]+\.(png|jpg|jpeg|webp|avif|svg))$/.test(file.name)) throw new Error(`${folder.name}: 不允许的文件 ${file.name}`);
      fs.copyFileSync(path.join(dir,file.name),path.join(dest,file.name));
    }
    count++;
  }
  console.log(`内容准备完成：${count} 篇公开候选文章；草稿与其图片未复制。`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareContent();
