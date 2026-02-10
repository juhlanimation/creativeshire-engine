# Creativeshire Engine Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SITE INSTANCE                                   │
│                    (preset configuration)                               │
│                                                                         │
│   site/config.ts ─────► SiteConfig { theme, chrome, defaults }         │
│   site/pages/*.ts ────► PageConfig[] { sections, meta }                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           RENDERER                                      │
│                                                                         │
│   SiteRenderer ──► PageRenderer ──► SectionRenderer ──► WidgetRenderer │
│                                                                         │
│   Traverses config tree, resolves components, renders React             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌────────────────────────────┐   ┌────────────────────────────────┐   │
│  │      L1: CONTENT           │   │       L2: EXPERIENCE           │   │
│  │      (renders once)        │   │       (animates 60fps)         │   │
│  │                            │   │                                │   │
│  │  • Primitives              │   │  • Behaviours (set values)     │   │
│  │  • Layout                  │   │  • Effects (animate values)    │   │
│  │  • Composites              │   │  • Drivers (coordinate)        │   │
│  │  • Sections                │   │  • Modes (patterns)            │   │
│  │  • Chrome                  │   │  • Triggers (detect events)    │   │
│  │                            │   │                                │   │
│  └────────────────────────────┘   └────────────────────────────────┘   │
│                  │                              │                       │
│                  └──────── CSS Variables ───────┘                       │
│                           --visible: 0|1                                │
│                           --scroll: 0..1                                │
│                           --hover: 0|1                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Widget Hierarchy

```
PRIMITIVES (atoms)
├── Text          Single text element, typography settings
├── Image         Single image, lazy loading, aspect ratio
├── Icon          SVG icons
├── Button        Clickable, variants
└── Link          Navigation

LAYOUT (structure)
├── Stack         Vertical children (gap, align)
├── Flex          Flexible container (direction, wrap)
├── Grid          CSS Grid (columns, rows)
├── Split         Two-panel layout (ratio)
├── Container     Max-width wrapper (size variants)
└── Box           Generic div with spacing

COMPOSITES (assembled or stateful)
├── ProjectCard   Stack(Image, Text, Text) + hover state
├── LogoLink      Link(Image) or Link(Text)
├── Video         Complex state (hover-play, visibility)
├── VideoPlayer   Controls, scrubber, fullscreen
├── ContactPrompt Expandable contact section
└── ...
```

---

## L1/L2 Communication

```
┌─────────────────────────────────────────────────────────────────────┐
│  L1 CONTENT                                                         │
│                                                                     │
│  <section data-behaviour="visibility/fade-in">                      │
│    <div class="effect-fade">                                        │
│      Content here                                                   │
│    </div>                                                           │
│  </section>                                                         │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ CSS Variable Bridge
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  L2 EXPERIENCE                                                      │
│                                                                     │
│  BEHAVIOUR (visibility/fade-in)     EFFECT (fade.css)              │
│  ─────────────────────────────      ─────────────────              │
│  Observes intersection         │    .effect-fade {                  │
│  Sets: --visible: 0 → 1        │      opacity: var(--visible, 0);   │
│                                │      transition: opacity 400ms;    │
│                                │    }                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Experience System Detail

```
TRIGGERS (detect events)
│
├── useIntersection ──────► element in viewport?
├── useScrollProgress ────► scroll position 0..1
├── useCursorPosition ────► mouse x,y coordinates
├── useViewport ──────────► window dimensions
└── usePrefersReducedMotion

         │
         ▼

BEHAVIOURS (set CSS variable values)
│
├── visibility/
│   └── fade-in ──────────► --visible: 0|1
│
├── scroll/
│   ├── progress ─────────► --scroll: 0..1
│   ├── fade ─────────────► --scroll-opacity: 0..1
│   └── color-shift ──────► --color-progress: 0..1
│
├── hover/
│   ├── scale ────────────► --hover: 0|1
│   └── reveal ───────────► --hover: 0|1
│
├── animation/
│   └── marquee ──────────► --marquee-offset: continuous
│
└── interaction/
    └── toggle ───────────► --active: 0|1

         │
         ▼

EFFECTS (define HOW values animate)
│
├── fade.css ─────────────► opacity transitions
├── transform/
│   ├── slide.css ────────► translateX/Y
│   ├── scale.css ────────► scale()
│   └── rotate.css ───────► rotate()
├── mask/
│   ├── wipe.css ─────────► clip-path animations
│   └── expand.css ───────► grow from point
└── emphasis/
    └── pulse.css ────────► attention effects

         │
         ▼

DRIVERS (coordinate complex sequences)
│
├── ScrollDriver ─────────► manages scroll-linked animations
├── useScrollFadeDriver ──► coordinates scroll + fade
└── gsap/
    └── use-gsap-reveal ──► GSAP-powered reveals

         │
         ▼

MODES (layout patterns with animation)
│
└── stacking ─────────────► cards stack on scroll
```

---

## Renderer Flow

```
SiteRenderer
│
├── Receives: SiteConfig, PageConfig
│
├── Renders:
│   ├── Chrome (Header)
│   │
│   ├── PageRenderer
│   │   │
│   │   └── For each section in page.sections:
│   │       │
│   │       └── SectionRenderer
│   │           │
│   │           ├── Resolves section pattern (Hero, About, etc.)
│   │           ├── Applies behaviours
│   │           │
│   │           └── For each widget in section:
│   │               │
│   │               └── WidgetRenderer
│   │                   │
│   │                   ├── Resolves widget type
│   │                   ├── LAYOUT → renders children recursively
│   │                   ├── COMPOSITE → renders assembled structure
│   │                   └── PRIMITIVE → renders leaf element
│   │
│   └── Chrome (Footer)
│
└── Output: React component tree with CSS variable hooks
```

---

## File Structure

```
creativeshire/
│
├── content/                    # L1: Static structure
│   │
│   ├── widgets/
│   │   ├── primitives/         # Text, Image, Icon, Button, Link
│   │   ├── layout/             # Stack, Grid, Flex, Split, Container, Box
│   │   ├── composite/          # ProjectCard, Video, VideoPlayer, etc.
│   │   ├── registry.ts         # Widget type → component mapping
│   │   └── types.ts
│   │
│   ├── sections/
│   │   ├── patterns/           # Hero, About, FeaturedProjects, etc.
│   │   └── types.ts
│   │
│   └── chrome/
│       ├── regions/            # Header, Footer, Sidebar
│       ├── overlays/           # Modal, CursorLabel
│       └── types.ts
│
├── experience/                 # L2: Animation layer
│   │
│   ├── behaviours/             # Named by TRIGGER
│   │   ├── scroll/             # progress, fade, color-shift
│   │   ├── hover/              # scale, reveal
│   │   ├── visibility/         # fade-in
│   │   ├── animation/          # marquee
│   │   ├── interaction/        # toggle
│   │   └── registry.ts
│   │
│   ├── effects/                # Named by MECHANISM (CSS files)
│   │   ├── fade.css
│   │   ├── transform/          # slide, scale, rotate
│   │   ├── mask/               # wipe, expand
│   │   └── emphasis/           # pulse
│   │
│   ├── drivers/                # Coordinate animations
│   │   ├── ScrollDriver.ts
│   │   └── gsap/
│   │
│   ├── modes/                  # Layout animation patterns
│   │   └── stacking/
│   │
│   └── triggers/               # Event detection hooks
│       ├── useIntersection.ts
│       ├── useScrollProgress.ts
│       └── ...
│
├── renderer/                   # Traverses config → React
│   ├── SiteRenderer.tsx
│   ├── PageRenderer.tsx
│   ├── SectionRenderer.tsx
│   └── WidgetRenderer.tsx
│
├── schema/                     # TypeScript types
│   ├── site.ts
│   ├── page.ts
│   ├── section.ts
│   ├── widget.ts
│   └── index.ts
│
├── presets/                    # Site templates
│   ├── bojuhl/
│   │   ├── site.ts
│   │   ├── pages/
│   │   └── chrome/
│   └── types.ts
│
└── index.ts                    # Main export (library entry point)
```

---

## Config Schema (Simplified)

```typescript
// Site Configuration
interface SiteConfig {
  name: string
  theme: ThemeConfig
  chrome: ChromeConfig
  defaults: DefaultSettings
}

// Page Configuration
interface PageConfig {
  slug: string
  title: string
  sections: SectionConfig[]
}

// Section Configuration
interface SectionConfig {
  pattern: 'hero' | 'about' | 'featured-projects' | ...
  behaviour?: string      // e.g., 'visibility/fade-in'
  mode?: string           // e.g., 'stacking'
  settings: PatternSettings
  widgets?: WidgetConfig[]
}

// Widget Configuration
interface WidgetConfig {
  type: 'text' | 'image' | 'stack' | 'grid' | ...
  behaviour?: string
  effect?: string
  settings: WidgetSettings
  children?: WidgetConfig[]  // For layout widgets
}
```

---

## Key Principles

1. **L1/L2 Separation**: Content renders once, experience animates at 60fps. They communicate via CSS variables only.

2. **Behaviour/Effect Split**:
   - Behaviour = WHAT value changes (trigger-based naming)
   - Effect = HOW it animates (mechanism-based naming)

3. **Widget Hierarchy**:
   - Primitives: No children, single purpose
   - Layout: Hold children, define structure
   - Composites: Assembled patterns OR complex state

4. **Top-Down Rendering**: Site → Page → Section → Widget

5. **Generalization**: Everything is configurable. Components are generic, presets apply site-specific values.
