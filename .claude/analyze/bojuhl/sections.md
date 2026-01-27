# Sections Analysis: bojuhl.com

## 1. Hero Section

**Purpose:** Introduce Bo Juhl with striking visual impact
**Viewport:** Full-screen (100vh)
**Background:** Multiple illustrated images that transition on scroll

### Structure
```
HeroSection
├── BackgroundLayer (scroll-driven image swap)
├── ContentLayer
│   ├── IntroText ("I'm Bo Juhl")
│   ├── RoleStack
│   │   ├── "EXECUTIVE PRODUCER" (beige/tan)
│   │   ├── "PRODUCER" (purple gradient)
│   │   └── "EDITOR" (purple/red)
│   └── ScrollIndicator ("(SCROLL)")
└── ChromeOverlay
    └── FloatingContact ("How can I help you?")
```

### Behaviour
- Background images: Ghibli-style illustrations that change based on scroll position
- At least 3 different background scenes observed during scroll
- Text remains fixed while background scrolls

### Design Tokens
- Title size: ~120px (display)
- Color accents: Multiple colors per word (gradient effect)
- Spacing: Generous whitespace, left-aligned

---

## 2. About Section

**Purpose:** Personal bio and credibility
**Layout:** Two-column split (text left, image right)

### Structure
```
AboutSection
├── TextColumn (50%)
│   ├── BioParagraph (with inline links)
│   ├── BioParagraph
│   ├── BioParagraph
│   └── Signature ("Bo Juhl" - italicized)
└── ImageColumn (50%)
    └── PortraitImage (professional photo)
```

### Content Pattern
- Past experience at Sun Creature
- Current work at Crossroad studio
- Links styled in purple (accent color)

---

## 3. Client Logos Section

**Purpose:** Social proof / credibility
**Layout:** Full-width horizontal marquee

### Structure
```
LogoMarqueeSection
└── MarqueeTrack (infinite scroll)
    ├── ClientLogo × 10 (Netflix, Amazon, Cartoon Network, Riot, EA, Ubisoft, 2K, Supercell, Respawn, Azuki)
    ├── ClientLogo × 10 (duplicate for seamless loop)
    └── ClientLogo × 10 (duplicate for seamless loop)
```

### Behaviour
- Continuous horizontal scroll animation
- Logos appear grayscale or muted
- No pause on hover observed

---

## 4. Featured Projects Section

**Purpose:** Showcase major work
**Layout:** Alternating left/right cards

### Structure
```
FeaturedProjectsSection
├── ProjectCard (image-left)
│   ├── ProjectImage
│   ├── ProjectMeta
│   │   ├── Title
│   │   ├── Description
│   │   ├── Year
│   │   └── Role
│   └── ClientStudioMeta
│       ├── "Client: {name}"
│       └── "Studio: {name}"
├── ProjectCard (image-right) [alternates]
└── ... (6 featured projects)
```

### Projects Identified
1. **ELEMENTS OF TIME** (2025) - Azuki / Crossroad Studio
2. **TOWER REVEAL** (2024) - Supercell / Sun Creature
3. **SANTA HOG RIDER'S WORKSHOP** (2022) - Supercell / Sun Creature
4. **RETURN TO VALORAN CITY** (2022) - Riot Games / Sun Creature
5. **THE PRINCESS & THE GREEN KNIGHT** (2020) - Amazon Prime / Sun Creature
6. **DONATE YOUR DATA** (2020) - Optus / Sun Creature

### Layout Pattern
- Odd items: Image left, text right
- Even items: Text left, image right
- Large whitespace between cards

---

## 5. Other Projects Gallery

**Purpose:** Show breadth of work
**Layout:** Horizontal scrolling gallery

### Structure
```
ProjectGallerySection
├── SectionHeader
│   ├── Title ("OTHER SELECTED PROJECTS")
│   └── DateRange ("2018-2024")
└── HorizontalGallery
    ├── GalleryThumbnail × 7+
    └── GalleryInfo (appears on hover/selection)
        ├── Year
        ├── Role
        ├── Title
        ├── Client
        └── Studio
```

### Projects in Gallery
- Genshin Impact (2023) - Hoyoverse
- It's On! (2018) - Riot Games
- Marvel Midnight Sun (2022) - 2K Games
- Ninjago Legacy (2021) - Lego
- The Goblin Queen (2024) - Supercell
- The Path, An Ionian Myth (2020) - Riot Games
- Only Slightly Exaggerated (2019) - Travel Oregon

---

## 6. Footer Section

**Purpose:** Navigation and contact
**Layout:** Multi-column

### Structure
```
FooterSection
├── NavColumn
│   ├── Link ("HOME" → #hero)
│   ├── Link ("ABOUT" → #about)
│   └── Link ("PROJECTS" → #projects)
├── ContactColumn ("GET IN TOUCH")
│   ├── Email (hello@bojuhl.com)
│   └── Link (linkedin)
├── StudioColumn ("FIND MY STUDIO")
│   ├── Link (crossroad.studio)
│   ├── Email (bo@crossroad.studio)
│   ├── Link (linkedin)
│   └── Link (instagram)
└── Copyright ("Copyright © Bo Juhl / All rights reserved")
```
