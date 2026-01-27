# Staggered Gallery Layout Widget

## Overview
Asymmetric image gallery layout where images alternate between left and right alignment with varying widths, creating visual rhythm and movement.

## Mobile Layout (375px)

### Dimensions
- **Width**: 100%
- **Padding**: 0 24px (horizontal only)
- **Gap**: 24px vertical between images

### Structure
```
[Gallery Container - flex column]
  [Image 1 - align-self: flex-end, width: 75%]
  [Image 2 - align-self: flex-start, width: 80%]
  [Image 3 - align-self: flex-end, width: 70%]
  [Image 4 - align-self: flex-start, width: 75%]
  ... repeating pattern
```

## Visual Treatment

### Container
- **Display**: Flex
- **Flex-direction**: Column
- **Gap**: 24px
- **Padding**: 24px 0 (vertical)

### Image Items

#### Alignment Pattern
- Odd indices (1, 3, 5...): Right-aligned (flex-end)
- Even indices (2, 4, 6...): Left-aligned (flex-start)

#### Width Variation
Images don't all have the same width:
- Range: 65% - 85% of container width
- Creates asymmetric, organic feel
- No strict pattern, visually balanced

#### Image Styling
- **Object-fit**: Cover
- **Aspect-ratio**: Varies (3:2, 4:3, 1:1)
- **Border-radius**: 0 (sharp corners)
- **Box-shadow**: None

## Props Schema
```typescript
interface GalleryImage {
  src: string;
  alt: string;
  alignment?: 'left' | 'right' | 'auto';
  width?: string;       // e.g., "75%"
  aspectRatio?: string; // e.g., "4/3"
}

interface StaggeredGalleryProps {
  images: GalleryImage[];
  gap?: string;           // Default: "24px"
  alternatePattern?: boolean; // Default: true (auto-alternate)
}
```

## Layout Algorithm

### Auto-Alternate (default)
```typescript
const getAlignment = (index: number) =>
  index % 2 === 0 ? 'right' : 'left';

const getWidth = (index: number) => {
  const widths = ['75%', '80%', '70%', '85%', '65%'];
  return widths[index % widths.length];
};
```

### Custom Pattern
Allow explicit alignment and width per image for fine-tuned control.

## Animation (Behaviour Reference)

### Scroll Reveal
- Images fade in as they enter viewport
- Staggered timing (each image slightly delayed)
- Duration: 0.5s per image
- Trigger: 20% of image visible

## Accessibility
- Images have descriptive alt text
- No essential content in images (decorative showcase)
- Layout doesn't rely on visual position for meaning

## Responsive Notes

### Mobile (375px)
- Single column, staggered widths
- Maximum visual impact in vertical scroll

### Tablet (768px+)
- May switch to 2-column masonry
- Or maintain staggered single column

### Desktop (1200px+)
- May use 2-3 column masonry layout
- Stagger effect less pronounced

## Example Usage
```tsx
<StaggeredGallery
  images={[
    { src: '/pasta.jpg', alt: 'People making pasta', width: '75%' },
    { src: '/event.jpg', alt: 'Community gathering', width: '80%' },
    { src: '/workspace.jpg', alt: 'Modern desk setup', width: '70%' },
    { src: '/kitchen.jpg', alt: 'Shared kitchen area', width: '75%' },
  ]}
  gap="24px"
/>
```

## Related Components
- `section/about.md` - Parent section using this layout
- `behaviour/scroll-reveal.md` - Image reveal animation

---

## Tablet (768px)

### Changes from Mobile
- **Layout**: Same single-column staggered pattern maintained
- **Gap**: Same 24px vertical between images
- **Padding**: 0 32px (increased from 0 24px)

### Visual Differences
- Images have slightly more horizontal space
- Width percentages remain similar (65-85%)
- Alignment pattern unchanged (alternating left/right)
- No transition to masonry grid yet (stays single column)

### Image Sizing at Tablet
| Position | Alignment | Width |
|----------|-----------|-------|
| 1 | Right | ~70% |
| 2 | Left | ~75% |
| 3 | Right | ~65% |
| 4 | Left | ~70% |

Images scale proportionally with container width.

---

## Desktop (1440px)

### Changes from Tablet
- **Layout**: Same single-column staggered pattern maintained (no masonry)
- **Gap**: ~32px vertical between images (increased from 24px)
- **Padding**: 0 48px (increased from 0 32px)
- **Image widths**: Smaller percentages but larger absolute pixels

### Dimensions
- **Width**: 100%
- **Padding**: 0 48px horizontal
- **Gap**: ~32px vertical
- **Container max-width**: Content constrained within ~1000px

### Visual Differences
- More generous whitespace around images
- Stagger pattern continues with alternating left/right alignment
- Images appear more refined with extra breathing room
- Gallery integrated smoothly with text block above

### Image Sizing at Desktop
| Position | Alignment | Width |
|----------|-----------|-------|
| 1 | Right | ~60% |
| 2 | Left | ~65% |
| 3 | Right | ~55% |
| 4 | Left | ~60% |

### Design Decision
Site maintains single-column staggered layout at all breakpoints (375px to 1440px+). This is an intentional design choice that:
- Creates consistent visual rhythm
- Emphasizes individual images
- Supports vertical scroll narrative
- Avoids grid monotony
