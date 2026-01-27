# Feature List Item Widget

## Overview
Individual feature row within a pricing card, displaying a status icon and feature text. Three states indicate included, add-on, or excluded features.

## Mobile Layout (375px)

### Dimensions
- **Height**: Auto (~32px with padding)
- **Width**: 100%
- **Padding**: 4px 0

### Structure
```
[Feature Item Container - flex row]
  [Status Icon - checkmark/plus/minus]
  [Feature Text]
```

## Visual Treatment

### Container
- **Display**: Flex
- **Align-items**: Center
- **Gap**: 12px

### Status Icon

#### Included (Checkmark)
- **Symbol**: Checkmark (Unicode: U+2713 or custom SVG)
- **Color**: Dark gray/black (#333333)
- **Size**: 16px

#### Add-on (Plus)
- **Symbol**: Plus sign (+)
- **Color**: Medium gray (#666666)
- **Size**: 16px

#### Excluded (Minus)
- **Symbol**: Minus/dash (-)
- **Color**: Light gray (#AAAAAA)
- **Size**: 16px

### Feature Text

#### Typography
- **Font-family**: Sans-serif
- **Font-size**: 14px
- **Line-height**: 1.4

#### Color by Status
| Status | Text Color | Opacity |
|--------|------------|---------|
| Included | Dark gray (#333) | 1.0 |
| Add-on | Medium gray (#666) | 0.9 |
| Excluded | Light gray (#AAA) | 0.6 |

## Props Schema
```typescript
interface FeatureListItemProps {
  text: string;
  status: 'included' | 'addon' | 'excluded';
  icon?: React.ReactNode;  // Custom icon override
}
```

## Status Definitions

| Status | Meaning | Icon | Example |
|--------|---------|------|---------|
| included | Feature is part of this tier | Check | "Fri adgang 24/7" |
| addon | Available for additional cost | Plus | "Tilkob kaffe" |
| excluded | Not available in this tier | Minus | "Egen fast plads" |

## Feature Text Examples (Danish)

- Fri adgang 24/7 (24/7 access)
- Egen nogle (Own key)
- Wi-Fi (1000 Mbit)
- Printer & scanner
- Bord & stol (Desk & chair)
- Modelokale (Meeting room)
- Egen fast plads (Own fixed spot)
- Reol plads (Shelf space)
- Tilkob kaffe (Add coffee)

## Accessibility
- Uses semantic list item (li) element
- Icon has aria-hidden="true" with status in sr-only text
- Sufficient color contrast for all states
- Status communicated through text, not just color

### Screen Reader Example
```html
<li>
  <span aria-hidden="true">✓</span>
  <span class="sr-only">Included:</span>
  <span>Fri adgang 24/7</span>
</li>
```

## Responsive Notes
- Layout remains consistent across breakpoints
- Font size may increase slightly on larger screens
- Icon size scales proportionally

## Related Components
- `widget/pricing-card.md` - Parent card container
- `section/pricing.md` - Full pricing section context

---

## Tablet (768px)

### Changes from Mobile
- **Font-size**: Same 14px (no change)
- **Icon size**: Same 16px
- **Gap**: Same 12px between icon and text

### Visual Differences
- No significant changes at tablet
- Layout remains consistent across breakpoints
- Status colors and styles unchanged

---

## Desktop (1440px)

### Changes from Tablet
- **Font-size**: ~14-15px (slight increase possible)
- **Icon size**: Same ~16px
- **Gap**: Same 12px between icon and text

### Visual Differences
- No significant changes at desktop
- Layout remains consistent across all breakpoints
- Status icons clearly visible:
  - ✓ Checkmark for included (dark gray)
  - ÷ Minus for excluded (light gray)
  - + Plus for add-ons (medium gray)
- Text colors maintain same hierarchy by status
