import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root } from './prepare-content.mjs';
const dist = path.join(root,'dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/,'');
function files(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?files(path.join(dir,f.name)):[path.join(dir,f.name)]); }
const output = files(dist);
assert(output.some(f=>f.endsWith('pagefind.js')), '缺少搜索索引');
for (const file of output) {
  const body = fs.readFileSync(file);
  assert(!body.includes(Buffer.from('DRAFT_SENTINEL_4af29')), `草稿泄漏：${path.relative(dist,file)}`);
  assert(!path.relative(dist,file).includes('privacy-canary'), '草稿路径泄漏');
  if (!/\.(html|xml|js|css|txt|json)$/.test(file)) continue;
  const text = body.toString();
  assert(!/[A-Z]:[\\/](?:Users|my-spaces)[\\/]/i.test(text),'产物含本机身份路径');
  if (!file.endsWith('.html')) continue;
  for (const match of text.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const link = match[1];
    if (/^(?:https?:|data:|mailto:|tel:|\/\/)/.test(link)) continue;
    let target;
    if (link.startsWith('/')) {
      assert(!base || link.startsWith(base+'/') || link===base,`链接遗漏 base：${link}`);
      target = path.join(dist,decodeURIComponent(link.slice(base.length)));
    } else target = path.resolve(path.dirname(file),decodeURIComponent(link));
    assert(fs.existsSync(target),`损坏的本地链接：${link} (${path.relative(dist,file)})`);
  }
}
const samplePath = path.join(dist,'posts/learning-in-small-steps/index.html');
if (fs.existsSync(samplePath)) {
  const article = fs.readFileSync(samplePath,'utf8');
  for (const fragment of ['示例','<h1','<table','<pre','<img','<ul','<ol']) assert(article.includes(fragment),`缺少文章元素 ${fragment}`);
}
assert(fs.existsSync(path.join(dist,'index.html')),'缺少首页');
assert(fs.existsSync(path.join(dist,'rss.xml')),'缺少 RSS');
assert(fs.readFileSync(path.join(dist,'robots.txt'),'utf8').includes(`${base}/sitemap-index.xml`),'robots 遗漏站点地图 base');
console.log(`验证通过：${output.length} 个产物，站内链接、配图、代码、表格、RSS、搜索文件与草稿哨兵。`);
