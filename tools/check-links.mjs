#!/usr/bin/env node
/**
 * Reports internal links that point at routes which do not exist yet.
 *
 *   node tools/check-links.mjs            list missing routes, exit 0
 *   node tools/check-links.mjs --strict   exit 1 if anything is missing
 *
 * Run it after every phase. Before launch, run with --strict: a marketing site
 * that 404s on its own navigation is worse than one with fewer pages.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'tools', 'content', 'docs', 'reference']);
const STRICT = process.argv.includes('--strict');

function findHtml(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry) || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) findHtml(full, acc);
    else if (entry.endsWith('.html')) acc.push(full);
  }
  return acc;
}

function resolves(href) {
  const path = href.split('#')[0].split('?')[0];
  if (path === '/') return existsSync(join(ROOT, 'index.html'));
  const clean = path.replace(/^\/|\/$/g, '');
  const target = join(ROOT, clean);
  if (path.endsWith('/')) return existsSync(join(target, 'index.html'));
  if (existsSync(target) && statSync(target).isDirectory())
    return existsSync(join(target, 'index.html'));
  return existsSync(target) || existsSync(`${target}.html`);
}

const pages = findHtml(ROOT);
const missing = new Map(); // route -> Set of pages linking to it

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith('//')) continue;
    if (resolves(href)) continue;
    if (!missing.has(href)) missing.set(href, new Set());
    missing.get(href).add(relative(ROOT, file));
  }
}

console.log(`Scanned ${pages.length} page(s).`);

if (!missing.size) {
  console.log('Every internal link resolves.');
  process.exit(0);
}

console.log(`\n${missing.size} route(s) not built yet:\n`);
for (const [route, sources] of [...missing].sort()) {
  console.log(`  ${route}`);
  console.log(`      linked from: ${[...sources].join(', ')}`);
}

if (STRICT) {
  console.error('\n--strict: build these or remove the links before launch.');
  process.exit(1);
}
console.log('\nExpected mid-build. Run with --strict before launch.');
