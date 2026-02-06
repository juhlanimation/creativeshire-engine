# Folder Structure Reference

> Quick reference for Creativeshire directory organization.

---

## Overview

| Folder | Purpose | Who Edits | Portable |
|--------|---------|-----------|----------|
| `engine/` | The CMS engine (components, behaviours, renderers) | Developers | Yes (future npm) |
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
├── engine/                       # THE CMS ENGINE
│   │
│   ├── schema/                          # INTERFACES & TYPES
│   │   ├── index.ts                     # Re-exports all
│   │   ├── site.ts, page.ts             # SiteSchema, PageSchema
│   │   ├── section.ts, widget.ts        # SectionSchema, WidgetSchema
│   │   ├── chrome.ts                    # ChromeSchema
│   │   ├── experience.ts                # ExperienceConfig, BehaviourConfig
│   │   ├── version.ts                   # ENGINE_VERSION, compatibility utils
│   │   └── shell.ts                     # ShellConfig (platform wrapper)
│   │
│   ├── content/                         # LAYER 1: WHAT'S ON THE PAGE
│   │   │
│   │   ├── widgets/
│   │   │   ├── primitives/              # LEAF NODES
│   │   │   │   └── {Name}/              # Text, Image, Icon, Button, Link
│   │   │   │       ├── index.tsx        # React component
│   │   │   │       ├── types.ts         # Props interface
│   │   │   │       ├── meta.ts          # ComponentMeta for platform UI
│   │   │   │       └── styles.css       # CSS with var() mappings
│   │   │   │
│   │   │   ├── layout/                  # CONTAINERS
│   │   │   │   └── {Name}/              # Flex, Grid, Stack, Split, etc.
│   │   │   │       ├── index.tsx
│   │   │   │       ├── types.ts
│   │   │   │       └── meta.ts          # ComponentMeta for platform UI
│   │   │   │
│   │   │   ├── patterns/                # FACTORY FUNCTIONS → WidgetSchema
│   │   │   │   └── {Name}/              # ProjectCard, LogoLink, etc.
│   │   │   │       ├── index.ts         # create{Name}(props) -> WidgetSchema
│   │   │   │       ├── types.ts
│   │   │   │       └── meta.ts          # ComponentMeta (component: false)
│   │   │   │
│   │   │   └── interactive/             # STATEFUL REACT COMPONENTS
│   │   │       └── {Name}/              # Video, VideoPlayer, ContactPrompt, etc.
│   │   │           ├── index.tsx        # React component with hooks/state
│   │   │           ├── types.ts
│   │   │           ├── meta.ts          # ComponentMeta (component: true)
│   │   │           └── styles.css       # Component-specific styles
│   │   │
│   │   ├── sections/
│   │   │   ├── Section.tsx              # Base section component
│   │   │   ├── types.ts
│   │   │   └── patterns/                # SECTION FACTORIES
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
│   ├── intro/                           # INTRO SEQUENCES (L2 SUB-LAYER)
│   │   ├── types.ts                     # IntroPhase, IntroState, IntroConfig, IntroPattern
│   │   ├── IntroProvider.tsx            # Provider, store, scroll locking
│   │   ├── IntroContext.ts              # React context, useIntro()
│   │   ├── IntroTriggerInitializer.tsx  # Wires triggers based on pattern
│   │   ├── registry.ts                  # Pattern registry
│   │   ├── index.ts                     # Barrel export
│   │   ├── patterns/                    # INTRO PATTERN DEFINITIONS
│   │   │   ├── index.ts                 # Registers all, exports
│   │   │   └── {name}/                  # video-gate, timed, scroll-reveal
│   │   │       ├── index.ts             # IntroPattern definition
│   │   │       └── meta.ts             # SettingsConfig for CMS
│   │   └── triggers/                    # INTRO TRIGGER HOOKS
│   │       ├── index.ts                 # Barrel export
│   │       └── use{Name}.ts            # useVideoTime, useTimer, usePhaseController
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
│   │   │   ├── intro/                   # Intro-phase behaviours
│   │   │   │   ├── index.ts            # Auto-registers all
│   │   │   │   ├── content-reveal.ts   # --intro-opacity, --intro-y
│   │   │   │   ├── text-reveal.ts      # --intro-text-opacity, --intro-text-y
│   │   │   │   ├── chrome-reveal.ts    # --chrome-opacity, --chrome-y
│   │   │   │   └── scroll-indicator.ts # --scroll-indicator-opacity
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
│   │   ├── EngineStore.ts               # Zustand store for schema state
│   │   ├── EngineProvider.tsx           # Root provider wrapping engine
│   │   ├── useEngineController.ts       # Hook for platform control
│   │   └── validation/                  # Runtime constraint validators
│   │
│   ├── migrations/                      # SCHEMA VERSION TRANSFORMS
│   │   ├── types.ts                     # Migration interface
│   │   ├── index.ts                     # Migration runner
│   │   └── v{X.Y.Z}/                    # Migrations per version
│   │
│   ├── validation/                      # BUILD-TIME VALIDATION
│   │   └── site-validator.ts            # assertValidSite()
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

### engine/ vs site/

| Aspect | `engine/` | `site/` |
|--------|------------------|---------|
| **Purpose** | The CMS engine | Instance data |
| **Contains** | Components, behaviours, renderers | Schemas, content, config |
| **Portable** | Yes (extractable to npm) | No (site-specific) |

### Widget Categories

| Category | Location | Purpose | Output |
|----------|----------|---------|--------|
| **Primitives** | `widgets/primitives/` | Leaf nodes (Text, Image, Icon, Button, Link) | React component |
| **Layout** | `widgets/layout/` | Containers (Flex, Grid, Stack, Split, etc.) | React component |
| **Patterns** | `widgets/patterns/` | Factory functions (ProjectCard, LogoLink) | WidgetSchema |
| **Interactive** | `widgets/interactive/` | Stateful components (Video, VideoPlayer, etc.) | React component |

### Pattern Levels

| Level | Location | Returns | Used In |
|-------|----------|---------|---------|
| **Section Pattern** | `sections/patterns/` | `SectionSchema` | Page definition |
| **Widget Pattern** | `widgets/patterns/` | `WidgetSchema` | Section content |

### ComponentMeta System

Every component folder has a `meta.ts` file that provides platform UI hints:

| Field | Purpose |
|-------|---------|
| `id` | Unique component identifier |
| `name` | Human-readable display name |
| `category` | primitive, layout, pattern, interactive, section, region, overlay |
| `component` | true = React component, false = factory function |
| `settings` | SettingConfig for each configurable prop |

---

## Quick Reference

| Need to... | Go to... |
|------------|----------|
| Add a primitive widget | `engine/content/widgets/primitives/{Name}/` |
| Add a layout widget | `engine/content/widgets/layout/{Name}/` |
| Add a widget pattern | `engine/content/widgets/patterns/{Name}/` |
| Add an interactive widget | `engine/content/widgets/interactive/{Name}/` |
| Add a section pattern | `engine/content/sections/patterns/{Name}/` |
| Add chrome region | `engine/content/chrome/regions/{Name}.tsx` |
| Add chrome overlay | `engine/content/chrome/overlays/{Name}.tsx` |
| Add intro pattern | `engine/intro/patterns/{name}/` |
| Add intro trigger | `engine/intro/triggers/use{Name}.ts` |
| Add experience definition | `engine/experience/experiences/{name}.ts` |
| Add animation mode | `engine/experience/modes/{name}/` |
| Add behaviour | `engine/experience/behaviours/{name}/` |
| Add trigger | `engine/experience/triggers/use{Name}.ts` |
| Add driver | `engine/experience/drivers/{Name}Driver.ts` |
| Define schema types | `engine/schema/{entity}.ts` |
| Define interface contract | `engine/interface/types.ts` |
| Add a migration | `engine/migrations/v{X.Y.Z}/{name}.ts` |
| Add build-time validation | `engine/validation/site-validator.ts` |
| Add full preset | `engine/presets/{name}/` |
| Add site page | `site/pages/{name}.ts` |
| Add site content | `site/data/{name}.ts` |
| Override chrome | `site/chrome/{name}.ts` |
| Configure site | `site/config.ts` |

---

## The Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      PLATFORM (external)                         │
│                   Creativeshire CMS / Editor                     │
└─────────────────────────────────────────────────────────────────┘
                              │ passes schema via
                              v
┌─────────────────────────────────────────────────────────────────┐
│                   engine/interface/                       │
│                    (Platform ↔ Engine)                           │
│                                                                  │
│   EngineProvider  ->  Wraps engine, exposes controller           │
│   EngineStore     ->  Zustand state with validation              │
│   Events          ->  onReady, onError, onStateChange            │
└─────────────────────────────────────────────────────────────────┘
                              │ validates & renders
                              v
┌─────────────────────────────────────────────────────────────────┐
│                      engine/presets/                      │
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
│                     engine/renderer/                      │
│                                                                  │
│   SiteRenderer -> PageRenderer -> SectionRenderer -> Widget      │
└─────────────────────────────────────────────────────────────────┘
                              │ uses primitives from
                              v
┌─────────────────────────────────────────────────────────────────┐
│   engine/content/           engine/experience/     │
│   (LAYER 1: Content)               (LAYER 2: Experience)         │
│                                                                  │
│   widgets/                         modes/                        │
│   sections/                        behaviours/                   │
│   chrome/                          drivers/                      │
│                                    triggers/                     │
└─────────────────────────────────────────────────────────────────┘
                              │ validated by
                              v
┌─────────────────────────────────────────────────────────────────┐
│   engine/schema/            engine/validation/     │
│   (Types + Version)                (Build-time Checks)           │
│                                                                  │
│   migrations/                      assertValidSite()             │
│   (Version Transforms)                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## See Also

- [Platform Context](../core/platform.spec.md) - Creativeshire platform relationship
- [Content Layer](../layers/content.spec.md) - Widgets, sections, chrome, features
- [Intro Layer](../layers/intro.spec.md) - Intro sequences, patterns, triggers
- [Experience Layer](../layers/experience.spec.md) - Experiences, modes, behaviours, drivers
- [Interface Layer](../layers/interface.spec.md) - Platform ↔ Engine contract
- [Preset Layer](../layers/preset.spec.md) - Full site configurations
- [Schema Layer](../layers/schema.spec.md) - Type definitions
- [Renderer Layer](../layers/renderer.spec.md) - Schema-to-component bridges
- [Site Instance Layer](../layers/site-instance.spec.md) - Instance data organization
