# /analyze-ui — UI Analysis Report

You are analyzing a UI for a WordPress theme built with Timber 3.x/Twig, Tailwind CSS, and
custom Gutenberg blocks. Read CLAUDE.md in this project for the full ruleset.

**UI to analyze:** $ARGUMENTS

---

## Your job

Produce the full analysis report below **before writing a single line of code**.
If the user has not provided a UI yet, ask them to share it (file path, HTML paste, or description).

---

## Output this exact report structure

```
## UI Analysis Report — [derive name from UI]

### Pages Identified
| # | Page | WordPress Template | Twig File |
|---|------|--------------------|-----------|
| 1 | …    | …                  | …         |

### Per-Page Breakdown

#### [Page Name]
- **Sections** (top → bottom): …
- **Gutenberg blocks needed**: list each as `theme/block-name`
- **Twig templates**: views/page.twig, views/partials/…
- **Block attributes** (what goes in block.json): field name — type — default value
- **Fallback values**: what each attribute shows when empty
- **SEO/AEO/GEO meta needed**:
  - content_format: article | faq | howto | product
  - faq_items needed: yes/no
  - schema types: …
- **Code injection needed**: GTM / pixel / other — which injection point (head/body_open/body_close/after_footer)
- **Tailwind notes**: any custom tokens needed in tailwind.config.js

### Shared Partials
| Component | Proposed file |
|-----------|--------------|
| …         | views/partials/….twig |

### Assets Inventory
| Filename | Type | Action needed |
|----------|------|--------------|
| …        | Image / SVG / Font | Convert to WebP / Inline SVG / … |

### Accessibility Flags
- List any accessibility concerns visible in the UI design
- Missing alt text candidates, contrast risks, keyboard trap risks, missing landmarks

### Performance Notes
- **LCP candidate**: which element / image is above the fold
- **Images to lazy-load**: list
- **Potential CLS risks**: images without dimensions, web fonts, dynamic content

### Contact Forms
- List any forms identified and whether Contact Form 7 applies

### Recommended Build Order
1. Shared partials first (head.twig, header.twig, footer.twig, inject-*.twig)
2. SEO panel React component (inc/seo-panel/)
3. [Blocks in page priority order — highest-traffic page first]
```

---

After the report, ask the user: **"Does this look right? Should I start building?"**
Do not proceed to code until the user confirms.
