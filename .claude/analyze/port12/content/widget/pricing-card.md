# Pricing Card Widget

## Overview
Self-contained pricing tier display with illustration, title, price, description, and feature list. Used to present membership options.

## Mobile Layout (375px)

### Dimensions
- **Width**: 100%
- **Max-width**: 320px
- **Padding**: 24px
- **Margin**: 0 auto (centered)
- **Background**: Transparent (inherits section background)

### Structure
```
[Pricing Card Container]
  [Illustration - centered]
  [Title - e.g., "FLEX"]
  [Price - e.g., "1.300 DKK"]
  [Price Subtitle - "ex moms / maned"]
  [Description - brief text]
  [Feature List]
    [Feature Item] x N
```

## Visual Treatment

### Illustration
- **Type**: Hand-drawn sketch style
- **Size**: ~120-150px height
- **Position**: Centered, top of card
- **Content**: People working at desks
- **Color**: Grayscale with subtle tones
- **Margin-bottom**: 16px

### Title
- **Font-family**: Bold sans-serif
- **Font-size**: 32-36px
- **Font-weight**: 800
- **Color**: Black (#1A1A1A)
- **Text-transform**: UPPERCASE
- **Text-align**: Center
- **Margin-bottom**: 8px

### Price
- **Font-family**: Bold sans-serif
- **Font-size**: 24px
- **Font-weight**: 700
- **Color**: Black (#1A1A1A)
- **Text-align**: Center
- **Format**: "X.XXX DKK" (Danish Krone)

### Price Subtitle
- **Font-size**: 11-12px
- **Font-weight**: 400
- **Color**: Gray (#666666)
- **Text-transform**: UPPERCASE
- **Letter-spacing**: 0.15em
- **Text-align**: Center
- **Margin-bottom**: 16px

### Description
- **Font-family**: Serif or elegant sans
- **Font-size**: 14-15px
- **Color**: Dark gray (#444444)
- **Text-align**: Center
- **Line-height**: 1.5
- **Max-width**: 280px
- **Margin**: 0 auto 24px

## Feature List
See `widget/feature-list-item.md` for individual item styling.

- **Layout**: Vertical stack
- **Alignment**: Left-aligned within centered block
- **Max-width**: 240px
- **Margin**: 0 auto
- **Gap**: 8px between items

## Props Schema
```typescript
interface PricingCardProps {
  illustration: {
    src: string;
    alt: string;
  };
  title: string;
  price: string;
  priceSubtitle: string;
  description: string;
  features: {
    text: string;
    status: 'included' | 'addon' | 'excluded';
  }[];
  ctaButton?: {
    text: string;
    href: string;
  };
}
```

## Interaction States

### Card Container
- **Default**: Static
- **Hover (desktop)**: Subtle shadow or lift

### CTA Button (if present)
- **Default**: Solid fill
- **Hover**: Darker fill or outline
- **Active**: Press effect

## Accessibility
- Semantic heading for title (h3)
- Feature list uses proper ul/li structure
- Price formatted for screen readers
- High contrast text

## Responsive Notes
- Cards stack vertically on mobile
- May display side-by-side on tablet (2 columns)
- Illustration and text scale proportionally

## Related Components
- `widget/feature-list-item.md` - Individual feature row
- `widget/illustrated-header.md` - Card illustration
- `section/pricing.md` - Parent section context

---

## Tablet (768px)

### Changes from Mobile
- **Width**: 100% (still single column, not side-by-side)
- **Max-width**: ~400px (increased from 320px)
- **Padding**: 32px (increased from 24px)

### Visual Differences
- Cards have more breathing room
- Illustrations scale to ~160-180px height
- Feature list has more horizontal space
- Text sizes remain similar
- Cards still stack vertically (not 2-column yet)

---

## Desktop (1440px)

### Changes from Tablet
- **Width**: Constrained to ~450-500px max-width (centered)
- **Layout**: Still single-column vertical stack (design choice)
- **Padding**: 40px (increased from 32px)
- **Illustrations**: ~200px height

### Dimensions
- **Max-width**: ~450-500px
- **Padding**: 40px
- **Margin**: 0 auto (centered in container)
- **Background**: Transparent (inherits section background)

### Visual Differences
- Cards have generous whitespace around them
- Illustrations more detailed at ~200px height
- Feature lists have comfortable reading width
- Title, price, and features well-proportioned
- No side-by-side layout even at 1440px (intentional design)

### Typography at Desktop
- Title: ~40px (bold sans-serif, uppercase)
- Price: ~28px (bold)
- Subtitle: ~12px (uppercase, wide letter-spacing)
- Description: ~15-16px
- Feature list items: ~14-15px

### Hover States (Desktop-Specific)
- **Card hover**: Subtle shadow or lift effect possible
- **CTA button hover**: Darker fill or outline (if present)
