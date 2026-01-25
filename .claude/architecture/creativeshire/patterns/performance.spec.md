# Performance Spec

> CSS and rendering optimizations for Creativeshire sites.

---

## Principle

Performance is a feature. Optimize render path for perceived speed:

1. **Above-fold** - Render immediately, no deferral
2. **Below-fold** - Defer rendering until near viewport
3. **Off-screen** - Skip rendering entirely

---

## Pattern 1: Content Visibility

Use CSS `content-visibility` to defer rendering of below-fold sections.

### How It Works

```css
/* Below-fold sections use content-visibility */
.section[data-below-fold] {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;  /* Estimated height */
}
```

- Browser skips layout/paint for off-screen content
- `contain-intrinsic-size` provides placeholder height
- Content renders when near viewport

### When to Use

| Section Position | content-visibility | Reason |
|------------------|-------------------|--------|
| Above-fold (hero) | None | LCP must render immediately |
| First below-fold | `auto` | Render when scrolled near |
| Far below-fold | `auto` | Skip until needed |

### Implementation

```typescript
// SectionRenderer.tsx
interface SectionRendererProps {
  section: SectionSchema
  index: number
  totalSections: number
}

export function SectionRenderer({
  section,
  index,
  totalSections
}: SectionRendererProps) {
  // First section (hero) renders immediately
  const isBelowFold = index > 0

  return (
    <section
      className="section"
      data-below-fold={isBelowFold || undefined}
      style={isBelowFold ? {
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 500px'
      } : undefined}
    >
      <SectionContent section={section} />
    </section>
  )
}
```

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | Above-fold sections have no content-visibility | LCP not affected |
| 2 | Below-fold sections use content-visibility: auto | Render deferred |
| 3 | contain-intrinsic-size provided | Layout stable |

---

## Pattern 2: Image Optimization

### Lazy Loading

```typescript
// widgets/Image/index.tsx
export default memo(function Image({ src, alt, priority }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
})
```

| Position | `loading` | `fetchpriority` |
|----------|-----------|-----------------|
| Hero image | `eager` | `high` |
| Above-fold | `eager` | `auto` |
| Below-fold | `lazy` | `auto` |

### Responsive Images

```typescript
// Use Next.js Image for automatic optimization
import Image from 'next/image'

export default function OptimizedImage({ src, alt }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      placeholder="blur"
      blurDataURL={generateBlurPlaceholder(src)}
    />
  )
}
```

---

## Pattern 3: Font Optimization

### Font Loading Strategy

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Show fallback immediately
  preload: true,
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Font Display Values

| Value | Behavior | Use Case |
|-------|----------|----------|
| `swap` | Fallback → Custom | Body text (CLS acceptable) |
| `optional` | Fallback if slow | Performance-critical |
| `block` | Invisible → Custom | Headings (avoid reflow) |

---

## Pattern 4: Animation Performance

### GPU-Accelerated Properties

Only animate properties that don't trigger layout:

| Property | Triggers | Performance |
|----------|----------|-------------|
| `transform` | Composite only | Fast |
| `opacity` | Composite only | Fast |
| `filter` | Composite only | Fast |
| `width/height` | Layout + Paint + Composite | Slow |
| `margin/padding` | Layout + Paint + Composite | Slow |
| `top/left` | Layout + Paint + Composite | Slow |

### will-change Usage

```css
/* Only on elements that WILL animate */
[data-behaviour] {
  will-change: transform, opacity;
}

/* Remove when not animating */
[data-behaviour]:not([data-active]) {
  will-change: auto;
}
```

**Rule:** `will-change` consumes GPU memory. Apply only to actively animating elements.

---

## Pattern 5: JavaScript Performance

### Batch DOM Reads and Writes

```typescript
// WRONG - Forces multiple reflows
elements.forEach(el => {
  const height = el.offsetHeight  // Read (forces layout)
  el.style.height = height + 'px'  // Write (invalidates layout)
})

// CORRECT - Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight)  // All reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 'px'  // All writes
})
```

### Use CSS Classes, Not Inline Styles

```typescript
// WRONG - Multiple style mutations
el.style.transform = 'scale(1.1)'
el.style.opacity = '0.5'
el.style.filter = 'blur(2px)'

// CORRECT - Single class toggle
el.classList.add('active')
```

```css
.active {
  transform: scale(1.1);
  opacity: 0.5;
  filter: blur(2px);
}
```

### Passive Event Listeners

```typescript
// WRONG - Can block scrolling
window.addEventListener('scroll', handler)

// CORRECT - Non-blocking
window.addEventListener('scroll', handler, { passive: true })
```

---

## Validation Rules Summary

| # | Rule | Check |
|---|------|-------|
| 1 | Above-fold has no content-visibility | Hero renders immediately |
| 2 | Below-fold uses content-visibility: auto | Render deferred |
| 3 | contain-intrinsic-size provided | Layout stable |
| 4 | Hero image has priority/eager | LCP optimized |
| 5 | Below-fold images are lazy | Bandwidth saved |
| 6 | Fonts use display: swap or optional | No FOIT |
| 7 | Only transform/opacity/filter animated | No layout thrashing |
| 8 | will-change only on active elements | GPU memory managed |
| 9 | Scroll listeners are passive | Non-blocking |
| 10 | DOM reads batched before writes | No forced reflows |

---

## Performance Budget

| Metric | Target | Why |
|--------|--------|-----|
| LCP | < 2.5s | Core Web Vital |
| FID | < 100ms | Core Web Vital |
| CLS | < 0.1 | Core Web Vital |
| TTI | < 3.8s | Interactive quickly |
| Bundle (JS) | < 100KB gzipped | Fast parse |

---

## See Also

- [Widget Spec](../components/content/widget.spec.md) - CSS variable fallbacks
- [Hydration Spec](./hydration.spec.md) - Flicker prevention
- [Data Fetching Spec](./data-fetching.spec.md) - Suspense streaming
