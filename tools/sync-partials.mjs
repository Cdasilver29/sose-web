#!/usr/bin/env node
/**
 * Keeps the shared nav and footer identical across every page.
 *
 *   node tools/sync-partials.mjs           rewrite every page from tools/partials/
 *   node tools/sync-partials.mjs --check   exit 1 if any page has drifted
 *
 * Pages mark where a partial goes:
 *   <!-- partial:nav -->  ... anything here is replaced ...  <!-- /partial:nav -->
 *
 * This edits files in place. There is no build output, so the repo is always
 * the deployable artifact.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PARTIAL_DIR = join(ROOT, 'tools', 'partials');
const SKIP_DIRS = new Set(['node_modules', '.git', 'tools', 'reference', 'content', 'docs']);
const CHECK = process.argv.includes('--check');

const partials = Object.fromEntries(
  readdirSync(PARTIAL_DIR)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace(/\.html$/, ''), readFileSync(join(PARTIAL_DIR, f), 'utf8').trim()])
);

function findHtml(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry) || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) findHtml(full, acc);
    else if (entry.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const pages = findHtml(ROOT);
let changed = [];
let missing = [];

for (const file of pages) {
  const before = readFileSync(file, 'utf8');
  let after = before;

  for (const [name, body] of Object.entries(partials)) {
    const open = `<!-- partial:${name} -->`;
    const close = `<!-- /partial:${name} -->`;
    if (!before.includes(open)) {
      missing.push(`${relative(ROOT, file)} is missing ${open}`);
      continue;
    }
    const pattern = new RegExp(
      `${open.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${close.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
    );
    after = after.replace(pattern, `${open}\n${body}\n${close}`);
  }

  if (after !== before) {
    changed.push(relative(ROOT, file));
    if (!CHECK) writeFileSync(file, after);
  }
}

if (missing.length) {
  console.error('Missing partial markers:');
  missing.forEach((m) => console.error('  ' + m));
}

if (CHECK) {
  if (changed.length || missing.length) {
    console.error(`\nDrift detected in ${changed.length} file(s):`);
    changed.forEach((f) => console.error('  ' + f));
    console.error('\nRun: npm run sync');
    process.exit(1);
  }
  console.log(`All ${pages.length} pages match tools/partials/.`);
} else {
  console.log(
    changed.length
      ? `Synced ${changed.length} of ${pages.length} pages:\n  ${changed.join('\n  ')}`
      : `All ${pages.length} pages already in sync.`
  );
  if (missing.length) process.exit(1);
}
