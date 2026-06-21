# /wp-review — Full CLAUDE.md Compliance Review

You are reviewing WordPress theme code for compliance with ALL rules in CLAUDE.md.
Run this after completing any feature or before committing. Think of it as a pre-commit
code review against the project's own standards.

**Files or scope to review:** $ARGUMENTS

If no argument is given, review all recently modified files (check git status or ask the user).

---

## Your job

Read every specified file and check it against CLAUDE.md rules 1–12.
Output a single consolidated report with pass/fail per rule per file.
Then list all required fixes, grouped by priority.

---

## Checklist by Rule

### Rule 1 — Tailwind CSS (Strict)
- [ ] No `.css` files with custom rules created (check for any new *.css files)
- [ ] No Bootstrap classes used (`col-`, `btn-`, `container`, `row`, etc.)
- [ ] No `style=""` inline attributes anywhere
- [ ] `tailwind.config.js` content paths cover all new file extensions/paths added

### Rule 2 — Timber / Twig Templating
- [ ] No HTML echoed directly from PHP (outside of `Timber::render` / `Timber::compile`)
- [ ] No database queries inside `.twig` files
- [ ] All data passed explicitly via `$context` array
- [ ] Reusable fragments use `{% include 'partials/…' %}` not duplicated markup

### Rule 3 — Gutenberg Blocks
- [ ] Attributes defined in `block.json`, not registered in PHP
- [ ] `render.php` uses `$attributes['field'] ?? 'default'` for every attribute
- [ ] `edit.jsx` uses `useBlockProps` on the root element
- [ ] Block registered via `register_block_type(__DIR__ . '/blocks/name')` in functions.php

### Rule 4 — Images
- [ ] Every `<img>` is wrapped in `<picture>` with a WebP `<source>`
- [ ] No PNG or JPG paths served without a WebP alternative
- [ ] Every `<img>` has explicit `width` and `height`
- [ ] LCP images use `loading="eager" fetchpriority="high"`
- [ ] Below-fold images use `loading="lazy" decoding="async"`

### Rule 5 — Performance
- [ ] No `<script>` without `defer` or `async` (except block `editorScript`)
- [ ] LCP image has `<link rel="preload">` in head
- [ ] No render-blocking CSS in `<body>`
- [ ] Transients used for any query that runs on every page load

### Rule 6 — SEO / AEO / GEO
- [ ] `views/partials/head.twig` outputs all required meta tags
- [ ] `schema_json` in `<head>` is a valid JSON-LD object
- [ ] `_content_format` used to select correct schema type
- [ ] `robots_directive` defaults to `'index,follow'`
- [ ] No ACF calls used for SEO fields — all via `register_post_meta` + `get_post_meta`

### Rule 7 — Code Injection Points
- [ ] All 4 injection points present in base.twig (head, body_open, body_close, after_footer)
- [ ] Injection values use `| raw` filter
- [ ] No hardcoded GTM snippets or pixel scripts in templates

### Rule 8 — Content Fallbacks
- [ ] Every Twig variable uses `| default(…)` or is set with `{% set x = x | default(…) %}` at top
- [ ] PHP attributes use `?? 'safe default'` not just `$attributes['field']` bare
- [ ] Arrays use `| default([])` in `{% for %}` loops
- [ ] Placeholder image exists at `assets/images/placeholder.webp`
- [ ] No `| raw` on user-provided content (only on system-generated HTML)

### Rule 9 — Accessibility
- [ ] Every `<img>` has `alt` attribute (empty string allowed for decorative)
- [ ] Buttons without visible text have `aria-label`
- [ ] Icon-only links have `aria-label`
- [ ] Form inputs have `<label>` or `aria-label`
- [ ] Structural roles use semantic elements (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`)
- [ ] Skip link present in base.twig
- [ ] Decorative SVGs have `aria-hidden="true"`

### Rule 10 — Modern Web Standards
- [ ] No `<div>` used as structural landmark
- [ ] No icon fonts (only inline SVG)
- [ ] No deprecated HTML attributes (`border`, `align`, `bgcolor`, `cellpadding`)
- [ ] Void elements without trailing slash: `<img>`, `<br>`, `<input>`

### Rule 11 — Contact Form 7
- [ ] CF7 rendered via `{{ function('do_shortcode', '…') | raw }}`
- [ ] CF7 wrapper has `role="region"`, `aria-label`, `aria-live="polite"`
- [ ] No hardcoded form HTML — always use CF7 shortcode

---

## Report format

```
## CLAUDE.md Compliance Review
**Scope:** {files reviewed}
**Date:** {today}

### Summary
| Rule | Status | Issues |
|------|--------|--------|
| Rule 1 — Tailwind | ✅ PASS | — |
| Rule 2 — Timber/Twig | ⚠️ WARN | 1 issue |
| Rule 3 — Blocks | ❌ FAIL | 2 issues |
…

### Issues (ordered by severity)

#### ❌ FAIL — Rule 3: Missing ?? fallback
**File:** blocks/hero/render.php:8
**Problem:** `$attributes['heading']` — no fallback if attribute is missing
**Fix:** Change to `$attributes['heading'] ?? ''`

#### ⚠️ WARN — Rule 8: Missing | default()
**File:** views/partials/card.twig:12
**Problem:** `{{ item.title }}` rendered without default filter
**Fix:** Change to `{{ item.title | default('') }}`

…

### Overall: X / 12 rules fully passing
```

After the report, ask: **"Should I apply all fixes now?"**
Apply them only if the user confirms.
