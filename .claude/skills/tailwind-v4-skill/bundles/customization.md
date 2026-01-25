# Tailwind v4 Customization Patterns Bundle

**Impact:** MEDIUM
**Source:** `.claude/skills/tailwind-v4-skill/rules/custom-*.md`

> Advanced patterns for extending Tailwind v4 with custom utilities, variants, and theme configurations.

---

## 1. Custom Utilities with @utility

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

**Complex utility example:**

```css
@utility scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 2. Custom Variants with @variant

v4 uses `@variant` to define custom variants directly in CSS.

**Simple variant - combines selectors:**

```css
@variant hocus (&:hover, &:focus);
```

**Media query variant:**

```css
@variant pointer-coarse (@media (pointer: coarse));
```

**Supports query:**

```css
@variant supports-grid (@supports (display: grid));
```

**Dark mode with class strategy:**

```css
@variant dark (&:is(.dark, .dark *));
```

**Usage:**

```html
<button class="hocus:bg-blue-600 pointer-coarse:p-4">
  Hover or focus me
</button>
```

**State variants:**

```css
@variant loading (&[data-loading="true"]);
@variant disabled (&:disabled, &[aria-disabled="true"]);
@variant current (&[aria-current="page"]);
```

---

## 3. Theme Inline Modifier

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

**Combining with :root for theming:**

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

**shadcn/ui integration pattern:**

```css
@import 'tailwindcss';

@theme inline {
  /* Map shadcn variables to Tailwind */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

---

## 4. New Gradient Syntax

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

**Multi-stop gradients:**

```html
<div class="bg-linear-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500"></div>
```

---

## Common Customization Patterns

### Design System Colors

```css
@theme {
  /* Brand colors */
  --color-brand-50: oklch(0.97 0.01 250);
  --color-brand-100: oklch(0.94 0.02 250);
  --color-brand-500: oklch(0.60 0.15 250);
  --color-brand-900: oklch(0.25 0.10 250);

  /* Semantic colors */
  --color-success: oklch(0.65 0.15 145);
  --color-warning: oklch(0.75 0.15 85);
  --color-error: oklch(0.55 0.20 25);
}
```

### Custom Spacing Scale

```css
@theme {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
}
```

### Animation Utilities

```css
@utility fade-in {
  animation: fadeIn 0.3s ease-out;
}

@utility slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## References

- [Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Theme Configuration](https://tailwindcss.com/docs/theme)
- [Gradients](https://tailwindcss.com/docs/background-image)
