# Project Card Widget

**Purpose:** Featured project display with video thumbnail, metadata, description, and role
**Type:** widget
**Visible:** mobile, tablet, desktop

## Layout (Observed Defaults)

### Mobile (375px)
- Width: 100%
- Thumbnail: Full width, 16:9 aspect ratio
- Content stacked vertically below thumbnail
- Padding: Minimal (content hugs edges)

### Structure
1. Video/Image Thumbnail (with WATCH overlay)
2. Meta row (Client | Studio)
3. Title (H3)
4. Description paragraph
5. Year
6. Role

### Spacing
- Thumbnail to meta: 8px
- Meta row gap: 32px between Client and Studio
- Title margin-bottom: 12px
- Card to card gap: ~64px

## Visual Treatment (Observed Defaults)

### Thumbnail
- Aspect ratio: 16:9 (1.78:1)
- Width: ~474px (full container width on mobile)
- Height: ~267px
- Object-fit: cover
- Border-radius: 0

### Watch Button Overlay
- Font-family: Arial, system-ui, sans-serif
- Font-size: 10px
- Font-weight: 500
- Color: white
- Text-transform: uppercase
- Letter-spacing: 0.25px
- Position: Centered on thumbnail

### Meta Row
- Display: flex
- Gap: 4px 32px (row/column)
- Margin-top: 8px

#### Label ("Client", "Studio")
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 400
- Color: black

#### Value ("RIOT GAMES", "SUN CREATURE")
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 500
- Color: black

### Title (H3)
- Font-family: Inter, system-ui, sans-serif
- Font-size: 10px
- Font-weight: 700
- Line-height: 15px
- Color: black
- Text-transform: uppercase
- Margin-bottom: 12px

### Description
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 400
- Line-height: 16.25px
- Color: black
- Text-align: justify

### Year & Role
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 400
- Color: black
- Stacked vertically

## Props / Data Schema

```typescript
interface ProjectCardProps {
  // Media
  thumbnailSrc: string;
  thumbnailAlt: string;
  videoSrc?: string;

  // Metadata
  client: string;
  studio: string;

  // Content
  title: string;
  description: string;
  year: string;
  role: string;

  // Interaction
  onWatch?: () => void;
  watchLabel?: string;            // default: "WATCH"
}
```

## Interaction States

- Default: Static thumbnail, WATCH label visible
- Hover (desktop): Thumbnail may scale, overlay darkens
- Tap/Click on WATCH: Opens video modal
- Focus: Visible outline on interactive area

## Behaviours

- **video-modal**: Opens fullscreen video on WATCH click
- **project-card-hover**: Scale/overlay effects on desktop hover

## Accessibility

- Interactive: Entire card or WATCH button is clickable
- Images: Descriptive alt text
- Video: Accessible controls in modal
- Focus: Clear focus indicators

---

### Tablet (768px+)

#### Layout Changes
| Property | Mobile | Tablet |
|----------|--------|--------|
| Layout | Stacked vertical | **Two-column horizontal** |
| Flex-direction | column | **row** |
| Card width | 100% | 758px |
| Thumbnail width | 100% (~474px) | **~431px (~55%)** |
| Thumbnail height | ~267px | ~243px |
| Content position | Below thumbnail | **Beside thumbnail** |

#### Structure at Tablet
- Display: flex
- Flex-direction: row
- Thumbnail and content side-by-side
- **Alternating layout**: Odd cards = thumbnail left, even cards = thumbnail right

#### Typography (unchanged from mobile)
- Title: 10px, 700 weight, uppercase
- Meta: 10px, 400/500 weight
- Description: 10px, 400 weight, justified
- Year/Role: 10px, 400 weight

#### Spacing
- Card-to-card gap: 256px (increased from ~64px on mobile)
- Internal structure maintains same relative proportions

---

### Desktop (1024px+)

#### Layout at Desktop
| Property | Tablet | Desktop |
|----------|--------|---------|
| Layout | Two-column horizontal | Two-column horizontal (same) |
| Card width | 758px | ~900-1200px (fluid) |
| Thumbnail width | ~431px (~55%) | ~500-650px (~55%) |
| Thumbnail height | ~243px | ~280-365px |
| Aspect ratio | 16:9 | 16:9 (same) |
| Content width | ~45% | ~45% (same ratio) |
| Gap | 8px | 8px (same) |

#### Alternating Pattern
- Odd cards: Thumbnail left, content right
- Even cards: Content left, thumbnail right

#### Typography (unchanged from tablet)
- Title: 10px, 700 weight, uppercase
- Meta labels: 10px, 400 weight
- Meta values: 10px, 500 weight
- Description: 10px, 400 weight, justified
- Year/Role: 10px, 400 weight

#### Hover States (Desktop-specific)
- **Thumbnail hover:**
  - Subtle scale effect (1.02-1.05x)
  - "WATCH" overlay becomes more prominent
  - Cursor changes to pointer
- **Card hover:**
  - May have subtle shadow or highlight effect

#### Changes from Tablet
- Card scales proportionally with viewport
- Same internal proportions (55/45 split)
- Hover interactions become active
- Same typography (no scaling)
- More whitespace in surrounding area
