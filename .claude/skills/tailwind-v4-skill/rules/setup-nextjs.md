---
title: Next.js App Router Integration
impact: CRITICAL
impactDescription: Required for Next.js projects
tags: setup, nextjs, postcss, app-router
---

## Next.js App Router Integration

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

**Turbopack compatibility:**

```bash
# Works with Turbopack
next dev --turbo
```

Reference: [Installation - Next.js](https://tailwindcss.com/docs/installation/nextjs)
