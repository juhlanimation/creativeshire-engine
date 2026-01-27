# Featured Projects Section

**Purpose:** Showcase featured project cards with video thumbnails, metadata, and descriptions
**Type:** section
**Visible:** mobile, tablet, desktop

## Layout (Observed Defaults)

### Mobile (375px)
- Width: 100vw
- Padding: 128px 0 (vertical)
- Background: white
- Cards stack vertically (single column)

### Card Layout
- Full width (100% - no horizontal padding on card)
- Video thumbnail: 16:9 aspect ratio
- Content padding: 0 8px (appears minimal)
- Gap between cards: ~64px (estimated from scroll)

## Visual Treatment (Observed Defaults)

### Colors
- Section background: rgb(255, 255, 255) (white)
- Card background: white
- Text primary: rgb(0, 0, 0) (black)
- Text secondary: rgb(0, 0, 0) (black, lighter weight)

### Typography

#### Project Title (H3)
- Font-family: Inter, system-ui, sans-serif
- Font-size: 10px
- Font-weight: 700
- Line-height: 15px
- Color: black
- Text-transform: uppercase
- Letter-spacing: normal
- Margin-bottom: 12px

#### Meta Label ("Client", "Studio")
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 400
- Color: black

#### Meta Value ("RIOT GAMES", "SUN CREATURE")
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 500
- Color: black
- Letter-spacing: normal

#### Description
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 400
- Line-height: 16.25px (1.625 ratio)
- Color: black
- Text-align: justify

#### Year
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 400
- Color: black

#### Role
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Font-weight: 400
- Color: black

### Video Thumbnail
- Aspect ratio: 16:9 (1.78:1)
- Width: 100% of container (~474px on mobile)
- Object-fit: cover
- Border-radius: 0

### Watch Button Overlay
- Font-family: Arial, system-ui, sans-serif
- Font-size: 10px
- Font-weight: 500
- Color: white
- Text-transform: uppercase
- Letter-spacing: 0.25px
- Position: Overlay on video thumbnail

## Props / Data Schema

```typescript
interface FeaturedProjectCardProps {
  // Media
  thumbnailSrc: string;
  thumbnailAlt: string;
  videoSrc?: string;              // For video playback on click

  // Metadata
  client: string;                 // "AZUKI", "RIOT GAMES"
  studio: string;                 // "CROSSROAD STUDIO", "SUN CREATURE"

  // Content
  title: string;                  // "ELEMENTS OF TIME"
  description: string;            // Full description text
  year: string;                   // "2025", "2022"
  role: string;                   // "Executive Producer", "Executive Producer, Producer"
}

interface FeaturedProjectsSectionProps {
  projects: FeaturedProjectCardProps[];
  sectionPadding?: string;        // default: "128px 0"
}
```

## Interaction States

- Default: Static thumbnail visible
- Hover: "WATCH" button appears (desktop), thumbnail may scale
- Tap/Click: Opens video modal
- Focus: Outline on interactive elements

## Behaviours

- **video-modal**: Click "WATCH" opens fullscreen video player
- **project-card-hover**: Hover effects on desktop (scale, overlay)

## Featured Projects List (from site)

1. ELEMENTS OF TIME - Azuki / Crossroad Studio (2025)
2. TOWER REVEAL - Supercell / Sun Creature
3. SANTA HOG RIDER'S WORKSHOP - Supercell / Sun Creature
4. RETURN TO VALORAN CITY - Riot Games / Sun Creature (2022)
5. THE PRINCESS & THE GREEN KNIGHT - Amazon Prime / Sun Creature (2020)
6. DONATE YOUR DATA - Optus / Sun Creature (2020)

## Accessibility

- Role: region with aria-label="Featured Projects"
- Video: Accessible video controls in modal
- Interactive: Keyboard accessible watch buttons
- Images: Descriptive alt text on thumbnails

---

### Tablet (768px+)

- Width: 100vw
- Padding: 128px 0 (same as mobile)
- Background: white
- Cards: **Two-column layout** (thumbnail + content side-by-side)
- Gap between cards: 256px

#### Card Layout Changes from Mobile
| Aspect | Mobile | Tablet |
|--------|--------|--------|
| Card layout | Stacked vertical | Two-column horizontal |
| Flex direction | column | **row** |
| Thumbnail width | 100% | ~431px (~55%) |
| Content position | Below thumbnail | Beside thumbnail |
| Card width | 100% | 758px (full container) |
| Alternating | No | Yes (odd/even swap sides) |

#### Card Structure at Tablet
- Display: flex
- Flex-direction: row
- Thumbnail on one side (~55% width)
- Content on other side (~45% width)
- **Alternating pattern**: Odd cards have thumbnail left, even cards have thumbnail right

#### Typography (same as mobile)
- Project title: 10px, 700 weight, uppercase
- Meta labels: 10px, 400 weight
- Description: 10px, 400 weight, justified

---

### Desktop (1024px+)

- Width: 100vw
- Height: Variable (3145px+ depending on content)
- Padding: 128px 0 (same as tablet)
- Background: white

#### Card Layout at Desktop
| Property | Tablet | Desktop |
|----------|--------|---------|
| Card layout | Two-column horizontal | Two-column horizontal (same) |
| Card width | 758px | ~900-1200px (scales with viewport) |
| Thumbnail width | ~431px (~55%) | ~500-650px (~55%) |
| Thumbnail height | ~243px | ~280-365px (16:9 maintained) |
| Content width | ~45% | ~45% (same ratio) |
| Gap between elements | 8px | 8px (same) |
| Card-to-card gap | 256px | 256px (same) |

#### Alternating Layout Pattern
- **Odd cards (1, 3, 5):** Thumbnail LEFT, content RIGHT
- **Even cards (2, 4, 6):** Content LEFT, thumbnail RIGHT
- Creates visual rhythm and breaks monotony

#### Typography (unchanged)
- Project title: 10px, 700 weight, uppercase
- Meta labels: 10px, 400 weight
- Meta values: 10px, 500 weight
- Description: 10px, 400 weight, justified
- Year/Role: 10px, 400 weight

#### Hover States (Desktop-specific)
- Thumbnail: May scale slightly on hover
- "WATCH" overlay: Appears/enhances on hover
- Cursor: Pointer on interactive areas

#### Changes from Tablet
- Cards scale proportionally with viewport
- Same alternating layout pattern
- Same typography (no scaling)
- Hover interactions become relevant
- More whitespace around cards
