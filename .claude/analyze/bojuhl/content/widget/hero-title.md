# Hero Title Widget

**Purpose:** Large display heading with blend-mode effect for dynamic backgrounds
**Type:** widget
**Visible:** mobile, tablet, desktop

## Layout (Observed Defaults)

### Mobile (375px)
- Display: block
- Stacked vertically with tight spacing
- Gap between titles: ~13px

## Visual Treatment (Observed Defaults)

### Typography
- Font-family: Inter, system-ui, sans-serif
- Font-size: 32px
- Font-weight: 900 (Black)
- Line-height: 30.4px (0.95 ratio - tighter than normal)
- Letter-spacing: 0.8px
- Color: rgb(255, 255, 255) (white)
- Text-transform: uppercase (via content)

### Special Effect
- mix-blend-mode: difference
- Creates dynamic color effect based on background
- Over light backgrounds: appears dark/inverted
- Over dark backgrounds: appears light

## Props / Data Schema

```typescript
interface HeroTitleProps {
  // Content
  text: string;                   // "EXECUTIVE PRODUCER"
  as?: 'h1' | 'h2' | 'h3';       // default: 'h1'

  // Styling
  fontSize?: string;              // default: "32px" (mobile)
  fontWeight?: number;            // default: 900
  lineHeight?: string;            // default: "30.4px"
  letterSpacing?: string;         // default: "0.8px"
  color?: string;                 // default: "white"

  // Effect
  useBlendMode?: boolean;         // default: true
  blendMode?: string;             // default: "difference"
}
```

## Responsive Behavior

| Breakpoint | Font Size | Line Height |
|------------|-----------|-------------|
| Mobile | 32px | 30.4px |
| Tablet | TBD | TBD |
| Desktop | TBD (larger) | TBD |

## Usage Example

```tsx
<HeroTitle text="EXECUTIVE PRODUCER" />
<HeroTitle text="PRODUCER" />
<HeroTitle text="EDITOR" />
```

## Accessibility

- Semantic: Uses proper heading tag (h1)
- Color contrast: High contrast white on dark (blend effect aside)
- Screen readers: Text content readable

---

### Tablet (768px+)

#### Typography Changes
| Property | Mobile | Tablet |
|----------|--------|--------|
| Font-size | 32px | **47px** |
| Line-height | 30.4px | **44.7px** |
| Letter-spacing | 0.8px | **1.18px** |
| Font-weight | 900 | 900 (same) |

#### Changes from Mobile
- Significant size increase (~47% larger)
- Maintains same 0.95 line-height ratio
- Same mix-blend-mode: difference effect
- Same stacked layout with tight spacing

---

### Desktop (1024px+)

#### Typography (estimated fluid scaling)
| Property | Tablet | Desktop |
|----------|--------|---------|
| Font-size | 47px | ~60-72px (fluid) |
| Line-height | 44.7px | ~57-68px |
| Letter-spacing | 1.18px | ~1.5-1.8px |
| Font-weight | 900 | 900 (same) |

#### Changes from Tablet
- Continues fluid scaling pattern
- Same mix-blend-mode: difference effect
- Same stacked vertical layout
- Increased visual impact at larger sizes
- No structural changes, only scale
