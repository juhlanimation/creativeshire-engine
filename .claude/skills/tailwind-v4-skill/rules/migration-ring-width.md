---
title: Ring Requires Explicit Width
impact: HIGH
impactDescription: Default ring is now invisible
tags: migration, ring, focus, accessibility
---

## Ring Requires Explicit Width

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

**Available widths:**

| Class | Width |
|-------|-------|
| `ring-0` | 0px |
| `ring-1` | 1px |
| `ring-2` | 2px |
| `ring-3` | 3px |
| `ring-4` | 4px |
| `ring-8` | 8px |

**With color:**

```html
<button class="focus:ring-3 focus:ring-blue-500">
  Blue focus ring
</button>
```

Reference: [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
