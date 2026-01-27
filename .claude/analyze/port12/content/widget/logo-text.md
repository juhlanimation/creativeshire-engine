# Logo Text Widget

## Overview
The PORT12 brand text used throughout the site in various contexts: hero (masked), sticky header, and footer.

## Mobile Layout (375px)

### Variants

#### Hero (Masked)
- **Font-size**: ~80px
- **Effect**: Text acts as clipping mask for background
- **Color**: Transparent fill, light blue outline

#### Sticky Header
- **Font-size**: ~24px
- **Color**: Black (#1A1A1A)
- **Background**: None

#### Footer
- **Font-size**: ~28px
- **Color**: White (#FFFFFF)
- **Background**: Dark

### Structure
```
[Logo Container]
  [Text "PORT12"]
```

## Visual Treatment

### Typography
- **Font-family**: Bold condensed sans-serif
- **Font-weight**: 800-900 (extra bold)
- **Text-transform**: UPPERCASE
- **Letter-spacing**: -0.02em (tight)
- **Line-height**: 1.0

### Color Variants
| Context | Fill Color | Outline |
|---------|------------|---------|
| Hero | Transparent (mask) | Light blue (#A8C8E8) |
| Header | Black (#1A1A1A) | None |
| Footer | White (#FFFFFF) | None |

## Mask Effect (Hero Variant)

### Implementation
- Text uses `background-clip: text`
- Background image shows through text letterforms
- Outline created with `-webkit-text-stroke` or similar

### CSS Concept
```css
.logo-masked {
  background-image: url('slideshow-image.jpg');
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-stroke: 2px #A8C8E8;
}
```

## Props Schema
```typescript
interface LogoTextProps {
  variant: 'hero' | 'header' | 'footer';
  text?: string;              // Default: "PORT12"
  link?: string;              // Optional click target
  maskImage?: string;         // For hero variant
}
```

## Interaction States

### Clickable Variants (Header, Footer)
- **Default**: Static appearance
- **Hover**: Slight opacity change or underline
- **Active**: Opacity reduction
- **Click**: Navigate to top of page

### Hero Variant
- Not clickable
- Background image animates independently

## Accessibility
- When clickable, wrapped in proper link element
- Alt text or aria-label for branding context
- Sufficient contrast in all variants

## Responsive Notes
- Font size scales with viewport
- Hero variant may use vw units for sizing
- Header/footer sizes remain relatively fixed

## Related Components
- `section/hero.md` - Hero context with mask effect
- `chrome/sticky-header.md` - Header context
- `chrome/footer.md` - Footer context

---

## Tablet (768px)

### Changes from Mobile

#### Hero (Masked)
- **Font-size**: ~100-120px (increased from ~80px)
- **Effect**: Same clipping mask for background
- Scales with viewport width using vw units

#### Sticky Header
- **Font-size**: ~28px (slight increase from ~24px)
- **Color**: Same black (#1A1A1A)

#### Footer
- **Font-size**: ~32px (slight increase from ~28px)
- **Color**: Same white (#FFFFFF)

### Visual Differences
- Hero logo more prominent and impactful
- Header/footer logos slightly larger for better proportions

---

## Desktop (1440px)

### Changes from Tablet

#### Hero (Masked)
- **Font-size**: ~140-160px (significantly increased from ~100-120px)
- **Effect**: Same clipping mask for background slideshow
- Scales dramatically with viewport width using vw units
- Light blue outline stroke (~2-3px) more visible at scale

#### Sticky Header
- **Font-size**: ~32px (increased from ~28px)
- **Color**: Black (#1A1A1A)
- **Position**: Fixed top-left with 24px padding

#### Footer
- **Font-size**: ~36px (increased from ~32px)
- **Color**: White (#FFFFFF)
- **Position**: Centered in footer section

### Visual Differences
- Hero logo creates dramatic visual impact, filling significant viewport width
- Image clipping effect more striking at larger scale
- Sticky header logo proportionally sized for desktop navigation
- Footer logo maintains brand consistency at larger size
