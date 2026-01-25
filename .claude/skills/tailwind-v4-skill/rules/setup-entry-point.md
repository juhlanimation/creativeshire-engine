---
title: CSS Entry Point
impact: CRITICAL
impactDescription: v3 directives cause build errors in v4
tags: setup, configuration, import, entry-point
---

## CSS Entry Point

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
