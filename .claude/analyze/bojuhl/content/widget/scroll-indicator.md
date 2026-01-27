# Scroll Indicator Widget

**Purpose:** Visual prompt encouraging users to scroll down
**Type:** widget
**Visible:** mobile, tablet, desktop

## Layout (Observed Defaults)

### Mobile (375px)
- Position: Centered horizontally at bottom of hero
- Distance from bottom: Variable based on content

## Visual Treatment (Observed Defaults)

### Typography
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 14px
- Font-weight: 700
- Letter-spacing: 1.4px
- Color: rgb(255, 255, 255) (white)
- Text: "(SCROLL)"

### Special Effect
- mix-blend-mode: difference
- Matches hero title blend effect for consistency

## Props / Data Schema

```typescript
interface ScrollIndicatorProps {
  // Content
  text?: string;                  // default: "(SCROLL)"

  // Styling
  fontSize?: string;              // default: "14px"
  fontWeight?: number;            // default: 700
  letterSpacing?: string;         // default: "1.4px"
  color?: string;                 // default: "white"

  // Effect
  useBlendMode?: boolean;         // default: true
  animated?: boolean;             // default: true (subtle animation)
}
```

## Interaction States

- Default: Visible with optional subtle animation
- After scroll: May fade out or remain visible
- Tap/Click: May smooth scroll to next section

## Behaviours

- **scroll-indicator**: Subtle bounce/pulse animation to draw attention

## Animation (Optional)

```css
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
```

## Accessibility

- Role: Decorative/presentational
- ARIA: Can be aria-hidden if purely decorative
- Function: Visual affordance, not required for navigation

---

### Tablet (768px+)

- Same styling as mobile (14px, 700 weight, 1.4px letter-spacing)
- Position: Centered at bottom of hero
- mix-blend-mode: difference (same effect)
- No significant changes from mobile layout

---

### Desktop (1024px+)

- Same styling as tablet (14px, 700 weight, 1.4px letter-spacing)
- Position: Centered at bottom of hero
- mix-blend-mode: difference (consistent effect)

#### Changes from Tablet
- No typography changes
- Same centered positioning
- Same blend mode effect
- Component remains consistent across all breakpoints
