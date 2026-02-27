# Creativeshire Engine

A CMS engine library. Think Squarespace/Webflow. Everything is generic and configurable.

## Package Info

This is a **library package** (`@creativeshire/engine`).

- Exports components for use by creativeshire-platform
- Does NOT know about platform (auth, routing, API)
- Framework-agnostic — platform injects Image/Link/router via `EngineProvider`
- React is a peer dependency (platform provides it)
- Local development uses Storybook (`npm run storybook`)

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
│ • Primitives     │ • Compositions    │
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
│   │   ├── effect-track   Bridge: EffectPrimitive → EffectTimeline track
│   │   ├── primitives/    Shared effect primitives (wipe, expand, fade, overlay-fade)
│   │   └── gsap/          GSAP reveal hook + RevealTransition component
│   ├── compositions/      stacking, slideshow, infinite-carousel...
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

Use **Playwright MCP** (`mcp__next-devtools__browser_eval`) for browser automation — NOT the Chrome extension (`mcp__claude-in-chrome__*`). Playwright is the available tool for screenshots, navigation, and console checks.

Browser automation captures **screenshots** (static snapshots). It cannot perceive motion.

| ✅ Use browser for | ❌ Don't use browser for |
|---|---|
| L1 layout verification | L2 animations/transitions |
| Checking elements render | Evaluating timing/easing |
| Responsive breakpoints | Scroll-based effects |
| Reference site analysis | Hover state "feel" |
| Console error checking | Any 60fps experience work |

**Playwright quick reference:**
```
# Start browser
browser_eval(action: "start")

# Navigate + screenshot
browser_eval(action: "navigate", url: "http://localhost:3000")
browser_eval(action: "screenshot")

# Check console errors
browser_eval(action: "console_messages", errorsOnly: true)

# Close when done
browser_eval(action: "close")
```

**For L2 work:** Verify through code review (CSS variables set? behaviour wired?) and ask user for feedback on motion feel. Screenshots of animations are meaningless.

## Replicating a Prototype

When given ANY design reference (screenshot, Figma export, reference website, or description).

**Build order:** Hardcode exact copy → Visual verify each section → Page assembly → Extract to theme → L2 experience.

**Media rule:** ALWAYS use actual media from the reference — real images, real videos, real text. NEVER use picsum.photos, "Lorem ipsum", or "Sample Project 1, 2, 3". Visual verification is meaningless with placeholder content.

### Phase 1: Audit

Run `npm run inventory:quick` to see all available bricks, then classify every element:

| Design Element | Engine Brick | Where |
|---|---|---|
| Persistent header/footer | Chrome pattern | `chrome/patterns/` |
| Page content block | Section pattern | `sections/patterns/` |
| Reusable UI atom | Global widget | `widgets/` |
| Section-specific stateful component | Scoped widget | `{Section}/components/` |
| Scroll/hover/visibility trigger | Behaviour | `behaviours/{trigger}/` |
| CSS animation mechanism | Effect | `effects/{mechanism}/` |
| Section orchestration mode | Composition | `compositions/` |
| Page enter/exit animation | Transition | `transitions/` |

For each: mark as **EXISTS** / **NEEDS VARIANT** / **MISSING**.

For each EXISTS section/chrome, **read its `anatomy.md`** — does it match the reference?

Build any MISSING bricks via scaffolding scripts. Expand existing bricks for NEEDS VARIANT (additive only, never remove existing variants).

| What to scaffold | Script |
|---|---|
| L1 section pattern (incl. content.ts) | `npm run create:section {Name}` |
| L2 behaviour | `npm run create:behaviour {cat}/{name}` |
| L2 effect CSS | `npm run create:effect {mechanism}/{name}` |
| Chrome pattern (incl. content.ts) | `npm run create:chrome {Name} --slot {slot}` |
| Preset (pages, contract, sample content) | `npm run create:preset {Name} [--pages home,about]` |
| Global widget (4 files + 3 registries) | `npm run create:widget {Name} -- --category {primitives\|layout\|interactive\|repeaters}` |
| Experience composition | `npm run create:composition {id} [-- --category scroll-driven]` |
| Effect primitive (timeline) | `npm run create:primitive {id}` |
| Intro sequence | `npm run create:intro {id} [-- --pattern timed]` |
| Page transition | `npm run create:transition {id} [-- --category fade]` |

Scripts auto-register in the appropriate barrel/registry files. After scaffolding, fill in the generated TODO placeholders.

Each brick must be GENERIC and REUSABLE — no site-specific names, no hardcoded content.
Content field declarations live in the section's own `content.ts`, not the preset.

### Phase 2: L1 Hardcoded Copy (section by section)

Work through ONE section at a time, top to bottom on the page. Do NOT move to the next section until the current one visually matches the reference.

For each section:

1. **Read the `anatomy.md`** — understand layout, typography scales, defaults, style override points
2. **Extract real content** from the reference:
   - Download/reference actual images and videos (NO placeholders)
   - Copy actual text content (headings, body, labels, CTAs)
   - Note actual colors, spacing, font sizes as literal values
3. **Configure** the section factory call:
   - Pass real content as direct props (hardcoded strings, not binding expressions yet)
   - Use `style` overrides with hardcoded CSS values where needed (hex colors, px/rem spacing)
   - Set meta settings (layout variants, toggles) based on anatomy.md
4. **Render** in Storybook section story
5. **Visual verification** (see checklist below)
6. **Fix** discrepancies until the section matches
7. **Sign off** — move to next section only when this one matches

### Phase 3: Page Assembly

1. Create preset: `npm run create:preset {Name} [--pages ...]`
2. Wire validated sections into preset pages
3. Configure chrome (header/footer) — also validate visually one at a time
4. Render full page in Storybook preset story
5. Screenshot full page → verify section flow, spacing, chrome interaction
6. Fix page-level issues

### Phase 4: Theme Extraction

Mechanical find-and-replace — convert hardcoded values to theme variables. Reference each section's `anatomy.md` "Theme Variable Mapping" table.

1. **Colors:** Replace hardcoded hex → `var(--text-primary)`, `var(--accent)`, etc.
2. **Spacing:** Replace hardcoded rem/px → `var(--spacing-md)`, `var(--spacing-section-x)`, etc.
3. **Fonts:** Replace font stacks → `var(--font-heading)`, `var(--font-paragraph)`, etc.
4. **Motion:** Replace durations/easings → `var(--duration-normal)`, `var(--ease-default)`, etc.
5. **Create or select** theme definition that produces the extracted values
6. **Convert content** from hardcoded strings to binding expressions: `{{ content.section.field }}`
7. **Build** `content-contract.ts` and `sample-content.ts` from section `content.ts` declarations

**Verify:** Switch themes in Storybook toolbar → confirm output still looks correct. `npm run test:arch` → confirm architectural compliance.

### Phase 5: L2 Experience (only after L1 is solid)

1. Identify animations in reference (scroll, hover, intro, transitions)
2. Map to existing behaviours (anatomy.md lists common pairings)
3. Wire `sectionBehaviours` + `chromeBehaviours` in experience composition
4. For motion: describe intent to user, ask for feedback (can't screenshot motion)

### Visual Verification Checklist

Run after EVERY section and chrome pattern. Do NOT skip this step.

```
1. Storybook running? → npm run storybook
2. Navigate to section story → L1 Content/Sections/{Name}
3. Screenshot via Playwright:
   browser_eval(action: "navigate", url: "http://localhost:6006/?path=/story/...")
   browser_eval(action: "screenshot")
4. Compare to the SPECIFIC AREA of the reference for this section
5. Checklist:
   □ Font sizes match? (relative proportions, not exact pixels)
   □ Font weights match? (bold/regular/light)
   □ Spacing proportions match? (gaps between elements)
   □ Alignment matches? (left/center/right)
   □ Colors match the reference?
   □ Media is actual reference content? (not placeholders)
   □ Layout structure correct? (stack vs flex vs grid)
6. Fix discrepancies → re-screenshot → re-compare
7. Move to next section ONLY when this one matches
```

## References

| Topic | Location |
|-------|----------|
| **Architecture** | [SKILL.md](.claude/skills/engine/SKILL.md) |
| **All Specs** | [specs/index.spec.md](.claude/skills/engine/specs/index.spec.md) |
| **Audit/Refactor** | [ARCHITECTURE-AUDIT.md](.claude/ARCHITECTURE-AUDIT.md) |
| **Widget Builders** | `engine/builders/` |
| **Content Utilities** | `engine/presets/content-utils.ts` |

## Agent Tooling

Scaffolding scripts and utilities the agent should use automatically when building bricks. **Always scaffold before implementing** — scripts handle registration, barrel imports, and boilerplate.

| Script | When to use |
|--------|-------------|
| `npm run create:section {Name}` | Building a new section pattern |
| `npm run create:behaviour {cat}/{name}` | Building a new behaviour |
| `npm run create:effect {mech}/{name}` | Building a new effect CSS file |
| `npm run create:chrome {Name} --slot {slot}` | Building a new chrome pattern |
| `npm run create:preset {Name} [--pages home,about]` | Building a new preset |
| `npm run create:widget {Name} -- --category {cat}` | Building a new global widget |
| `npm run create:composition {id} [-- --category {cat}]` | Building a new composition |
| `npm run create:primitive {id}` | Building a new effect primitive |
| `npm run create:intro {id} [-- --pattern {pat}]` | Building a new intro sequence |
| `npm run create:transition {id} [-- --category {cat}]` | Building a new page transition |
| `npm run inventory:quick` | Before building — discover existing bricks to reuse |
| `npm run test:arch` | After building — validate structure, registration, naming |

Slash commands (user-invocable):

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

10. **Settings taxonomy (4 tiers):** Every meta setting must fit one of four tiers. Max 12 visible settings per brick.
    - **Essential** (visible): Mode switches, layout choices (4-10 per section)
    - **Style** (visible, `group: 'Style'`): Colors, shadows, spacing presets
    - **Advanced** (`advanced: true`): Timing, offsets, multipliers — collapsed in CMS
    - **Preset-only** (`hidden: true`): CSS values, scales, layout internals — never in CMS

    Content data (text, images, collections) belongs in `content.ts`, never `meta.ts`.
    Typography scales are factory decisions, not user settings — use `textSizeMultiplierSetting()` (Advanced) for hero titles only.
    See: [settings-taxonomy.spec.md](.claude/skills/engine/specs/reference/settings-taxonomy.spec.md)

## Blast Radius Rules

**These rules protect hosted sites from agent-caused regressions.**

### SAFE — Agents do freely (zero sites affected)

- Create new section patterns, chrome patterns, overlays
- Create new global widgets, behaviours, effects, experiences, transitions
- Add new variants/choices to existing widget meta settings
- Create new presets

### REQUIRES EXPLICIT USER APPROVAL

- Modify existing global widget rendering logic
- Change existing section pattern factory output
- Remove any widget variant, setting, or prop
- Modify behaviour `compute()` functions that are in use
- Change effect CSS that existing behaviours depend on
- Modify schema types in breaking ways

### NEVER

- Remove a widget setting choice (breaks sites using that choice)
- Rename a `patternId` (breaks site schemas referencing it)
- Change widget `type` strings (breaks widget registry lookups)
- Remove a behaviour ID (breaks presets referencing it)
- Delete an effect data-attribute selector (breaks widgets using it)

### Widget Expansion Policy

| Scenario | Action |
|---|---|
| 2+ sections need same interactive element | Expand existing global widget with additive variant |
| 1 section needs stateful component | Create section-scoped widget |
| New section looks similar to existing | Create NEW section pattern, reuse same widgets |
| Existing widget almost works | Add new `variant` choice to meta settings (additive) |

**Never** make an existing section "flexible enough" to serve a different purpose. Create a new pattern.
