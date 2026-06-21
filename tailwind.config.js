/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.twig',
    './blocks/**/*.twig',
    './blocks/**/*.jsx',
    './inc/**/*.jsx',
    // Seeded block markup (project/page bodies) carries Tailwind classes too.
    './inc/page-content/**/*.html',
    // Scoped PHP globs (avoid matching node_modules/ — Tailwind perf warning).
    './*.php',
    './inc/**/*.php',
    './blocks/**/*.php',
    // Interaction layer: app.js toggles state classes (is-in, rv-w/rv-wi,
    // rot-host, is-active, is-open…). Without this glob Tailwind tree-shakes
    // those @layer base rules, leaving data-reveal content stuck at opacity:0.
    './assets/js/**/*.js',
  ],
  // Belt-and-braces: never purge the JS-driven state/animation classes even if
  // a future refactor changes how app.js references them.
  safelist: [
    'is-in',
    'is-active',
    'is-open',
    'rv-line',
    'rv-w',
    'rv-wi',
    'rot-host',
    'rot-stack',
    'rot-word',
  ],
  theme: {
    extend: {
      // Colors map to CSS custom properties so the light/dark/forest
      // theme switcher ([data-theme]) keeps working at runtime.
      colors: {
        paper:   'var(--c-paper)',
        surface: 'var(--c-surface)',
        ink:     'var(--c-ink)',
        muted:   'var(--c-muted)',
        line:    'var(--c-line)',
        brand: {
          DEFAULT: 'var(--c-brand)',
          on:      'var(--c-onbrand)',
        },
        accent: {
          DEFAULT: 'var(--c-accent)',
          on:      'var(--c-onaccent)',
        },
        // Flat aliases so the mockup's `text-onbrand` / `bg-onaccent`
        // utility classes compile (Tailwind v4 CDN exposed these in the mockup).
        onbrand:  'var(--c-onbrand)',
        onaccent: 'var(--c-onaccent)',
        // Static fallbacks (official client hex) for non-theme contexts.
        primary:   '#73c1b5',
        secondary: '#f35b2d',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
