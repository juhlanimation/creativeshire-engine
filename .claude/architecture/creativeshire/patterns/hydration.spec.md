# Hydration Safety Spec

> Patterns to prevent visual flicker during React hydration.

---

## The Problem

Visual flicker occurs when server-rendered HTML doesn't match initial client state:

```
1. Server renders with CSS variable fallbacks (--y: 0)
2. Browser displays server HTML immediately
3. React hydrates, driver hasn't registered yet
4. Brief moment where fallback values show
5. Driver registers, applies computed values
6. User sees "snap" from fallback to computed
```

This is most visible with:
- Scroll-based parallax (content jumps to scroll position)
- Viewport-based sizing (elements resize on hydration)
- Theme values (flash of wrong theme)

---

## Solution: Hydration Guard Pattern

### Step 1: CSS Variables with Matching Fallbacks

Fallback must match the expected initial state.

```css
/* Widget reads CSS variable with fallback */
.hero-widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}
```

**Rule:** Fallback value = expected initial value (usually 0 for transforms, 1 for opacity).

### Step 2: Suppress Transitions Until Initialized

```css
/* Suppress transitions until driver initializes */
[data-behaviour]:not([data-initialized]) {
  transition: none !important;
}

/* Enable transitions after initialization */
[data-behaviour][data-initialized] {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
```

### Step 3: Set data-initialized After Driver Registers

```typescript
// BehaviourWrapper.tsx
import { useEffect, useRef } from 'react'

export function BehaviourWrapper({ behaviour, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Driver registers and computes initial values
    const cleanup = registerDriver(el, behaviour)

    // Mark as initialized AFTER driver has set values
    requestAnimationFrame(() => {
      el.setAttribute('data-initialized', '')
    })

    return () => {
      el.removeAttribute('data-initialized')
      cleanup()
    }
  }, [behaviour])

  return (
    <div ref={ref} data-behaviour={behaviour}>
      {children}
    </div>
  )
}
```

---

## Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | CSS variables have fallbacks | `var(--x, fallback)` present |
| 2 | Fallback matches initial state | No visual shift on hydration |
| 3 | Transitions suppressed until initialized | `[data-behaviour]:not([data-initialized])` selector |
| 4 | data-initialized set after driver registers | In useEffect, after RAF |
| 5 | Cleanup removes data-initialized | On unmount |

---

## CSS Variable Fallback Contract

| Variable | Fallback | Reason |
|----------|----------|--------|
| `--y` | `0` | No vertical offset initially |
| `--x` | `0` | No horizontal offset initially |
| `--scale` | `1` | Full size initially |
| `--opacity` | `1` | Fully visible initially |
| `--rotate` | `0deg` | No rotation initially |
| `--blur` | `0px` | No blur initially |
| `--clip-top` | `0%` | Fully visible initially |
| `--clip-bottom` | `0%` | Fully visible initially |

---

## Pattern: Client-Only Values

For values that can only be computed on client (e.g., scroll position), use inline script to prevent flash.

```typescript
// Inline script runs before React hydration
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      var scrollY = window.scrollY;
      document.documentElement.style.setProperty('--initial-scroll', scrollY + 'px');
    })();
  `
}} />
```

**Use sparingly.** This pattern:
- Blocks initial render slightly
- Only for critical above-fold content
- Most content should use CSS fallbacks instead

---

## Pattern: Theme Flicker Prevention

For theme values (dark/light mode), read from cookie/localStorage before hydration.

```typescript
// In <head> via next/script or inline
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      var theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  `
}} />
```

Then CSS applies correct theme immediately:

```css
[data-theme="dark"] {
  --bg: #000;
  --fg: #fff;
}

[data-theme="light"] {
  --bg: #fff;
  --fg: #000;
}
```

---

## Anti-Patterns

### Don't: Missing fallback

```css
/* WRONG - No fallback, undefined on server */
.widget {
  transform: translateY(calc(var(--y) * 1px));
}

/* CORRECT - Fallback provides server value */
.widget {
  transform: translateY(calc(var(--y, 0) * 1px));
}
```

### Don't: Fallback doesn't match initial state

```css
/* WRONG - Fallback doesn't match driver initial */
.widget {
  opacity: var(--opacity, 0);  /* Driver starts at 1 */
}

/* CORRECT - Fallback matches driver initial */
.widget {
  opacity: var(--opacity, 1);
}
```

### Don't: Transitions during hydration

```css
/* WRONG - Animates from fallback to computed */
.widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  transition: transform 0.3s ease;
}

/* CORRECT - Suppress until initialized */
.widget {
  transform: translateY(calc(var(--y, 0) * 1px));
}

.widget[data-initialized] {
  transition: transform 0.3s ease;
}
```

### Don't: Set data-initialized too early

```typescript
// WRONG - Set before driver computes values
useEffect(() => {
  el.setAttribute('data-initialized', '')  // Too early!
  registerDriver(el, behaviour)
}, [])

// CORRECT - Set after driver registers
useEffect(() => {
  const cleanup = registerDriver(el, behaviour)
  requestAnimationFrame(() => {
    el.setAttribute('data-initialized', '')
  })
  return cleanup
}, [])
```

---

## Testing Hydration

### Manual Test

1. Disable JavaScript in browser
2. Load page - should render with fallback values
3. Enable JavaScript
4. Reload - should hydrate without visible flash

### Automated Test

```typescript
// Check no layout shift on hydration
test('no hydration flicker', async () => {
  // Render server HTML
  const html = await renderToString(<Page />)

  // Hydrate
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)

  // Measure layout shift during hydration
  const cls = await measureCLS(() => {
    hydrateRoot(container, <Page />)
  })

  expect(cls).toBeLessThan(0.1)
})
```

---

## See Also

- [Widget Spec](../components/content/widget.spec.md) - CSS variable fallbacks
- [Behaviour Spec](../components/experience/behaviour.spec.md) - BehaviourWrapper
- [Driver Spec](../components/experience/driver.spec.md) - CSS variable writes
