# /init-theme — Bootstrap a New WordPress Theme from CLAUDE.md

You are initializing a brand-new WordPress theme from scratch.
Read CLAUDE.md in this project — every file you create must comply with it.

**Theme name (slug):** $ARGUMENTS

---

## Before you start

If $ARGUMENTS is empty, ask the user:
1. **Theme slug** — kebab-case, used for folder name and text domain (e.g. `my-site`)
2. **Theme display name** — human title (e.g. `My Site`)
3. **Author name** — for style.css header
4. **Primary brand color (hex)** — goes into tailwind.config.js
5. **Secondary brand color (hex)** — optional

Do not create any files until you have at least the theme slug and display name.

---

## Walk through each phase in order. Complete one phase, confirm with the user, then move to the next.

---

## Phase 1 — Package & Build Config

Tell the user: **"Phase 1 / 7 — Package & Build Config"**

### 1a. `package.json`
```json
{
  "name": "{theme-slug}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build":   "wp-scripts build src/index.js blocks/**/index.js inc/seo-panel/index.jsx --output-path=dist",
    "start":   "wp-scripts start src/index.js blocks/**/index.js inc/seo-panel/index.jsx --output-path=dist",
    "lint:js": "wp-scripts lint-js",
    "lint:css":"wp-scripts lint-style"
  },
  "devDependencies": {
    "@wordpress/scripts": "^30.0.0"
  }
}
```

### 1b. `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.twig',
    './blocks/**/*.twig',
    './blocks/**/*.jsx',
    './inc/**/*.jsx',
    './**/*.php',
  ],
  theme: {
    extend: {
      colors: {
        primary:   '{brand-primary-hex}',
        secondary: '{brand-secondary-hex}',
      },
    },
  },
  plugins: [],
};
```

### 1c. `postcss.config.js`
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 1d. `src/index.js`
```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```
> Note: tell the user to rename this to `src/index.css` and update package.json entry if @wordpress/scripts version requires it.

After creating these 4 files, tell the user:
**"✅ Phase 1 complete. Run `npm install` to install dependencies. Ready for Phase 2?"**
Wait for confirmation.

---

## Phase 2 — WordPress Theme Files

Tell the user: **"Phase 2 / 7 — WordPress Theme Files"**

### 2a. `style.css` (theme registration — no styles go here)
```css
/*
Theme Name:  {Theme Display Name}
Theme URI:   https://example.com
Author:      {Author Name}
Description: WordPress theme built with Timber 3.x, Twig, and Tailwind CSS.
Version:     1.0.0
Text Domain: {theme-slug}
*/
```

### 2b. `functions.php`
```php
<?php
defined('ABSPATH') || exit;

// Timber
use Timber\Timber;
require_once __DIR__ . '/vendor/autoload.php';
Timber::init();
Timber::$dirname = ['views'];

// Theme includes
require_once __DIR__ . '/inc/meta-fields.php';
require_once __DIR__ . '/inc/meta-context.php';
require_once __DIR__ . '/inc/robots.php';
require_once __DIR__ . '/inc/sitemap.php';
require_once __DIR__ . '/inc/code-injection-options.php';

// Enqueue theme assets
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        '{theme-slug}-style',
        get_template_directory_uri() . '/dist/index.css',
        [],
        wp_get_theme()->get('Version')
    );
    wp_enqueue_script(
        '{theme-slug}-script',
        get_template_directory_uri() . '/dist/index.js',
        [],
        wp_get_theme()->get('Version'),
        ['strategy' => 'defer']
    );
});

// Register all blocks auto-discovered from blocks/ directory
add_action('init', function () {
    foreach (glob(__DIR__ . '/blocks/*/block.json') as $block_json) {
        register_block_type(dirname($block_json));
    }
});

// Theme supports
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['comment-list','comment-form','search-form','gallery','caption','style','script']);
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
    add_theme_support('align-wide');
});
```

### 2c. `index.php` (required WordPress fallback)
```php
<?php
defined('ABSPATH') || exit;
$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render('index.twig', $context);
```

### 2d. `page.php`
```php
<?php
defined('ABSPATH') || exit;
$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render(['page-' . $context['post']->slug . '.twig', 'page.twig'], $context);
```

### 2e. `single.php`
```php
<?php
defined('ABSPATH') || exit;
$context = Timber::context();
$context['post'] = Timber::get_post();
Timber::render(['single-' . $context['post']->post_type . '.twig', 'single.twig'], $context);
```

### 2f. `404.php`
```php
<?php
defined('ABSPATH') || exit;
$context = Timber::context();
Timber::render('404.twig', $context);
```

After creating these files, tell the user:
**"✅ Phase 2 complete. Ready for Phase 3?"**
Wait for confirmation.

---

## Phase 3 — inc/ PHP Modules

Tell the user: **"Phase 3 / 7 — PHP Modules (SEO, Meta, Robots, Sitemap, Injection)"**

### 3a. `inc/meta-fields.php`
```php
<?php
defined('ABSPATH') || exit;

add_action('init', function () {
    $fields = [
        // SEO
        '_meta_title'          => 'string',
        '_meta_description'    => 'string',
        '_og_image'            => 'string',
        '_canonical_url'       => 'string',
        '_robots_directive'    => 'string',
        // AEO
        '_faq_items'           => 'string',
        '_speakable_selectors' => 'string',
        '_content_format'      => 'string',
        // GEO
        '_author_name'         => 'string',
        '_author_credentials'  => 'string',
        '_content_updated'     => 'string',
        '_entity_mentions'     => 'string',
    ];
    foreach ($fields as $key => $type) {
        register_post_meta('', $key, [
            'type'          => $type,
            'single'        => true,
            'show_in_rest'  => true,
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
});
```

### 3b. `inc/meta-context.php`
```php
<?php
defined('ABSPATH') || exit;

add_filter('timber/context', function ($ctx) {
    $id = get_the_ID();
    if (!$id) return $ctx;

    // SEO
    $ctx['meta_title']       = get_post_meta($id, '_meta_title', true)       ?: get_the_title();
    $ctx['meta_description'] = get_post_meta($id, '_meta_description', true) ?: '';
    $ctx['og_image']         = get_post_meta($id, '_og_image', true)         ?: get_the_post_thumbnail_url($id, 'large') ?: '';
    $ctx['canonical_url']    = get_post_meta($id, '_canonical_url', true)    ?: get_permalink($id);
    $ctx['robots_directive'] = get_post_meta($id, '_robots_directive', true) ?: 'index,follow';
    $ctx['og_type']          = is_singular('post') ? 'article' : 'website';

    // AEO
    $ctx['faq_items']      = json_decode(get_post_meta($id, '_faq_items', true) ?: '[]', true);
    $ctx['content_format'] = get_post_meta($id, '_content_format', true) ?: 'article';

    // GEO / E-E-A-T
    $ctx['author_name']        = get_post_meta($id, '_author_name', true)
                                 ?: get_the_author_meta('display_name', (int) get_post_field('post_author', $id));
    $ctx['author_credentials'] = get_post_meta($id, '_author_credentials', true) ?: '';
    $ctx['content_updated']    = get_post_meta($id, '_content_updated', true)    ?: get_the_modified_date('c', $id);
    $ctx['entity_mentions']    = json_decode(get_post_meta($id, '_entity_mentions', true) ?: '[]', true);

    // Code injection
    $ctx['injection'] = [
        'head'         => get_option('theme_code_head',         ''),
        'body_open'    => get_option('theme_code_body_open',    ''),
        'body_close'   => get_option('theme_code_body_close',   ''),
        'after_footer' => get_option('theme_code_after_footer', ''),
    ];

    // JSON-LD
    $ctx['schema_json'] = json_encode(theme_build_schema($ctx), JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

    return $ctx;
});

function theme_build_schema(array $ctx): array {
    $site_name = get_bloginfo('name');
    $site_url  = home_url('/');

    $org = [
        '@type'  => 'Organization',
        'name'   => $site_name,
        'url'    => $site_url,
        'sameAs' => [],
    ];

    $breadcrumb = [
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => $site_name, 'item' => $site_url],
        ],
    ];

    $base = [
        '@context' => 'https://schema.org',
        '@graph'   => [$org, $breadcrumb],
    ];

    $webpage = [
        '@type'         => 'WebPage',
        'url'           => $ctx['canonical_url'] ?? $site_url,
        'name'          => $ctx['meta_title']    ?? '',
        'description'   => $ctx['meta_description'] ?? '',
        'dateModified'  => $ctx['content_updated']  ?? '',
        'author'        => [
            '@type'       => 'Person',
            'name'        => $ctx['author_name']        ?? '',
            'description' => $ctx['author_credentials'] ?? '',
        ],
        'publisher'    => $org,
    ];

    if (!empty($ctx['entity_mentions'])) {
        $webpage['mentions'] = array_map(fn($e) => ['@type' => 'Thing', 'name' => $e], $ctx['entity_mentions']);
    }

    switch ($ctx['content_format'] ?? 'article') {
        case 'faq':
            $faq_entities = array_map(fn($item) => [
                '@type'          => 'Question',
                'name'           => $item['q'] ?? '',
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['a'] ?? ''],
            ], $ctx['faq_items'] ?? []);
            $base['@graph'][] = array_merge($webpage, ['@type' => 'FAQPage', 'mainEntity' => $faq_entities]);
            break;
        case 'howto':
            $steps = array_map(fn($item, $i) => [
                '@type' => 'HowToStep',
                'position' => $i + 1,
                'name' => $item['q'] ?? '',
                'text' => $item['a'] ?? '',
            ], $ctx['faq_items'] ?? [], array_keys($ctx['faq_items'] ?? []));
            $base['@graph'][] = array_merge($webpage, ['@type' => 'HowTo', 'step' => $steps]);
            break;
        case 'article':
            $base['@graph'][] = array_merge($webpage, ['@type' => 'Article']);
            break;
        default:
            $base['@graph'][] = $webpage;
    }

    return $base;
}
```

### 3c. `inc/robots.php`
```php
<?php
defined('ABSPATH') || exit;

add_filter('robots_txt', function ($output, $public) {
    if (!$public) {
        return "User-agent: *\nDisallow: /\n";
    }
    $output .= "\nSitemap: " . home_url('/wp-sitemap.xml') . "\n";
    return $output;
}, 10, 2);
```

### 3d. `inc/sitemap.php`
```php
<?php
defined('ABSPATH') || exit;

// Remove media attachment pages from sitemap
add_filter('wp_sitemaps_post_types', function ($types) {
    unset($types['attachment']);
    return $types;
});

// Add featured image data to sitemap entries
add_filter('wp_sitemaps_posts_entry', function ($entry, $post) {
    $thumb = get_the_post_thumbnail_url($post->ID, 'full');
    if ($thumb) {
        $entry['images'] = [['loc' => $thumb]];
    }
    return $entry;
}, 10, 2);
```

### 3e. `inc/code-injection-options.php`
```php
<?php
defined('ABSPATH') || exit;

add_action('admin_menu', function () {
    add_options_page(
        'Theme Code Injection',
        'Code Injection',
        'manage_options',
        'theme-code-injection',
        'theme_code_injection_page'
    );
});

add_action('admin_init', function () {
    foreach (['theme_code_head','theme_code_body_open','theme_code_body_close','theme_code_after_footer'] as $opt) {
        register_setting('theme_code_injection', $opt, ['sanitize_callback' => 'wp_kses_post']);
    }
});

function theme_code_injection_page(): void {
    if (!current_user_can('manage_options')) return;
    ?>
    <div class="wrap">
      <h1>Theme Code Injection</h1>
      <form method="post" action="options.php">
        <?php settings_fields('theme_code_injection'); ?>
        <?php foreach ([
            'theme_code_head'         => 'Before &lt;/head&gt; (GTM script, custom head tags)',
            'theme_code_body_open'    => 'After &lt;body&gt; open (GTM noscript, pixels)',
            'theme_code_body_close'   => 'Before &lt;/body&gt; (deferred scripts)',
            'theme_code_after_footer' => 'After &lt;/footer&gt; (additional scripts)',
        ] as $key => $label): ?>
          <h2><?= esc_html($label) ?></h2>
          <textarea name="<?= esc_attr($key) ?>" rows="6" style="width:100%;font-family:monospace"><?= esc_textarea(get_option($key, '')) ?></textarea>
        <?php endforeach; ?>
        <?php submit_button(); ?>
      </form>
    </div>
    <?php
}
```

After creating these files, tell the user:
**"✅ Phase 3 complete. Ready for Phase 4?"**
Wait for confirmation.

---

## Phase 4 — Base Twig Templates

Tell the user: **"Phase 4 / 7 — Twig Templates (base, head, header, footer)"**

### 4a. `views/base.twig`
```twig
<!DOCTYPE html>
<html lang="en">
<head>
  {% include 'partials/head.twig' %}
  {% if injection.head %}{{ injection.head | raw }}{% endif %}
</head>
<body class="{{ body_class }}">

  {% if injection.body_open %}{{ injection.body_open | raw }}{% endif %}

  <a href="#main"
     class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:shadow-lg">
    Skip to main content
  </a>

  {% include 'partials/header.twig' %}

  {% block content %}{% endblock %}

  <footer>
    {% include 'partials/footer.twig' %}
    {% if injection.body_close %}{{ injection.body_close | raw }}{% endif %}
  </footer>

  {% if injection.after_footer %}{{ injection.after_footer | raw }}{% endif %}

</body>
</html>
```

### 4b. `views/partials/head.twig`
```twig
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ meta_title | default(site.name) }} | {{ site.name }}</title>
<meta name="description" content="{{ meta_description | default('') }}">
<meta name="robots" content="{{ robots_directive | default('index,follow') }}">
<link rel="canonical" href="{{ canonical_url | default(site.url) }}">

<meta property="og:title"       content="{{ meta_title | default(site.name) }}">
<meta property="og:description" content="{{ meta_description | default('') }}">
<meta property="og:image"       content="{{ og_image | default('') }}">
<meta property="og:url"         content="{{ canonical_url | default(site.url) }}">
<meta property="og:type"        content="{{ og_type | default('website') }}">
<meta property="og:site_name"   content="{{ site.name }}">

<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="{{ meta_title | default(site.name) }}">
<meta name="twitter:description" content="{{ meta_description | default('') }}">
<meta name="twitter:image"       content="{{ og_image | default('') }}">

{% if author_name %}<meta name="author" content="{{ author_name }}">{% endif %}

<script type="application/ld+json">{{ schema_json | raw }}</script>

{{ function('wp_head') }}
```

### 4c. `views/partials/header.twig`
```twig
<header class="w-full" role="banner">
  <nav class="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between" aria-label="Main navigation">
    <a href="{{ site.url }}" class="font-bold text-xl" aria-label="{{ site.name }} home">
      {{ site.name }}
    </a>
    {# Navigation menu — replace with wp_nav_menu output #}
    <ul class="flex gap-6 list-none" role="list">
      {% for item in menu.items | default([]) %}
        <li>
          <a href="{{ item.link }}"
             class="hover:text-primary transition-colors"
             {% if item.current %}aria-current="page"{% endif %}>
            {{ item.title }}
          </a>
        </li>
      {% endfor %}
    </ul>
  </nav>
</header>
```

### 4d. `views/partials/footer.twig`
```twig
<div class="max-w-screen-xl mx-auto px-4 py-12">
  <p class="text-sm text-gray-500">
    &copy; {{ "now" | date("Y") }} {{ site.name }}. All rights reserved.
  </p>
</div>
{{ function('wp_footer') }}
```

### 4e. `views/index.twig`
```twig
{% extends "base.twig" %}
{% block content %}
<main id="main" class="max-w-screen-xl mx-auto px-4 py-12" role="main">
  {% if post %}
    <h1 class="text-4xl font-bold mb-6">{{ post.title | default('') }}</h1>
    <div class="prose max-w-none">{{ post.content | raw }}</div>
  {% endif %}
</main>
{% endblock %}
```

### 4f. `views/page.twig`
```twig
{% extends "base.twig" %}
{% block content %}
<main id="main" class="max-w-screen-xl mx-auto px-4 py-12" role="main">
  <h1 class="text-4xl font-bold mb-8">{{ post.title | default('') }}</h1>
  <div>{{ post.content | raw }}</div>
</main>
{% endblock %}
```

### 4g. `views/404.twig`
```twig
{% extends "base.twig" %}
{% block content %}
<main id="main" class="max-w-screen-xl mx-auto px-4 py-24 text-center" role="main">
  <h1 class="text-6xl font-bold mb-4">404</h1>
  <p class="text-xl text-gray-500 mb-8">Page not found.</p>
  <a href="{{ site.url }}" class="inline-flex items-center px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition">
    Go home
  </a>
</main>
{% endblock %}
```

After creating these files, tell the user:
**"✅ Phase 4 complete. Ready for Phase 5?"**
Wait for confirmation.

---

## Phase 5 — SEO Panel (Block Editor Sidebar)

Tell the user: **"Phase 5 / 7 — SEO/AEO/GEO Block Editor Sidebar Panel"**

### 5a. `inc/seo-panel/index.jsx`
```jsx
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelBody, TextControl, TextareaControl, SelectControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

function SeoPanel() {
  const postType = useSelect(select => select('core/editor').getCurrentPostType(), []);
  const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

  const update = key => val => setMeta({ ...meta, [key]: val });

  return (
    <PluginDocumentSettingPanel name="seo-panel" title="SEO / AEO / GEO" icon="search">

      <PanelBody title="SEO" initialOpen={true}>
        <TextControl
          label="Meta Title"
          value={meta._meta_title || ''}
          onChange={update('_meta_title')}
          help="Fallback: post title"
        />
        <TextareaControl
          label="Meta Description"
          value={meta._meta_description || ''}
          onChange={update('_meta_description')}
          rows={3}
        />
        <TextControl
          label="OG Image URL"
          value={meta._og_image || ''}
          onChange={update('_og_image')}
          help="Fallback: featured image"
        />
        <TextControl
          label="Canonical URL"
          value={meta._canonical_url || ''}
          onChange={update('_canonical_url')}
          help="Fallback: permalink"
        />
        <SelectControl
          label="Robots"
          value={meta._robots_directive || 'index,follow'}
          options={[
            { label: 'index, follow',    value: 'index,follow' },
            { label: 'noindex, follow',  value: 'noindex,follow' },
            { label: 'index, nofollow',  value: 'index,nofollow' },
            { label: 'noindex, nofollow',value: 'noindex,nofollow' },
          ]}
          onChange={update('_robots_directive')}
        />
      </PanelBody>

      <PanelBody title="AEO — Answer Engine" initialOpen={false}>
        <SelectControl
          label="Content Format"
          value={meta._content_format || 'article'}
          options={[
            { label: 'Article',  value: 'article' },
            { label: 'FAQ Page', value: 'faq' },
            { label: 'How-To',   value: 'howto' },
            { label: 'Product',  value: 'product' },
            { label: 'Default',  value: 'default' },
          ]}
          onChange={update('_content_format')}
          help="Controls JSON-LD schema type"
        />
        <TextareaControl
          label="FAQ Items (JSON)"
          value={meta._faq_items || ''}
          onChange={update('_faq_items')}
          rows={5}
          help='Format: [{"q":"Question?","a":"Answer."}]'
        />
      </PanelBody>

      <PanelBody title="GEO — Generative Engine" initialOpen={false}>
        <TextControl
          label="Author Name"
          value={meta._author_name || ''}
          onChange={update('_author_name')}
          help="Fallback: post author"
        />
        <TextControl
          label="Author Credentials"
          value={meta._author_credentials || ''}
          onChange={update('_author_credentials')}
          help='e.g. "PhD, 10 years experience"'
        />
        <TextControl
          label="Last Updated (ISO date)"
          value={meta._content_updated || ''}
          onChange={update('_content_updated')}
          help="e.g. 2025-01-15. Fallback: post modified date"
        />
        <TextareaControl
          label="Entity Mentions (JSON)"
          value={meta._entity_mentions || ''}
          onChange={update('_entity_mentions')}
          rows={3}
          help='Format: ["Entity A","Entity B"]'
        />
      </PanelBody>

    </PluginDocumentSettingPanel>
  );
}

registerPlugin('theme-seo-panel', { render: SeoPanel });
```

### 5b. Enqueue the SEO panel in `functions.php`
Add this to `functions.php`:
```php
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_script(
        '{theme-slug}-seo-panel',
        get_template_directory_uri() . '/dist/inc/seo-panel/index.js',
        ['wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-core-data', 'wp-data'],
        wp_get_theme()->get('Version')
    );
});
```

After creating these files, tell the user:
**"✅ Phase 5 complete. Ready for Phase 6?"**
Wait for confirmation.

---

## Phase 6 — Assets & Placeholders

Tell the user: **"Phase 6 / 7 — Assets & Placeholders"**

- Create `assets/images/` directory (create a `.gitkeep` file inside)
- Remind the user to add `assets/images/placeholder.webp` — a small neutral WebP image used as the image fallback throughout the theme (Rule 8)
- Create `assets/icons/` directory (`.gitkeep`) — inline SVGs go here
- Create `assets/fonts/` directory (`.gitkeep`) — web fonts go here if self-hosted

Tell the user:
**"✅ Phase 6 complete — add your placeholder.webp to assets/images/. Ready for Phase 7?"**
Wait for confirmation.

---

## Phase 7 — Final Checklist & Next Steps

Tell the user: **"Phase 7 / 7 — Final Checklist"**

Print this checklist:

```
## Theme Init Complete ✅

### Files created
- package.json, tailwind.config.js, postcss.config.js
- style.css, functions.php, index.php, page.php, single.php, 404.php
- inc/meta-fields.php, inc/meta-context.php
- inc/robots.php, inc/sitemap.php
- inc/code-injection-options.php
- inc/seo-panel/index.jsx
- views/base.twig, views/index.twig, views/page.twig, views/404.twig
- views/partials/head.twig, header.twig, footer.twig

### Manual steps remaining
- [ ] Run: composer require timber/timber
- [ ] Run: npm install
- [ ] Add assets/images/placeholder.webp
- [ ] Set theme brand colors in tailwind.config.js (already done if provided)
- [ ] Activate theme in WordPress admin
- [ ] Go to Settings → Code Injection to add GTM / pixels
- [ ] Create nav menu in WordPress and pass it to Timber context

### Next commands to use
- /analyze-ui [file]       — when you receive a UI to build
- /new-block [name]        — create a new Gutenberg block
- /new-partial [name]      — create a reusable Twig partial
- /seo-audit               — after building a template
- /perf-audit              — before going live
- /wp-review               — before every commit
- /to-tailwind [file]      — convert any non-Tailwind code
```
