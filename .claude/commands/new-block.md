# /new-block — Scaffold a Gutenberg Block

You are scaffolding a new custom Gutenberg block for a WordPress theme using
Timber 3.x/Twig, Tailwind CSS, and `@wordpress/scripts`. Read CLAUDE.md for the full ruleset.

**Block name or description:** $ARGUMENTS

---

## Step 1 — Gather requirements

If $ARGUMENTS does not fully describe the block, ask the user:
1. **Block name** — kebab-case slug (e.g. `hero-banner`, `feature-card`, `cta-strip`)
2. **Purpose** — one sentence describing what this block does on the front end
3. **Fields** — list each content field: name, type (string/boolean/number/array/object), default value
4. **Supports** — any Gutenberg block supports needed? (align, color, spacing, etc.)

Do not create any files until you have block name + at least one field defined.

---

## Step 2 — Create all 4 files

### File 1: `blocks/{name}/block.json`
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "theme/{name}",
  "title": "{Human Title}",
  "description": "{one-line description}",
  "category": "theme",
  "icon": "star-filled",
  "editorScript": "file:./index.js",
  "style": "file:./style.css",
  "render": "file:./render.php",
  "attributes": {
    "{field}": {
      "type": "{type}",
      "default": "{safe default}"
    }
  },
  "supports": {
    "html": false,
    "align": false
  }
}
```
- Every attribute MUST have a `"default"` — never leave it empty.

### File 2: `blocks/{name}/edit.jsx`
Rules:
- Import `useBlockProps`, `InspectorControls` from `@wordpress/block-editor`
- Import `PanelBody`, `TextControl`, `ToggleControl`, `MediaUpload` etc. from `@wordpress/components`
- Use `useBlockProps()` on the editor root element
- Each attribute gets a control in `InspectorControls` → `PanelBody`
- Show a live preview of the block content inside `useBlockProps` div
- Use Tailwind classes for the editor preview so it matches front-end

```jsx
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { heading } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title="Content">
          <TextControl
            label="Heading"
            value={heading}
            onChange={(val) => setAttributes({ heading: val })}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {/* preview markup with Tailwind */}
      </div>
    </>
  );
}
```

### File 3: `blocks/{name}/render.php`
Rules (CLAUDE.md Rule 3 + Rule 8 fallbacks):
- Use `$attributes['field'] ?? 'safe default'` for every attribute
- Pass all values to Timber context explicitly
- Never pass the raw `$attributes` array — destructure it

```php
<?php
defined('ABSPATH') || exit;

$context = Timber::context();

// Destructure with fallbacks (CLAUDE.md Rule 8)
$context['heading']   = $attributes['heading']   ?? '';
$context['image_url'] = $attributes['imageUrl']  ?? '';
$context['image_alt'] = $attributes['imageAlt']  ?? '';
$context['cta_label'] = $attributes['ctaLabel']  ?? '';
$context['cta_url']   = $attributes['ctaUrl']    ?? '#';

Timber::render('blocks/{name}/{name}.twig', $context);
```

### File 4: `blocks/{name}/{name}.twig`
Rules (CLAUDE.md Rules 1, 4, 7, 8, 9):
- Tailwind utility classes only — no inline styles
- Every text field uses `| default('')`
- Every image uses `<picture>` with WebP + fallback (Rule 4)
- LCP image (hero): `loading="eager" fetchpriority="high"`
- Below-fold images: `loading="lazy" decoding="async"`
- Explicit `width` and `height` on every `<img>`
- Semantic HTML5 elements, proper ARIA attributes
- Skip empty sections: `{% if heading %}…{% endif %}`

```twig
<section class="…tailwind classes…" aria-label="{{ heading | default('') }}">

  {% if heading %}
    <h2 class="…">{{ heading }}</h2>
  {% endif %}

  {% if image_url %}
    <picture>
      <source srcset="{{ image_webp | default(theme.link ~ '/assets/images/placeholder.webp') }}" type="image/webp">
      <img
        src="{{ image_url | default(theme.link ~ '/assets/images/placeholder.jpg') }}"
        alt="{{ image_alt | default('') }}"
        width="800"
        height="450"
        loading="lazy"
        decoding="async"
      >
    </picture>
  {% endif %}

  {% if cta_label %}
    <a href="{{ cta_url | default('#') }}" class="…">
      {{ cta_label }}
    </a>
  {% endif %}

</section>
```

---

## Step 3 — Register the block

Remind the user to add this line to `functions.php` if not already using auto-discovery:
```php
register_block_type(__DIR__ . '/blocks/{name}');
```

Or if using a loop to register all blocks:
```php
foreach (glob(__DIR__ . '/blocks/*/block.json') as $block) {
    register_block_type(dirname($block));
}
```

---

## Step 4 — Checklist before finishing

- [ ] All attributes have defaults in block.json
- [ ] All attributes have `?? fallback` in render.php
- [ ] All Twig variables use `| default()`
- [ ] Images use `<picture>` + WebP fallback
- [ ] Explicit width/height on all `<img>` tags
- [ ] Tailwind classes only — no inline styles
- [ ] Semantic HTML + ARIA where needed
- [ ] Block registered in functions.php
