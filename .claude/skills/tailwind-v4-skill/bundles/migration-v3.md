# Tailwind v4 Migration from v3 Bundle

**Impact:** HIGH
**Source:** `.claude/skills/tailwind-v4-skill/rules/migration-*.md`

> Breaking changes from v3 that require code updates. These patterns will silently fail or produce different results if not addressed.

---

## 1. Native Container Queries

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

---

## 2. Dark Mode Configuration

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

---

## 3. Explicit var() in Arbitrary Values

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

---

## 4. OKLCH Color Space

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

---

## 5. Ring Requires Explicit Width

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

---

## 6. Shadow Scale Shift

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

---

## Quick Reference: v3 to v4 Migration Checklist

1. [ ] Replace `@tailwind` directives with `@import 'tailwindcss'`
2. [ ] Remove `@tailwindcss/container-queries` plugin
3. [ ] Replace `darkMode: 'class'` with `@variant dark`
4. [ ] Add explicit `var()` to all `[--var-name]` arbitrary values
5. [ ] Update `ring` to `ring-3` (or explicit width)
6. [ ] Update shadow classes one step down
7. [ ] Review colors for OKLCH differences

---

## References

- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Container Queries](https://tailwindcss.com/docs/container-queries)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Colors](https://tailwindcss.com/docs/colors)
