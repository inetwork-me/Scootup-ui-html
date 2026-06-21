# /seo-audit — SEO + AEO + GEO Compliance Audit

You are auditing a WordPress theme template or page for SEO, AEO (Answer Engine Optimization),
and GEO (Generative Engine Optimization) completeness. Read CLAUDE.md Rule 6 for the full spec.

**File or page to audit:** $ARGUMENTS

---

## Your job

1. Read the specified file(s). If no file is given, ask the user which template to audit.
2. Run through every check below.
3. Output a scored report with ✅ PASS / ⚠️ WARN / ❌ FAIL for each item.
4. List specific fixes for every WARN and FAIL.

---

## SEO Checks

### Head meta (views/partials/head.twig or wherever head is rendered)
- [ ] `<meta charset="UTF-8">` present
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">` present
- [ ] `<title>` tag present and uses `{{ meta_title }} | {{ site.name }}` pattern
- [ ] `<meta name="description">` present with Timber variable
- [ ] `<meta name="robots">` present with `{{ robots_directive | default('index,follow') }}`
- [ ] `<link rel="canonical">` present
- [ ] Open Graph: og:title, og:description, og:image, og:url, og:type, og:site_name — all 6 present
- [ ] Twitter Card: twitter:card, twitter:title, twitter:description, twitter:image — all 4 present
- [ ] `<h1>` appears **exactly once** in the rendered template (check all included partials)

### robots.txt (inc/robots.php)
- [ ] `robots_txt` filter exists
- [ ] Sitemap URL is injected via the filter
- [ ] No static `robots.txt` file committed to the theme

### sitemap.xml (inc/sitemap.php)
- [ ] WordPress built-in sitemap is not disabled
- [ ] `attachment` post type removed from sitemap
- [ ] Image data added to sitemap entries

---

## AEO Checks (Answer Engine Optimization)

- [ ] `_content_format` post meta field is registered and surfaced in Block Editor sidebar
- [ ] `schema_json` is output in `<head>` as `application/ld+json`
- [ ] For pages with `content_format = faq`: FAQPage schema generated with Question/Answer pairs
- [ ] For pages with `content_format = howto`: HowTo schema generated
- [ ] FAQ items are human-readable, concise, direct answers (not keyword-stuffed)
- [ ] H2/H3 headings match FAQ questions (featured-snippet optimization)
- [ ] Speakable schema: `_speakable_selectors` field registered (even if empty for now)

---

## GEO Checks (Generative Engine Optimization)

- [ ] `<meta name="author">` present in head when `author_name` is set
- [ ] `author` field in Article/WebPage JSON-LD includes `name` and `description` (credentials)
- [ ] `dateModified` in JSON-LD is populated (from `_content_updated` or `get_the_modified_date()`)
- [ ] `publisher` Organization block in JSON-LD includes `sameAs` array (social profiles)
- [ ] `mentions` array present in Article JSON-LD when `entity_mentions` are defined
- [ ] `BreadcrumbList` schema present on all pages except homepage
- [ ] Content uses clear, factual, citable sentences (qualitative — flag if unable to verify)

---

## Context Population Checks (inc/meta-context.php)

- [ ] `timber/context` filter exists for SEO meta population
- [ ] `meta_title` falls back to `get_the_title()`
- [ ] `og_image` falls back to `get_the_post_thumbnail_url()`
- [ ] `canonical_url` falls back to `get_permalink()`
- [ ] `robots_directive` falls back to `'index,follow'`
- [ ] `content_format` falls back to `'article'`
- [ ] `author_name` falls back to `get_the_author_meta('display_name', …)`
- [ ] `content_updated` falls back to `get_the_modified_date('c', …)`

---

## Code Injection Checks (Rule 7)

- [ ] `theme_code_head` option output before `</head>`
- [ ] `theme_code_body_open` option output after `<body>` open
- [ ] `theme_code_body_close` option output before `</body>`
- [ ] `theme_code_after_footer` option output after `</footer>`
- [ ] All injection points use `| raw` filter (safe since admin-only input)

---

## Report format

```
## SEO + AEO + GEO Audit Report
**File audited:** {filename}
**Date:** {today}

### SEO — Head Meta
| Check | Status | Note |
|-------|--------|------|
| charset | ✅ PASS | |
| viewport | ✅ PASS | |
| title tag | ❌ FAIL | Missing fallback to get_the_title() |
…

### AEO
| Check | Status | Note |
…

### GEO
| Check | Status | Note |
…

### Fixes Required
1. [Specific file + line + what to change]
2. …

### Score: X / Y checks passing
```

After the report, offer to fix all FAILs automatically.
