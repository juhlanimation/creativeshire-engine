# Pricing Section

## Overview
Membership pricing display with two tiers (FLEX and ALL-IN), each featuring illustrated headers, pricing, descriptions, and feature lists with visual status indicators.

## Mobile Layout (375px)

### Dimensions
- **Width**: 100%
- **Padding**: 24px horizontal
- **Background**: Light gray (#F0F0F0 approximately)

### Structure
```
[Pricing Container]
  [Pricing Card - FLEX]
    [Illustration]
    [Title "FLEX"]
    [Price "1.300 DKK"]
    [Price Subtitle "ex moms / maned"]
    [Description]
    [Feature List]
  [Pricing Card - ALL-IN]
    [Illustration]
    [Title "ALL-IN"]
    [Price "2.000 DKK"]
    [Price Subtitle "ex moms / maned"]
    [Description]
    [Feature List]
```

## Visual Treatment

### Background
- **Color**: Light warm gray (#EDEBE8 approximately)
- **Pattern**: Subtle illustrated elements in background (faded)

### Pricing Card

#### Illustration
- **Style**: Hand-drawn/sketch illustration
- **Content**: People working at desks/tables
- **Size**: ~150px height
- **Position**: Centered above title
- **Colors**: Grayscale with subtle hints

#### Title
- **Font-family**: Bold sans-serif
- **Font-size**: ~36px
- **Color**: Black (#1A1A1A)
- **Text-transform**: UPPERCASE
- **Text-align**: Center

#### Price
- **Font-family**: Bold sans-serif
- **Font-size**: ~24px
- **Color**: Black
- **Format**: "X.XXX DKK"
- **Text-align**: Center

#### Price Subtitle
- **Text**: "ex moms / maned" (ex VAT / month)
- **Font-size**: ~12px
- **Color**: Gray (#666)
- **Text-transform**: UPPERCASE
- **Letter-spacing**: Wide
- **Text-align**: Center

#### Description
- **Font-size**: ~14px
- **Color**: Dark gray (#444)
- **Text-align**: Center
- **Max-width**: ~280px
- **Margin**: 16px auto

### Feature List
Vertical list with status icons:

#### Icon Types
| Icon | Meaning | Visual |
|------|---------|--------|
| Checkmark | Included | Dark checkmark |
| Plus | Add-on available | Plus symbol |
| Minus | Not included | Minus/dash |

#### List Item Styling
- **Font-size**: ~14px
- **Color**: Dark gray
- **Line-height**: 2.0 (generous spacing)
- **Icon gap**: 12px from text
- **Text-align**: Left (with centered list block)

## Pricing Tiers Data

### FLEX - 1,300 DKK/month
Features:
- [check] Fri adgang 24/7 (24/7 access)
- [check] Egen nogle (Own key)
- [check] Wi-Fi (1000 Mbit)
- [check] Printer & scanner
- [check] Bord & stol (Desk & chair)
- [check] Modelokale (Meeting room)
- [minus] Egen fast plads (Own fixed spot)
- [minus] Reol plads (Shelf space)
- [plus] Tilkob kaffe (Add coffee)

### ALL-IN - 2,000 DKK/month
Features:
- [check] Fri adgang 24/7
- [check] Egen nogle
- [check] Wi-Fi (1000 Mbit)
- [check] Printer & scanner
- [check] Bord & stol
- [check] Modelokale
- [check] Egen fast plads
- [check] Reol plads
- [plus] Tilkob kaffe

## Props Schema
```typescript
interface PricingFeature {
  text: string;
  status: 'included' | 'addon' | 'excluded';
}

interface PricingTier {
  illustration: {
    src: string;
    alt: string;
  };
  title: string;
  price: string;
  priceSubtitle: string;
  description: string;
  features: PricingFeature[];
}

interface PricingProps {
  tiers: PricingTier[];
  backgroundIllustration?: string;
}
```

## Interaction States
- Static display, no interactive elements on cards
- Possible hover highlight on desktop
- CTA button may be present (not visible in current analysis)

## Accessibility
- Semantic list structure for features
- Icons have appropriate aria-labels
- Price information clearly formatted
- High contrast text

## Responsive Notes
- Cards stack vertically on mobile
- May display side-by-side on tablet/desktop
- Illustrations scale proportionally
- Feature lists maintain readability

## Related Components
- `widget/pricing-card.md` - Individual pricing tier card
- `widget/feature-list-item.md` - Feature with status icon
- `widget/illustrated-header.md` - Hand-drawn illustration component

---

## Tablet (768px)

### Changes from Mobile
- **Layout**: Cards still stack vertically (not side-by-side yet)
- **Card width**: Wider cards with more horizontal space
- **Illustrations**: Scale proportionally, more detail visible
- **Feature lists**: Same layout, slightly more spacing

### Dimensions
- **Width**: 100%
- **Padding**: 32px horizontal
- **Background**: Same light gray (#EDEBE8)

### Visual Differences
- Pricing cards have more breathing room
- Illustrations (~180px height vs 150px on mobile)
- Feature list text may be slightly larger (~15px)
- Cards still centered with max-width constraint
- No 2-column layout at 768px (likely switches at ~900px+)

### Card Layout
- FLEX card appears first (top)
- ALL-IN card appears second (below)
- Both cards stacked vertically with ~48px gap between

---

## Desktop (1440px)

### Changes from Tablet
- **Layout**: Cards STILL stack vertically (single column, not side-by-side)
- **Card width**: Constrained to ~450-500px max-width, centered
- **Spacing**: Increased padding and gaps
- **Illustrations**: Scale larger (~200px height)

### Dimensions
- **Width**: 100%
- **Padding**: 64px horizontal
- **Background**: Same light warm gray (#EDEBE8)
- **Card max-width**: ~450-500px (centered)
- **Gap between cards**: ~64px

### Visual Differences
- Cards have generous whitespace around them
- Illustrations more detailed at larger size
- Feature lists have comfortable reading width
- Same vertical stacking layout (design choice, not responsive limitation)
- Light gray background with subtle illustrated elements

### Card Layout at Desktop
```
[Pricing Container - centered, max-width ~800px]
  [FLEX Card - centered, max-width ~450px]
    [Illustration ~200px]
    [Title "FLEX"]
    [Price "1.300 DKK"]
    [Subtitle "EX MOMS / MANED"]
    [Description]
    [Feature List]
  [Gap ~64px]
  [ALL-IN Card - centered, max-width ~450px]
    [Illustration ~200px]
    [Title "ALL-IN"]
    [Price "2.000 DKK"]
    [Subtitle "EX MOMS / MANED"]
    [Description]
    [Feature List]
```

### Typography at Desktop
- Card title: ~40px (bold sans-serif, uppercase)
- Price: ~28px (bold)
- Subtitle: ~12px (uppercase, wide letter-spacing)
- Description: ~15px (serif or elegant sans)
- Feature list: ~14px

### Feature List Icons (Observed)
- ✓ Checkmark: Included features (dark gray)
- ÷ Divide/minus: Excluded features (light gray)
- + Plus: Add-on options (medium gray)

### FLEX Card Features
- ✓ FRI ADGANG 24/7
- ✓ EGEN NOGLE
- ✓ WI-FI (1000 MBIT)
- ✓ PRINTER & SCANNER
- ✓ BORD & STOL
- ✓ MODELOKALE
- ÷ EGEN FAST PLADS
- ÷ REOL PLADS
- + TILKOB KAFFE

### ALL-IN Card Features
- ✓ FRI ADGANG 24/7
- ✓ EGEN NOGLE
- ✓ WI-FI (1000 MBIT)
- ✓ PRINTER & SCANNER
- ✓ BORD & STOL
- ✓ MODELOKALE
- ✓ EGEN FAST PLADS
- ✓ REOL PLADS
- + TILKOB KAFFE
