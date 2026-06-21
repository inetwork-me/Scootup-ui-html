# CLAUDE.md — WordPress Theme Development Standards

## Stack
- **CMS**: WordPress (latest stable)
- **Templating**: Timber 3.x + Twig 3.x — ALL front-end output must go through Twig
- **Styling**: Tailwind CSS utility classes ONLY — no custom .css files, no Bootstrap
- **Blocks**: Custom Gutenberg blocks — React/JSX + block.json + native WP attributes
- **SEO/AEO/GEO**: Native WordPress custom meta (no ACF) via `register_post_meta` + Block Editor sidebar panel
- **Forms**: Contact Form 7
- **Build**: `@wordpress/scripts` (webpack + PostCSS + Tailwind)
- **Language**: Single language (no multilingual plugin)

---

## Rule 1 — Tailwind CSS (Strict)
- Apply Tailwind utility classes directly in `.twig`, `.jsx`, and `.php` templates
- NEVER create a custom `.css` file with standalone rules
- NEVER use Bootstrap or any other CSS framework alongside Tailwind
- NEVER use inline `style=""` attributes
- Configure `tailwind.config.js` with `content` paths covering all `.twig`, `.php`, `.jsx`
- All design tokens (colors, spacing, typography, breakpoints) live in `tailwind.config.js`
- Use `@layer components` in the config ONLY when a pattern repeats 5+ times across files

---

## Rule 2 — Timber / Twig Templating
- All front-end HTML output goes through `Timber::render()` or `Timber::compile()`
- Template hierarchy mirrors WordPress: `page.twig`, `single.twig`, `archive.twig`, etc.
- Block front-end uses `render.php` which calls `Timber::render('blocks/{name}.twig', $ctx)`
- Pass all data explicitly via `$context` array — never query inside a Twig template
- Use Timber image helpers for resizing: `{{ image.src | resize(800, 600) }}`
- Partials for every reusable component: `{% include 'partials/card.twig' with {...} %}`

### Folder Structure
```
theme-root/
├── blocks/
│   └── {block-name}/
│       ├── block.json        ← attributes, supports, category, icon
│       ├── edit.jsx          ← React editor UI
│       ├── render.php        ← calls Timber::render
│       └── {block-name}.twig ← front-end Twig template
├── views/
│   ├── index.twig
│   ├── page.twig
│   ├── single.twig
│   ├── archive.twig
│   └── partials/
│       ├── head.twig         ← all <head> meta tags
│       ├── header.twig
│       ├── footer.twig
│       ├── inject-head.twig  ← code injection before </head>
│       ├── inject-body.twig  ← code injection after <body>
│       └── inject-footer.twig ← code injection before </body>
├── inc/
│   ├── meta-fields.php       ← register_post_meta for SEO/AEO/GEO
│   ├── meta-context.php      ← timber/context filter populating meta values
│   ├── seo-panel/
│   │   ├── index.jsx         ← Block Editor sidebar panel (PluginDocumentSettingPanel)
│   │   └── block.json
│   ├── robots.php            ← robots_txt filter
│   └── sitemap.php           ← wp_sitemaps_* filters / custom sitemap extensions
├── src/
│   └── index.js              ← Tailwind entry (@tailwind base/components/utilities)
├── functions.php
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Rule 3 — Gutenberg Blocks (React, Native Attributes)
- Each custom block lives in `blocks/{block-name}/`
- Use `block.json` for ALL attribute registration — no PHP-side attributes
- All block content fields are defined as attributes in `block.json`:
  ```json
  {
    "name": "theme/hero",
    "attributes": {
      "heading":    { "type": "string", "default": "" },
      "subheading": { "type": "string", "default": "" },
      "imageUrl":   { "type": "string", "default": "" },
      "imageAlt":   { "type": "string", "default": "" },
      "ctaLabel":   { "type": "string", "default": "" },
      "ctaUrl":     { "type": "string", "default": "" }
    }
  }
  ```
- `edit.jsx` uses `@wordpress/block-editor` components: `useBlockProps`, `InspectorControls`, `RichText`, `MediaUpload`
- `render.php` passes attributes to Timber context:
  ```php
  $context               = Timber::context();
  $context['heading']    = $attributes['heading']  ?? '';
  $context['image_url']  = $attributes['imageUrl'] ?? '';
  $context['image_alt']  = $attributes['imageAlt'] ?? '';
  Timber::render('blocks/hero/hero.twig', $context);
  ```
- Enqueue block assets via `block.json` `editorScript` / `style` / `viewScript` fields
- Register all blocks via `register_block_type(__DIR__ . '/blocks/block-name')` in `functions.php`

---

## Rule 4 — Images (WebP Mandatory)
- ALL images served to users must be WebP format
- Source assets (PNG, JPG) are converted to WebP at build time via `imagemin-webp` or `sharp`
- Always use `<picture>` with WebP source + original format fallback:
  ```twig
  <picture>
    <source srcset="{{ image_webp }}" type="image/webp">
    <img
      src="{{ image_src }}"
      alt="{{ image_alt }}"
      width="{{ image_width }}"
      height="{{ image_height }}"
      loading="lazy"
      decoding="async"
    >
  </picture>
  ```
- LCP (above-fold hero) images: `loading="eager" fetchpriority="high"` — never lazy-load these
- Always specify explicit `width` and `height` on every `<img>` to prevent CLS
- Use `srcset` + `sizes` for responsive images when multiple sizes are available

---

## Rule 5 — Performance (Target: 95+ Lighthouse)
- Preload the LCP image: `<link rel="preload" as="image" href="...hero.webp" fetchpriority="high">`
- All scripts: `defer` unless render-critical; no synchronous JS in `<body>`
- No render-blocking CSS in `<body>`
- Web fonts: `font-display: swap`; prefer system font stack where design allows
- Use WordPress transients for expensive queries in Timber context
- `NODE_ENV=production` build: minify + tree-shake all assets
- No unused Tailwind classes shipped (JIT purges automatically via `content` config)
- Target Core Web Vitals: LCP < 2.5s | CLS < 0.1 | INP < 200ms
- Lazy-load all images below the fold (`loading="lazy"` + `decoding="async"`)
- Use `<link rel="preconnect">` for third-party origins (fonts, analytics)

---

## Rule 6 — SEO + AEO + GEO (No ACF — Native WordPress Meta)

### 6.1 Custom Meta Fields (registered natively)
Register in `inc/meta-fields.php` and include from `functions.php`:

```php
function theme_register_seo_meta() {
    $fields = [
        // SEO
        '_meta_title'         => ['type' => 'string'],
        '_meta_description'   => ['type' => 'string'],
        '_og_image'           => ['type' => 'string'],  // absolute URL
        '_canonical_url'      => ['type' => 'string'],
        '_robots_directive'   => ['type' => 'string'],  // e.g. "index,follow"
        // AEO — Answer Engine Optimization
        '_faq_items'          => ['type' => 'string'],  // JSON: [{q:"",a:""}]
        '_speakable_selectors'=> ['type' => 'string'],  // CSS selectors for Speakable
        '_content_format'     => ['type' => 'string'],  // article | faq | howto | product
        // GEO — Generative Engine Optimization
        '_author_name'        => ['type' => 'string'],
        '_author_credentials' => ['type' => 'string'],  // e.g. "PhD, 10 years exp."
        '_content_updated'    => ['type' => 'string'],  // ISO date for dateModified
        '_entity_mentions'    => ['type' => 'string'],  // JSON: ["Entity A","Entity B"]
    ];
    foreach ($fields as $key => $args) {
        register_post_meta('', $key, array_merge($args, [
            'show_in_rest' => true,
            'single'       => true,
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]));
    }
}
add_action('init', 'theme_register_seo_meta');
```

Block Editor sidebar panel (`inc/seo-panel/index.jsx`) uses `PluginDocumentSettingPanel`
+ `useEntityProp` to surface all fields as a tabbed panel (SEO / AEO / GEO tabs).

### 6.2 Timber Context — Meta Population (`inc/meta-context.php`)
```php
add_filter('timber/context', function($ctx) {
    $id = get_the_ID();

    // SEO
    $ctx['meta_title']       = get_post_meta($id, '_meta_title', true)
                               ?: get_the_title();
    $ctx['meta_description'] = get_post_meta($id, '_meta_description', true) ?: '';
    $ctx['og_image']         = get_post_meta($id, '_og_image', true)
                               ?: get_the_post_thumbnail_url($id, 'large');
    $ctx['canonical_url']    = get_post_meta($id, '_canonical_url', true)
                               ?: get_permalink($id);
    $ctx['robots_directive'] = get_post_meta($id, '_robots_directive', true)
                               ?: 'index,follow';

    // AEO
    $ctx['faq_items']        = json_decode(
                                   get_post_meta($id, '_faq_items', true) ?: '[]', true
                               );
    $ctx['content_format']   = get_post_meta($id, '_content_format', true) ?: 'article';

    // GEO / E-E-A-T
    $ctx['author_name']        = get_post_meta($id, '_author_name', true)
                                 ?: get_the_author_meta('display_name', get_post_field('post_author', $id));
    $ctx['author_credentials'] = get_post_meta($id, '_author_credentials', true) ?: '';
    $ctx['content_updated']    = get_post_meta($id, '_content_updated', true)
                                 ?: get_the_modified_date('c', $id);
    $ctx['entity_mentions']    = json_decode(
                                     get_post_meta($id, '_entity_mentions', true) ?: '[]', true
                                 );

    // Schema JSON-LD — built from context values
    $ctx['schema_json'] = theme_build_schema($ctx);

    return $ctx;
});
```

### 6.3 `views/partials/head.twig` — Full Meta Output
```twig
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ meta_title }} | {{ site.name }}</title>
<meta name="description" content="{{ meta_description }}">
<meta name="robots" content="{{ robots_directive }}">
<link rel="canonical" href="{{ canonical_url }}">

{# Open Graph #}
<meta property="og:title"       content="{{ meta_title }}">
<meta property="og:description" content="{{ meta_description }}">
<meta property="og:image"       content="{{ og_image }}">
<meta property="og:url"         content="{{ canonical_url }}">
<meta property="og:type"        content="{{ og_type | default('website') }}">
<meta property="og:site_name"   content="{{ site.name }}">

{# Twitter / X Card #}
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="{{ meta_title }}">
<meta name="twitter:description" content="{{ meta_description }}">
<meta name="twitter:image"       content="{{ og_image }}">

{# GEO: E-E-A-T authorship signal #}
{% if author_name %}
<meta name="author" content="{{ author_name }}">
{% endif %}

{# Structured Data (SEO + AEO + GEO) #}
<script type="application/ld+json">{{ schema_json | raw }}</script>
```

### 6.4 Schema JSON-LD Strategy
Function `theme_build_schema($ctx)` in `inc/meta-context.php` builds JSON-LD based on
`$ctx['content_format']`:

| `content_format` | Schema types generated |
|-----------------|----------------------|
| `article`       | WebPage, Article, BreadcrumbList, Organization |
| `faq`           | WebPage, FAQPage (AEO), BreadcrumbList |
| `howto`         | WebPage, HowTo (AEO), BreadcrumbList |
| `product`       | WebPage, Product, BreadcrumbList |
| _(default)_     | WebPage, BreadcrumbList, Organization |

Every schema includes:
- `author` with `name`, `description` (credentials) — GEO E-E-A-T
- `dateModified` from `content_updated` — GEO freshness signal
- `mentions` array from `entity_mentions` — GEO entity association
- `publisher` Organization block with `sameAs` (social profiles) — site-wide constant

### 6.5 robots.txt (auto-generated)
In `inc/robots.php`:
```php
add_filter('robots_txt', function($output, $public) {
    $output .= "\nSitemap: " . home_url('/wp-sitemap.xml') . "\n";
    if (!$public) {
        $output = "User-agent: *\nDisallow: /\n";
    }
    return $output;
}, 10, 2);
```
Never commit a static `robots.txt` file — let WordPress generate it dynamically.

### 6.6 sitemap.xml (WordPress built-in + extended)
WordPress 5.5+ outputs `/wp-sitemap.xml` automatically. Extend in `inc/sitemap.php`:
```php
// Remove post types or taxonomies from sitemap
add_filter('wp_sitemaps_post_types', function($types) {
    unset($types['attachment']); // no media pages
    return $types;
});

// Ensure images appear in sitemap entries
add_filter('wp_sitemaps_posts_entry', function($entry, $post) {
    $thumb = get_the_post_thumbnail_url($post->ID, 'full');
    if ($thumb) $entry['images'] = [['loc' => $thumb]];
    return $entry;
}, 10, 2);
```

---

## Rule 7 — Code Injection Points (GTM, Pixels, Scripts)

WordPress options (`theme_code_injection_*`) are managed via a dedicated **Theme Options** admin page (Settings → Theme Code Injection). Each field is a `<textarea>` for raw HTML/script.

| Injection point | Option key | Template location |
|----------------|-----------|-------------------|
| Before `</head>` | `theme_code_head` | `views/partials/head.twig` bottom |
| After `<body>` open | `theme_code_body_open` | `views/partials/header.twig` top |
| Before `</body>` | `theme_code_body_close` | `views/partials/footer.twig` bottom |
| After `</footer>` | `theme_code_after_footer` | `views/partials/footer.twig` after `</footer>` |

### Twig output pattern
```twig
{# In head.twig — before </head> #}
{% if injection.head %}
  {{ injection.head | raw }}
{% endif %}

{# In header.twig — immediately after <body> #}
{% if injection.body_open %}
  {{ injection.body_open | raw }}
{% endif %}

{# In footer.twig — before </body> #}
{% if injection.body_close %}
  {{ injection.body_close | raw }}
{% endif %}

{# In footer.twig — after </footer> #}
{% if injection.after_footer %}
  {{ injection.after_footer | raw }}
{% endif %}
```

### PHP — populate Timber context
```php
add_filter('timber/context', function($ctx) {
    $ctx['injection'] = [
        'head'         => get_option('theme_code_head',         ''),
        'body_open'    => get_option('theme_code_body_open',    ''),
        'body_close'   => get_option('theme_code_body_close',   ''),
        'after_footer' => get_option('theme_code_after_footer', ''),
    ];
    return $ctx;
});
```

**Google Tag Manager example** (auto-placed when GTM ID is configured):
- GTM `<script>` snippet → `theme_code_head`
- GTM `<noscript>` snippet → `theme_code_body_open`

---

## Rule 8 — Content Fallbacks

Every dynamic value in Twig must have a fallback. **Never render empty or broken output.**

### Twig default filter — use everywhere
```twig
{# Text fields #}
{{ heading | default('') }}
{{ description | default(site.description) }}

{# Images — always fall back to a placeholder WebP #}
{% set hero_img = image_url | default(theme.link ~ '/assets/images/placeholder.webp') %}

{# Links #}
{{ cta_url | default('#') }}

{# Booleans / flags #}
{% if show_section | default(true) %}
```

### Image fallback pattern (always use)
```twig
<picture>
  <source srcset="{{ image_webp | default(placeholder_webp) }}" type="image/webp">
  <img
    src="{{ image_src | default(placeholder_src) }}"
    alt="{{ image_alt | default('') }}"
    width="{{ image_width | default(800) }}"
    height="{{ image_height | default(450) }}"
    loading="lazy"
    decoding="async"
  >
</picture>
```

### PHP — safe array access before passing to context
```php
$context['heading']    = $attributes['heading']    ?? '';
$context['image_url']  = $attributes['imageUrl']   ?? '';
$context['items']      = $attributes['items']       ?? [];
$context['show_cta']   = $attributes['showCta']     ?? true;
```

### Rules
- Strings: always `| default('')` or a meaningful fallback string
- Images: always fall back to `placeholder.webp` (committed to `assets/images/`)
- Arrays/loops: always `{% for item in items | default([]) %}`
- Numbers: always `| default(0)`
- Never use `| raw` on user-provided content — only on trusted, system-generated HTML

---

## Rule 9 — Accessibility
- Every `<img>` must have `alt` — use `alt=""` for purely decorative images only
- Buttons without visible text: `<button aria-label="Close menu">`
- Icon-only links: `<a href="..." aria-label="Follow us on Twitter">`
- All form inputs: paired `<label for="id">` or `aria-label`
- Use semantic HTML5 landmarks — never `<div>` for structural roles:
  `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<aside>`
- Skip-to-main link as first focusable element in `<body>`:
  ```twig
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2">
    Skip to main content
  </a>
  ```
- All interactive elements keyboard-accessible (Tab order logical, focus rings visible)
- Colour contrast: 4.5:1 minimum for normal text, 3:1 for large text (WCAG AA)
- ARIA roles/attributes only when no native HTML element fits the purpose
- `aria-hidden="true"` on decorative SVGs and icons

---

## Rule 10 — Modern Web Standards
- HTML5 semantic elements always; no `<div>` for structural landmarks
- Self-closing void elements without trailing slash: `<img>`, `<br>`, `<input>` (HTML5)
- Inline `<svg>` for all icons — no icon fonts
- `srcset` + `sizes` on all responsive images
- No deprecated HTML attributes (`border`, `align`, `bgcolor`, `cellpadding`)
- HTTPS assumed; no mixed content
- CSS Grid and Flexbox via Tailwind — no float layouts
- `charset` and `viewport` meta always present

---

## Rule 11 — Contact Form 7
- Use Contact Form 7 shortcode rendered via Timber's `function()` helper:
  ```twig
  {{ function('do_shortcode', '[contact-form-7 id="FORM_ID" title="Contact"]') | raw }}
  ```
- Wrap CF7 output in a semantic container with ARIA live region for validation messages:
  ```twig
  <div
    class="cf7-wrapper"
    role="region"
    aria-label="Contact form"
    aria-live="polite"
  >
    {{ function('do_shortcode', '[contact-form-7 id="FORM_ID"]') | raw }}
  </div>
  ```
- Style CF7 output using Tailwind via `tailwind.config.js` — target CF7 class selectors inside
  an `@layer components` block (this is the one exception to the no-custom-CSS rule, since
  CF7 generates its own class names that cannot be set in templates)
- Enable spam protection: hCaptcha or Cloudflare Turnstile via official CF7 add-on
- Always set `use_ajax: true` on the CF7 form tag for no-refresh submission
- Map form fields to confirmation emails using CF7 Mail tab — never expose sensitive data

---

## Rule 12 — UI Analysis Report
When given any UI (HTML file, screenshot, Figma description, wireframe), produce this
report **before writing any code**:

```
## UI Analysis Report — [Project / Page Name]

### Pages Identified
| # | Page | WordPress Template | Twig File |
|---|------|--------------------|-----------|
| 1 | Home | front-page.php     | front-page.twig |

### Per-Page Breakdown
#### [Page Name]
- **Sections**: hero, features grid, testimonials, CTA, footer
- **Gutenberg blocks needed**: `hero`, `feature-card`, `testimonial-slider`, `cta-banner`
- **Twig templates**: `views/page.twig`, `views/partials/hero.twig`
- **Block attributes** (block.json): heading (string), subheading (string), imageUrl (string), ctaLabel (string), ctaUrl (string)
- **SEO meta needed**: content_format (article/faq/howto), faq_items if FAQ layout
- **Tailwind notes**: custom color token needed for brand gradient
- **Fallback values**: [list default values for empty attributes]
- **Code injection needed**: [e.g. GTM, pixel — which injection point]

### Shared Partials
| Component | File |
|-----------|------|
| Navigation | views/partials/header.twig |
| Footer | views/partials/footer.twig |
| Card | views/partials/card.twig |

### Assets Inventory
| Asset | Type | Action |
|-------|------|--------|
| hero-bg.png | Image | Convert to WebP at build time |
| logo.svg | SVG | Inline SVG, no conversion needed |

### Accessibility Flags
- [any concerns spotted in the UI]

### Performance Notes
- LCP candidate: [element / image]
- Images to lazy-load: [list]
- Potential CLS risks: [list]

### Recommended Build Order
1. Shared partials (header, footer, head meta, injection partials)
2. SEO panel React component (inc/seo-panel/)
3. [Blocks ordered by page priority, highest-traffic page first]
```

---

## Rule 13 — Automated Build Pipeline (Commands & Agents)

When building or extending this theme, run the following skills/commands **in this exact
order**. Each step's output feeds the next — do not skip a step, and do not reorder.
Treat any step as a no-op only when its work is already complete and verified.

| # | Command | When it runs | Skip condition |
|---|---------|--------------|----------------|
| 1 | `/init-theme`         | First — bootstrap theme scaffolding from this CLAUDE.md | Theme already scaffolded (`functions.php`, `views/`, build config present) |
| 2 | `/analyze-ui`         | After scaffolding — produce the Rule 12 UI Analysis Report from the source UI | No source UI/mockup provided |
| 3 | `/to-tailwind`        | Convert the analyzed CSS/HTML to Tailwind utility classes | UI is already pure Tailwind |
| 4 | `/new-block`          | Scaffold each Gutenberg block identified in the UI report | No blocks required by the report |
| 5 | `/new-page-template`  | Scaffold each WordPress page template identified | No page templates required |
| 6 | `/new-partial`        | Scaffold each reusable Twig partial identified | No new partials required |
| 7 | `/seo-audit`          | Validate SEO + AEO + GEO compliance (Rule 6) | — |
| 8 | `/perf-audit`         | Validate performance / Core Web Vitals (Rule 5) | — |
| 9 | `/wp-review`          | Final full CLAUDE.md compliance review | — |

### Compliance Agents (run in any order, after step 9)
Run these to keep production assets in sync with the source-of-truth UI. Order does not
matter; run whichever apply to the work just done, and re-run on demand:

- **`webp-converter`** — convert any new raster images to WebP and rewrite all references (Rule 4)
- **`svg-sync`** — sync inline/standalone SVG icons against the `monsters-ui/` mockup
- **`anchor-sync`** — audit every `<a href>` against the mockup and fix link drift
- **`products-sync`** — ensure each product has an item page and seed any missing ones

### Notes
- These are conversational steps **I** run when you ask me to build/extend the theme — they
  are guidance, not event-triggered automation. For truly automatic (event-driven) execution,
  configure hooks in `settings.json` instead.
- If a step reports failures, fix them before advancing to the next numbered step.

---

## Build Commands
```bash
npm run build    # production build (minified, purged Tailwind)
npm run start    # development watch
npm run lint:js  # ESLint via @wordpress/scripts
```
