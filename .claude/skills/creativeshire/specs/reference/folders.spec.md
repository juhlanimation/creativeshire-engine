# Folder Structure Reference

> Quick reference for Creativeshire directory organization.

---

## Overview

| Folder | Purpose | Who Edits | Portable |
|--------|---------|-----------|----------|
| `creativeshire/` | The CMS engine (components, behaviours, renderers) | Developers | Yes (future npm) |
| `site/` | Instance data for this specific site | Content editors | No |
| `app/` | Next.js routing (thin wrappers) | Developers | No |

---

## Complete Structure

```
/
├── app/                                 # NEXT.JS ROUTING
│   ├── layout.tsx                       # Root layout (wraps SiteRenderer)
│   ├── page.tsx                         # Home -> site/pages/home.ts
│   └── {route}/page.tsx                 # Route -> site/pages/{route}.ts
│
├── creativeshire/                       # THE CMS ENGINE
│   │
│   ├── schema/                          # INTERFACES & TYPES
│   │   ├── index.ts                     # Re-exports all
│   │   ├── site.ts, page.ts             # SiteSchema, PageSchema
│   │   ├── section.ts, widget.ts        # SectionSchema, WidgetSchema
│   │   ├── chrome.ts                    # ChromeSchema
│   │   └── experience.ts                # ExperienceConfig, BehaviourConfig
│   │
│   ├── content/                         # LAYER 1: WHAT'S ON THE PAGE
│   │   │
│   │   ├── widgets/
│   │   │   ├── primitives/              # LEAF NODES
│   │   │   │   └── {Name}/              # Text, Image, Video, Button, etc.
│   │   │   │       ├── index.tsx        # React component
│   │   │   │       ├── types.ts         # Props interface
│   │   │   │       └── styles.css       # CSS with var() mappings
│   │   │   │
│   │   │   ├── layout/                  # CONTAINERS
│   │   │   │   └── {Name}/              # Flex, Grid, Stack, Carousel, etc.
│   │   │   │       ├── index.tsx
│   │   │   │       └── types.ts
│   │   │   │
│   │   │   └── composite/               # WIDGET FACTORIES
│   │   │       └── {Name}/              # IconButton, CardWithMeta, etc.
│   │   │           ├── index.ts         # create{Name}(props) -> WidgetSchema
│   │   │           └── types.ts
│   │   │
│   │   ├── sections/
│   │   │   ├── Section.tsx              # Base section component
│   │   │   ├── types.ts
│   │   │   └── composites/              # SECTION FACTORIES
│   │   │       └── {Name}/              # Hero, Gallery, CTA, FAQ, etc.
│   │   │           ├── index.ts         # create{Name}Section(props)
│   │   │           ├── types.ts
│   │   │           └── variants.ts
│   │   │
│   │   ├── chrome/
│   │   │   ├── Chrome.tsx               # Chrome orchestrator
│   │   │   ├── regions/                 # Header, Footer, Sidebar
│   │   │   └── overlays/                # Cursor, Loader, ModalContainer
│   │   │
│   │   └── registry.ts                  # Auto-discovery
│   │
│   ├── experience/                      # LAYER 2: HOW THE PAGE FEELS
│   │   │
│   │   ├── experiences/                 # USER-SELECTABLE EXPERIENCES
│   │   │   ├── types.ts                 # ExperienceDefinition interface
│   │   │   ├── registry.ts              # All experiences registered
│   │   │   ├── stacking.ts              # Barebone (no animation)
│   │   │   ├── cinematic-scroll.ts
│   │   │   ├── gallery-focus.ts
│   │   │   └── parallax-depth.ts
│   │   │
│   │   ├── modes/                       # ANIMATION MODES (internal)
│   │   │   └── {name}/                  # static, parallax, reveal, cinematic
│   │   │       ├── index.ts             # Mode definition
│   │   │       ├── store.ts             # Zustand store factory
│   │   │       └── behaviours.ts        # Mode-specific behaviours
│   │   │
│   │   ├── behaviours/                  # BEHAVIOUR SYSTEM
│   │   │   ├── types.ts, registry.ts    # Behaviour interface, collection
│   │   │   ├── resolve.ts               # Resolution logic
│   │   │   ├── BehaviourWrapper.tsx     # Generic wrapper
│   │   │   └── {name}/                  # scroll-stack, depth-layer, etc.
│   │   │       ├── index.ts
│   │   │       └── types.ts
│   │   │
│   │   ├── drivers/                     # DIRECT DOM ANIMATION
│   │   │   └── {Name}Driver.ts          # Scroll, GSAP, Audio, Cursor
│   │   │
│   │   ├── triggers/                    # EVENT -> STORE
│   │   │   └── use{Name}.ts             # useScrollProgress, useSwipe, etc.
│   │   │
│   │   ├── ExperienceProvider.tsx       # React context for mode
│   │   └── DriverProvider.tsx           # React context for driver
│   │
│   ├── renderer/                        # SCHEMA -> COMPONENTS
│   │   ├── SiteRenderer.tsx             # Site -> Chrome + Pages
│   │   ├── PageRenderer.tsx             # Page -> Sections
│   │   ├── SectionRenderer.tsx          # Section -> BehaviourWrapper
│   │   ├── WidgetRenderer.tsx           # Widget -> BehaviourWrapper
│   │   └── ChromeRenderer.tsx           # Chrome -> Regions + Overlays
│   │
│   ├── interface/                       # PLATFORM <-> ENGINE CONTRACT
│   │   ├── types.ts                     # EngineInput, EngineController, EngineEvents
│   │   ├── EngineProvider.tsx           # Root provider wrapping engine
│   │   └── useEngineController.ts       # Hook for platform control
│   │
│   └── presets/                         # FULL CONFIGURATIONS
│       └── {name}/                      # starter, showcase, editorial
│           ├── index.ts                 # Main export (SitePreset)
│           ├── site.ts                  # Site-level defaults
│           ├── pages/                   # Page structures
│           └── chrome/                  # Chrome configuration
│
├── site/                                # THIS SITE'S DATA
│   ├── config.ts                        # Extends preset, selects mode
│   ├── pages/                           # Page schemas (home.ts, about.ts)
│   ├── chrome/                          # Chrome overrides
│   └── data/                            # Content (projects.ts, etc.)
│
└── lib/utils.ts                         # Shared utilities (cn, etc.)
```

---

## Key Distinctions

### Experiences vs Modes vs Behaviours

| Concept | Location | Purpose | User Selects |
|---------|----------|---------|--------------|
| **Experience** | `experience/experiences/` | Wrapping rules + appended sections + constraints | Yes |
| **Mode** | `experience/modes/` | Animation configuration (state provider) | No |
| **Behaviour** | `experience/behaviours/` | Compute function for one effect | No |

Users select Experiences. Experiences reference Modes. Modes use Behaviours.

### Presets vs Modes

| Concept | Location | Scope |
|---------|----------|-------|
| **Preset** | `presets/` | Full site (Content + Experience + Chrome) |
| **Mode** | `experience/modes/` | Animation behavior only |

A preset **includes** a mode selection plus content structure.

### creativeshire/ vs site/

| Aspect | `creativeshire/` | `site/` |
|--------|------------------|---------|
| **Purpose** | The CMS engine | Instance data |
| **Contains** | Components, behaviours, renderers | Schemas, content, config |
| **Portable** | Yes (extractable to npm) | No (site-specific) |

### Widget Categories

| Category | Location | Purpose | Output |
|----------|----------|---------|--------|
| **Primitives** | `widgets/primitives/` | Display actual content (leaf nodes) | React component |
| **Layout** | `widgets/layout/` | Arrange other widgets (containers) | React component |
| **Composite** | `widgets/composite/` | Pre-assembled patterns (factories) | WidgetSchema |

### Composite Levels

| Level | Location | Returns | Used In |
|-------|----------|---------|---------|
| **Section Pattern** | `sections/patterns/` | `SectionSchema` | Page definition |
| **Widget Composite** | `widgets/composite/` | `WidgetSchema` | Section content |

---

## Quick Reference

| Need to... | Go to... |
|------------|----------|
| Add a primitive widget | `creativeshire/content/widgets/primitives/{Name}/` |
| Add a layout widget | `creativeshire/content/widgets/layout/{Name}/` |
| Add a widget composite | `creativeshire/content/widgets/composite/{Name}/` |
| Add a section composite | `creativeshire/content/sections/patterns/{Name}/` |
| Add chrome region | `creativeshire/content/chrome/regions/{Name}.tsx` |
| Add chrome overlay | `creativeshire/content/chrome/overlays/{Name}.tsx` |
| Add experience definition | `creativeshire/experience/experiences/{name}.ts` |
| Add animation mode | `creativeshire/experience/modes/{name}/` |
| Add behaviour | `creativeshire/experience/behaviours/{name}/` |
| Add trigger | `creativeshire/experience/triggers/use{Name}.ts` |
| Add driver | `creativeshire/experience/drivers/{Name}Driver.ts` |
| Define schema types | `creativeshire/schema/{entity}.ts` |
| Define interface contract | `creativeshire/interface/types.ts` |
| Add full preset | `creativeshire/presets/{name}/` |
| Add site page | `site/pages/{name}.ts` |
| Add site content | `site/data/{name}.ts` |
| Override chrome | `site/chrome/{name}.ts` |
| Configure site | `site/config.ts` |

---

## The Three Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      creativeshire/presets/                      │
│                         (Starting Points)                        │
│                                                                  │
│   showcase/  ->  experience: { mode: 'parallax' }               │
│                  chrome: { header, footer }                      │
│                  pages: { home, about, work }                    │
└─────────────────────────────────────────────────────────────────┘
                              │ extends
                              v
┌─────────────────────────────────────────────────────────────────┐
│                            site/                                 │
│                       (Instance Data)                            │
│                                                                  │
│   config.ts  ->  { ...showcasePreset, mode: 'reveal' }          │
│   pages/     ->  Page schemas with actual content                │
│   data/      ->  Projects, testimonials, etc.                    │
└─────────────────────────────────────────────────────────────────┘
                              │ consumed by
                              v
┌─────────────────────────────────────────────────────────────────┐
│                     creativeshire/renderer/                      │
│                                                                  │
│   SiteRenderer -> PageRenderer -> SectionRenderer -> Widget      │
└─────────────────────────────────────────────────────────────────┘
                              │ uses primitives from
                              v
┌─────────────────────────────────────────────────────────────────┐
│   creativeshire/content/           creativeshire/experience/     │
│   (LAYER 1: Content)               (LAYER 2: Experience)         │
│                                                                  │
│   widgets/                         modes/                        │
│   sections/                        behaviours/                   │
│   chrome/                          drivers/                      │
│                                    triggers/                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## See Also

- [Platform Context](../core/platform.spec.md) - Creativeshire platform relationship
- [Content Layer](../layers/content.spec.md) - Widgets, sections, chrome, features
- [Experience Layer](../layers/experience.spec.md) - Experiences, modes, behaviours, drivers
- [Interface Layer](../layers/interface.spec.md) - Platform ↔ Engine contract
- [Preset Layer](../layers/preset.spec.md) - Full site configurations
- [Schema Layer](../layers/schema.spec.md) - Type definitions
- [Renderer Layer](../layers/renderer.spec.md) - Schema-to-component bridges
- [Site Instance Layer](../layers/site-instance.spec.md) - Instance data organization
