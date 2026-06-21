# /new-partial — Scaffold a Twig Partial

You are creating a reusable Twig partial for a WordPress theme using
Timber 3.x/Twig and Tailwind CSS. Read CLAUDE.md for the full ruleset.

**Partial name or description:** $ARGUMENTS

---

## Step 1 — Gather requirements

If $ARGUMENTS does not fully describe the partial, ask:
1. **Name** — kebab-case (e.g. `card`, `testimonial`, `pricing-row`, `alert-banner`)
2. **Purpose** — where is this partial used? (page template, block, header, footer…)
3. **Variables it needs** — list each: name, type, required or optional, fallback value
4. **Is it a loop item?** — will it be used inside `{% for item in items %}`?

---

## Step 2 — Create `views/partials/{name}.twig`

Rules (CLAUDE.md Rules 1, 7, 8, 9, 10):

### Structure template
```twig
{#
  Partial: {name}
  Purpose: {one line}
  Variables:
    - {var} ({type, optional|required}): {description}. Default: {value}
#}

{# ── set safe defaults for all variables ── #}
{% set title       = title       | default('') %}
{% set description = description | default('') %}
{% set image_url   = image_url   | default(theme.link ~ '/assets/images/placeholder.jpg') %}
{% set image_webp  = image_webp  | default(theme.link ~ '/assets/images/placeholder.webp') %}
{% set image_alt   = image_alt   | default('') %}
{% set link_url    = link_url    | default('#') %}
{% set link_label  = link_label  | default('') %}

{# ── markup ── #}
<article class="…tailwind…" aria-label="{{ title }}">

  {% if image_url %}
    <picture>
      <source srcset="{{ image_webp }}" type="image/webp">
      <img
        src="{{ image_url }}"
        alt="{{ image_alt }}"
        width="…"
        height="…"
        loading="lazy"
        decoding="async"
      >
    </picture>
  {% endif %}

  {% if title %}
    <h3 class="…">{{ title }}</h3>
  {% endif %}

  {% if description %}
    <p class="…">{{ description }}</p>
  {% endif %}

  {% if link_label %}
    <a href="{{ link_url }}" class="…" aria-label="{{ link_label }}">
      {{ link_label }}
    </a>
  {% endif %}

</article>
```

### Rules to follow
- Set ALL variables with `| default()` at the top of the file
- Wrap each conditional section in `{% if var %}…{% endif %}` — never render empty tags
- Images always use `<picture>` + WebP + fallback + explicit width/height
- Tailwind classes only — no inline styles, no custom CSS classes
- Semantic HTML5 element appropriate to the content role
  - Standalone card → `<article>`
  - Navigation item → `<li>` inside calling template's `<ul>`
  - Alert / notice → `<aside role="alert">`
  - Decorative section → `<div>` with no structural role
- ARIA: `aria-label` on interactive wrappers, `aria-hidden="true"` on decorative icons

---

## Step 3 — Show the include syntax

Show the user how to include this partial from a template or block:

```twig
{# Single use #}
{% include 'partials/{name}.twig' with {
  title: item.title,
  description: item.description,
  image_url: item.image.src,
  image_webp: item.image.src | replace({'.jpg': '.webp', '.png': '.webp'}),
  image_alt: item.image.alt,
  link_url: item.link,
  link_label: item.link_label
} only %}

{# Loop use #}
{% for item in items | default([]) %}
  {% include 'partials/{name}.twig' with { title: item.title, … } only %}
{% endfor %}
```

Note: always use `only` keyword to prevent variable leakage from parent scope.

---

## Step 4 — Checklist

- [ ] All variables set with `| default()` at top
- [ ] No section renders if its variable is empty
- [ ] Images use `<picture>` + WebP source + fallback
- [ ] Explicit `width` and `height` on `<img>`
- [ ] Tailwind classes only
- [ ] Semantic HTML element chosen correctly
- [ ] ARIA attributes present where needed
