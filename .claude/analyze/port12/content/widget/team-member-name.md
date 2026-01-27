# Team Member Name Widget

## Overview
Large typographic display of team member names in the team section. Names have active/inactive states that control visibility and trigger background image changes.

## Mobile Layout (375px)

### Dimensions
- **Width**: 100%
- **Height**: Auto
- **Padding**: 0

### Structure
```
[Member Name Container]
  [Name Text - e.g., "RUNE SVENNINGSEN"]
```

## Visual Treatment

### Typography
- **Font-family**: Bold condensed sans-serif
- **Font-size**: Fluid, ~32-40px (fits viewport width)
- **Font-weight**: 800-900 (extra bold)
- **Text-transform**: UPPERCASE
- **Line-height**: 1.1 (very tight)
- **Letter-spacing**: -0.01em (slightly tight)
- **Word-break**: Normal (names stay on one line if possible)

### States

#### Active State
- **Color**: Dark blue (#1A365D) or Black (#1A1A1A)
- **Opacity**: 1.0
- **Transition**: color 0.2s ease

#### Inactive State
- **Color**: Light gray (#CCCCCC)
- **Opacity**: 0.5
- **Transition**: color 0.2s ease

## Props Schema
```typescript
interface TeamMemberNameProps {
  name: string;
  isActive: boolean;
  onClick?: () => void;
  onHover?: () => void;
  image: {
    src: string;
    alt: string;
  };
}
```

## Member Data

| Name | Image Type |
|------|------------|
| Rune Svenningsen | Portrait photo |
| Maria Tranberg | Portrait photo |
| Nicolaj Larsson | Illustrated artwork (purple) |
| Tor Birk Trads | Portrait or artwork |
| Bo Juhl | Portrait photo |
| Maria Kjaer | Portrait or artwork |

## Interaction States

### Mobile (Scroll-triggered)
- Names become active based on scroll position
- Only one name active at a time
- Scroll through section cycles through members

### Desktop (Hover-triggered)
- **Default**: First name active
- **Hover**: Hovered name becomes active
- **Mouse leave**: Returns to default or last hovered

### Transitions
- Color change: 0.2s ease
- Background image crossfade: 0.4s

## Accessibility
- Names are semantic headings (h2 or h3)
- Active state announced to screen readers
- Keyboard navigation cycles through names
- Background images have alt text

### ARIA Pattern
```html
<h3
  aria-selected="true"
  tabindex="0"
  role="tab"
>
  RUNE SVENNINGSEN
</h3>
```

## Responsive Notes
- Font size uses clamp() or vw units for fluid scaling
- Names may wrap on very narrow screens
- Touch targets adequate for mobile interaction

## Related Components
- `section/team.md` - Parent section with background images
- `behaviour/team-member-reveal.md` - Interaction logic

---

## Tablet (768px)

### Changes from Mobile
- **Font-size**: ~48-56px (increased from ~32-40px)
- **Line-height**: Same 1.1 (tight)
- **Letter-spacing**: Same -0.01em

### Visual Differences
- Names are significantly larger and more impactful
- Still uses fluid scaling (vw or clamp())
- All 6 names fit on single viewport height
- Active/inactive states unchanged
- Background image transitions remain same timing

---

## Desktop (1440px)

### Changes from Tablet
- **Font-size**: ~70-80px (significantly increased from ~48-56px)
- **Interaction**: HOVER-BASED (instead of scroll-based)
- **Active color**: Accent peach (#E8A87C) instead of dark blue/black
- **Opacity**: Names have transparency, background shows through

### Dimensions
- **Width**: 100%
- **Height**: Auto
- **Font-size**: ~70-80px (fluid scaling with vw)

### States at Desktop

#### Active/Hovered State
- **Color**: Accent peach/salmon (#E8A87C)
- **Opacity**: 1.0
- **Transition**: color 0.2s ease

#### Inactive State
- **Color**: Light gray (#AAAAAA)
- **Opacity**: 0.5
- **Background visible through text**
- **Transition**: color 0.2s ease

### Visual Differences
- Dramatically larger typography creates strong visual hierarchy
- Hover interaction replaces scroll-based cycling
- Accent color (peach) highlights active member
- Semi-transparent inactive names allow background to show through
- Background images (portraits/artwork) fill entire viewport behind text

### Interaction (Desktop-Specific)
- **Hover**: Moving cursor over name activates it
- **Background change**: Corresponding member image crossfades in (0.4s)
- **Cursor**: Pointer on hover
- **Multiple names**: Only one active at a time
