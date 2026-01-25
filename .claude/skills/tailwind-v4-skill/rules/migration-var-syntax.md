---
title: Explicit var() in Arbitrary Values
impact: HIGH
impactDescription: Silently fails without var()
tags: migration, css-variables, arbitrary-values
---

## Explicit var() in Arbitrary Values

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

This applies to all arbitrary values that reference CSS variables:

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
