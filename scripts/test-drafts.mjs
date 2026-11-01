import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { root, prepareContent } from './prepare-content.mjs';
const dirs = ['privacy-canary','privacy-canary-default'].map(slug=>path.join(root,'content/articles',slug));
assert(dirs.every(dir=>!fs.existsSync(dir)),'测试目录已存在，拒绝覆盖');
try {
  for (const [i,dir] of dirs.entries()) {
    fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,'index.md'),`---\ntitle: DRAFT_SENTINEL_4af29\npublished: 2026-10-30\ntags: [DRAFT_SENTINEL_4af29]\n${i===0?'draft: true\n':''}image: ./private.svg\n---\nDRAFT_SENTINEL_4af29\n![private](./private.svg)\n`);
    fs.writeFileSync(path.join(dir,'private.svg'),'<svg xmlns="http://www.w3.org/2000/svg"><text>DRAFT_SENTINEL_4af29</text></svg>');
  }
  prepareContent();
  for (const dir of dirs) assert(!fs.existsSync(path.join(root,'src/content/posts',path.basename(dir))));
  const run = (command,args)=> { const result=spawnSync(command,args,{cwd:root,stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}}); assert.equal(result.status,0,`${command} failed`); };
  run(process.execPath,['node_modules/astro/astro.js','build']);
  // Run Pagefind through its declared local package binary.
  run(process.execPath,['node_modules/pagefind/lib/runner/bin.cjs','--site','dist']);
  run(process.execPath,['scripts/verify-build.mjs']);
  console.log('PASS：显式草稿、默认草稿及其图片均未进入 Astro 和完整发布产物。');
} finally {
  for (const dir of dirs) fs.rmSync(dir,{recursive:true,force:true});
  prepareContent();
}
