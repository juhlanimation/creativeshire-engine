# Accessibility Guidelines

> Standards for building inclusive, accessible experiences in the Creativeshire engine.

---

## Purpose

Accessibility ensures all users can perceive, understand, navigate, and interact with Creativeshire-powered sites. The engine supports screen readers, keyboard navigation, reduced motion preferences, and WCAG 2.1 AA compliance. Accessible design improves SEO, legal compliance, and user experience for everyone.

---

## Concepts

| Term | Definition |
|------|------------|
| ARIA | Accessible Rich Internet Applications - attributes that enhance HTML semantics |
| Landmark | Semantic region (`<main>`, `<nav>`, `<header>`) for screen reader navigation |
| Focus Trap | Containing focus within a modal/overlay until dismissed |
| Live Region | Area announced by screen readers when content changes |
| Skip Link | Hidden link allowing keyboard users to bypass repetitive content |
| Reduced Motion | User preference to minimize or eliminate motion effects |

---

## Rules

### Must

1. All interactive elements are keyboard accessible
2. All images have `alt` text (empty `alt=""` for decorative images)
3. Form inputs have associated `<label>` elements
4. Color contrast meets WCAG AA (4.5:1 text, 3:1 large text/UI)
5. Focus indicators are visible on all interactive elements
6. Page has single `<h1>` and logical heading hierarchy
7. Landmarks used for major page regions (`<main>`, `<nav>`, `<header>`, `<footer>`)
8. Modals trap focus and return focus on close
9. Error messages are programmatically associated with inputs
10. `aria-live` regions used for dynamic content updates
11. Behaviours check `prefersReducedMotion` and return static values when true
12. Skip link provided for bypassing navigation
13. Touch targets are minimum 44x44px
14. Content is readable when zoomed to 200%
15. Custom components expose appropriate ARIA roles

### Must Not

1. Rely on color alone to convey information
2. Use `tabindex` > 0 (disrupts natural tab order)
3. Remove focus outlines without replacement
4. Auto-play video/audio without user control
5. Use motion that causes vestibular issues without reduced motion fallback
6. Nest interactive elements (button inside link)
7. Use placeholder text as the only label
8. Trap keyboard focus unintentionally
9. Hide content from screen readers that is visually present
10. Use ARIA when native HTML semantics suffice

---

## Validation Rules

> Each rule maps 1:1 to `accessibility.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Images have alt attribute | `checkImagesHaveAlt` | `*.tsx` |
| 2 | Form inputs have labels | `checkFormLabels` | `*.tsx` |
| 3 | No tabindex > 0 | `checkTabIndex` | `*.tsx` |
| 4 | Heading hierarchy valid | `checkHeadingHierarchy` | `*.tsx` |
| 5 | Interactive elements focusable | `checkFocusable` | `*.tsx` |
| 6 | aria-label on icon-only buttons | `checkIconButtons` | `*.tsx` |
| 7 | Behaviours handle reduced motion | `checkReducedMotionHandled` | `index.ts` |
| 8 | Live regions have aria-live | `checkLiveRegions` | `*.tsx` |
| 9 | Modals have focus trap | `checkFocusTrap` | `overlays/*.tsx` |
| 10 | Skip link present | `checkSkipLink` | `Chrome.tsx` |

---

## ARIA Attributes

### When to Use ARIA

| Scenario | Solution | Example |
|----------|----------|---------|
| Icon-only button | `aria-label` | `<button aria-label="Close menu">` |
| Current page in nav | `aria-current="page"` | `<a aria-current="page" href="/">` |
| Expandable content | `aria-expanded` | `<button aria-expanded="false">` |
| Loading state | `aria-busy` | `<div aria-busy="true">` |
| Error association | `aria-describedby` | `<input aria-describedby="error-msg">` |
| Live updates | `aria-live` | `<div aria-live="polite">` |
| Modal dialog | `role="dialog"` + `aria-modal` | `<div role="dialog" aria-modal="true">` |
| Tab interface | `role="tablist/tab/tabpanel"` | See template below |

### Common ARIA Patterns

```tsx
// Icon-only button
<button aria-label="Close navigation menu" onClick={onClose}>
  <IconX aria-hidden="true" />
</button>

// Expandable section
<button
  aria-expanded={isOpen}
  aria-controls="panel-content"
  onClick={toggle}
>
  Toggle Section
</button>
<div id="panel-content" hidden={!isOpen}>
  Panel content here
</div>

// Loading indicator
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? "Loading..." : content}
</div>
```

---

## Semantic HTML

### Required Landmarks

| Element | Purpose | Engine Location |
|---------|---------|-----------------|
| `<header>` | Site header with logo/navigation | `chrome/regions/Header.tsx` |
| `<nav>` | Navigation menus | `chrome/regions/Header.tsx` |
| `<main>` | Primary content area | `PageRenderer.tsx` |
| `<footer>` | Site footer | `chrome/regions/Footer.tsx` |
| `<aside>` | Complementary content | `chrome/regions/Sidebar.tsx` |
| `<section>` | Grouped content with heading | `SectionRenderer.tsx` |

### Heading Hierarchy

```tsx
// CORRECT - Single h1, logical hierarchy
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
    <h3>Subsection</h3>
  </section>
</main>

// WRONG - Skipped levels, multiple h1
<main>
  <h1>Title</h1>
  <h1>Another Title</h1>  {/* Only one h1 per page */}
  <h4>Skipped h2, h3</h4>  {/* Don't skip levels */}
</main>
```

### Lists for Related Items

```tsx
// CORRECT - Semantic list
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

// WRONG - Divs for list content
<nav>
  <div><a href="/">Home</a></div>
  <div><a href="/about">About</a></div>
</nav>
```

---

## Keyboard Navigation

### Focus Order

Focus follows visual reading order (left-to-right, top-to-bottom in LTR languages).

| Key | Action |
|-----|--------|
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous focusable element |
| `Enter` | Activate link/button |
| `Space` | Activate button, toggle checkbox |
| `Escape` | Close modal/dropdown |
| `Arrow keys` | Navigate within components (tabs, menus) |

### Skip Link Template

```tsx
// chrome/Chrome.tsx
export function Chrome({ children }: ChromeProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:p-4 focus:rounded"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
```

### Keyboard Shortcuts in Widgets

```tsx
// widgets/content/Carousel/index.tsx
function handleKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowLeft':
      goToPrevious();
      break;
    case 'ArrowRight':
      goToNext();
      break;
    case 'Home':
      goToFirst();
      break;
    case 'End':
      goToLast();
      break;
  }
}

<div
  role="region"
  aria-label="Image carousel"
  onKeyDown={handleKeyDown}
  tabIndex={0}
>
```

---

## Screen Readers

### Alt Text Guidelines

| Image Type | Alt Text | Example |
|------------|----------|---------|
| Content image | Describe content | `alt="Team photo at 2024 offsite"` |
| Decorative image | Empty alt | `alt=""` |
| Functional image | Describe function | `alt="Submit form"` |
| Complex image | Brief alt + long description | `alt="Sales chart" aria-describedby="chart-desc"` |

### aria-label vs aria-labelledby

```tsx
// aria-label: Direct text label
<button aria-label="Close dialog">
  <IconX />
</button>

// aria-labelledby: Reference existing text
<section aria-labelledby="section-title">
  <h2 id="section-title">Our Services</h2>
</section>
```

### Live Regions

```tsx
// Polite - Wait for idle before announcing
<div aria-live="polite" aria-atomic="true">
  {itemCount} items in cart
</div>

// Assertive - Announce immediately (use sparingly)
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>
```

---

## Color Contrast

### WCAG Requirements

| Element | Minimum Ratio | Example |
|---------|---------------|---------|
| Normal text (<18px) | 4.5:1 | `#767676` on white |
| Large text (>=18px bold or >=24px) | 3:1 | `#949494` on white |
| UI components | 3:1 | Buttons, form controls |
| Focus indicators | 3:1 | Focus ring color |

### Testing Tools

| Tool | Use Case |
|------|----------|
| Chrome DevTools | Color picker shows contrast ratio |
| axe DevTools | Full page accessibility audit |
| WAVE | Browser extension for quick checks |
| Contrast Checker | Manual ratio verification |

### Implementation Pattern

```css
/* globals.css - Define accessible color pairs */
@theme {
  --color-text: oklch(0.2 0 0);         /* Dark text */
  --color-text-muted: oklch(0.4 0 0);   /* 4.5:1 on white */
  --color-background: oklch(0.98 0 0);  /* Light background */
  --color-focus: oklch(0.5 0.2 250);    /* Visible focus ring */
}
```

---

## Focus Management

### Focus Trapping in Modals

```tsx
// chrome/overlays/Modal.tsx
import { useEffect, useRef } from 'react';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocus.current = document.activeElement as HTMLElement;

      // Focus first focusable element
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.[0]?.focus();
    } else {
      // Restore focus on close
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      ref={modalRef}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
```

### Focus Restoration Pattern

```tsx
// After dynamic content loads
function SectionContent({ id }: { id: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the section when it becomes active
    if (isActive) {
      contentRef.current?.focus();
    }
  }, [isActive]);

  return (
    <div
      ref={contentRef}
      tabIndex={-1}  // Focusable but not in tab order
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`}>{title}</h2>
    </div>
  );
}
```

---

## Form Accessibility

### Required Elements

```tsx
// CORRECT - Label associated with input
<div>
  <label htmlFor="email">Email address</label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
  />
</div>

// CORRECT - Error state with description
<div>
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    aria-invalid={hasError}
    aria-describedby={hasError ? "password-error" : undefined}
  />
  {hasError && (
    <p id="password-error" role="alert">
      Password must be at least 8 characters
    </p>
  )}
</div>
```

### Form Validation Pattern

```tsx
// widgets/content/Form/index.tsx
function Form({ fields, onSubmit }: FormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Error summary for screen readers */}
      {Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="assertive">
          <h3>Please fix the following errors:</h3>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fields.map((field) => (
        <FormField
          key={field.id}
          {...field}
          error={errors[field.id]}
        />
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Motion Accessibility

### prefers-reduced-motion Integration

The `prefersReducedMotion` trigger monitors the user's system preference and updates the experience store. Behaviours must check this value and return static values when true.

**See:** [Trigger Spec - Accessibility Section](../components/experience/trigger.spec.md#accessibility) for the `usePrefersReducedMotion` hook implementation.

**See:** [Behaviour Spec - Accessibility Section](../components/experience/behaviour.spec.md#accessibility) for the reduced motion fallback pattern.

### Behaviour Implementation Pattern

```typescript
// behaviours/parallax/index.ts
const parallax: Behaviour = {
  id: 'parallax',
  requires: ['scrollProgress', 'prefersReducedMotion'],

  compute: (state, options) => {
    // Always check reduced motion first
    if (state.prefersReducedMotion) {
      return {
        '--parallax-y': 0,
        '--parallax-scale': 1,
        '--parallax-opacity': 1
      };
    }

    // Normal parallax calculations
    const depth = options?.depth ?? 0.5;
    return {
      '--parallax-y': state.scrollProgress * depth * 100,
      '--parallax-scale': 1 + (state.scrollProgress * 0.1),
      '--parallax-opacity': 1 - (state.scrollProgress * 0.3)
    };
  },

  cssTemplate: `
    transform: translateY(calc(var(--parallax-y, 0) * 1px))
               scale(var(--parallax-scale, 1));
    opacity: var(--parallax-opacity, 1);
    will-change: transform, opacity;
  `
};
```

### CSS-Only Reduced Motion

For simple animations not controlled by behaviours:

```css
/* Base animation */
.widget-entrance {
  animation: fadeSlideUp 0.5s ease-out;
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  .widget-entrance {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

---

## Testing

### Tools

| Tool | Use |
|------|-----|
| axe-core / jest-axe | WCAG violations in unit tests |
| Lighthouse / Pa11y | CI/CD audits |
| NVDA (Win) / VoiceOver (Mac) | Screen reader testing |
| Colorblindly extension | Color blindness simulation |

### Manual Checks

Tab through page (keyboard only), test at 200% zoom, enable reduced motion in OS, verify high contrast mode.

### Testing Template

```typescript
// widgets/content/Button/index.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import { Button } from './index';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Button onClick={() => {}}>Click me</Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible', () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={onClick}>Click me</Button>
    );

    const button = getByRole('button');
    button.focus();
    expect(document.activeElement).toBe(button);

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onClick).toHaveBeenCalled();
  });

  it('has visible focus indicator', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole('button');
    button.focus();
    expect(button).toHaveClass('focus-visible:ring-2');
  });
});
```

### Definition of Done

A component is accessible when:

- [ ] All axe-core tests pass
- [ ] Keyboard navigable (Tab, Enter, Escape)
- [ ] Screen reader announces correctly
- [ ] Color contrast meets WCAG AA
- [ ] Works at 200% zoom
- [ ] Respects reduced motion preference
- [ ] Focus visible on all interactive elements

---

## Anti-Patterns

### Don't: Remove focus outlines

```tsx
// WRONG - Removes accessibility feature
button:focus {
  outline: none;
}

// CORRECT - Custom visible focus style
button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

**Why:** Users who navigate with keyboard cannot see where focus is.

### Don't: Use tabindex > 0

```tsx
// WRONG - Disrupts natural tab order
<button tabIndex={5}>Fifth</button>
<button tabIndex={1}>First</button>

// CORRECT - Use 0 or -1 only
<button tabIndex={0}>In tab order</button>
<button tabIndex={-1}>Focusable via JS only</button>
```

**Why:** Positive tabindex creates unpredictable navigation.

### Don't: Nest interactive elements

```tsx
// WRONG - Button inside link
<a href="/page">
  <button onClick={handleClick}>Action</button>
</a>

// CORRECT - Separate elements
<a href="/page">View Page</a>
<button onClick={handleClick}>Action</button>
```

**Why:** Screen readers cannot parse nested interactive elements.

### Don't: Use ARIA when HTML works

```tsx
// WRONG - ARIA where HTML suffices
<div role="button" tabIndex={0} onClick={onClick}>
  Click me
</div>

// CORRECT - Native element
<button onClick={onClick}>
  Click me
</button>
```

**Why:** Native elements have built-in keyboard support and semantics.

### Don't: Hide content inconsistently

```tsx
// WRONG - Visually hidden but in DOM
<div style={{ opacity: 0 }}>Hidden content</div>

// CORRECT - Properly hidden from all users
<div hidden>Hidden from everyone</div>

// CORRECT - Visually hidden but available to screen readers
<span className="sr-only">Screen reader only</span>
```

**Why:** Content state must be consistent for all users.

---

## Templates

### Accessible Widget Template

```tsx
// widgets/content/{Name}/index.tsx
"use client";

import { forwardRef, useId } from "react";
import type { WidgetNameProps, WidgetNameHandle } from "./types";

const WidgetName = forwardRef<WidgetNameHandle, WidgetNameProps>(
  function WidgetName({ items, label, ...props }, ref) {
    const id = useId();
    const labelId = `${id}-label`;

    return (
      <div
        role="region"
        aria-labelledby={labelId}
        className="widget-name"
      >
        <h2 id={labelId} className="sr-only">
          {label}
        </h2>

        <ul role="list">
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                aria-label={`${item.title}: ${item.description}`}
                onClick={() => handleSelect(item)}
              >
                <img
                  src={item.image}
                  alt=""  // Decorative, text in aria-label
                  aria-hidden="true"
                />
                <span>{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

export default WidgetName;
```

### Accessible Chrome Template

```tsx
// chrome/Chrome.tsx
import { Header } from "./regions/Header";
import { Footer } from "./regions/Footer";
import type { ChromeProps } from "./types";

export function Chrome({ children }: ChromeProps) {
  return (
    <>
      {/* Skip link - first focusable element */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded focus:ring-2 focus:ring-focus"
      >
        Skip to main content
      </a>

      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="focus:outline-none"
      >
        {children}
      </main>

      <Footer />

      {/* Live region for dynamic announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="announcements"
      />
    </>
  );
}
```

---

## See Also

- [Trigger Spec](../components/experience/trigger.spec.md) - `usePrefersReducedMotion` implementation
- [Behaviour Spec](../components/experience/behaviour.spec.md) - Reduced motion fallback pattern
- [Tech Stack](./tech-stack.spec.md) - Styling guidelines for focus states
- [Naming Conventions](./naming.spec.md) - ARIA attribute naming
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - External reference
