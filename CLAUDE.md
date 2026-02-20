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
import { noirPreset } from '@creativeshire/engine/presets'
```

### Subpath Imports

```typescript
import { SiteRenderer } from '@creativeshire/engine/renderer'
import type { SiteSchema } from '@creativeshire/engine/schema'
import { noirPreset } from '@creativeshire/engine/presets'
```

---

## Widget Hierarchy

```
GLOBAL WIDGETS (reusable across 2+ sections)
  primitives/    Text, Image, Icon, Button, Link
  layout/        Stack, Grid, Flex, Split, Container, Box, Marquee
  interactive/   Video, VideoPlayer, EmailCopy
  repeaters/     ExpandRowImageRepeater

SECTION-SCOPED WIDGETS (inside sections/patterns/{Section}/components/)
  Registered via registerScopedWidget('{Section}__{Widget}', Component)
  Side-effect imported in section factory
  NOT in global registry, NOT in meta-registry

  AboutBio__MarqueeImageRepeater
  ProjectCompare__VideoCompare
  ProjectGallery__FlexGalleryCardRepeater
  ProjectShowcase__FlexButtonRepeater (with IndexNav colocated inside)
  ProjectTabs__TabbedContent
  TeamShowcase__StackVideoShowcase
  ProjectFeatured/components/ProjectCard (factory helper, no scoped registration)
```

**Widget placement decision tree:**
- Used by 2+ sections → global (`widgets/`)
- Used by 1 section, has React state → section-scoped (`sections/patterns/{Section}/components/`)
- Purely structural repetition → inline in section factory using Stack/Flex + `__repeat`

**Repeater naming convention:** `[LayoutType][ContentType]Repeater`
- **LayoutType** = how items are arranged (Marquee, Stack, Row, ExpandRow, Grid, Flex)
- **ContentType** = what widget/pattern each item renders as (Image, Text, ProjectCard)
- Use engine widget/layout names only — no domain terms like "Logo" or "Gallery"

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
│ • Primitives     │ • Experiences     │
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
├── config/                Breakpoints, responsive constants
├── styles/                container-queries.css
├── styles.css             Global engine styles
├── themes/                Theme definitions, registry, utils
├── content/
│   ├── actions/           Action pub/sub (index, resolver, scanner)
│   ├── widgets/
│   │   ├── primitives/    Text, Image, Icon, Button, Link
│   │   ├── layout/        Stack, Grid, Flex, Split, Container, Box, Marquee
│   │   ├── interactive/   Video, VideoPlayer, EmailCopy
│   │   └── repeaters/     ExpandRowImageRepeater (multi-section)
│   ├── sections/
│   │   └── patterns/      HeroVideo, AboutBio, ProjectGallery...
│   │       └── {Section}/components/  Section-scoped widgets
│   └── chrome/
│       ├── patterns/      FixedNav, ContactFooter, FloatingContact...
│       └── overlays/      Modal, CursorLabel, SlideIndicators...
├── experience/
│   ├── behaviours/        Named by TRIGGER
│   │   ├── scroll/        progress, direction, velocity
│   │   ├── hover/         state (--hover: 0|1)
│   │   ├── visibility/    in-view (--visible: 0|1)
│   │   ├── animation/     continuous (marquee, pulse)
│   │   ├── interaction/   toggle (--active: 0|1)
│   │   ├── intro/         Intro-specific behaviours
│   │   └── video/         Video frame tracking
│   ├── effects/           Named by MECHANISM
│   │   ├── color-shift/   Color/blend transitions
│   │   ├── emphasis/      spin, pulse, shake, bounce
│   │   ├── fade/          Opacity-based animations
│   │   ├── marquee/       Infinite scroll animation
│   │   ├── mask/          wipe, reveal
│   │   ├── overlay/       Background overlay darkening
│   │   ├── reveal/        Progressive clip-path reveals
│   │   └── transform/     slide, scale
│   ├── drivers/           Continuous: CSS vars at 60fps (ScrollDriver, MomentumDriver)
│   ├── timeline/          Discrete: play → complete
│   │   ├── EffectTimeline Parallel/sequential track orchestration
│   │   ├── animateElement CSS class-based animation Promise wrapper
│   │   └── gsap/          GSAP reveal transitions (wipe, expand, fade)
│   ├── experiences/       stacking, slideshow, infinite-carousel...
│   ├── lifecycle/         SectionLifecycleProvider
│   ├── navigation/        Page transitions, keyboard/swipe/wheel nav
│   ├── transitions/       Transition registry + fade config
│   └── triggers/          React hooks for behaviours
├── intro/                 Intro sequences, triggers, provider
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

### Figma → Code Workflow

Design sections in Figma using synced theme variables, then implement with Claude:

1. **Sync tokens:** `FIGMA_TOKEN=xxx npx tsx scripts/figma-sync.ts` — pushes theme variables to Figma
2. **Design in Figma** using only Figma variables (Colors, Typography, Spacing collections) — no freestyle hex values
3. **Implement:** Point Claude at the Figma frame via MCP tools → follows the [Section from Figma workflow](.claude/skills/engine/SKILL.md) → wires all CSS to theme variables
4. **Verify:** All CSS uses `var(--*)` tokens, `npm run test:arch` passes, light/dark themes work

Variable mapping reference: [theme-contract.spec.md](.claude/skills/engine/specs/reference/theme-contract.spec.md#figma--css-variable-mapping)

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
   | `ClientNameHero` | `Hero` pattern with settings |
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

7. **CSS variables must be in SSR HTML:** Set theme CSS variables as inline styles on the React element (not via hooks) so they're present in server-rendered HTML — zero FOUC. Only use hooks (`useLayoutEffect`) for variables that must be on `document.documentElement`. See `SiteRenderer.tsx` `buildThemeStyle()` + `useThemeVariables` for the reference pattern.

8. **Use container query units (`cqw`/`cqh`), not viewport units (`vw`/`vh`):** Widgets and sections size relative to the site container, not the viewport. The site container may be narrower than the viewport (max-width on ultrawide) or embedded in an iframe. `cqw`/`cqh` respect the actual container; `vw`/`vh` don't.

   | ❌ Viewport units | ✅ Container query units |
   |---|---|
   | `font-size: 6vw` | `font-size: 6cqw` |
   | `width: 50vw` | `width: 50cqw` |
   | `padding: 2vh 3vw` | `padding: 2cqh 3cqw` |
   | `height: 100vh` | `height: 100cqh` (or `100dvh` for fullscreen sections) |

   **Exceptions:** `dvh` is acceptable for full-viewport section heights. `100vw` in overlay positioning calcs is intentional (fixed-position overlays are viewport-relative).

9. **Use existing props/variants/theme before adding CSS:** Widgets already have configurable variants, settings, and theme-driven styles. Before writing ANY custom CSS, check the widget's `meta.ts` settings and the theme contract. The answer is almost always "set a prop" or "use a theme variable," not "add a stylesheet."

   **Decision order:**
   1. Does the widget have a setting/variant for this? → Use it (`variant: 'hover-underline'`)
   2. Does the theme contract have a variable? → Use it (`var(--link-color)`)
   3. Can an existing widget setting be extended? → Add a choice to the existing setting
   4. None of the above? → Only then write CSS, and put it in the widget's own `styles.css`

   | ❌ Layered CSS | ✅ Use what exists |
   |---|---|
   | Custom `.hover-underline { border-bottom... }` | `variant: 'hover-underline'` on Link widget |
   | `.section-title { font-size: 3rem; color: white }` | Theme variables + Text widget settings |
   | New `pattern-overrides.css` file | Props on the widget schema |
   | Section-level CSS overriding widget internals | Widget's own settings/variants |

   **Why:** Layered CSS creates invisible coupling. When someone changes a widget's internals, the layered CSS breaks silently. Props and theme variables are the contract — CSS files are implementation details that should stay inside their widget.
