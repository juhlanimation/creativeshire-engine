# Composable Site Architecture

> A site is three orthogonal containers composed together. A preset is a pre-filled combination of all three.

---

## The Model

```
SITE = ContentComposition + ExperienceComposition + ThemeComposition
PRESET = pre-filled L1 + L2 + Theme (starting point)
```

A site is the product of three independent compositions:

| Container | Layer | What it controls |
|-----------|-------|------------------|
| **ContentComposition** | L1 | Pages, chrome, CMS fields, sample data |
| **ExperienceComposition** | L2 | Motion, interaction, orchestration, transitions |
| **ThemeComposition** | -- | Colors, typography, spacing, scrollbar |

Each container is independently replaceable. Swap the experience without touching content. Swap the theme without touching either.

---

## L1 -- ContentComposition

The structural arrangement of content. Purely structural -- no behaviours, no animations, no theme.

### What it owns

- **Pages** -- page definitions, slugs, sections per page
- **Chrome** -- header, footer, overlay assignments
- **Content contract** -- CMS field declarations derived from sections + chrome
- **Sample content** -- preview/seed data for new sites

### Interface

```typescript
interface ContentComposition {
  id: string
  name: string
  pages: Record<string, PageSchema>
  chrome: PresetChromeConfig
  contentContract: ContentContract
  sampleContent: Record<string, unknown>
}
```

### What it does NOT contain

- Behaviours or behaviour assignments
- Intro sequences
- Page transitions
- Presentation model
- Theme variables

Content compositions are reusable across experiences and themes. The same content structure (e.g., a portfolio with hero + projects + about + contact) can be driven by stacking, slideshow, or cover-scroll experiences without modification.

---

## L2 -- ExperienceComposition

How the site feels -- all motion, interaction, and orchestration. Everything that changes over time.

### What it owns

- **Presentation model** -- stacking, slideshow, cover-scroll, etc.
- **Navigation config** -- inputs, looping, snapping
- **Section behaviours** -- per-section behaviour assignments
- **Chrome behaviours** -- per-region behaviour assignments
- **Intro sequence** -- gate, overlay, reveal settings
- **Page transitions** -- exit/entry animations between pages (moved from `SitePreset.transition`)
- **Experience chrome** -- indicators, arrows, navigation UI
- **Controllers** -- runtime orchestration components
- **Constraints** -- L1 compatibility rules (fullViewport, minSections, etc.)

### Interface

```typescript
type ExperienceComposition = Experience
```

`ExperienceComposition` is a type alias for `Experience`. The `Experience` interface already carries all L2 fields including `transition`, which was moved from the old `SitePreset` top-level into the experience where it belongs. Page transitions are an experience concern, not a content concern.

Key fields on `Experience` (and therefore `ExperienceComposition`):
- `sectionBehaviours` -- per-section behaviour assignments
- `chromeBehaviours` -- per-region behaviour assignments
- `presentation` -- model (stacking, slideshow, cover-scroll, etc.)
- `navigation` -- inputs, looping, snapping
- `intro` -- gate, overlay, reveal settings
- `transition` -- exit/entry animations between pages
- `controller` -- runtime orchestration components
- `constraints` -- L1 compatibility rules

An `ExperienceComposition` is itself a single experience definition — it does NOT contain a collection of sub-experiences. Named experiences are separate entries in the experience registry.

### Named experiences as L2 presets

Named experiences (`stacking`, `cover-scroll`, `slideshow`, etc.) are pre-built `ExperienceComposition` instances stored in the experience registry (`registerExperience()`). They are L2 presets -- curated bundles of presentation + navigation + behaviours that users select in the CMS.

---

## L2 Authoring: ExperienceRef

Two modes for specifying L2 in a preset:

### Mode A -- Reference + overrides

Start from a named experience, override specific slots.

```typescript
interface ExperienceRef {
  base: string
  overrides?: Partial<ExperienceComposition>
}
```

Example:

```typescript
experience: {
  base: 'cover-scroll',
  overrides: {
    sectionBehaviours: {
      hero: [{ behaviour: 'scroll/parallax', options: { intensity: 80 } }]
    },
    transition: { id: 'fade', settings: { duration: 600 } }
  }
}
```

Resolution: look up `base` in the experience registry, deep-merge `overrides` on top.

### Mode B -- Inline

Build from scratch as a full `ExperienceComposition`. No base reference. Every field is explicit.

```typescript
experience: {
  id: 'custom-experience',
  name: 'Custom',
  description: 'Bespoke experience for this preset',
  sectionBehaviours: { '*': [{ behaviour: 'visibility/fade-in' }] },
  presentation: { model: 'stacking', /* ... */ },
  transition: { id: 'fade' }
}
```

### Discriminant

The preset resolves which mode by checking for the `base` property:

```typescript
type PresetExperience = ExperienceComposition | ExperienceRef

function isExperienceRef(e: PresetExperience): e is ExperienceRef {
  return 'base' in e && typeof (e as ExperienceRef).base === 'string'
}
```

---

## Theme -- ThemeComposition

Visual language wrapper. Independent of content structure and experience motion.

```typescript
interface ThemeComposition {
  id: string
  name: string
  theme: ThemeSchema
}
```

Themes control:
- Color palettes (light/dark modes)
- Typography (font families, sizes, scales)
- Spacing tokens
- Scrollbar appearance
- Container constraints
- Smooth scroll config

Themes do NOT control motion, behaviours, or content structure.

---

## Preset as Composition

A preset composes all three containers:

```typescript
interface SitePreset {
  name?: string
  content: ContentComposition
  experience: ExperienceComposition | ExperienceRef
  theme: ThemeComposition
}
```

Each slot is independently authored:
- **content** -- which sections, which chrome, which CMS fields
- **experience** -- how it moves, how users navigate, what transitions play
- **theme** -- how it looks (colors, fonts, spacing)

---

## Compatibility Validation

L2 containers declare constraints via `ExperienceConstraints`:

```typescript
interface ExperienceConstraints {
  fullViewportSections?: boolean
  maxVisibleSections?: number
  sectionOverflow?: 'visible' | 'hidden' | 'scroll'
}
```

Platform filters compatible L2 options based on the active L1 structure. For example:
- A slideshow experience (`maxVisibleSections: 1`, `fullViewportSections: true`) is incompatible with a content composition that has sections relying on natural content height.
- A cover-scroll experience requires at least 2 sections.

Validation runs when the user changes either L1 or L2 in the CMS. The platform shows only compatible experience options for the current content structure.

---

## Resolution Pipeline

`buildSiteSchemaFromPreset()` is the single bridge from `SitePreset` to `SiteSchema`. It:

1. Extracts chrome from `preset.content.chrome`
2. Resolves experience from `preset.experience`:
   - If `ExperienceRef`: look up `base` in registry, deep-merge `overrides`
   - If inline `ExperienceComposition`: use directly
3. Extracts theme from `preset.theme.theme`
4. Extracts pages from `preset.content.pages`
5. Extracts transition from the resolved experience's `transition`
6. Outputs `SiteSchema` (the type is unchanged)

```
SitePreset
  ├── content ────────→ chrome, pages
  ├── experience ─────→ experience config, transition
  └── theme ──────────→ theme
           ↓
      buildSiteSchemaFromPreset()
           ↓
       SiteSchema (unchanged type)
```

The output `SiteSchema` remains the same type the renderer already consumes. The composable model is a preset-authoring concern, not a runtime concern.

---

## Migration from Old SitePreset

### Old shape

```typescript
interface SitePreset {
  name?: string
  theme?: ThemeSchema
  experience?: PresetExperienceConfig
  transition?: TransitionConfig
  chrome: PresetChromeConfig
  pages: Record<string, PageSchema>
}
```

### New shape

```typescript
interface SitePreset {
  name?: string
  content: ContentComposition
  experience: ExperienceComposition | ExperienceRef
  theme: ThemeComposition
}
```

### Field mapping

| Old field | New location |
|-----------|-------------|
| `theme` | `theme.theme` |
| `experience` | `experience` (as `ExperienceComposition` or `ExperienceRef`) |
| `transition` | `experience.transition` (inside L2 container) |
| `chrome` | `content.chrome` |
| `pages` | `content.pages` |
| *(new)* | `content.contentContract` |
| *(new)* | `content.sampleContent` |
| *(new)* | `content.id`, `content.name` |
| *(new)* | `theme.id`, `theme.name` |

### Key changes

1. **`transition` moves into L2.** Page transitions are motion, not content. They belong in the experience container.
2. **`chrome` and `pages` move into L1.** They are content structure, now grouped with the content contract and sample content they define.
3. **`theme` gets wrapped.** The `ThemeSchema` is now inside a named `ThemeComposition` wrapper with `id` and `name` for registry/UI purposes.
4. **Content contract is explicit.** Previously implicit (derived at build time). Now a declared part of the content composition.
5. **Sample content is colocated.** Previously scattered or absent. Now lives with the content composition it seeds.

---

## Invariants

1. **SiteSchema is unchanged.** The composable model is a preset-authoring concern. The runtime renderer receives the same `SiteSchema` it always has.
2. **Containers are orthogonal.** Changing L1 does not require changing L2 or theme (unless constraint validation fails).
3. **Experience carries all motion.** No motion config lives outside the experience container.
4. **Content carries all structure.** No structural config lives outside the content container.
5. **Theme carries all visual tokens.** No color/font/spacing config lives outside the theme container.
6. **Resolution is the only bridge.** `buildSiteSchemaFromPreset()` is the single point where compositions become a `SiteSchema`.

---

## Related Documents

- Philosophy: [philosophy.spec.md](../core/philosophy.spec.md)
- Preset Layer: [preset.spec.md](../layers/preset.spec.md)
- Preset Contract: [preset.spec.md](../components/preset/preset.spec.md)
- Experience Layer: [experience.spec.md](../layers/experience.spec.md)
- Content Layer: [content.spec.md](../layers/content.spec.md)
- Schema: [schema.spec.md](../layers/schema.spec.md)
