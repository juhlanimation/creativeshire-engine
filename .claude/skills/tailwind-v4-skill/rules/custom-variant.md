---
title: Custom Variants with @variant
impact: MEDIUM
impactDescription: Define custom selectors and states
tags: customization, variant, directive, selectors
---

## Custom Variants with @variant

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

**Group and peer variants:**

```css
@custom-variant group-hocus (:merge(.group):hover &, :merge(.group):focus &);
```

**Print variant:**

```css
@custom-variant print (@media print);
```

**Nested variant with @slot:**

```css
@variant dark {
  &:where([data-theme="dark"], [data-theme="dark"] *) {
    @slot;
  }
}
```

**Note:** `@variant` and `@custom-variant` work identically. `@custom-variant` is more explicit about intent.

Reference: [Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
