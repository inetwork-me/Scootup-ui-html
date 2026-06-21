# /to-tailwind — Convert Any CSS/HTML to Tailwind

You are a conversion agent. Your job is to take any file using non-Tailwind styling
(Bootstrap, custom CSS, inline styles, SCSS, plain CSS, Bulma, Foundation, etc.)
and convert it fully to Tailwind utility classes following CLAUDE.md Rule 1.

**File or code to convert:** $ARGUMENTS

---

## Step 1 — Identify what you are dealing with

Read the file(s). Before converting, output a one-paragraph detection summary:

```
## Detection Summary
- Input type: [HTML / Twig / JSX / PHP template / CSS file / SCSS file / mixed]
- Styling systems found: [Bootstrap 4/5 / custom CSS / inline styles / SCSS / CSS vars / Bulma / other]
- Approximate conversion complexity: [Simple / Medium / Complex]
- Files that will be modified: [list]
- Files that will be created or updated: [tailwind.config.js if new tokens needed]
```

Ask the user to confirm before proceeding if complexity is **Complex**.

---

## Step 2 — Conversion rules

### A. Bootstrap → Tailwind class mapping

Apply these mappings (and their responsive variants e.g. `col-md-6` → `md:w-1/2`):

**Layout / Grid**
| Bootstrap | Tailwind |
|-----------|----------|
| `container` | `max-w-screen-xl mx-auto px-4` |
| `container-fluid` | `w-full px-4` |
| `row` | `flex flex-wrap -mx-4` |
| `col` | `flex-1 px-4` |
| `col-{n}` | `w-{n}/12 px-4` (e.g. col-6 → `w-6/12`) |
| `col-auto` | `w-auto px-4` |
| `d-none` | `hidden` |
| `d-block` | `block` |
| `d-flex` | `flex` |
| `d-inline-flex` | `inline-flex` |
| `d-grid` | `grid` |
| `justify-content-start` | `justify-start` |
| `justify-content-center` | `justify-center` |
| `justify-content-end` | `justify-end` |
| `justify-content-between` | `justify-between` |
| `align-items-start` | `items-start` |
| `align-items-center` | `items-center` |
| `align-items-end` | `items-end` |
| `flex-column` | `flex-col` |
| `flex-wrap` | `flex-wrap` |
| `flex-nowrap` | `flex-nowrap` |
| `gap-{n}` | `gap-{n}` (1:1 if values match) |

**Spacing**
| Bootstrap | Tailwind |
|-----------|----------|
| `m-0` → `m-0`, `m-1` → `m-1`, `m-2` → `m-2`, `m-3` → `m-3`, `m-4` → `m-4`, `m-5` → `m-12` |
| `p-{n}` | same scale as m |
| `mt-`, `mb-`, `ms-`, `me-`, `mx-`, `my-` | `mt-`, `mb-`, `ml-`, `mr-`, `mx-`, `my-` |
| `pt-`, `pb-`, `ps-`, `pe-`, `px-`, `py-` | same prefix |

**Typography**
| Bootstrap | Tailwind |
|-----------|----------|
| `text-start` | `text-left` |
| `text-center` | `text-center` |
| `text-end` | `text-right` |
| `fw-bold` | `font-bold` |
| `fw-normal` | `font-normal` |
| `fw-light` | `font-light` |
| `fst-italic` | `italic` |
| `text-uppercase` | `uppercase` |
| `text-lowercase` | `lowercase` |
| `text-capitalize` | `capitalize` |
| `fs-1` through `fs-6` | `text-6xl` through `text-sm` (adjust to design) |
| `lead` | `text-lg leading-relaxed` |
| `small` | `text-sm` |
| `text-muted` | `text-gray-500` |
| `text-primary` | `text-primary` (map to token in tailwind.config.js) |
| `text-danger` | `text-red-600` |
| `text-success` | `text-green-600` |
| `text-warning` | `text-yellow-500` |
| `text-info` | `text-blue-500` |
| `text-white` | `text-white` |
| `text-dark` | `text-gray-900` |
| `text-light` | `text-gray-100` |
| `text-truncate` | `truncate` |
| `text-break` | `break-words` |
| `text-wrap` | `whitespace-normal` |
| `text-nowrap` | `whitespace-nowrap` |

**Background / Color**
| Bootstrap | Tailwind |
|-----------|----------|
| `bg-primary` | `bg-primary` (map to token) |
| `bg-secondary` | `bg-secondary` |
| `bg-white` | `bg-white` |
| `bg-dark` | `bg-gray-900` |
| `bg-light` | `bg-gray-100` |
| `bg-danger` | `bg-red-600` |
| `bg-success` | `bg-green-600` |
| `bg-warning` | `bg-yellow-400` |
| `bg-transparent` | `bg-transparent` |

**Borders / Radius**
| Bootstrap | Tailwind |
|-----------|----------|
| `border` | `border` |
| `border-0` | `border-0` |
| `border-top` | `border-t` |
| `border-bottom` | `border-b` |
| `border-start` | `border-l` |
| `border-end` | `border-r` |
| `rounded` | `rounded` |
| `rounded-0` | `rounded-none` |
| `rounded-1` | `rounded-sm` |
| `rounded-2` | `rounded-md` |
| `rounded-3` | `rounded-lg` |
| `rounded-circle` | `rounded-full` |
| `rounded-pill` | `rounded-full` |

**Sizing**
| Bootstrap | Tailwind |
|-----------|----------|
| `w-25` | `w-1/4` |
| `w-50` | `w-1/2` |
| `w-75` | `w-3/4` |
| `w-100` | `w-full` |
| `h-100` | `h-full` |
| `mw-100` | `max-w-full` |
| `mh-100` | `max-h-full` |
| `vw-100` | `w-screen` |
| `vh-100` | `h-screen` |
| `min-vw-100` | `min-w-full` |
| `min-vh-100` | `min-h-screen` |

**Buttons**
| Bootstrap | Tailwind equivalent |
|-----------|-------------------|
| `btn btn-primary` | `inline-flex items-center justify-center px-6 py-2 bg-primary text-white font-medium rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition` |
| `btn btn-secondary` | same pattern with `bg-secondary` |
| `btn btn-outline-primary` | `border border-primary text-primary hover:bg-primary hover:text-white …` |
| `btn btn-lg` | add `text-lg px-8 py-3` |
| `btn btn-sm` | add `text-sm px-3 py-1` |
| `btn-block` / `d-grid` | `w-full` |

**Shadows / Effects**
| Bootstrap | Tailwind |
|-----------|----------|
| `shadow-sm` | `shadow-sm` |
| `shadow` | `shadow` |
| `shadow-lg` | `shadow-lg` |
| `shadow-none` | `shadow-none` |

**Position / Display**
| Bootstrap | Tailwind |
|-----------|----------|
| `position-static` | `static` |
| `position-relative` | `relative` |
| `position-absolute` | `absolute` |
| `position-fixed` | `fixed` |
| `position-sticky` | `sticky` |
| `top-0` | `top-0` |
| `bottom-0` | `bottom-0` |
| `start-0` | `left-0` |
| `end-0` | `right-0` |
| `z-index-*` | `z-*` |
| `overflow-hidden` | `overflow-hidden` |
| `overflow-auto` | `overflow-auto` |
| `overflow-visible` | `overflow-visible` |
| `overflow-scroll` | `overflow-scroll` |

**Visibility**
| Bootstrap | Tailwind |
|-----------|----------|
| `visible` | `visible` |
| `invisible` | `invisible` |
| `opacity-0` | `opacity-0` |
| `opacity-25` | `opacity-25` |
| `opacity-50` | `opacity-50` |
| `opacity-75` | `opacity-75` |
| `opacity-100` | `opacity-100` |

**Responsive prefixes**
Bootstrap `sm`, `md`, `lg`, `xl`, `xxl` → Tailwind `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

---

### B. Custom CSS property → Tailwind utility

For every CSS rule in a `.css` / `.scss` file or `<style>` block, map each declaration:

| CSS property | Tailwind utility |
|-------------|-----------------|
| `color: #…` | `text-[#…]` or add to `tailwind.config.js` theme.colors |
| `background-color: #…` | `bg-[#…]` or theme token |
| `font-size: …` | `text-[…]` or theme token |
| `font-weight: bold/700` | `font-bold` |
| `line-height: …` | `leading-[…]` |
| `letter-spacing: …` | `tracking-[…]` |
| `margin: …` | `m-…` / `mx-…` / `my-…` |
| `padding: …` | `p-…` / `px-…` / `py-…` |
| `width: …` | `w-…` |
| `height: …` | `h-…` |
| `max-width: …` | `max-w-…` |
| `min-height: …` | `min-h-…` |
| `display: flex` | `flex` |
| `display: grid` | `grid` |
| `gap: …` | `gap-…` |
| `border-radius: …` | `rounded-…` |
| `box-shadow: …` | `shadow-…` or `shadow-[…]` |
| `opacity: …` | `opacity-…` |
| `position: …` | `relative/absolute/fixed/sticky` |
| `top/right/bottom/left: …` | `top-…/right-…/bottom-…/left-…` |
| `z-index: …` | `z-…` |
| `cursor: pointer` | `cursor-pointer` |
| `pointer-events: none` | `pointer-events-none` |
| `transition: …` | `transition` / `transition-all` / `duration-…` / `ease-…` |
| `transform: …` | `translate-…/rotate-…/scale-…` |
| `overflow: …` | `overflow-…` |
| `white-space: nowrap` | `whitespace-nowrap` |
| `text-overflow: ellipsis` | `truncate` |
| `list-style: none` | `list-none` |
| `outline: none` | `outline-none` |
| `appearance: none` | `appearance-none` |

**Media queries → responsive prefixes**
```css
@media (min-width: 640px)  { … }  →  sm:
@media (min-width: 768px)  { … }  →  md:
@media (min-width: 1024px) { … }  →  lg:
@media (min-width: 1280px) { … }  →  xl:
@media (min-width: 1536px) { … }  →  2xl:
```

**Pseudo-classes → Tailwind variants**
```css
:hover   →  hover:
:focus   →  focus:
:active  →  active:
:visited →  visited:
:first-child → first:
:last-child  → last:
:nth-child(odd) → odd:
:not(…)  →  not-… (limited)
```

---

### C. Inline styles → utility classes

For every `style="…"` attribute, extract each declaration and apply the CSS→Tailwind mapping
from section B. Remove the `style` attribute entirely after conversion.

---

### D. Values with no direct Tailwind utility → tailwind.config.js

When a value cannot be expressed with a standard utility (e.g. `font-size: 17px`, `color: #1a2b3c`,
a brand gradient, a custom breakpoint):

1. Add it to `tailwind.config.js` under the appropriate `theme.extend` key
2. Use the new token name as the utility class in the converted markup
3. Document the addition in the output report

```js
// tailwind.config.js — additions made during conversion
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1a2b3c',
          accent:  '#f05a28',
        },
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
};
```

---

### E. What CANNOT be auto-converted (flag these to the user)

- Complex CSS animations / `@keyframes` → keep in a minimal `src/animations.css` and note the Rule 1 exception
- CSS custom property cascades that change at runtime via JS
- Third-party component library styles that override deeply nested selectors
- Print stylesheets (`@media print`)

For each unfixable item, output:
```
⚠️  CANNOT AUTO-CONVERT: {selector / property}
    Reason: {why Tailwind can't express this}
    Recommendation: {what to do instead}
```

---

## Step 3 — Output format

### For each converted file, show a diff-style summary:
```
### Converted: {filename}
- Removed: Bootstrap classes, custom CSS, inline styles
- Added: Tailwind utility classes
- tailwind.config.js tokens added: [list or "none"]
- Manual fixes needed: [list or "none"]
```

Then output the **complete converted file content** — do not show diffs for the actual file,
write the final result directly using the Edit or Write tool.

### Final summary:
```
## Conversion Complete

| File | Status |
|------|--------|
| {file} | ✅ Fully converted |
| {file} | ⚠️ Converted with 2 manual items |

### tailwind.config.js additions
[show the extend block to add, or "No changes needed"]

### Manual items remaining
1. {description + file + line}
2. …

### Rule 1 compliance after conversion
- Custom CSS files remaining: [list or "none — ✅ clean"]
- Inline styles remaining: [list or "none — ✅ clean"]
- Bootstrap classes remaining: [list or "none — ✅ clean"]
```

---

## Important rules during conversion

- Preserve ALL functionality — only change styling, never remove semantic HTML or ARIA
- Keep all `id`, `data-*`, `aria-*`, `role` attributes exactly as-is
- Do not remove or alter JavaScript event hooks (`data-toggle`, `data-bs-*`, `@click`, etc.)
  unless they are Bootstrap JS-specific and no longer needed
- If converting Bootstrap JS components (modal, dropdown, collapse), flag them:
  these need Alpine.js, vanilla JS, or a headless library replacement — do not silently break them
- After conversion, run `/wp-review` on the converted files
