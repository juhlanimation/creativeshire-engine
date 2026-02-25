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

Every section and chrome pattern carries its own **content declaration** (`content.ts`) — the CMS field definitions and sample data that describe what content the brick needs. When assembling a preset, content contracts and sample content are auto-derived from the bricks you compose. No manual re-declaration.

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

### Migration Policy: Strangler Fig

Builders, raw `WidgetSchema`, and content declarations all produce identical output — they coexist.

| Code | Action |
|---|---|
| **New** sections/chrome | Always use builders + `content.ts` |
| **Existing** sections/chrome | Leave as-is — do NOT mass-migrate |
| **Touching** an existing factory for other reasons | Migrate to builders + add `content.ts` while you're in there |

**Never** do a big-bang migration of existing factories. Each rewrite is a chance to regress a hosted site. Let old factories age out naturally as you touch them for real work.

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

> **Goal:** One command per brick type. Generates all files + handles registry wiring. Every section/chrome brick includes a `content.ts` declaring its CMS fields and sample data.
> **Dependency:** None (can be built in parallel with Phase 1)
> **Files:** `scripts/create-section.ts`, `scripts/create-behaviour.ts`, `scripts/create-effect.ts`, `scripts/create-chrome.ts`

#### 2.0: Content Declaration Types

Before scaffolding can generate `content.ts`, we need the types it exports.

- [ ] **2.0.1** Create `engine/schema/content-field.ts`

  Types live in `schema/` (not `presets/`) so sections can import without a content→preset dependency direction.

  ```typescript
  import type { ContentSourceFieldType } from '../presets/types'

  /**
   * Content field with a RELATIVE path, declared by a section/chrome pattern.
   * The `section` property is omitted — auto-filled during aggregation.
   */
  export interface SectionContentField {
    /** Relative dot-notation path (e.g. 'logo.src', NOT 'azukiElementals.logo.src') */
    path: string
    type: ContentSourceFieldType
    label: string
    required?: boolean
    default?: unknown
    placeholder?: string
    separator?: string
    hidden?: boolean
    /** For collection-type fields: nested item fields (also relative) */
    itemFields?: SectionContentField[]
  }

  /**
   * Content declaration exported by a section or chrome pattern's content.ts.
   * Declares CMS fields (relative paths) and provides sample data for previews.
   */
  export interface SectionContentDeclaration<T = Record<string, unknown>> {
    /** Human-readable label for CMS grouping (e.g. 'Project Gallery') */
    label: string
    /** Optional description for CMS UI */
    description?: string
    /** CMS field declarations with relative paths */
    contentFields: SectionContentField[]
    /** Concrete sample data matching the shape the factory expects */
    sampleContent: T
  }
  ```

- [ ] **2.0.2** Re-export from `engine/presets/types.ts`

  Add to bottom:
  ```typescript
  export type { SectionContentField, SectionContentDeclaration } from '../schema/content-field'
  ```

---

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
    ├── content.ts     # Content field declarations + sample data
    ├── styles.css     # Section class + var(--*) template comments
    └── preview.ts     # Storybook preview (imports from content.ts)
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

  **Generated `content.ts` template:**

  ```typescript
  import type { SectionContentDeclaration } from '../../../../schema/content-field'
  import type { {Name}Props } from './types'

  export const content: SectionContentDeclaration<Partial<{Name}Props>> = {
    label: '{Display Name}',
    description: 'TODO: Describe this section',

    contentFields: [
      // TODO: Declare CMS content fields with relative paths.
      // These are user-editable content (media, text, collections).
      // Settings (layout, scales, colors) go in meta.ts instead.
      //
      // Examples:
      // { path: 'title', type: 'text', label: 'Title', required: true },
      // { path: 'logo.src', type: 'image', label: 'Logo Image', required: true },
      // { path: 'logo.alt', type: 'text', label: 'Logo Alt Text', default: 'Logo' },
      // { path: 'items', type: 'collection', label: 'Items', required: true,
      //   itemFields: [
      //     { path: 'title', type: 'text', label: 'Title', required: true },
      //     { path: 'thumbnail', type: 'image', label: 'Thumbnail' },
      //   ],
      // },
    ],

    sampleContent: {
      // TODO: Provide concrete demo data for previews and development.
      // Shape must match the factory's props.
      // This data is shared by Storybook (via preview.ts) and preset sample-content.
    },
  }
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
  import { content } from './content'
  import type { {Name}Props } from './types'

  export const previewProps: Partial<{Name}Props> = {
    ...content.sampleContent,
    // Storybook-specific overrides (theme, layout):
    colorMode: 'dark',
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

- [ ] **2.1.4** Test: run `npm run create:section TestSection`, verify files created (including content.ts), registry updated, `npm run test:arch` passes, then delete TestSection and revert registry

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
    ├── meta.ts     # defineChromeMeta with slot info
    └── content.ts  # Content field declarations + sample data
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

  **Generated `content.ts` template (same as section pattern):**

  ```typescript
  import type { SectionContentDeclaration } from '../../../../schema/content-field'
  import type { {Name}Props } from './types'

  export const content: SectionContentDeclaration<Partial<{Name}Props>> = {
    label: '{Display Name}',
    description: 'TODO: Describe this chrome pattern',
    contentFields: [
      // TODO: Declare CMS content fields
    ],
    sampleContent: {
      // TODO: Provide demo data
    },
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

### Phase 3: Widget Builders & Content Utilities

> **Goal:** Typed helper functions for two assembly tasks: (1) composing `WidgetSchema` objects inside factories, (2) aggregating per-section content declarations into preset-level contracts and bindings.
> **Dependency:** Phase 2.0 (content field types)
> **Files:** `engine/builders/`, `engine/presets/content-utils.ts`

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

- [ ] **3.9** Create content aggregation utilities

  **File:** `engine/presets/content-utils.ts` (new)

  Three utilities that turn per-section content declarations into preset-level artifacts:

  **`buildContentContract(declarations, options?)`**
  - Input: `Record<string, SectionContentDeclaration>` keyed by content namespace (e.g. `azukiElementals`)
  - Converts relative field paths to absolute: `logo.src` → `azukiElementals.logo.src`
  - Auto-fills `section` property on each `ContentSourceField`
  - Returns complete `ContentContract`

  ```typescript
  import type {
    ContentContract, ContentSourceField, ContentSection,
  } from './types'
  import type {
    SectionContentDeclaration, SectionContentField,
  } from '../schema/content-field'

  export type ContentDeclarationMap = Record<string, SectionContentDeclaration>

  function toAbsoluteField(
    field: SectionContentField, namespace: string, sectionId: string,
  ): ContentSourceField {
    return {
      ...field,
      path: `${namespace}.${field.path}`,
      section: sectionId,
      ...(field.itemFields && {
        itemFields: field.itemFields.map(f => ({
          ...f, section: sectionId,
        })) as ContentSourceField[],
      }),
    }
  }

  export function buildContentContract(
    declarations: ContentDeclarationMap,
    options?: { settingOverrides?: ContentContract['settingOverrides'] },
  ): ContentContract {
    const sections: ContentSection[] = []
    const sourceFields: ContentSourceField[] = []

    for (const [namespace, decl] of Object.entries(declarations)) {
      sections.push({ id: namespace, label: decl.label, description: decl.description })
      for (const field of decl.contentFields) {
        sourceFields.push(toAbsoluteField(field, namespace, namespace))
      }
    }

    return { sections, sourceFields, settingOverrides: options?.settingOverrides }
  }
  ```

  **`buildSampleContent(declarations)`**
  - Input: same declaration map
  - Returns `{ namespace: sampleContent, ... }` — flat merge for binding resolution

  ```typescript
  export function buildSampleContent(
    declarations: ContentDeclarationMap,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const [namespace, decl] of Object.entries(declarations)) {
      result[namespace] = decl.sampleContent
    }
    return result
  }
  ```

  **`withContentBindings(namespace, fields)`**
  - Input: namespace + `SectionContentField[]`
  - Generates `{ logo: { src: '{{ content.ns.logo.src }}' }, projects: '{{ content.ns.projects }}' }`
  - Preset spreads the result, then adds style overrides on top

  ```typescript
  export function withContentBindings(
    namespace: string,
    fields: SectionContentField[],
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const field of fields) {
      setNestedValue(result, field.path, `{{ content.${namespace}.${field.path} }}`)
    }
    return result
  }

  function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split('.')
    let current = obj
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current) || typeof current[parts[i]] !== 'object') {
        current[parts[i]] = {}
      }
      current = current[parts[i]] as Record<string, unknown>
    }
    current[parts[parts.length - 1]] = value
  }
  ```

- [ ] **3.10** Test content utilities: write unit test that builds a contract from 2 declarations and verifies absolute paths, section IDs, and sample content structure

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
  npm run create:section {Name}              # L1 section pattern (incl. content.ts)
  npm run create:behaviour {cat}/{name}      # L2 behaviour
  npm run create:effect {mechanism}/{name}   # L2 effect CSS
  npm run create:chrome {Name} --slot {slot} # Chrome pattern (incl. content.ts)
  ```

  Each brick must be GENERIC and REUSABLE — no site-specific names, no hardcoded content.
  All content uses binding expressions: `{{ content.section.field }}`.
  Content field declarations live in the section's own `content.ts`, not the preset.

  ### Phase 3: Expand Existing Bricks (if needed)
  For NEEDS VARIANT bricks:
  - Add new variant/choice to existing widget meta settings (ADDITIVE only)
  - Never remove existing variants
  - Verify existing presets still produce same output

  ### Phase 4: Assemble Preset
  Wire all bricks (new + existing) into the preset:
  - `pages/` → section factories with `withContentBindings()` + style overrides
  - `experience` → sectionBehaviours + chromeBehaviours
  - `chrome` → regions (header/footer) + overlays (modal/cursor)
  - `theme` → color, typography, spacing tokens
  - `content-contract.ts` → `buildContentContract()` from section content declarations
  - `sample-content.ts` → `buildSampleContent()` from section content declarations

  Run `npm run test:arch` before committing.
  ```

- [ ] **4.1.2** Add "Blast Radius Rules" section

  Add after "Rules" section. Paste the blast radius rules from the top of this document.

- [ ] **4.1.3** Add widget builders to references table

  ```markdown
  | **Widget Builders** | `engine/builders/` |
  | **Content Utilities** | `engine/presets/content-utils.ts` |
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

- [ ] **4.2.1** `engine/content/sections/CLAUDE.md` — Add scaffolding + content.ts reference

  Append:
  ```markdown
  ## Creating a New Section

  ```bash
  npm run create:section {Name}
  ```

  This generates index.ts, types.ts, meta.ts, content.ts, styles.css, preview.ts
  and registers in registry.ts.

  ### Section File Responsibilities

  | File | What goes here | What does NOT go here |
  |------|---------------|----------------------|
  | `meta.ts` | CMS settings (layout, scales, behavior toggles) | Content fields, sample data |
  | `content.ts` | CMS content fields + sample data | Settings, style overrides |
  | `preview.ts` | Storybook args (imports from content.ts) | Duplicate content data |

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

  This generates factory files (including content.ts) and registers in pattern-registry.ts.
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
  5. **Content Contract:** `buildContentContract()` from section `content.ts` imports
  6. **Sample Content:** `buildSampleContent()` from the same declarations

  Content declarations live in the sections, not the preset. The preset only:
  - Overrides labels (e.g. `{ ...galleryContent, label: 'Azuki Elementals' }`)
  - Adds site-level fields (head, contact) inline
  - Passes `withContentBindings(namespace, fields)` for auto-generated bindings

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
- [ ] **5.4** Verify scaffolded section has `content.ts` with valid structure
- [ ] **5.5** Run `npm run test:arch` — verify scaffolded bricks pass
- [ ] **5.6** Delete test bricks and revert registry changes
- [ ] **5.7** Final `npm run test:arch` — verify clean state

---

### Phase 6: Preset Content Migration (All Presets)

> **Goal:** Migrate all existing presets to derive their content contracts and sample content from section-level `content.ts` files. One-time lift for all 14 section patterns across 4 presets.
> **Dependency:** Phases 2.0 (types), 3.9 (content utilities)
> **Risk:** Low — content declarations are data-only, no rendering logic changes.

#### 6.1: Create `content.ts` for ALL section patterns

Every section pattern gets a `content.ts`. Extract content field declarations + sample data from each preset's `content-contract.ts` and `sample-content.ts`.

**Prism sections (6):**

| Section | Namespace in prism |
|---------|-------------------|
| `ProjectGallery/content.ts` | `azukiElementals` |
| `ProjectShowcase/content.ts` | `boyMoleFoxHorse` |
| `ProjectCompare/content.ts` | `the21` |
| `ProjectVideoGrid/content.ts` | `clashRoyale` |
| `ProjectExpand/content.ts` | `riotGames` |
| `ProjectTabs/content.ts` | `projectsILike` |

**Noir sections (4):**

| Section | Namespace in noir |
|---------|------------------|
| `HeroVideo/content.ts` | `hero` / `showreel` |
| `AboutBio/content.ts` | `about` |
| `ProjectFeatured/content.ts` | `featured` |
| `ProjectStrip/content.ts` | `strip` |

**Loft sections (4):**

| Section | Namespace in loft |
|---------|------------------|
| `HeroTitle/content.ts` | `hero` |
| `AboutCollage/content.ts` | `about` |
| `TeamShowcase/content.ts` | `team` |
| `ContentPricing/content.ts` | `pricing` |

- [ ] **6.1.1** Create `content.ts` for prism sections (6 files)
- [ ] **6.1.2** Create `content.ts` for noir sections (4 files)
- [ ] **6.1.3** Create `content.ts` for loft sections (4 files)

**Content vs. style split:** Only content props (media, text, collections) go in `contentFields`/`sampleContent`. Style/layout props (`sectionTheme`, `thumbnailBorder`, `textColor`, `colorMode`) stay at preset level — they are preset assembly decisions, not section content.

#### 6.2: Create `content.ts` for chrome patterns

- [ ] **6.2.1** `ContactFooter/content.ts` — nav links, contact email, headings
- [ ] **6.2.2** `FixedNav/content.ts` — site title, nav links, logo
- [ ] **6.2.3** Any other chrome patterns used across presets

#### 6.3: Migrate each preset

Each preset's content-contract.ts → thin aggregation, sample-content.ts → derived, page templates → withContentBindings().

- [ ] **6.3.1** Migrate **prism** preset

  ```typescript
  // content-contract.ts (183 lines → ~30 lines)
  import { buildContentContract } from '../../presets/content-utils'
  import { content as galleryContent } from '../../content/sections/patterns/ProjectGallery/content'
  // ... other section imports

  export const prismContentContract = buildContentContract({
    // Site-level (inline — not owned by a section pattern)
    head: { label: 'Head', contentFields: [...], sampleContent: {...} },
    contact: { label: 'Contact', contentFields: [...], sampleContent: {...} },
    showreel: { label: 'Showreel', contentFields: [...], sampleContent: {...} },
    about: { label: 'About', contentFields: [...], sampleContent: {...} },
    // Section-level (imported, label overridden)
    azukiElementals: { ...galleryContent, label: 'Azuki Elementals' },
    boyMoleFoxHorse: { ...showcaseContent, label: 'Boy Mole Fox Horse' },
    the21: { ...compareContent, label: 'THE 21' },
    clashRoyale: { ...videoGridContent, label: 'Clash Royale' },
    riotGames: { ...expandContent, label: 'Riot Games' },
    projectsILike: { ...tabsContent, label: 'Projects I Like' },
  })
  ```

  Update `sample-content.ts` → `buildSampleContent(declarations)`.
  Update `pages/home.ts` → `withContentBindings()`.

- [ ] **6.3.2** Migrate **noir** preset (285-line contract → thin aggregation)
- [ ] **6.3.3** Migrate **loft** preset (136-line contract → thin aggregation)
- [ ] **6.3.4** Migrate **test-multipage** preset (50-line contract → thin aggregation)

#### 6.4: Simplify section `preview.ts` files

Update all 14 sections to import from sibling `content.ts`:

```typescript
import { content } from './content'
export const previewProps: Partial<ProjectGalleryProps> = {
  ...content.sampleContent,
  sectionHeight: 'viewport-fixed',
  sectionTheme: 'azuki',
}
```

- [ ] **6.4.1** Update prism section preview files (6)
- [ ] **6.4.2** Update noir section preview files (4)
- [ ] **6.4.3** Update loft section preview files (4)

#### 6.5: Verification

- [ ] **6.5.1** Parity test: verify each preset's `buildContentContract()` output matches its old hand-written contract (field-by-field, ignoring order). Migration safety net — remove after verification.
- [ ] **6.5.2** Architecture test: add content declaration validation to `__tests__/architecture/registration.test.ts`:
  - Sections with `content.ts` export valid `SectionContentDeclaration`
  - Content field paths are relative (no namespace prefixes)
  - Content field types are valid `ContentSourceFieldType`
- [ ] **6.5.3** `npm run test:arch` passes
- [ ] **6.5.4** Storybook renders all sections with content from `content.ts`
- [ ] **6.5.5** Dev server resolves bindings from derived sample content

---

## File Change Summary

### New Files

| File | Phase | Description |
|---|---|---|
| `engine/schema/content-field.ts` | 2.0 | `SectionContentField` + `SectionContentDeclaration` types |
| `scripts/create-section.ts` | 2.1 | Section scaffolding script (generates content.ts) |
| `scripts/create-behaviour.ts` | 2.2 | Behaviour scaffolding script |
| `scripts/create-effect.ts` | 2.3 | Effect scaffolding script |
| `scripts/create-chrome.ts` | 2.4 | Chrome pattern scaffolding script (generates content.ts) |
| `engine/builders/index.ts` | 3.1 | Builder barrel export |
| `engine/builders/primitives.ts` | 3.2 | Text, Image, Icon, Button, Link builders |
| `engine/builders/layouts.ts` | 3.3 | Flex, Stack, Grid, Split, Container, Box builders |
| `engine/builders/interactive.ts` | 3.4 | Video, VideoPlayer, EmailCopy builders |
| `engine/builders/helpers.ts` | 3.5 | bind() helper |
| `engine/presets/content-utils.ts` | 3.9 | buildContentContract, buildSampleContent, withContentBindings |
| `engine/content/sections/patterns/*/content.ts` (14 files) | 6.1 | Content fields + sample data for all section patterns |
| `engine/content/chrome/patterns/*/content.ts` (2+ files) | 6.2 | Content fields + sample data for chrome patterns |

### Modified Files

| File | Phase | Change |
|---|---|---|
| `engine/presets/types.ts` | 2.0 | Re-export content field types |
| `scripts/inventory.ts` | 1.1-1.3 | Add transitions, quick reference, --quick flag |
| `package.json` | 1.3, 2.x, 3.7 | Add npm scripts + builders export |
| `engine/presets/*/content-contract.ts` (4 presets) | 6.3 | Thin aggregation via buildContentContract() |
| `engine/presets/*/sample-content.ts` (4 presets) | 6.3 | Derive via buildSampleContent() |
| `engine/presets/*/pages/*.ts` (4 presets) | 6.3 | Use withContentBindings() |
| `engine/content/sections/patterns/*/preview.ts` (14 files) | 6.4 | Import from content.ts |
| `__tests__/architecture/registration.test.ts` | 6.5 | Content declaration validation |
| `CLAUDE.md` | 4.1 | Add workflow, blast radius rules, commands |
| `engine/content/sections/CLAUDE.md` | 4.2.1 | Add scaffolding + content.ts reference |
| `engine/experience/behaviours/CLAUDE.md` | 4.2.2 | Add scaffolding reference + checklist |
| `engine/experience/effects/CLAUDE.md` | 4.2.3 | Add scaffolding reference + checklist |
| `engine/content/chrome/CLAUDE.md` | 4.2.4 | Add scaffolding reference |
| `engine/presets/CLAUDE.md` | 4.2.5 | Add assembly workflow + content utilities |

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
┌───────────┬───────────┬───────────────────┐
│ Phase 1   │ Phase 2   │ Phase 3           │  ← All three run in PARALLEL
│ Inventory │ Scaffold  │ Builders +        │
│ Script    │ Scripts   │ Content Utilities  │
│           │ (2.0 first│                   │
│           │  for types│                   │
│           │  then 2.1-│                   │
│           │  2.4)     │                   │
└─────┬─────┴─────┬─────┴─────────┬─────────┘
      └───────────┼───────────────┘
                  ↓
             Phase 4
             CLAUDE.md
             Updates
                  ↓
             Phase 5
             Validation
                  ↓
             Phase 6
             Preset Content
             Migration (all 4)
```

**Phases 1, 2, and 3 have NO dependencies on each other** — assign to different agent sessions.

Exception: Phase 2.0 (content field types) must complete before Phase 3.9 (content utilities) and before Phase 6. In practice, 2.0 is a single small file — do it first.

Phase 4 references the outputs of 1-3 (script names, builder API, content utilities), so it runs after.

Phase 5 is the integration test for scaffolding — runs after 1-4.

Phase 6 is the prism migration — runs after 2.0 + 3.9 (needs types + utilities). Can run in parallel with Phase 5.
