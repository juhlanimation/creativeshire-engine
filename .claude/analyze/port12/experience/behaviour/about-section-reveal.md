# About Section Reveal

## Overview
The About section features a text block with decorative corner brackets that appears as the user scrolls past the hero section.

## Breakpoint: Mobile (375x812)

### Implementation
- **Container**: Section with light background (`bg-background`)
- **Text Block**: Paragraph with corner bracket decorations
- **Images**: Photo gallery below the text
- **Animation**: Fade/slide in as section enters viewport

### Structure
```html
<section class="bg-background relative overflow-hidden">
  <!-- Corner bracket container -->
  <div class="relative p-16">
    <!-- Top-left corner -->
    <span class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-foreground"></span>
    <!-- Top-right corner -->
    <span class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-foreground"></span>

    <!-- About text -->
    <p class="text-lg leading-relaxed">
      Port12 er et kontorfællesskab, men vi er sgu mere fællesskab end vi er kontor...
    </p>

    <!-- Bottom-left corner -->
    <span class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-foreground"></span>
    <!-- Bottom-right corner -->
    <span class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-foreground"></span>
  </div>

  <!-- Photo gallery -->
  <div class="gallery">
    <img src="/images/port12-1.jpg" alt="Port12">
    <img src="/images/port12-2.jpg" alt="Port12">
    <!-- ... more images ... -->
  </div>
</section>
```

### Corner Brackets CSS
```css
.bracket {
  position: absolute;
  width: 2rem; /* 32px */
  height: 2rem;
  border-color: var(--foreground);
  border-width: 2px;
}

.bracket-top-left {
  top: 0;
  left: 0;
  border-top-style: solid;
  border-left-style: solid;
}

.bracket-top-right {
  top: 0;
  right: 0;
  border-top-style: solid;
  border-right-style: solid;
}

.bracket-bottom-left {
  bottom: 0;
  left: 0;
  border-bottom-style: solid;
  border-left-style: solid;
}

.bracket-bottom-right {
  bottom: 0;
  right: 0;
  border-bottom-style: solid;
  border-right-style: solid;
}
```

### Typography
| Property | Value |
|----------|-------|
| font-size | 1.125rem (18px) |
| line-height | 1.625 (relaxed) |
| text-align | justified or left |
| color | var(--foreground) |

### Layout (Mobile)
| Property | Value |
|----------|-------|
| padding | 64px horizontal, 160px top |
| text width | ~387px (container width) |
| section height | auto (content-driven) |

### Animation (Potential)
While no explicit animation was observed, typical implementations include:
```css
.about-section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.about-section.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

### Trigger
- **Type**: Scroll / Intersection Observer
- **Threshold**: When section enters viewport (~10-20%)
- **Behavior**: Content fades/slides into view

### Photo Gallery
- Multiple images showing the coworking space
- Images have slight rotation/tilt for visual interest
- Masonry-style or staggered layout
- Images are lazy-loaded for performance

### Mobile Considerations
- Full-width text block with generous padding
- Images stack vertically on mobile
- Corner brackets scale appropriately
- Touch-friendly image viewing

### Background Transition
The section creates a visual contrast from the dark hero:
- Hero: Dark with video background
- About: Light background (beige/cream)
- Creates clear section separation

### Related Behaviours
- [hero-text-blend-mode.md](./hero-text-blend-mode.md) - Previous section
- [photo-gallery-layout.md](./photo-gallery-layout.md) - Gallery within this section

## Responsive Notes
- **Mobile (375px):** Full-width text block with generous padding, images stack vertically
- **Tablet (768px):** Corner brackets remain same size (32px), text block has more horizontal space. Photo gallery displays in masonry/staggered layout with larger image sizes. Same fade/slide reveal animation triggered by Intersection Observer when section enters viewport.
- **Desktop (1440px):** Corner brackets remain 32px. Text block centered with max-width constraint. Photo gallery displays in multi-column masonry layout with staggered positioning and subtle rotation effects on images. Hover states on images may include subtle scale/shadow effects. Smooth reveal animation on scroll.
