# About Section

## Overview
Introduction section with Danish text describing the coworking space philosophy, followed by a staggered photo gallery showcasing the community and workspace.

## Mobile Layout (375px)

### Dimensions
- **Width**: 100%
- **Padding**: 24px horizontal
- **Margin-top**: ~40px after hero

### Structure
```
[About Container]
  [Text Block with Corner Brackets]
    [Paragraph - introduction text]
  [Photo Gallery - staggered layout]
    [Image 1 - left aligned, ~80% width]
    [Image 2 - right aligned, ~70% width]
    [Image 3 - left aligned, ~75% width]
    [Image 4 - right aligned, ~65% width]
    ... repeating pattern
```

## Visual Treatment

### Text Block
- **Background**: Light gray (#F5F5F5 approximately)
- **Padding**: ~24px
- **Decorative corners**: L-shaped bracket marks at corners
  - Top-left and bottom-right corners have subtle bracket decoration
  - Creates "quoted" or "highlighted" feel

### Typography
- **Font-family**: Serif or elegant sans-serif
- **Font-size**: ~16px
- **Line-height**: 1.6
- **Color**: Dark gray/black (#1A1A1A)
- **Text-align**: Left, justified appearance

### Content (Danish)
"Port12 er et kontorfaellesskab, men vi er sgu mere faellesskab end vi er kontor. Godt nok sidder vi meget pa vores flade og hakker i tastaturerne, men vi gar mere op i at spille hinanden gode ved at dele: viden, erfaring, opgaver og inspiration. Det er den energi, du tapper ind i hos Port12 i Ry. Kom forbi og smag kaffen!"

Translation: "Port12 is a coworking space, but we're damn well more community than office. Sure, we sit a lot at our desks typing away, but we care more about helping each other by sharing: knowledge, experience, tasks and inspiration. That's the energy you tap into at Port12 in Ry. Come by and taste the coffee!"

## Photo Gallery

### Layout Pattern
Images alternate left and right alignment with varying widths:
- Creates visual rhythm and movement
- Avoids monotonous grid layout
- Images slightly overlap vertical space

### Image Specifications
| Position | Alignment | Width | Content |
|----------|-----------|-------|---------|
| 1 | Right | ~75% | People making pasta |
| 2 | Left | ~80% | Community event/gathering |
| 3 | Right | ~70% | Workspace with desk |
| 4 | Left | ~75% | People in kitchen area |

### Image Styling
- **Border-radius**: 0 (sharp corners)
- **Object-fit**: cover
- **Aspect-ratio**: Varies (roughly 4:3 to 3:2)
- **Gap between images**: ~24px vertical

## Props Schema
```typescript
interface AboutProps {
  heading?: string;              // Optional section heading
  content: string;               // Main paragraph text
  images: {
    src: string;
    alt: string;
    alignment: 'left' | 'right';
    width?: string;              // e.g., "75%"
  }[];
}
```

## Interaction States
- Static content, no interactive elements
- Images may have subtle reveal animation on scroll (see behaviour)

## Accessibility
- Images have descriptive alt text ("Port12 medlemmer", "Port12 faellesskab event")
- Text has sufficient contrast
- Semantic paragraph structure

## Responsive Notes
- Text block maintains readable line length
- Images may become full-width on smallest screens
- Stagger pattern adjusts for wider viewports

## Related Components
- `widget/text-block-bracketed.md` - Text with corner decorations
- `layout-widget/staggered-gallery.md` - Alternating image layout

---

## Tablet (768px)

### Changes from Mobile
- **Layout**: Same single-column staggered layout maintained
- **Text block**: Wider, improved line length for readability
- **Gallery**: Same alternating left/right pattern
- **Spacing**: Slightly increased horizontal padding

### Dimensions
- **Width**: 100%
- **Padding**: 32px horizontal (increased from 24px)
- **Margin-top**: ~48px after hero

### Visual Differences
- Text block has more comfortable line length (~60-70 characters)
- Images have more horizontal space but maintain stagger pattern
- Corner brackets on text block remain same size
- No layout switch to 2-column grid yet (stays single column)

### Gallery at Tablet
| Position | Alignment | Width |
|----------|-----------|-------|
| 1 | Right | ~70% |
| 2 | Left | ~75% |
| 3 | Right | ~65% |
| 4 | Left | ~70% |

Images maintain staggered single-column layout at tablet width.

---

## Desktop (1440px)

### Changes from Tablet
- **Layout**: Same single-column staggered layout maintained (no 2-column grid)
- **Text block**: Max-width constrained for optimal line length (~65-75 characters)
- **Gallery**: Same alternating left/right pattern with more horizontal space
- **Spacing**: Increased horizontal padding and margins

### Dimensions
- **Width**: 100%
- **Padding**: 48px horizontal (increased from 32px)
- **Margin-top**: ~64px after hero
- **Max-width**: Content constrained within ~800px centered container

### Text Block at Desktop
- **Width**: ~600px max for optimal reading
- **Padding**: 32px internal
- **Background**: Same light gray (#F3F2EF)
- **Corner brackets**: Same 16px size, positioned at corners
- **Typography**: 16-17px font, 1.6 line-height

### Gallery at Desktop
| Position | Alignment | Width |
|----------|-----------|-------|
| 1 | Right | ~65% |
| 2 | Left | ~70% |
| 3 | Right | ~60% |
| 4 | Left | ~65% |

### Visual Differences
- More generous whitespace around all elements
- Images have more breathing room in stagger pattern
- Text block centered with comfortable margins
- Gallery images appear smaller percentage-wise but larger in absolute pixels
- Scroll progress bar visible on right edge throughout

### Image Content Observed
1. People making pasta with pasta machine
2. Community event/gathering with bunting decorations
3. Overhead workspace shot (keyboard, monitor, coffee, papers)
4. People sitting at table in workspace
