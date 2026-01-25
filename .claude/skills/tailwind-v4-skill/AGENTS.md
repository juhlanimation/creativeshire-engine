# Tailwind CSS v4 Best Practices

**Version 1.0.0**
Community
January 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring Tailwind CSS v4 codebases. Humans may also find
> it useful, but guidance here is optimized for automation and consistency
> by AI-assisted workflows.

---

## Abstract

Comprehensive styling guide for Tailwind CSS v4 applications, designed for AI agents and LLMs. Contains 15 rules across 3 categories, covering CSS-first configuration, new directives (@theme, @utility, @variant, @source), migration from v3, and anti-patterns to avoid. Each rule includes detailed explanations with incorrect vs. correct code examples.

---

## Table of Contents

1. [Setup & Configuration](#1-setup--configuration) - **CRITICAL**
   - 1.1 [CSS Entry Point](#11-css-entry-point)
   - 1.2 [Next.js App Router Integration](#12-nextjs-app-router-integration)
   - 1.3 [Vite Integration](#13-vite-integration)
   - 1.4 [Source Detection and Safelisting](#14-source-detection-and-safelisting)
   - 1.5 [Theme Configuration with @theme](#15-theme-configuration-with-theme)
2. [Migration from v3](#2-migration-from-v3) - **HIGH**
   - 2.1 [Native Container Queries](#21-native-container-queries)
   - 2.2 [Dark Mode Configuration](#22-dark-mode-configuration)
   - 2.3 [Explicit var() in Arbitrary Values](#23-explicit-var-in-arbitrary-values)
   - 2.4 [OKLCH Color Space](#24-oklch-color-space)
   - 2.5 [Ring Requires Explicit Width](#25-ring-requires-explicit-width)
   - 2.6 [Shadow Scale Shift](#26-shadow-scale-shift)
3. [Customization Patterns](#3-customization-patterns) - **MEDIUM**
   - 3.1 [Custom Utilities with @utility](#31-custom-utilities-with-utility)
   - 3.2 [Custom Variants with @variant](#32-custom-variants-with-variant)
   - 3.3 [Theme Inline Modifier](#33-theme-inline-modifier)
   - 3.4 [New Gradient Syntax](#34-new-gradient-syntax)

---

## 1. Setup & Configuration

**Impact:** CRITICAL
**Description:** Proper v4 configuration is essential. v4 uses CSS-first configuration with new directives, replacing the JavaScript-based config of v3.

### 1.1 CSS Entry Point

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

Reference: [Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)

---

### 1.2 Next.js App Router Integration

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

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
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

Reference: [Installation - Next.js](https://tailwindcss.com/docs/installation/nextjs)

---

### 1.3 Vite Integration

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

```css
/* src/index.css */
@import 'tailwindcss';
```

**Key differences:**
- `@tailwindcss/vite` - Fastest, uses Lightning CSS
- `@tailwindcss/postcss` - For non-Vite builds
- No `autoprefixer` needed - v4 handles prefixes

Reference: [Installation - Vite](https://tailwindcss.com/docs/installation/vite)

---

### 1.4 Source Detection and Safelisting

v4 auto-detects source files but provides `@source` for manual control. Safelisting uses `@source inline()`.

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

/* With variants */
@source inline("hover:bg-red-500 dark:text-white");
```

**Incorrect (v3 safelist in JS - not supported):**

```js
// tailwind.config.js - THIS DOES NOT WORK IN V4
module.exports = {
  safelist: ['bg-red-500', 'text-white']  // Not supported!
}
```

**Important:** Tailwind scans files as plain text. String interpolation won't work:

```tsx
// These classes WON'T be detected
const color = 'red'
className={`bg-${color}-500`}

// Use complete class names
className={color === 'red' ? 'bg-red-500' : 'bg-blue-500'}
```

Reference: [Detecting Classes](https://tailwindcss.com/docs/detecting-classes-in-source-files)

---

### 1.5 Theme Configuration with @theme

v4 uses `@theme` blocks in CSS to define design tokens. This replaces the JS-based `tailwind.config.js` for most use cases.

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

Reference: [Theme Variables](https://tailwindcss.com/docs/theme)

---

## 2. Migration from v3

**Impact:** HIGH
**Description:** Breaking changes from v3 that require code updates. These patterns will silently fail or produce different results if not addressed.

### 2.1 Native Container Queries

v4 includes container queries natively. Remove `@tailwindcss/container-queries` plugin.

**Incorrect (v3 with plugin):**

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/container-queries'),  // NOT needed in v4
  ],
}
```

**Correct (v4 native):**

```html
<!-- Define container -->
<div class="@container">
  <!-- Respond to container width -->
  <div class="@lg:grid-cols-2 @md:flex-row">
    Content
  </div>
</div>
```

**Container variants:**

| Variant | Container Width |
|---------|-----------------|
| `@sm:` | 320px (20rem) |
| `@md:` | 448px (28rem) |
| `@lg:` | 512px (32rem) |
| `@xl:` | 576px (36rem) |
| `@2xl:` | 672px (42rem) |

**Common confusion:**
- `lg:` = viewport breakpoint (screen width)
- `@lg:` = container query (parent width)

Reference: [Container Queries](https://tailwindcss.com/docs/container-queries)

---

### 2.2 Dark Mode Configuration

v4 defaults to `media` strategy (prefers-color-scheme). For class-based dark mode, use `@variant`.

**v4 default (media query):**

```css
/* Automatic - follows system preference */
@import 'tailwindcss';
```

**Class-based dark mode:**

```css
@import 'tailwindcss';

@variant dark (&:is(.dark, .dark *));
```

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-gray-900">
      Dark when .dark class on html
    </div>
  </body>
</html>
```

**Data attribute strategy:**

```css
@variant dark (&:is([data-theme="dark"], [data-theme="dark"] *));
```

**Incorrect (v3 config):**

```js
// tailwind.config.js - NOT the v4 way
module.exports = {
  darkMode: 'class',  // Use @variant instead
}
```

Reference: [Dark Mode](https://tailwindcss.com/docs/dark-mode)

---

### 2.3 Explicit var() in Arbitrary Values

v4 requires explicit `var()` when using CSS variables in arbitrary values. The v3 implicit injection is removed.

**Incorrect (v3 implicit var):**

```html
<div class="bg-[--my-color]">Colored box</div>
<!-- In v4, this produces NO CSS output - silently fails -->
```

**Correct (v4 explicit var):**

```html
<div class="bg-[var(--my-color)]">Colored box</div>
<!-- Correctly references the CSS variable -->
```

This applies to all arbitrary values:

```html
<!-- All incorrect in v4 -->
<div class="w-[--sidebar-width]">
<div class="p-[--spacing-lg]">
<div class="text-[--heading-size]">

<!-- All correct in v4 -->
<div class="w-[var(--sidebar-width)]">
<div class="p-[var(--spacing-lg)]">
<div class="text-[var(--heading-size)]">
```

Reference: [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

---

### 2.4 OKLCH Color Space

v4 uses OKLCH color space by default. Colors appear more vibrant but may look different from v3.

**What changed:**

```css
/* v3 output */
.bg-blue-500 { background-color: rgb(59 130 246); }

/* v4 output */
.bg-blue-500 { background-color: oklch(0.623 0.214 259.815); }
```

**Custom colors with oklch:**

```css
@theme {
  --color-brand: oklch(0.7 0.15 250);
  --color-brand-light: oklch(from var(--color-brand) calc(l + 0.1) c h);
}
```

**If you need exact v3 colors:**

```css
@theme {
  /* Override with rgb if needed */
  --color-blue-500: rgb(59 130 246);
}
```

Reference: [Colors](https://tailwindcss.com/docs/colors)

---

### 2.5 Ring Requires Explicit Width

v4 changed `ring` to require an explicit width. The default `ring` utility no longer applies a visible ring.

**Incorrect (v3 mental model):**

```html
<button class="focus:ring">Focusable button</button>
<!-- In v4, this produces a ring with width 0 - invisible -->
```

**Correct (v4 explicit width):**

```html
<button class="focus:ring-3">Focusable button</button>
<!-- Produces a 3px ring, similar to v3's default "ring" -->
```

**Available widths:** `ring-0`, `ring-1`, `ring-2`, `ring-3`, `ring-4`, `ring-8`

Reference: [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

---

### 2.6 Shadow Scale Shift

v4 shifted the shadow scale down by one step.

**Full scale mapping:**

| v3 Class | v4 Equivalent |
|----------|---------------|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `shadow-md` | `shadow` |
| `shadow-lg` | `shadow-md` |
| `shadow-xl` | `shadow-lg` |
| `shadow-2xl` | `shadow-xl` |

Reference: [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

---

## 3. Customization Patterns

**Impact:** MEDIUM
**Description:** Advanced patterns for extending Tailwind v4 with custom utilities, variants, and theme configurations.

### 3.1 Custom Utilities with @utility

v4 uses `@utility` directive to define custom utilities that work with variants.

**Incorrect (v3 @layer pattern):**

```css
@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
}
```

**Correct (v4 @utility directive):**

```css
@utility content-auto {
  content-visibility: auto;
}
```

**With variants - they just work:**

```html
<div class="hover:content-auto md:content-auto">
  <!-- Variants apply automatically -->
</div>
```

Reference: [Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)

---

### 3.2 Custom Variants with @variant

v4 uses `@variant` to define custom variants directly in CSS.

**Correct (v4 @variant):**

```css
/* Simple variant - combines selectors */
@variant hocus (&:hover, &:focus);

/* Media query variant */
@variant pointer-coarse (@media (pointer: coarse));

/* Supports query */
@variant supports-grid (@supports (display: grid));

/* Dark mode with class strategy */
@variant dark (&:is(.dark, .dark *));
```

**Usage:**

```html
<button class="hocus:bg-blue-600 pointer-coarse:p-4">
  Hover or focus me
</button>
```

Reference: [Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)

---

### 3.3 Theme Inline Modifier

Use `@theme inline` to preserve CSS variables in output alongside utilities.

**Standard @theme:**

```css
@theme {
  --font-sans: "Inter", sans-serif;
}
/* Variables used for utility generation but NOT emitted */
```

**With inline modifier:**

```css
@theme inline {
  --font-sans: "SF Pro Text", system-ui, sans-serif;
  --color-primary: #0066cc;
}
/* Variables ARE emitted as CSS custom properties */
```

**When to use inline:**

- shadcn/ui and Radix design systems that reference CSS vars
- Dynamic theming with JavaScript
- Sharing variables between Tailwind and custom CSS

**Combining with :root:**

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

:root {
  --background: #ffffff;
  --foreground: #1d1d1f;
}

.dark {
  --background: #000000;
  --foreground: #f5f5f7;
}
```

Reference: [Theme Configuration](https://tailwindcss.com/docs/theme)

---

### 3.4 New Gradient Syntax

Tailwind v4 introduces cleaner gradient utilities.

**Linear gradients:**

```html
<!-- v4 syntax -->
<div class="bg-linear-to-r from-blue-500 to-purple-500"></div>

<!-- Direction variants -->
bg-linear-to-t    <!-- top -->
bg-linear-to-tr   <!-- top-right -->
bg-linear-to-r    <!-- right -->
bg-linear-to-br   <!-- bottom-right -->
bg-linear-to-b    <!-- bottom -->
bg-linear-to-bl   <!-- bottom-left -->
bg-linear-to-l    <!-- left -->
bg-linear-to-tl   <!-- top-left -->
```

**Radial gradients:**

```html
<div class="bg-radial from-white to-transparent"></div>
<div class="bg-radial-[at_top] from-sky-500 to-transparent"></div>
```

**Conic gradients:**

```html
<div class="bg-conic from-red-500 via-yellow-500 to-red-500"></div>
```

**With arbitrary values:**

```html
<div class="bg-linear-[45deg] from-pink-500 to-orange-500"></div>
```

Reference: [Gradients](https://tailwindcss.com/docs/background-image)

---

## References

- [Tailwind CSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Theme Variables](https://tailwindcss.com/docs/theme)
- [Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Detecting Classes](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)

---

*Upstream: [tlq5l/tailwindcss-v4-skill](https://github.com/tlq5l/tailwindcss-v4-skill)*
