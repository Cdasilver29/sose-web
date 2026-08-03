# tools/

`sync-partials.mjs` keeps the nav and footer identical across every page by
rewriting the marked blocks in place. It is the only tooling in this project.

- `npm run sync` rewrites pages from `tools/partials/`
- `npm run check` exits 1 if any page has drifted, for use before commits or in CI

Nothing in this folder is served. Exclude it when deploying to shared hosting.
