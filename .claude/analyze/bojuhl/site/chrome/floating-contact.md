# Floating Contact Chrome

**Purpose:** Floating contact prompt that appears on scroll (desktop) or integrates into footer (mobile)
**Type:** chrome (global)
**Visible:** mobile (integrated), tablet (floating), desktop (floating)

## Layout (Observed Defaults)

### Mobile (375px)
- **NOT FLOATING** - Position: relative (integrates into page flow)
- Display: flex
- Width: 100%
- Height: 48px
- Appears as part of navigation flow, not fixed overlay

### Tablet/Desktop (estimated)
- Position: fixed
- Bottom-right corner
- Floating overlay style
- Appears after scrolling past hero

## Visual Treatment (Observed Defaults)

### Mobile Layout
- Background: transparent (rgba(0,0,0,0))
- No border-radius
- Integrated into content flow

### Typography

#### Prompt Text ("How can I help you?")
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 18px
- Font-weight: 500
- Color: white

#### Email Text
- Text: "hello@bojuhl.com"
- Same font styling as prompt
- Clickable/copyable

## Props / Data Schema

```typescript
interface FloatingContactProps {
  // Content
  promptText: string;             // "How can I help you?"
  email: string;                  // "hello@bojuhl.com"

  // Behavior
  fixedOnDesktop?: boolean;       // default: true
  showAfterScroll?: number;       // Pixels scrolled before showing (desktop)

  // Styling
  backgroundColor?: string;       // Desktop: likely dark with opacity
  borderRadius?: string;          // Desktop: rounded corners
}
```

## Responsive Behavior

| Breakpoint | Position | Behavior |
|------------|----------|----------|
| Mobile (<768px) | relative | Part of page flow, not floating |
| Tablet (768px+) | fixed | Floats in bottom-right corner |
| Desktop (1024px+) | fixed | Floats in bottom-right corner |

## Interaction States

- Default (mobile): Visible in normal content flow
- Default (desktop): Hidden initially
- After scroll (desktop): Fades in at bottom-right
- Hover: May expand or highlight email
- Click: Opens email client or copies address

## Accessibility

- Role: navigation (contains contact action)
- ARIA: aria-label="Contact"
- Keyboard: Focusable and activatable
- Motion: Respect prefers-reduced-motion for fade animations

---

### Tablet (768px+)

#### Position Changes
| Property | Mobile | Tablet |
|----------|--------|--------|
| Position | relative (in flow) | **Fixed/absolute** |
| Location | Part of page content | **Top-right corner floating** |
| Display | flex | flex (same) |
| Visibility | Always visible | **Visible, overlays content** |

#### Behavior at Tablet
- Floats in top-right corner of viewport
- Persists while scrolling (fixed position)
- Shows "How can I help you?" text
- Email address displayed/accessible
- Semi-transparent or solid background for readability

#### Visual Treatment
- Background: Dark/semi-transparent (for contrast against light sections)
- Text: White
- Position: Fixed top-right
- Z-index: Above page content

#### Changes from Mobile
- **Major change**: From inline/relative to floating fixed position
- Now overlays page content instead of being part of flow
- Visible throughout entire scroll experience
- Acts as persistent CTA

---

### Desktop (1024px+)

#### Position
| Property | Tablet | Desktop |
|----------|--------|---------|
| Position | Fixed/absolute | Fixed/absolute (same) |
| Location | Top-right corner | Top-right corner (same) |
| Width | ~774px (full width) | Constrained width |

#### Visual Treatment
- Background: Semi-transparent dark for contrast
- Text: White, 16-18px
- "How can I help you?" prompt text
- Email address displayed

#### Behavior at Desktop
- Persists in top-right corner throughout scroll
- Remains visible over all sections (white and dark backgrounds)
- Acts as persistent contact CTA
- Hover states may reveal additional interaction

#### Changes from Tablet
- Same floating behavior
- May have slightly different padding for larger viewports
- Same visual treatment and positioning
- Consistent user experience across tablet/desktop
