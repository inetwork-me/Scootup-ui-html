# /new-page-template — Scaffold a WordPress Page Template

You are creating a WordPress page template pair (PHP + Twig) for a theme using
Timber 3.x/Twig, Tailwind CSS, and custom Gutenberg blocks. Read CLAUDE.md for the full ruleset.

**Template name or description:** $ARGUMENTS

---

## Step 1 — Gather requirements

If $ARGUMENTS doesn't specify the template, ask:
1. **Template type** — which WordPress template?
   - `page` — standard page (page.php / page.twig)
   - `front-page` — homepage (front-page.php / front-page.twig)
   - `single` — single post (single.php / single.twig)
   - `archive` — post archive (archive.php / archive.twig)
   - `page-{slug}` — specific page by slug (page-about.php / page-about.twig)
   - `taxonomy-{name}` — taxonomy archive
   - `search` — search results
   - `404` — not found page
2. **Sections / blocks** the page will contain
3. **SEO content_format** for this template type (article / faq / howto / product / default)

---

## Step 2 — Create the PHP template file

File: `{template-name}.php`

```php
<?php
/**
 * Template Name: {Human Name}   ← only add this line for custom page templates
 */
defined('ABSPATH') || exit;

$context = Timber::context();

// Page / post data
$context['post'] = Timber::get_post();

// SEO meta — populated via timber/context filter in inc/meta-context.php
// (meta_title, meta_description, og_image, canonical_url, schema_json, etc.)

// Code injection — populated via timber/context filter
// (injection.head, injection.body_open, injection.body_close, injection.after_footer)

Timber::render('{template-name}.twig', $context);
```

Rules:
- Never query the database in the template file — all queries go through `Timber::context()`
- The `timber/context` filters in `inc/meta-context.php` handle SEO and injection automatically
- If extra queries are needed, add them as transient-cached functions called here

---

## Step 3 — Create the Twig template file

File: `views/{template-name}.twig`

```twig
{% extends "base.twig" %}

{% block content %}
<main id="main" class="…tailwind…" role="main">

  {# ── Page hero or title ── #}
  <section class="…" aria-labelledby="page-title">
    <h1 id="page-title" class="…">{{ post.title | default('') }}</h1>
  </section>

  {# ── Gutenberg block content ── #}
  <div class="…">
    {{ post.content | raw }}
  </div>

</main>
{% endblock %}
```

If a `base.twig` does not yet exist, create `views/base.twig`:

```twig
<!DOCTYPE html>
<html lang="{{ site.language | default('en') }}">
<head>
  {% include 'partials/head.twig' %}
  {% if injection.head %}{{ injection.head | raw }}{% endif %}
</head>
<body class="{{ body_class }}">

  {# Code injection: after <body> — GTM noscript, pixels #}
  {% if injection.body_open %}{{ injection.body_open | raw }}{% endif %}

  {# Skip to main content link (accessibility) #}
  <a href="#main"
     class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded">
    Skip to main content
  </a>

  {% include 'partials/header.twig' %}

  {% block content %}{% endblock %}

  <footer>
    {% include 'partials/footer.twig' %}
  </footer>

  {# Code injection: before </body> #}
  {% if injection.body_close %}{{ injection.body_close | raw }}{% endif %}

  {# Code injection: after </footer> #}
  {% if injection.after_footer %}{{ injection.after_footer | raw }}{% endif %}

</body>
</html>
```

---

## Step 4 — SEO/AEO/GEO checklist for this template type

Remind the user what SEO fields to configure for this template in the Block Editor sidebar:

| Template | Recommended `content_format` | Extra AEO fields |
|----------|------------------------------|-----------------|
| front-page | _(default)_ | organization schema auto-added |
| single (blog post) | `article` | author_name, author_credentials, content_updated |
| FAQ page | `faq` | faq_items JSON array |
| How-to guide | `howto` | faq_items used as steps |
| Product page | `product` | — |
| 404 | _(skip indexing)_ | set robots_directive to `noindex,nofollow` |

---

## Step 5 — Checklist

- [ ] PHP template: no DB queries, only `Timber::context()` + `Timber::render()`
- [ ] Twig template: extends `base.twig`
- [ ] `<h1>` appears exactly once
- [ ] `id="main"` on `<main>` for skip link target
- [ ] Code injection points present in base.twig
- [ ] SEO context (meta_title, etc.) handled by `inc/meta-context.php` filter — no duplication
- [ ] `content_format` meta set in Block Editor for correct schema type
