# Fonts

Self-hosted so the site makes no third-party request. See the `@font-face`
block at the top of `css/styles.css` and the brand tokens section of
`CLAUDE.md`.

| File | Family | Style | Weight axis | Size |
|---|---|---|---|---|
| `inter-latin.woff2` | Inter | normal | 400–700 | 48 KB |
| `playfair-latin.woff2` | Playfair Display | normal | 400–700 | 38 KB |
| `playfair-italic-latin.woff2` | Playfair Display | italic | 500 | 23 KB |

All three are the **latin** subset only, taken from the Google Fonts CDN build
(Inter v20, Playfair Display v40). The latin-ext subset was dropped after a
scan of every character painted on the site found none in that range; anything
outside latin falls back to the system font.

Both families are variable, which is why one file covers a weight range rather
than one file per weight.

## Licensing

Both are licensed under the SIL Open Font License 1.1, which permits
redistribution provided the licence travels with the font. It is vendored here:

- `OFL-Inter.txt` — Copyright (c) 2016 The Inter Project Authors
- `OFL-PlayfairDisplay.txt` — Copyright 2017 The Playfair Display Project
  Authors, with Reserved Font Name "Playfair Display"

Neither font may be sold on its own, and any derivative must not use the
reserved name. Nothing here modifies either font.
