# Bojuhl.com - Content Structure Analysis

**Breakpoints Analyzed:**
- Mobile: 375x812 (2025-01-27)
- Tablet: 768x1024 (2025-01-27)
- Desktop: 1024px+ (2025-01-27)

**URL:** https://www.bojuhl.com

## Site Overview

Bo Juhl's portfolio site - Executive Producer & Editor specializing in animated films and campaigns. Single-page design with smooth scroll-snap sections and video modal interactions.

## Page Structure

```
SITE
├── Chrome (Global)
│   ├── Footer (visible)
│   └── Floating Contact (integrated into flow on mobile)
│
└── PAGE: Home (Single Page)
    ├── SECTION: Hero (#hero)
    │   ├── Video Background
    │   ├── Intro Text ("I'm Bo Juhl")
    │   ├── Role Titles (H1 x3)
    │   └── Scroll Indicator
    │
    ├── SECTION: About (#about)
    │   ├── Bio Text (with Crossroad links)
    │   ├── Signature ("Bo Juhl")
    │   ├── Photo Background
    │   └── Logo Marquee (HIDDEN on mobile)
    │
    ├── SECTION: Featured Projects (#projects)
    │   └── Project Cards (x6)
    │       ├── Video Thumbnail
    │       ├── Meta (Client/Studio)
    │       ├── Title (H3)
    │       ├── Description
    │       └── Year/Role
    │
    ├── SECTION: Other Projects (HIDDEN on mobile)
    │
    └── FOOTER
        ├── Navigation Links
        ├── Contact Section
        ├── Studio Section
        └── Copyright
```

## Components Identified

### Sections (4)
| Section | Visibility | Height |
|---------|------------|--------|
| hero | All breakpoints | 100vh |
| about | All breakpoints | 100vh |
| featured-projects | All breakpoints | Auto (~3622px) |
| other-projects | **Hidden on mobile** | 0 |

### Widgets (4)
- hero-title - Large display heading with blend effect
- project-card - Featured project with thumbnail, meta, description
- scroll-indicator - Scroll prompt text
- video-thumbnail - Clickable video preview

### Chrome (2)
- footer - Global site footer
- floating-contact - Contact prompt (non-floating on mobile)

## Typography System

### Font Families
1. **Inter** - Headings, navigation, titles
2. **Plus Jakarta Sans** - Body text, descriptions, meta

### Scale (Mobile)
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Hero Title (H1) | Inter | 32px | 900 |
| Project Title (H3) | Inter | 10px | 700 |
| Section Heading (H2) | Inter | 10px | 700 |
| Body Text | Plus Jakarta Sans | 10-16px | 400-500 |
| Footer Heading | Inter | 14px | 900 |
| Navigation | Inter | 14px | 300 |

## Color Palette

| Usage | Value | Notes |
|-------|-------|-------|
| Background (dark) | rgb(0, 0, 0) | Hero, About, Footer |
| Background (light) | rgb(255, 255, 255) | Projects section |
| Text on dark | rgb(255, 255, 255) | White |
| Text on light | rgb(0, 0, 0) | Black |
| Link/Accent | rgb(153, 51, 255) | Purple (#9933FF) |

## Key Behaviors (Mobile)

1. **Scroll Background** - Video background in hero
2. **Mix-Blend-Mode Text** - Hero text inverts over video
3. **Video Modal** - Project videos open in fullscreen modal
4. **Section Snap** - Sections may have scroll-snap behavior

## Mobile-Specific Notes

- **Logo Marquee**: Hidden on mobile (display: none)
- **Other Projects Gallery**: Hidden on mobile (display: none)
- **Floating Contact**: Not floating - integrated into page flow
- **Padding**: 32px horizontal padding throughout
- **Text Size**: Smaller text (10px) for meta/descriptions

---

## Tablet Analysis (768px+)

### Key Layout Changes at Tablet

| Component | Mobile | Tablet |
|-----------|--------|--------|
| Hero Title | 32px | **47px** (+47%) |
| About Section | Single column, photo bg | **Two-column** (text + photo) |
| Logo Marquee | Hidden | **Visible** (bottom of About) |
| Project Cards | Stacked vertical | **Two-column** (thumbnail + content) |
| Other Projects | Hidden | **Visible** (7-item horizontal row) |
| Footer | Single column | **Three-column** flex |
| Floating Contact | Inline in flow | **Fixed top-right** overlay |

### New Components at Tablet
- **logo-marquee** widget - Animated client logo scroll (About section)
- **other-projects** section - Now visible as thumbnail grid

### Layout Patterns Observed

1. **Two-Column Split**
   - About: Text left (~45%) / Photo right (~55%)
   - Project Cards: Thumbnail (~55%) / Content (~45%), alternating sides

2. **Three-Column Footer**
   - Navigation | Contact | Studio
   - Flex layout with equal distribution

3. **Horizontal Gallery**
   - Other Projects: 7 thumbnails in flex row
   - Gap: 4px
   - Individual width: ~105px

### Visibility Matrix

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Hero | Yes | Yes | Yes |
| About | Yes | Yes | Yes |
| Logo Marquee | No | **Yes** | Yes |
| Featured Projects | Yes | Yes | Yes |
| Other Projects | No | **Yes** | Yes |
| Footer | Yes | Yes | Yes |
| Floating Contact (fixed) | No | **Yes** | Yes |

## Files Created

### Sections
- `content/section/hero.md`
- `content/section/about.md`
- `content/section/featured-projects.md`
- `content/section/other-projects.md`

### Widgets
- `content/widget/hero-title.md`
- `content/widget/project-card.md`
- `content/widget/scroll-indicator.md`
- `content/widget/video-thumbnail.md`

### Chrome
- `site/chrome/footer.md`
- `site/chrome/floating-contact.md`

### New at Tablet
- `content/widget/logo-marquee.md` - Client logo carousel (tablet+)

---

## Desktop Analysis (1024px+)

### Key Layout Changes at Desktop

| Component | Tablet | Desktop |
|-----------|--------|---------|
| Hero Title | 47px | ~60-72px (fluid scaling) |
| Content Padding | Variable | `lg:px-24` (96px) or `lg:px-48` (192px) |
| About Text Column | ~259px | ~400-500px (max-w-[500px]) |
| Project Cards | 758px wide | ~900-1200px (fluid) |
| Thumbnail Width | ~431px | ~500-650px |
| Footer Gap | 64px | 64px (same) |

### Desktop-Specific Behaviors

1. **Hover States Active**
   - Project card thumbnails: Subtle scale on hover
   - Other projects gallery: Thumbnail expansion (78px -> 268px)
   - Links: Underline on hover
   - Video thumbnails: Enhanced "WATCH" overlay

2. **Gallery Thumbnail Expansion**
   - Default: Compressed thumbnails (~78px width)
   - Hover: Expanded view (~268px width) with full project details
   - Shows: Year, Role, Title, Client, Studio, WATCH button

3. **Increased Whitespace**
   - Horizontal padding increases via Tailwind `lg:` classes
   - More breathing room around content
   - Same structural layouts as tablet

### Typography at Desktop

| Element | Tablet | Desktop |
|---------|--------|---------|
| Hero Title (H1) | 47px | ~60-72px (fluid) |
| Project Title (H3) | 10px | 10px (unchanged) |
| Bio Text | 14px | 14-16px |
| Meta Text | 10px | 10px (unchanged) |

### Layout Consistency

Desktop maintains the same fundamental layouts as tablet:
- Two-column About section (text left, photo right)
- Two-column project cards (alternating thumbnail position)
- Horizontal Other Projects gallery
- Three-column footer

The primary differences are:
- Increased padding and whitespace
- Fluid scaling of hero typography
- Active hover states for interactive elements
- Thumbnail expansion in Other Projects gallery

### Breakpoint Classes Observed

```css
/* Tailwind desktop classes found */
lg:px-24    /* 96px horizontal padding */
lg:px-48    /* 192px horizontal padding */
max-w-[500px]  /* Text column constraint */
```

### Responsive Summary

| Breakpoint | Key Characteristics |
|------------|---------------------|
| Mobile (375px) | Single column, minimal padding, hidden components |
| Tablet (768px) | Two-column layouts, components revealed, fixed chrome |
| Desktop (1024px+) | Same layouts + hover states, increased padding, fluid scaling |
