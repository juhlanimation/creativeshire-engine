# Tailwind v4 Setup & Configuration Bundle

**Impact:** CRITICAL
**Source:** `.claude/skills/tailwind-v4-skill/rules/setup-*.md`

> Proper v4 configuration is essential. v4 uses CSS-first configuration with new directives, replacing the JavaScript-based config of v3.

---

## 1. CSS Entry Point

v4 uses `@import 'tailwindcss'` as the single entry point. The v3 `@tailwind` directives cause errors in v4.

**Incorrect (v3 directives - will error in v4):**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Correct (v4 single import):**

```css
@import 'tailwindcss';
```

**With options:**

```css
/* Set source scanning base */
@import 'tailwindcss' source('../src');

/* Add prefix */
@import 'tailwindcss' prefix(tw);

/* Disable auto-detection */
@import 'tailwindcss' source(none);
```

---

## 2. Next.js App Router Integration

v4 works with Next.js via PostCSS. Use `@tailwindcss/postcss` instead of the v3 `tailwindcss` package.

**Setup (PostCSS - recommended):**

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

```css
/* app/globals.css */
@import 'tailwindcss';

@source '../components/**/*.tsx';
@source '../app/**/*.tsx';
```

**Incorrect (v3 config reference):**

```js
// tailwind.config.js - NOT the v4 way
module.exports = {
  content: ['./app/**/*.tsx', './components/**/*.tsx'],
}
```

**Correct (v4 CSS source detection):**

```css
/* In globals.css */
@import 'tailwindcss';

/* Explicit source paths if auto-detection misses files */
@source '../components/**/*.tsx';
```

---

## 3. Vite Integration

v4 has a dedicated Vite plugin that's faster than PostCSS. Use `@tailwindcss/vite` instead of `postcss.config.js`.

**Incorrect (v3 PostCSS approach):**

```js
// postcss.config.js - SLOWER in v4
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

**Correct (v4 Vite plugin):**

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

**Key differences:**
- `@tailwindcss/vite` - Fastest, uses Lightning CSS
- `@tailwindcss/postcss` - For non-Vite builds
- No `autoprefixer` needed - v4 handles prefixes

---

## 4. Source Detection and Safelisting

v4 auto-detects source files but provides `@source` for manual control.

**Add paths:**

```css
@source "../shared-components/**/*.tsx";
@source "./templates/*.html";
```

**Exclude paths:**

```css
@source not "./legacy/**/*";
@source not "../packages/deprecated";
```

**Safelist specific classes:**

```css
/* Safelist exact classes */
@source inline("bg-red-500 text-white p-4");

/* With brace expansion */
@source inline("bg-{red,blue,green}-{100,500,900}");
```

**Important:** Tailwind scans files as plain text. String interpolation won't work:

```tsx
// These classes WON'T be detected
const color = 'red'
className={`bg-${color}-500`}

// Use complete class names
className={color === 'red' ? 'bg-red-500' : 'bg-blue-500'}
```

---

## 5. Theme Configuration with @theme

v4 uses `@theme` blocks in CSS to define design tokens. This replaces the JS-based `tailwind.config.js`.

**Incorrect (v3 JS config as primary):**

```js
// tailwind.config.js - still works but not the v4 way
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      }
    }
  }
}
```

**Correct (v4 CSS-first):**

```css
@import 'tailwindcss';

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --breakpoint-3xl: 1920px;
  --font-display: "Satoshi", sans-serif;
}
```

**Override entire namespace:**

```css
@theme {
  /* Remove all default colors */
  --color-*: initial;

  /* Define only your colors */
  --color-brand: #ff6b00;
  --color-surface: #fafafa;
}
```

**Theme variable namespaces:**

| Prefix | Purpose |
|--------|---------|
| `--color-*` | Colors |
| `--font-*` | Font families |
| `--text-*` | Font sizes |
| `--spacing-*` | Sizes/margins |
| `--breakpoint-*` | Responsive breakpoints |
| `--radius-*` | Border radius |
| `--shadow-*` | Box shadows |
| `--ease-*` | Transition timing |

---

## References

- [Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Installation - Next.js](https://tailwindcss.com/docs/installation/nextjs)
- [Installation - Vite](https://tailwindcss.com/docs/installation/vite)
- [Detecting Classes](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Theme Variables](https://tailwindcss.com/docs/theme)
