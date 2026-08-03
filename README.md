# SOSE Website

Marketing site for Sight Over Site Engineering, Kenya.
Static HTML, CSS and vanilla JS. No framework, no build step.

## Run it

```bash
npm run dev        # http://localhost:5173
```

A server is required because asset paths are root-relative. Opening
`index.html` from the file system will not load CSS. VS Code Live Server works
equally well.

## Shared nav and footer

They live in `tools/partials/`. Edit them there, never inside a page, then:

```bash
npm run sync       # push into every page
npm run check      # fails if any page drifted. Run before committing.
```

## Deploy

The repo is the artifact. There is no build output.

- Netlify or Vercel: connect the repo, no build command, publish directory `.`
- Shared hosting or cPanel: upload everything except `tools/`, `content/`,
  `docs/`, `node_modules/` and dotfiles into `public_html`

## Continue the build

`CLAUDE.md` holds the rules. `BUILD-PLAN.md` has the remaining phases with
prompts. `services/structural-audits/index.html` is the pattern every interior
page follows.
