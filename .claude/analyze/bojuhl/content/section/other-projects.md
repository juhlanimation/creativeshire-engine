# Other Selected Projects Section

**Purpose:** Gallery grid of additional project thumbnails with hover details
**Type:** section
**Visible:** tablet, desktop (HIDDEN on mobile)

## Layout (Observed Defaults)

### Mobile (375px)
- **DISPLAY: NONE** - This section is completely hidden on mobile
- Users on mobile only see Featured Projects section

### Tablet/Desktop (estimated)
- Grid layout with multiple columns
- Thumbnail images in gallery format
- Hover reveals project details

## Visual Treatment (Observed Defaults)

### Section Heading (H2)
- Text: "OTHER SELECTED PROJECTS"
- Font-family: Inter, system-ui, sans-serif
- Font-size: 10px
- Font-weight: 700
- Line-height: 15px
- Color: black
- Letter-spacing: normal

### Year Range Label
- Text: "2018-2024"
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 10px
- Color: black

### Project Details (on hover)
- Year, Role, Title, Client, Studio

## Props / Data Schema

```typescript
interface OtherProjectCardProps {
  thumbnailSrc: string;
  thumbnailAlt: string;
  title: string;                  // "SCENERY AND SENTIMENT | GENSHIN IMPACT"
  client: string;                 // "HOYOVERSE"
  studio: string;                 // "SUN CREATURE"
  year: string;                   // "2023"
  role: string;                   // "Executive Producer"
}

interface OtherProjectsSectionProps {
  heading: string;                // "OTHER SELECTED PROJECTS"
  yearRange: string;              // "2018-2024"
  projects: OtherProjectCardProps[];

  // Visibility
  hideOnMobile?: boolean;         // default: true
}
```

## Interaction States

- Default: Grid of thumbnail images (on tablet/desktop)
- Hover: Overlay with project details appears
- Mobile: Section not rendered

## Projects List (from DOM)

1. SCENERY AND SENTIMENT | GENSHIN IMPACT - Hoyoverse / Sun Creature (2023)
2. IT'S ON! - Riot Games / Sun Creature (2018)
3. MARVEL MIDNIGHT SUN - 2K Games / Sun Creature (2022)
4. NINJAGO LEGACY - LEGO / Sun Creature (2021)
5. THE GOBLIN QUEEN - Supercell / Sun Creature (2024)
6. THE PATH, AN IONIAN MYTH - Riot Games / Sun Creature (2020)
7. ONLY SLIGHTLY EXAGGERATED - Travel Oregon / Sun Creature (2019)

## Responsive Behavior

| Breakpoint | Visibility | Layout |
|------------|------------|--------|
| Mobile (<768px) | Hidden (display: none) | N/A |
| Tablet (768px+) | Visible | Grid |
| Desktop (1024px+) | Visible | Grid |

## Accessibility

- Role: region with aria-label
- Hidden on mobile: Not in tab order on mobile
- Images: Descriptive alt text
- Hover content: Also accessible via focus

---

### Tablet (768px+)

**This section is NOW VISIBLE at tablet (was hidden on mobile)**

- Width: 100vw
- Height: 934px
- Padding: 128px 0
- Background: white

#### Grid Layout
- Display: flex
- Flex-direction: row
- Flex-wrap: nowrap
- Gap: 4px
- Thumbnails: 7 visible in horizontal row
- Individual thumbnail width: ~105px
- All thumbnails equal height (portrait aspect ratio)

#### Visual Treatment
- Thumbnails displayed as horizontal filmstrip
- Hover reveals project details overlay
- Section heading "OTHER SELECTED PROJECTS" at top
- Year range "2018-2024" displayed

#### Changes from Mobile
| Aspect | Mobile | Tablet |
|--------|--------|--------|
| Visibility | Hidden (display: none) | **Visible** |
| Layout | N/A | Horizontal flex row |
| Thumbnails | N/A | 7 items, ~105px each |
| Interaction | N/A | Hover for details |

---

### Desktop (1024px+)

- Width: 100vw
- Height: ~934px (same as tablet)
- Padding: 128px 0 (same)
- Background: white

#### Grid Layout at Desktop
| Property | Tablet | Desktop |
|----------|--------|---------|
| Display | flex row | flex row (same) |
| Thumbnails | 7 items | 7 items (same) |
| Individual width | ~78px default | ~100-120px (scales) |
| Height | ~512px | ~512px (portrait) |
| Gap | 4px | 4px (same) |
| Container width | 758px | Scales with viewport |

#### Hover Behavior (Desktop-specific)
- **Default state:** All thumbnails at base width (~78-100px)
- **Hover state:** Hovered thumbnail EXPANDS to ~268px (3.4x wider)
- **Expanded view shows:**
  - "WATCH" button overlay
  - Year (e.g., "2020")
  - Role (e.g., "Executive Producer, Editor")
  - Project title
  - Client name
  - Studio name

#### Thumbnail Expansion Animation
- Smooth width transition on hover
- Other thumbnails compress slightly to accommodate
- Reveals project details overlay
- "WATCH" text appears for video playback

#### Typography on Hover Overlay
- Year: 10px, 400 weight
- Role: 10px, 400 weight
- Title: 10px, 700 weight, uppercase
- Client/Studio labels: 10px, 400 weight
- Client/Studio values: 10px, 500 weight

#### Changes from Tablet
- Same layout structure
- Thumbnails may be slightly larger
- Hover expansion effect is the key desktop interaction
- More visible detail on hover due to larger expanded size
