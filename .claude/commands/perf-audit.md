# /perf-audit — Performance Compliance Audit (95+ Lighthouse)

You are auditing a WordPress theme for performance compliance against CLAUDE.md Rule 5.
Target: 95+ Lighthouse performance score, Core Web Vitals in green.

**File or directory to audit:** $ARGUMENTS

---

## Your job

1. Read the specified file(s). If no argument given, audit the full `views/` directory and all PHP templates.
2. Run through every check below.
3. Output a report with ✅ PASS / ⚠️ WARN / ❌ FAIL for each item.
4. List specific file + line fixes for every WARN and FAIL.

---

## LCP — Largest Contentful Paint (target < 2.5s)

- [ ] Hero / above-fold image uses `loading="eager" fetchpriority="high"` (NOT lazy)
- [ ] LCP image is preloaded in `<head>`: `<link rel="preload" as="image" href="…" fetchpriority="high">`
- [ ] LCP image is WebP format and served via `<picture>` element
- [ ] LCP image has explicit `width` and `height` attributes
- [ ] No render-blocking `<script>` tags above the LCP element (check base.twig / head.twig)
- [ ] Web fonts are preconnected: `<link rel="preconnect" href="https://fonts.googleapis.com">`

---

## CLS — Cumulative Layout Shift (target < 0.1)

- [ ] Every `<img>` tag has explicit `width` and `height` attributes
- [ ] No images without dimensions anywhere in views/ or blocks/
- [ ] Web fonts use `font-display: swap` (check any @font-face or Google Fonts URL)
- [ ] No dynamic content injected above existing content without reserved space
- [ ] Ad slots or embeds have a fixed aspect-ratio container

---

## INP — Interaction to Next Paint (target < 200ms)

- [ ] No synchronous JS blocking the main thread in `<head>` without `defer` or `async`
- [ ] Heavy scripts (analytics, chat widgets) loaded with `defer` or `async`
- [ ] No large inline `<script>` blocks in Twig templates
- [ ] Event listeners on common elements (nav, modals) use passive listeners

---

## Resource Loading

- [ ] All `<script>` tags in templates use `defer` or `async` (check head.twig, footer.twig, injection points)
- [ ] No synchronous CSS loaded in `<body>`
- [ ] Google Fonts (if used): loaded via `<link rel="preconnect">` + display=swap param
- [ ] Third-party scripts (GTM, pixels) go through code injection points, not hardcoded in templates
- [ ] `<link rel="preconnect">` present for every third-party origin referenced

---

## Images

- [ ] ALL images use `<picture>` with WebP `<source>` + fallback `<img>`
- [ ] All below-fold images: `loading="lazy" decoding="async"`
- [ ] All above-fold (LCP) images: `loading="eager" fetchpriority="high"`
- [ ] `srcset` + `sizes` present on images that need responsive sizing
- [ ] Placeholder image committed at `assets/images/placeholder.webp`
- [ ] No PNG or JPG served directly without WebP alternative

---

## Build & Assets

- [ ] `tailwind.config.js` has `content` paths covering all `.twig`, `.php`, `.jsx` files (unused classes purged)
- [ ] `NODE_ENV=production` build is what gets deployed (check build scripts)
- [ ] Block assets use `block.json` `style` / `editorStyle` split (editor CSS not loaded on front end)
- [ ] WordPress transients used for expensive Timber context queries (check `inc/meta-context.php`)

---

## Report format

```
## Performance Audit Report
**Scope audited:** {files/directories}
**Date:** {today}

### LCP
| Check | Status | File | Fix |
|-------|--------|------|-----|
| Hero loading="eager" | ❌ FAIL | views/partials/hero.twig:14 | Change loading="lazy" to loading="eager" fetchpriority="high" |
…

### CLS
| Check | Status | File | Fix |
…

### INP
…

### Resource Loading
…

### Images
…

### Build & Assets
…

### Priority Fixes (ordered by impact)
1. [Highest impact first — file:line — exact change needed]
2. …

### Estimated Score Impact
- Fixing LCP preload: +{n} pts
- Fixing missing img dimensions: +{n} pts
…

### Score: X / Y checks passing
```

After the report, offer to apply all fixes automatically.
