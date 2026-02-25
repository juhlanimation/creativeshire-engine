# Brick Factory: Engine Scaffolding & Workflow Plan

> **Purpose:** Reduce prototype → engine translation from ~30min of agent exploration to ~2min of scaffolding + creative translation. Every new prototype enriches the engine's brick library rather than creating one-off implementations.
>
> **Audience:** Engine team (agents + human reviewers). Each task has checkboxes, file paths, and dependencies.

---

## Mental Model: The Lego Factory

```
PROTOTYPE (screenshot, Figma Make, reference site, description)
       ↓
PHASE 1: AUDIT — Disassemble into brick needs
       ↓
PHASE 2: INVENTORY — Check what exists
       ↓
PHASE 3: BUILD MOLDS — Create missing bricks (generic, reusable)
       ↓
PHASE 4: ASSEMBLE — Wire bricks into preset
```

Every brick goes into the **factory** (engine), not into the **box** (preset).
The preset is just assembly instructions.

A "brick" is any engine capability:

| Brick Type | Location | Registry |
|---|---|---|
| Section pattern | `engine/content/sections/patterns/{Name}/` | `sections/registry.ts` |
| Chrome pattern | `engine/content/chrome/patterns/{Name}/` | `chrome/pattern-registry.ts` |
| Chrome overlay | `engine/content/chrome/overlays/{Name}/` | `chrome/registry.ts` |
| Global widget | `engine/content/widgets/{category}/{Name}/` | `widgets/registry.ts` + `meta-registry.ts` |
| Scoped widget | `engine/content/sections/patterns/{Section}/components/` | `registerScopedWidget()` |
| Behaviour | `engine/experience/behaviours/{category}/{name}/` | `registerBehaviour()` auto |
| Effect | `engine/experience/effects/{mechanism}/{name}.css` | `effects/index.css` @import |
| Experience | `engine/experience/experiences/{name}.ts` | `registerExperience()` |
| Page transition | `engine/experience/transitions/{name}/` | `registerPageTransition()` |

---

## Blast Radius Rules

**These rules protect hosted sites from agent-caused regressions.**

### SAFE — Agents do freely (zero sites affected)

- Create new section patterns
- Create new chrome patterns / overlays
- Create new global widgets
- Create new behaviours / effects / experiences / transitions
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

Widgets are the **reuse layer**. Sections are the **composition layer**.

| Scenario | Action |
|---|---|
| 2+ sections need same interactive element | Expand existing global widget with additive variant |
| 1 section needs stateful component | Create section-scoped widget |
| New section looks similar to existing | Create NEW section pattern, reuse same widgets |
| Existing widget almost works | Add new `variant` choice to meta settings (additive) |

**Never** make an existing section "flexible enough" to serve a different purpose. Create a new pattern.

---

## Implementation Phases

### Phase 0: Prerequisites

- [ ] Read and understand this document fully
- [ ] Verify `npm run test:arch` passes on current main branch
- [ ] Verify `npm run inventory` runs and generates `scripts/reports/inventory.md`

---

### Phase 1: Enhanced Inventory Script

> **Goal:** Make `npm run inventory` the single source of truth for what bricks exist.
> **Dependency:** None
> **Files:** `scripts/inventory.ts`

The existing script already covers L1 components well. It needs L2 coverage and a quick-reference summary format.

- [ ] **1.1** Add transitions section to inventory

  The script currently covers: widgets, sections, chrome, behaviours, effects, experiences, drivers, triggers, presets. Missing: **page transitions**.

  ```typescript
  // Add after the Experiences section in generateInventory()
  // Scan: engine/experience/transitions/
  // Pattern: same as experiences (files excluding index.ts, types.ts, registry.ts)
  ```

  **File:** `scripts/inventory.ts` — add a `Transitions` category block (same pattern as Experiences block at line ~371)

- [ ] **1.2** Add quick-reference summary to inventory output

  After the table summary, add a flat list format that agents can scan instantly:

  ```markdown
  ## Quick Reference

  ### Sections (14)
  HeroVideo, HeroTitle, AboutBio, AboutCollage, ContentPricing, ProjectCompare,
  ProjectExpand, ProjectFeatured, ProjectGallery, ProjectShowcase, ProjectStrip,
  ProjectTabs, ProjectVideoGrid, TeamShowcase

  ### Behaviours (19)
  scroll/fade, scroll/fade-out, scroll/cover-progress, scroll/collapse,
  scroll/color-shift, scroll/image-cycle, scroll/progress, scroll/reveal,
  hover/reveal, hover/scale, hover/expand, visibility/fade-in, visibility/center,
  animation/marquee, interaction/toggle, video/frame, intro/content-reveal,
  intro/text-reveal, intro/chrome-reveal, intro/scroll-indicator

  ### Chrome Patterns (8)
  MinimalNav, FixedNav, CenteredNav, ContactFooter, BrandFooter,
  CursorTracker, FloatingContact, VideoModal

  ### Effects (10)
  color-shift, emphasis/spin, emphasis/pulse, fade, marquee-scroll,
  mask/wipe, mask/reveal, overlay-darken, transform/scale, transform/slide

  ### Experiences
  cover-scroll, slideshow, infinite-carousel, ...

  ### Global Widgets (14)
  Text, Image, Icon, Button, Link, Stack, Grid, Flex, Split, Container,
  Box, Marquee, Video, VideoPlayer, EmailCopy, ExpandRowImageRepeater
  ```

  **File:** `scripts/inventory.ts` — add `generateQuickReference()` function, called from `main()`, appended to output

- [ ] **1.3** Add `--quick` flag for agent-friendly compact output

  ```bash
  npm run inventory -- --quick   # Only prints the Quick Reference to stdout
  ```

  **File:** `scripts/inventory.ts` — check `process.argv` for `--quick`, print to stdout instead of file
  **File:** `package.json` — add script: `"inventory:quick": "npx tsx scripts/inventory.ts --quick"`

- [ ] **1.4** Verify inventory output is accurate by running it and comparing to actual file system

---

### Phase 2: Scaffolding Scripts

> **Goal:** One command per brick type. Generates all files + handles registry wiring.
> **Dependency:** None (can be built in parallel with Phase 1)
> **Files:** `scripts/create-section.ts`, `scripts/create-behaviour.ts`, `scripts/create-effect.ts`, `scripts/create-chrome.ts`

#### 2.1: Section Scaffolding

- [ ] **2.1.1** Create `scripts/create-section.ts`

  ```bash
  npm run create:section ProjectHero
  # or with category:
  npm run create:section ProjectHero --category hero
  ```

  **Generates:**

  ```
  engine/content/sections/patterns/ProjectHero/
    ├── index.ts       # Factory stub using widget composition
    ├── types.ts       # Props interface extending BaseSectionProps
    ├── meta.ts        # defineSectionMeta with standard settings
    ├── styles.css     # Section class + var(--*) template comments
    └── preview.ts     # Preview data stub for stories
  ```

  **File:** `scripts/create-section.ts`

  **Generated `index.ts` template:**

  ```typescript
  /**
   * {Name} pattern - factory function.
   *
   * Structure:
   * - TODO: Describe widget hierarchy
   */

  import type { SectionSchema, WidgetSchema } from '../../../../schema'
  import { applyMetaDefaults } from '../../../../schema/settings'
  import type { {Name}Props } from './types'
  import { meta } from './meta'

  export function create{Name}Section(rawProps?: {Name}Props): SectionSchema {
    const p = applyMetaDefaults(meta, rawProps ?? {})

    // TODO: Build widgets
    const widgets: WidgetSchema[] = []

    return {
      id: p.id ?? '{kebab-id}',
      patternId: '{Name}',
      label: p.label ?? '{Display Name}',
      constrained: p.constrained,
      colorMode: p.colorMode,
      layout: { type: 'stack', direction: 'column', align: 'start' },
      style: p.style,
      className: p.className,
      paddingTop: p.paddingTop,
      paddingBottom: p.paddingBottom,
      paddingLeft: p.paddingLeft,
      paddingRight: p.paddingRight,
      sectionHeight: p.sectionHeight ?? 'auto',
      widgets,
    }
  }
  ```

  **Generated `types.ts` template:**

  ```typescript
  import type { BaseSectionProps } from '../base'

  export interface {Name}Props extends BaseSectionProps {
    // === Content ===
    // TODO: Add content props (use binding expressions for CMS)

    // === Media ===
    // TODO: Add media props if needed

    // === Typography ===
    // TODO: Add scale/multiplier props if needed
  }
  ```

  **Generated `meta.ts` template:**

  ```typescript
  import { defineSectionMeta } from '../../../../schema/meta'
  import type { {Name}Props } from './types'

  export const meta = defineSectionMeta<{Name}Props>({
    id: '{Name}',
    name: '{Display Name}',
    description: 'TODO: Describe this section pattern',
    category: 'section',
    sectionCategory: '{category}',  // hero | about | project | content | team
    unique: false,
    icon: 'section',
    tags: ['{tag}'],
    component: false,
    ownedFields: ['layout', 'className'],
    settings: {
      // TODO: Add settings
      // See HeroTitle/meta.ts or AboutBio/meta.ts for examples
    },
  })
  ```

  **Generated `styles.css` template:**

  ```css
  /**
   * {Name} section styles.
   *
   * Available theme variables:
   *   var(--text-primary), var(--text-secondary)
   *   var(--bg-primary), var(--bg-secondary)
   *   var(--spacing-sm), var(--spacing-md), var(--spacing-lg), var(--spacing-xl)
   *   var(--font-heading), var(--font-body)
   *
   * Use cqw/cqh units, NOT vw/vh.
   */

  .section-{kebab-name} {
    /* Section-specific styles here */
  }
  ```

  **Generated `preview.ts` template:**

  ```typescript
  import type { {Name}Props } from './types'

  export const preview{Name}: {Name}Props = {
    colorMode: 'dark',
    // TODO: Add preview props
  }
  ```

- [ ] **2.1.2** Auto-register section in `sections/registry.ts`

  The script must append to three locations in `engine/content/sections/registry.ts`:

  1. **Meta import** (line ~13 area):
     ```typescript
     import { meta as {Name}Meta } from './patterns/{Name}/meta'
     ```

  2. **Registry entry** (inside `sectionRegistry` object):
     ```typescript
     {Name}: createEntry('{Name}', {Name}Meta as SectionMeta,
       async () => (await import('./patterns/{Name}')).create{Name}Section),
     ```

  3. **Factory re-export** (bottom of file):
     ```typescript
     export { create{Name}Section } from './patterns/{Name}'
     export type { {Name}Props } from './patterns/{Name}/types'
     ```

  **File:** `scripts/create-section.ts` — add registry update logic
  **Target:** `engine/content/sections/registry.ts`

- [ ] **2.1.3** Add npm script

  **File:** `package.json` — add: `"create:section": "npx tsx scripts/create-section.ts"`

- [ ] **2.1.4** Test: run `npm run create:section TestSection`, verify files created, registry updated, `npm run test:arch` passes, then delete TestSection and revert registry

---

#### 2.2: Behaviour Scaffolding

- [ ] **2.2.1** Create `scripts/create-behaviour.ts`

  ```bash
  npm run create:behaviour scroll/parallax
  # Format: {category}/{name}
  ```

  **Generates:**

  ```
  engine/experience/behaviours/{category}/{name}/
    ├── index.ts    # Behaviour definition + registerBehaviour()
    └── meta.ts     # defineBehaviourMeta
  ```

  **File:** `scripts/create-behaviour.ts`

  **Generated `meta.ts` template:**

  ```typescript
  import { defineBehaviourMeta } from '../../registry'

  export const meta = defineBehaviourMeta({
    id: '{category}/{name}',
    name: '{Display Name}',
    description: 'TODO: Describe what state this behaviour computes',
    icon: 'animation',
    tags: ['{category}', '{name}'],
    category: '{category}',
  })
  ```

  **Generated `index.ts` template:**

  ```typescript
  /**
   * {category}/{name} behaviour - TODO: describe.
   *
   * CSS Variables Output:
   * - --{name}-xxx: TODO: document outputs
   */

  import type { Behaviour } from '../../types'
  import { registerBehaviour } from '../../registry'
  import { meta } from './meta'

  const {camelName}: Behaviour = {
    ...meta,
    requires: ['prefersReducedMotion'],  // TODO: add required state keys

    cssTemplate: `
      /* TODO: Define CSS that reads variables from compute() */
    `,

    compute: (state, options, element) => {
      if (state.prefersReducedMotion) {
        return {
          // TODO: reduced motion fallback values
        }
      }

      return {
        // TODO: compute CSS variable values from state
      }
    },
  }

  registerBehaviour({camelName})
  export default {camelName}
  ```

- [ ] **2.2.2** Auto-register behaviour in barrel exports

  The script must update two files:

  1. **Category barrel** (`engine/experience/behaviours/{category}/index.ts`):
     ```typescript
     import './{name}'
     export { default as {camelName} } from './{name}'
     ```

  2. **Root barrel** (`engine/experience/behaviours/index.ts`):
     Add to the re-exports section for that category (if new export name).

  **Files:** `scripts/create-behaviour.ts`, target barrels

- [ ] **2.2.3** Add npm script

  **File:** `package.json` — add: `"create:behaviour": "npx tsx scripts/create-behaviour.ts"`

- [ ] **2.2.4** Test: create test behaviour, verify registration, test:arch, cleanup

---

#### 2.3: Effect Scaffolding

- [ ] **2.3.1** Create `scripts/create-effect.ts`

  ```bash
  npm run create:effect transform/flip
  # Format: {mechanism}/{name}
  ```

  **Generates:**

  ```
  engine/experience/effects/{mechanism}/{name}.css
  ```

  **File:** `scripts/create-effect.ts`

  **Generated CSS template:**

  ```css
  /**
   * {mechanism}/{name} effect.
   *
   * Consumes CSS variables set by behaviours.
   * Define HOW the values animate, not WHAT the values are.
   *
   * Pattern: [data-effect~="{name}"] { ... }
   */

  [data-effect~="{name}"] {
    /* TODO: Define animation using behaviour CSS variables */
    /* Example: opacity: var(--section-opacity, 1); */
    /* Example: transition: opacity var(--fade-duration, 300ms) ease-out; */
  }
  ```

- [ ] **2.3.2** Auto-register in `effects/index.css`

  Append `@import './{mechanism}/{name}.css';` under the correct mechanism section header.

  **File:** `scripts/create-effect.ts`, target: `engine/experience/effects/index.css`

- [ ] **2.3.3** Add npm script

  **File:** `package.json` — add: `"create:effect": "npx tsx scripts/create-effect.ts"`

- [ ] **2.3.4** Test: create test effect, verify import added, test:arch, cleanup

---

#### 2.4: Chrome Pattern Scaffolding

- [ ] **2.4.1** Create `scripts/create-chrome.ts`

  ```bash
  npm run create:chrome StickyNav --slot header
  npm run create:chrome DrawerMenu --slot overlay
  ```

  **Generates:**

  ```
  engine/content/chrome/patterns/{Name}/
    ├── index.ts    # Factory function returning PresetRegionConfig or PresetOverlayConfig
    ├── types.ts    # Props interface
    └── meta.ts     # defineChromeMeta with slot info
  ```

  **File:** `scripts/create-chrome.ts`

  **Generated `index.ts` template (region):**

  ```typescript
  import type { PresetRegionConfig } from '../../../../presets/types'
  import type { {Name}Props } from './types'

  export function create{Name}Region(props?: {Name}Props): PresetRegionConfig {
    return {
      widgets: [
        // TODO: Add widget schemas
      ],
      layout: {
        justify: 'space-between',
        align: 'center',
        padding: '1.5rem 2rem',
        ...props?.layout,
      },
      ...(props?.overlay != null && { overlay: props.overlay }),
      ...(props?.style && { style: props.style }),
    }
  }
  ```

  **Generated `index.ts` template (overlay):**

  ```typescript
  import type { PresetOverlayConfig } from '../../../../presets/types'
  import type { {Name}Props } from './types'

  export function create{Name}Overlay(props?: {Name}Props): PresetOverlayConfig {
    return {
      component: '{Name}',
      props: {
        // TODO: Add overlay props
        ...props,
      },
    }
  }
  ```

- [ ] **2.4.2** Auto-register in `chrome/pattern-registry.ts`

  The script must update `engine/content/chrome/pattern-registry.ts`:

  1. **Meta import:**
     ```typescript
     import { meta as {Name}Meta } from './patterns/{Name}/meta'
     ```

  2. **Registry entry** (inside `chromePatternRegistry`):
     ```typescript
     {Name}: {
       meta: {Name}Meta as ChromePatternMeta,
       getFactory: async () => (await import('./patterns/{Name}')).create{Name}Region,
     },
     ```

  3. **Re-exports** at bottom:
     ```typescript
     export { create{Name}Region } from './patterns/{Name}'
     export type { {Name}Props } from './patterns/{Name}/types'
     ```

  **File:** `scripts/create-chrome.ts`, target: `engine/content/chrome/pattern-registry.ts`

- [ ] **2.4.3** Add npm script

  **File:** `package.json` — add: `"create:chrome": "npx tsx scripts/create-chrome.ts"`

- [ ] **2.4.4** Test: create test chrome pattern, verify registration, test:arch, cleanup

---

### Phase 3: Widget Builders

> **Goal:** Typed helper functions that produce `WidgetSchema` objects. These are the composable API for assembling widgets inside section/chrome factories.
> **Dependency:** None (can be built in parallel with Phase 1 and 2)
> **Files:** `engine/builders/`

- [ ] **3.1** Create `engine/builders/index.ts` — barrel export

- [ ] **3.2** Create primitive builders

  **File:** `engine/builders/primitives.ts`

  ```typescript
  import type { WidgetSchema, SerializableValue } from '../schema'

  interface TextBuilderOptions {
    /** HTML element scale (h1, h2, p, small, etc.) */
    scale?: string
    /** Additional inline styles */
    style?: Record<string, unknown>
    /** Widget ID override */
    id?: string
    /** Behaviour assignment */
    behaviour?: { id: string; options?: Record<string, unknown> }
  }

  let _counter = 0
  function autoId(prefix: string, explicit?: string): string {
    if (explicit) return explicit
    return `${prefix}-${++_counter}`
  }

  /**
   * Create a Text widget schema.
   *
   * @param content - Text content or binding expression (e.g., '{{ content.hero.title }}')
   * @param options - Scale, style, behaviour
   */
  export function text(content: string, options?: TextBuilderOptions): WidgetSchema {
    return {
      id: autoId('text', options?.id),
      type: 'Text',
      props: {
        content,
        ...(options?.scale && { as: options.scale }),
      },
      ...(options?.style && { style: options.style }),
      ...(options?.behaviour && { behaviour: options.behaviour }),
    }
  }

  // Similar: image(), icon(), button(), link()
  ```

  Each primitive builder:
  - `text(content, options?)` → Text WidgetSchema
  - `image(options)` → Image WidgetSchema (`src`, `alt`, `width`, `height`)
  - `icon(options)` → Icon WidgetSchema (`name`, `size`)
  - `button(options)` → Button WidgetSchema (`label`, `variant`, `href`)
  - `link(options)` → Link WidgetSchema (`content`, `href`, `variant`)

- [ ] **3.3** Create layout builders

  **File:** `engine/builders/layouts.ts`

  Layout builders accept **child widget arrays**:

  ```typescript
  interface FlexBuilderOptions {
    direction?: 'row' | 'column'
    align?: string
    justify?: string
    gap?: number | string
    wrap?: boolean
    style?: Record<string, unknown>
    id?: string
    behaviour?: { id: string; options?: Record<string, unknown> }
  }

  export function flex(options: FlexBuilderOptions, children: WidgetSchema[]): WidgetSchema {
    return {
      id: autoId('flex', options.id),
      type: 'Flex',
      props: {
        direction: options.direction ?? 'row',
        ...(options.align && { align: options.align }),
        ...(options.justify && { justify: options.justify }),
        ...(options.gap != null && { gap: options.gap }),
        ...(options.wrap && { wrap: options.wrap }),
      },
      ...(options.style && { style: options.style }),
      ...(options.behaviour && { behaviour: options.behaviour }),
      widgets: children,
    }
  }
  ```

  Layout builders:
  - `flex(options, children)` → Flex WidgetSchema
  - `stack(options, children)` → Stack WidgetSchema
  - `grid(options, children)` → Grid WidgetSchema
  - `split(options, children)` → Split WidgetSchema
  - `container(options, children)` → Container WidgetSchema
  - `box(options, children)` → Box WidgetSchema

- [ ] **3.4** Create interactive builders

  **File:** `engine/builders/interactive.ts`

  - `video(options)` → Video WidgetSchema (`src`, `poster`, `background`, `autoplay`)
  - `videoPlayer(options)` → VideoPlayer WidgetSchema
  - `emailCopy(options)` → EmailCopy WidgetSchema

- [ ] **3.5** Create `bind()` helper

  **File:** `engine/builders/helpers.ts`

  ```typescript
  /**
   * Create a content binding expression.
   * @param path - Content path (e.g., 'hero.title')
   * @returns Binding expression string '{{ content.hero.title }}'
   */
  export function bind(path: string): string {
    return `{{ content.${path} }}`
  }
  ```

- [ ] **3.6** Export everything from barrel

  **File:** `engine/builders/index.ts`

  ```typescript
  export { text, image, icon, button, link } from './primitives'
  export { flex, stack, grid, split, container, box } from './layouts'
  export { video, videoPlayer, emailCopy } from './interactive'
  export { bind } from './helpers'
  ```

- [ ] **3.7** Add subpath export to `package.json`

  **File:** `package.json` — add to `exports`:
  ```json
  "./builders": "./engine/builders/index.ts"
  ```

- [ ] **3.8** Test: write a small section factory using builders, verify it produces valid WidgetSchema, test:arch passes

---

### Phase 4: CLAUDE.md Updates

> **Goal:** Every agent session starts with the right mental model and workflow.
> **Dependency:** Phases 1-3 (reference the scripts and builders they create)

#### 4.1: Root CLAUDE.md

- [ ] **4.1.1** Add "Replicating a Prototype" workflow section

  Add after the "How to Work" section. This is the primary workflow agents follow:

  ```markdown
  ## Replicating a Prototype

  When given ANY design reference (screenshot, Figma export, reference website, or description):

  ### Phase 1: Audit (Disassemble)
  Run `npm run inventory:quick` to see all available bricks, then classify every element:

  | Design Element | Engine Brick | Where |
  |---|---|---|
  | Persistent header/footer | Chrome pattern | `chrome/patterns/` |
  | Page content block | Section pattern | `sections/patterns/` |
  | Reusable UI atom | Global widget | `widgets/` |
  | Section-specific stateful component | Scoped widget | `{Section}/components/` |
  | Scroll/hover/visibility trigger | Behaviour | `behaviours/{trigger}/` |
  | CSS animation mechanism | Effect | `effects/{mechanism}/` |
  | Section orchestration mode | Experience | `experiences/` |
  | Page enter/exit animation | Transition | `transitions/` |

  For each: mark as **EXISTS** / **NEEDS VARIANT** / **MISSING**.

  ### Phase 2: Build Missing Bricks
  For each MISSING brick, scaffold and implement:

  ```
  npm run create:section {Name}              # L1 section pattern
  npm run create:behaviour {cat}/{name}      # L2 behaviour
  npm run create:effect {mechanism}/{name}   # L2 effect CSS
  npm run create:chrome {Name} --slot {slot} # Chrome pattern
  ```

  Each brick must be GENERIC and REUSABLE — no site-specific names, no hardcoded content.
  All content uses binding expressions: `{{ content.section.field }}`.

  ### Phase 3: Expand Existing Bricks (if needed)
  For NEEDS VARIANT bricks:
  - Add new variant/choice to existing widget meta settings (ADDITIVE only)
  - Never remove existing variants
  - Verify existing presets still produce same output

  ### Phase 4: Assemble Preset
  Wire all bricks (new + existing) into the preset:
  - `pages/` → section factories with content bindings
  - `experience` → sectionBehaviours + chromeBehaviours
  - `chrome` → regions (header/footer) + overlays (modal/cursor)
  - `theme` → color, typography, spacing tokens
  - `content-contract.ts` → CMS field definitions
  - `sample-content.ts` → dev preview data

  Run `npm run test:arch` before committing.
  ```

- [ ] **4.1.2** Add "Blast Radius Rules" section

  Add after "Rules" section. Paste the blast radius rules from the top of this document.

- [ ] **4.1.3** Add widget builders to references table

  ```markdown
  | **Widget Builders** | `engine/builders/` |
  ```

- [ ] **4.1.4** Add scaffolding commands to Commands table

  ```markdown
  | `npm run create:section {Name}` | Scaffold new section pattern |
  | `npm run create:behaviour {cat}/{name}` | Scaffold new behaviour |
  | `npm run create:effect {mech}/{name}` | Scaffold new effect |
  | `npm run create:chrome {Name}` | Scaffold new chrome pattern |
  | `npm run inventory:quick` | Show all available bricks |
  ```

---

#### 4.2: Subfolder CLAUDE.md Updates

These files already exist. Add scaffolding references and builder info where relevant.

- [ ] **4.2.1** `engine/content/sections/CLAUDE.md` — Add scaffolding command reference

  Append:
  ```markdown
  ## Creating a New Section

  ```bash
  npm run create:section {Name}
  ```

  This generates index.ts, types.ts, meta.ts, styles.css, preview.ts and registers in registry.ts.
  See existing patterns (HeroTitle, AboutBio) for reference.

  ## Widget Builders

  Use builders from `engine/builders/` to compose widgets in factory functions:

  ```typescript
  import { flex, text, image, bind } from '../../../builders'

  const widgets = [
    flex({ direction: 'column', gap: 32 }, [
      text(bind('hero.title'), { scale: 'display' }),
      image({ src: bind('hero.photoSrc'), alt: 'Hero photo' }),
    ])
  ]
  ```
  ```

- [ ] **4.2.2** `engine/experience/behaviours/CLAUDE.md` — Add scaffolding command reference

  Append:
  ```markdown
  ## Creating a New Behaviour

  ```bash
  npm run create:behaviour {category}/{name}
  # Example: npm run create:behaviour scroll/parallax
  ```

  This generates index.ts + meta.ts and auto-registers in barrel exports.

  ## Behaviour Definition Checklist

  1. Meta: id, name, description, category, tags
  2. requires: what state keys does compute() need?
  3. compute(): maps state → CSS variables (no DOM, no transitions)
  4. cssTemplate: optional static CSS for the element
  5. Handle prefersReducedMotion (instant values, no animation)
  ```

- [ ] **4.2.3** `engine/experience/effects/CLAUDE.md` — Add scaffolding command reference

  Append:
  ```markdown
  ## Creating a New Effect

  ```bash
  npm run create:effect {mechanism}/{name}
  # Example: npm run create:effect transform/flip
  ```

  This generates the CSS file and adds @import to index.css.

  ## Effect Checklist

  1. Selector: `[data-effect~="{name}"]`
  2. Consume CSS variables from behaviours (var(--xxx))
  3. Define transition/animation properties (HOW it animates)
  4. Never set values — only define how values animate
  ```

- [ ] **4.2.4** `engine/content/chrome/CLAUDE.md` — Add scaffolding command reference

  Append:
  ```markdown
  ## Creating a New Chrome Pattern

  ```bash
  npm run create:chrome {Name} --slot header   # header/footer region
  npm run create:chrome {Name} --slot overlay   # modal/floating overlay
  ```

  This generates factory files and registers in pattern-registry.ts.
  ```

- [ ] **4.2.5** `engine/presets/CLAUDE.md` — Add assembly workflow reference

  Append:
  ```markdown
  ## Assembling a Preset

  A preset wires existing engine bricks into a site template:

  1. **Theme:** Color, typography, spacing, scrollbar, container settings
  2. **Pages:** Import section factories, compose into PageSchema arrays
  3. **Experience:** Map section IDs to behaviour assignments
  4. **Chrome:** Wire header/footer regions + overlay configurations
  5. **Content Contract:** Define CMS fields that map to binding expressions
  6. **Sample Content:** Provide preview data for local development

  All content in page templates uses binding expressions: `{{ content.section.field }}`

  Run `npm run inventory:quick` to see available bricks before assembling.
  ```

---

### Phase 5: Validation

> **Goal:** Ensure scaffolded bricks pass all architecture tests from creation.
> **Dependency:** Phases 1-4

- [ ] **5.1** Run `npm run test:arch` — verify all existing tests still pass
- [ ] **5.2** Run `npm run inventory` — verify output includes all categories
- [ ] **5.3** Scaffold one brick of each type using the scripts:
  - `npm run create:section TestVerify`
  - `npm run create:behaviour scroll/test-verify`
  - `npm run create:effect transform/test-verify`
  - `npm run create:chrome TestVerifyNav --slot header`
- [ ] **5.4** Run `npm run test:arch` — verify scaffolded bricks pass
- [ ] **5.5** Delete test bricks and revert registry changes
- [ ] **5.6** Final `npm run test:arch` — verify clean state

---

## File Change Summary

### New Files

| File | Phase | Description |
|---|---|---|
| `scripts/create-section.ts` | 2.1 | Section scaffolding script |
| `scripts/create-behaviour.ts` | 2.2 | Behaviour scaffolding script |
| `scripts/create-effect.ts` | 2.3 | Effect scaffolding script |
| `scripts/create-chrome.ts` | 2.4 | Chrome pattern scaffolding script |
| `engine/builders/index.ts` | 3.1 | Builder barrel export |
| `engine/builders/primitives.ts` | 3.2 | Text, Image, Icon, Button, Link builders |
| `engine/builders/layouts.ts` | 3.3 | Flex, Stack, Grid, Split, Container, Box builders |
| `engine/builders/interactive.ts` | 3.4 | Video, VideoPlayer, EmailCopy builders |
| `engine/builders/helpers.ts` | 3.5 | bind() helper |

### Modified Files

| File | Phase | Change |
|---|---|---|
| `scripts/inventory.ts` | 1.1-1.3 | Add transitions, quick reference, --quick flag |
| `package.json` | 1.3, 2.x, 3.7 | Add npm scripts + builders export |
| `CLAUDE.md` | 4.1 | Add workflow, blast radius rules, commands |
| `engine/content/sections/CLAUDE.md` | 4.2.1 | Add scaffolding + builder reference |
| `engine/experience/behaviours/CLAUDE.md` | 4.2.2 | Add scaffolding reference + checklist |
| `engine/experience/effects/CLAUDE.md` | 4.2.3 | Add scaffolding reference + checklist |
| `engine/content/chrome/CLAUDE.md` | 4.2.4 | Add scaffolding reference |
| `engine/presets/CLAUDE.md` | 4.2.5 | Add assembly workflow |

### Registry Files Touched by Scaffolding Scripts (at runtime)

These files are NOT modified during plan implementation — they are modified by the scaffolding scripts when run by users:

| File | Script | What gets added |
|---|---|---|
| `engine/content/sections/registry.ts` | create:section | Meta import + entry + re-exports |
| `engine/content/chrome/pattern-registry.ts` | create:chrome | Meta import + entry + re-exports |
| `engine/experience/behaviours/{cat}/index.ts` | create:behaviour | Import + re-export |
| `engine/experience/behaviours/index.ts` | create:behaviour | Re-export (if new) |
| `engine/experience/effects/index.css` | create:effect | @import line |

---

## Dependency Graph

```
Phase 0 (prerequisites)
    ↓
┌───────────┬───────────┬───────────┐
│ Phase 1   │ Phase 2   │ Phase 3   │  ← All three can run in PARALLEL
│ Inventory │ Scaffold  │ Builders  │
│ Script    │ Scripts   │           │
└─────┬─────┴─────┬─────┴─────┬─────┘
      └───────────┼───────────┘
                  ↓
             Phase 4
             CLAUDE.md
             Updates
                  ↓
             Phase 5
             Validation
```

**Phases 1, 2, and 3 have NO dependencies on each other** — assign to different team members or parallel agent sessions.

Phase 4 references the outputs of 1-3 (script names, builder API), so it runs after.

Phase 5 is the integration test — runs last.
