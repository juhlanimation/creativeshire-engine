# About Section

**Purpose:** Biography section with personal photo, bio text, client links, and signature
**Type:** section
**Visible:** mobile, tablet, desktop

## Layout (Observed Defaults)

### Mobile (375px)
- Width: 100vw
- Height: 100vh (viewport height, scroll-snap)
- Padding: 0
- Background: Black with photo overlay

### Content Container
- Padding: 0 32px (horizontal)
- Text overlaid on photo background
- Signature aligned right

### Logo Marquee (Client Logos)
- **HIDDEN on mobile** (display: none)
- Visible on tablet/desktop only

## Visual Treatment (Observed Defaults)

### Colors
- Background: rgb(0, 0, 0) (black)
- Text primary: rgb(255, 255, 255) (white)
- Link color: rgb(153, 51, 255) (purple - #9933FF)
- Photo has dark overlay for text readability

### Typography

#### Bio Paragraph
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 16px
- Font-weight: 400
- Line-height: 24px (1.5 ratio)
- Color: white
- Text-align: justify (on mobile)

#### Link Text (Crossroad)
- Color: rgb(153, 51, 255) (purple)
- Text-decoration: none
- Hover: underline (on desktop)

#### Signature ("Bo Juhl")
- Font-family: serif (italic style)
- Font-style: italic
- Color: white
- Text-align: right

### Photo
- Position: absolute/fixed (parallax scrolling)
- Object-fit: cover
- Dark gradient overlay for text legibility

## Props / Data Schema

```typescript
interface AboutSectionProps {
  // Content
  bioParagraphs: string[];        // Array of paragraph text
  links?: Array<{
    text: string;
    href: string;
  }>;
  signature: string;              // "Bo Juhl"

  // Photo
  photoSrc: string;
  photoAlt: string;

  // Client logos (hidden on mobile)
  clientLogos?: Array<{
    name: string;
    src: string;
  }>;

  // Layout
  showLogoMarquee?: boolean;      // default: false on mobile
}
```

## Interaction States

- Default: Photo visible with text overlay
- Hover: Links show underline (desktop only)
- Scroll: Parallax effect - photo stays fixed while content scrolls

## Child Components

### Logo Marquee (Hidden on Mobile)
- Contains: Netflix, Amazon Studios, Cartoon Network, Riot Games, EA Games, Ubisoft, 2K Games, Supercell, Respawn Entertainment, Azuki
- Filter: brightness(0) invert(1) - makes logos white
- Animation: Continuous horizontal scroll (marquee)
- **Display: none at mobile breakpoint**

## Accessibility

- Role: region
- ARIA: aria-label="About Bo Juhl"
- Images: Decorative photo can be aria-hidden
- Links: Proper href values for navigation

---

### Tablet (768px+)

- Width: 100vw
- Height: 100vh (877px observed)
- Layout: **Two-column** (text left ~45%, photo right ~55%)
- Text column padding: 160px 64px 0

#### Layout Changes from Mobile
| Aspect | Mobile | Tablet |
|--------|--------|--------|
| Layout | Single column, photo as background | Two columns side-by-side |
| Photo | Background overlay with dark gradient | Dedicated right column |
| Text width | Full width with padding | ~387px (constrained) |
| Logo Marquee | Hidden | **Visible** at bottom |

#### Logo Marquee (NEW at Tablet)
- **Visible:** tablet, desktop (hidden on mobile)
- Position: absolute, bottom: 32px
- Display: flex (horizontal row)
- Height: 168px (includes animation overflow)
- Contains: Netflix, Amazon Studios, Cartoon Network, Riot Games, EA Games, Ubisoft, 2K Games, Supercell, Respawn Entertainment, Azuki
- Filter: brightness(0) invert(1) - white logos
- Animation: Continuous horizontal scroll marquee
- Gap: 4px between logo groups

#### Child Components at Tablet
- Logo marquee visible and positioned at bottom of section
- Floating contact chrome visible in top-right corner

---

### Desktop (1024px+)

- Width: 100vw
- Height: 100vh (fills viewport)
- Layout: **Two-column** (text left, photo right)
- Content container: `max-w-[500px]` on text column

#### Layout Measurements (observed at 784px, scales up)
| Property | Tablet | Desktop |
|----------|--------|---------|
| Section width | 100vw | 100vw |
| Text column width | ~259px | ~400-500px (max-w-[500px]) |
| Photo column width | ~387px | ~50-55% of viewport |
| Text padding | 160px 64px 0 | `lg:px-24` or `lg:px-48` |

#### Typography
| Element | Tablet | Desktop |
|---------|--------|---------|
| Bio paragraph | 14px / 22.75px | 14-16px / 22-26px |
| Font-weight | 400 | 400 (same) |
| Text-align | justify | justify (same) |
| Signature | 14px italic | 14px italic (same) |

#### Photo Column
- Width: ~50-55% of viewport
- Height: Fills section height (parallax fixed)
- Object-fit: cover
- Two overlapping images for depth effect

#### Logo Marquee
- Position: absolute, bottom of section
- Display: flex (horizontal scroll)
- Contains: Netflix, Amazon Studios, Cartoon Network, Riot Games, EA Games, Ubisoft, 2K Games, Supercell, Respawn Entertainment, Azuki
- Filter: brightness(0) invert(1) - white logos
- Animation: Continuous horizontal scroll

#### Changes from Tablet
- Increased horizontal padding on text column
- Text column may expand toward max-width (500px)
- Photo column scales proportionally
- Same two-column layout structure
- Logo marquee remains at bottom
