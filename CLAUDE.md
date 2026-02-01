# Creativeshire Engine

A CMS engine library. Think Squarespace/Webflow. Everything is generic and configurable.

## Package Info

This is a **library package** (`@creativeshire/engine`).

- Exports components for use by creativeshire-platform
- Does NOT know about platform (auth, routing, API)
- React is a peer dependency (platform provides it)
- Local development uses `app/` folder (not exported)

### Importing (from platform)

```typescript
import { SiteRenderer } from '@creativeshire/engine'
import { bojuhlPreset } from '@creativeshire/engine/presets'
```

### Subpath Imports

```typescript
import { SiteRenderer } from '@creativeshire/engine/renderer'
import type { SiteSchema } from '@creativeshire/engine/schema'
import { bojuhlPreset } from '@creativeshire/engine/presets'
```

---

## Widget Hierarchy

```
PRIMITIVES (atoms - no children, single purpose)
  Text, Image, Icon, Button, Link

LAYOUT (structure - holds children)
  Stack, Grid, Flex, Split, Container, Box

PATTERNS (factory functions → WidgetSchema)
  ProjectCard = createProjectCard() → {type: 'Flex', widgets: [...]}
  LogoLink = createLogoLink() → {type: 'Link', widgets: [...]}

INTERACTIVE (React components with state)
  Video = hover-play, visibility, modal integration
  VideoPlayer = controls, scrubber, fullscreen
  ContactPrompt = copy-to-clipboard, flip animation
  ExpandableGalleryRow = coordinated hover expansion
  GalleryThumbnail = expandable with metadata
```

## Architecture

```
PLATFORM             Creativeshire CMS (external)
       ↓             (passes schema, receives events)
INTERFACE            EngineProvider, Controller, Events
       ↓             (validates, manages state, live updates)
SITE INSTANCE        site/config.ts, site/pages/
       ↓             (the assembled site - what gets deployed)
PRESET               engine/presets/{name}/
       ↓             (template copied as starting point)
RENDERER             Site → Page → Section → Widget
       ↓
┌──────────────────┬───────────────────┐
│ L1 CONTENT       │ L2 EXPERIENCE     │
│ (renders once)   │ (animates 60fps)  │
│                  │                   │
│ • Primitives     │ • Modes           │
│ • Layout         │ • Behaviours      │
│ • Patterns       │ • Effects         │
│ • Interactive    │                   │
│ • Sections       │ • Drivers         │
│ • Chrome         │ • Triggers        │
└──────────────────┴───────────────────┘
         ↕ CSS Variables ↕

SCHEMA               TypeScript types + version
VALIDATION           Build-time checks (assertValidSite)
MIGRATIONS           Version transforms (auto at build)
```

**L1/L2 Rule:** Content renders. Experience animates. They communicate via CSS variables only.

**Behaviour/Effect split:**
```
BEHAVIOUR (trigger)  →  Sets CSS variable VALUE
                        --visible: 1, --scroll: 0.5

EFFECT (animation)   →  Defines HOW value animates
                        transition: opacity 400ms ease
```

Behaviours named by TRIGGER: `scroll/`, `hover/`, `visibility/`
Effects named by MECHANISM: `fade`, `transform/`, `mask/`

## File Locations

```
engine/
├── content/
│   ├── widgets/
│   │   ├── primitives/    Text, Image, Icon, Button, Link
│   │   ├── layout/        Stack, Grid, Flex, Split, Container, Box
│   │   ├── patterns/      Factory functions → WidgetSchema
│   │   └── interactive/   React components with state
│   ├── sections/
│   │   └── patterns/      Hero, About, ProjectGrid...
│   └── chrome/
│       ├── regions/       Header, Footer, Sidebar
│       └── overlays/      Modal, CursorLabel...
├── experience/
│   ├── behaviours/        Named by TRIGGER
│   │   ├── scroll/        progress, direction, velocity
│   │   ├── hover/         state (--hover: 0|1)
│   │   ├── visibility/    in-view (--visible: 0|1)
│   │   ├── animation/     continuous (marquee, pulse)
│   │   └── interaction/   toggle (--active: 0|1)
│   ├── effects/           Named by MECHANISM
│   │   ├── fade.css       Opacity (single file)
│   │   ├── transform/     slide, scale, rotate, flip
│   │   ├── mask/          wipe, expand
│   │   ├── emphasis/      pulse, shake, bounce
│   │   └── page/          Route transitions (later)
│   ├── drivers/           ScrollDriver, VisibilityDriver
│   └── modes/             stacking, parallax...
├── interface/             Platform ↔ Engine contract
│   ├── EngineProvider     Root provider with controller
│   ├── EngineStore        Zustand state management
│   └── validation/        Runtime constraint validators
├── migrations/            Schema version transforms
├── validation/            Build-time schema validation
├── presets/{name}/        Site-specific configurations
├── renderer/              SiteRenderer, SectionRenderer...
└── schema/                TypeScript types + version + shell
```

## How to Work

Just describe what you want. For non-trivial work:

1. **Plan mode** for complex tasks (Claude enters automatically)
2. **Browser** for L1 layout verification (open reference, compare static result)
3. **Check existing patterns** before creating new ones
4. **Validate visually** when layout matters

Work **top-down**: SITE → PAGE → SECTION → WIDGET. Never start with atoms.

### Browser Tools: When to Use

Browser automation captures **screenshots** (static snapshots). It cannot perceive motion.

| ✅ Use browser for | ❌ Don't use browser for |
|---|---|
| L1 layout verification | L2 animations/transitions |
| Checking elements render | Evaluating timing/easing |
| Responsive breakpoints | Scroll-based effects |
| Reference site analysis | Hover state "feel" |
| Console error checking | Any 60fps experience work |

**For L2 work:** Verify through code review (CSS variables set? behaviour wired?) and ask user for feedback on motion feel. Screenshots of animations are meaningless.

## References

| Topic | Location |
|-------|----------|
| **Architecture** | [SKILL.md](.claude/skills/engine/SKILL.md) |
| **All Specs** | [specs/index.spec.md](.claude/skills/engine/specs/index.spec.md) |
| **Audit/Refactor** | [ARCHITECTURE-AUDIT.md](.claude/ARCHITECTURE-AUDIT.md) |

## Commands (Optional)

| Command | When |
|---------|------|
| `/analyze <url>` | Document patterns for library/reuse |
| `/fix [path] "desc"` | Quick targeted fix |

## Branches

- `sprint/{summary}` - Feature work
- `fix/{desc}` - Quick fixes

## Rules

1. **Think webbuilder, not website:** This is a CMS engine like Squarespace/Webflow. Every widget, section, and behaviour must be GENERALIZED with configurable settings. When copying a site, build generic components that CAN produce that look—not site-specific implementations.

   | ❌ Site-specific | ✅ Generalized |
   |---|---|
   | `BojuhlHero` | `Hero` pattern with settings |
   | `AcmeFooter` | `Footer` region with layout options |
   | Hardcoded colors | Theme variables via settings |

2. **Presets wire components:** Components alone don't render. A preset bundles them into `site/config.ts` and `site/pages/*.ts`. The preset applies site-specific VALUES to generic components.

3. **Colocation over centralization:** Hooks, stores, and triggers live WITH the components that use them, not in central folders.

4. **Visual tools for L1 only:** Use browser for layout comparison and static rendering checks. Never for L2 animation/transition work—screenshots can't show motion.

5. **No backward compatibility shims:** Don't create aliases, adapters, or compatibility layers. Use canonical names directly. Old patterns get deleted and replaced, not aliased. Scattered code is technical debt.

   | ❌ Don't | ✅ Do |
   |---|---|
   | `BEHAVIOUR_ALIASES['old-name'] = 'new/name'` | Delete old, use `new/name` everywhere |
   | Keep old files "just in case" | Delete unused code immediately |
   | Gradual migration with both patterns | One pattern, applied consistently |

6. **Tests must pass before commits:**
   ```
   Before commit:
   1. Run `npm run test:arch`
   2. Report results to user
   3. Ask if they want to proceed
   ```
