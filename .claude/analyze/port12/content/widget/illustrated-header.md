# Illustrated Header Widget

## Overview
Hand-drawn sketch illustration used as decorative headers for pricing cards and the contact section. Creates a warm, personal, artisanal feel.

## Mobile Layout (375px)

### Dimensions
- **Width**: Auto (content-based)
- **Height**: 120-150px
- **Max-width**: 280px
- **Position**: Centered

### Structure
```
[Illustration Container]
  [SVG or Image - hand-drawn style]
```

## Visual Treatment

### Style
- **Type**: Hand-drawn/sketch illustration
- **Line style**: Loose, organic lines
- **Color**: Grayscale with subtle warm tones
- **Background**: Transparent

### Illustration Variants

#### FLEX Card
- **Content**: Three people working at a shared table
- **Elements**: Laptops, coffee cups, casual interaction
- **Mood**: Collaborative, flexible

#### ALL-IN Card
- **Content**: Single person at dedicated workspace
- **Elements**: Desktop monitor, desk lamp, plants, shelf
- **Mood**: Professional, established

#### Contact Section
- **Content**: Envelope with speech bubble
- **Elements**: Letter, "..." in bubble
- **Mood**: Inviting, conversational

### Color Palette
- **Primary lines**: Dark gray (#444444)
- **Fills**: Light gray wash (#E5E5E5)
- **Accents**: Subtle warm tones (optional)

## Props Schema
```typescript
interface IllustratedHeaderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}
```

## Illustration Specifications

### File Format
- **Preferred**: SVG (scalable, small file size)
- **Alternative**: PNG with transparency

### Dimensions
- **Aspect ratio**: Varies by illustration
- **Minimum width**: 200px
- **Recommended**: 400px+ for retina

### Optimization
- SVG paths simplified
- No excessive detail that won't render at small sizes
- Consistent stroke width (2-3px at intended size)

## Accessibility
- Decorative illustrations have empty alt or aria-hidden
- If conveying meaning, descriptive alt text provided
- Not essential for understanding content

## Responsive Notes
- Scales proportionally with container
- May reduce height on very small screens
- Quality maintained at all sizes (vector)

## Related Components
- `widget/pricing-card.md` - Cards using illustrations
- `section/contact.md` - Contact section illustration
- `section/pricing.md` - Overall pricing section

---

## Tablet (768px)

### Changes from Mobile
- **Height**: ~160-180px (increased from 120-150px)
- **Max-width**: ~350px (increased from 280px)

### Visual Differences
- Illustrations have more room to display detail
- Hand-drawn style remains consistent
- Proportional scaling maintains aspect ratio
- Same grayscale color palette

---

## Desktop (1440px)

### Changes from Tablet
- **Height**: ~200px (increased from ~160-180px)
- **Max-width**: ~400px (increased from ~350px)

### Dimensions
- **Height**: ~200px
- **Max-width**: ~400px
- **Position**: Centered above card/section content

### Visual Differences
- Illustrations display at larger size with more detail visible
- Hand-drawn sketch style remains consistent
- Grayscale color palette maintained
- Proportional scaling preserves aspect ratio

### Illustration Variants at Desktop
- **FLEX Card**: Three people at shared table, more detail visible
- **ALL-IN Card**: Person at dedicated workspace with monitor, lamp, shelves
- **Contact Section**: Envelope with speech bubble "..." (~120px at contact)
