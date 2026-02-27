# Settings & Fields Taxonomy

Guidelines for what settings to expose in section/widget/chrome metas, and how to organize them.

## Industry Context

Professional web builders (Squarespace, Webflow, Framer) expose 5-8 settings per section block:

| Block type | Squarespace | Webflow | Framer | Our target |
|---|---|---|---|---|
| Hero | ~6 | ~7 | ~5 | **4-8** |
| Gallery | ~5 | ~5 | ~4 | **4-7** |
| Pricing | ~4 | ~4 | ~3 | **4-6** |
| Text widget | ~2 | ~6 | ~5 | **3-6** |
| Image widget | ~4 | ~3 | ~4 | **3-5** |
| Button widget | ~3 | ~2 | ~3 | **2-4** |

**Key insight:** No professional builder exposes per-element typography scales at section level. Text styling is site-wide (theme fonts panel) or inline (click text, change size).

---

## Four-Tier Visibility System

### Tier 1: Essential (default)

- **Flag**: none (default behavior)
- **CMS**: Always visible, top of panel
- **Storybook**: Top-level controls
- **Purpose**: Core mode switches, layout choices that define the brick's purpose
- **Examples**: Column count, layout mode (grid/carousel/list), hover-play toggle
- **Count**: 1-5 per brick

### Tier 2: Style

- **Flag**: `group: 'Style'` (or `'Styling'`)
- **CMS**: Design panel, all visible when tab open
- **Storybook**: Grouped under "Style"
- **Purpose**: Visual customization — changes look without changing structure
- **Examples**: Background color, text color mode (light/dark), card shadow toggle, border, accent color
- **Count**: 1-5 per brick

### Tier 3: Advanced

- **Flag**: `advanced: true`
- **CMS**: Collapsed "More Options" section
- **Storybook**: Hidden by default (filtered by controls-adapter)
- **Purpose**: Power-user fine-tuning that 90% of users never need
- **Examples**: Typography size multiplier, marquee duration, loop start time, precise offsets, letter-spacing
- **Count**: 0-4 per brick

### Tier 4: Preset-only

- **Flag**: `hidden: true` (optionally `editorHint: 'structural'`)
- **CMS**: Never shown
- **Storybook**: Filtered out
- **Purpose**: Implementation details the preset author controls at template creation time
- **Examples**: Flexbox direction/justify, gap CSS values, text semantic scale (h1/h2/body), object-fit, structural variant
- **Count**: 0-6 per brick

---

## Tier Assignment Decision Tree

```
Is this the primary data the user types/uploads/curates?
  YES → Content field (content.ts), NOT a meta setting

Is this a visual knob (color, shadow, spacing preset)?
  YES → Tier 2 (Style)

Would only a power user touch this (timing, precise position, multiplier)?
  YES → Tier 3 (Advanced)

Is this an implementation detail the section design depends on?
  YES → Tier 4 (Preset-only, hidden: true)

Default → Tier 1 (Essential) — mode/variant switch
```

---

## Hard Limits

| Brick type | Visible (T1+T2) max | Advanced (T3) max | Hidden (T4) max |
|---|---|---|---|
| Widget (primitive) | 5 | 3 | 4 |
| Widget (interactive) | 6 | 4 | 5 |
| Widget (layout) | 5 | 2 | 3 |
| **Section pattern** | **10** | **3** | **6** |
| **Chrome pattern** | **6** | **2** | **3** |

**Hard ceiling: No brick may have more than 12 visible (Tier 1 + Tier 2) settings.**

---

## Content vs. Settings Boundary

### The Rule

- **Content** (`content.ts`): Data the site owner types, uploads, or curates. Unique per site.
- **Settings** (`meta.ts`): How the engine displays that content. Same across sites using a preset.
- **If a field exists in `content.ts`, it must NOT also appear in `meta.ts`.**

### Decision Matrix

| Field type | Where | Why |
|---|---|---|
| Title text, bio paragraphs, CTA label | Content | User types it |
| Image/video URLs | Content | User uploads them |
| Contact email, social links | Content | Unique per site |
| Copyright text, navigation links | Content | User customizes it |
| Project/plan collections | Content | User manages them |
| Background color, card shadow | Setting (Style) | Design preference |
| Column count, layout mode | Setting (Essential) | Structure choice |
| Text color mode (light/dark) | Setting (Style) | Visual choice |
| Loop start time, marquee duration | Setting (Advanced) | Technical tuning |
| Flexbox gap CSS value, text scale | Setting (Preset-only) | Implementation detail |
| Bio max-width, vertical offsets | Setting (Preset-only) | Layout internals |

---

## Typography Scale Policy

### Rule: Factories hard-code semantic scales. Users don't pick them.

Section factories decide: "title is h2, caption is small." This is a design contract, not a user choice.

### Implementation

- **Remove** all `textScaleSetting()` from visible section metas
- Move to `hidden: true` if presets need to override scales
- Use `textSizeMultiplierSetting()` (Advanced) only for hero display titles
- Theme-level font choices cascade site-wide

### Exception

`textSizeMultiplierSetting()` is acceptable as Tier 3 (Advanced) for hero titles where the user wants "bigger/smaller" without changing the semantic level.

---

## Sub-Widget Settings Policy

### Rule: Settings belong to the component that uses them.

Section meta should NOT re-declare internal widget settings:

```typescript
// BAD: section meta declares sub-widget settings
settings: {
  marqueeDuration: { ... },  // belongs to MarqueeImageRepeater
  invertLogos: { ... },       // belongs to MarqueeImageRepeater
}

// GOOD: factory passes values via widget props
widgets: [{
  type: 'AboutBio__MarqueeImageRepeater',
  props: { duration: 120, invertLogos: true },
}]
```

---

## Storybook Display Strategy

### Standard Groups (ordered)

1. **Layout** — columns, gap preset, mode switches
2. **Style** — colors, shadows, borders, text color mode
3. **Spacing** — padding presets
4. **Advanced** — timing, multipliers, offsets (collapsed)

### Visibility

- Tier 1+2 → visible as Storybook controls (automatic via `controls-adapter.ts`)
- Tier 3 → filtered out (`advanced: true`)
- Tier 4 → filtered out (`hidden: true`)

### Content in Storybook

Content is NOT exposed as Storybook controls. It flows from `content.ts` → `sampleContent` → `preview.ts`. Users see a working section with realistic preview data, and adjust only the design settings via controls.

---

## Standard Setting Helpers

Use helpers from `engine/schema/settings-helpers.ts` for consistency:

| Helper | Returns | Default tier |
|---|---|---|
| `colorSetting(label, default?)` | `type: 'color'`, group: Style | Style |
| `textColorModeSetting(default?)` | `type: 'select'` light/dark | Style |
| `spacingPresetSetting(label, default?)` | `type: 'select'` none/tight/default/loose | Style |
| `textSizeMultiplierSetting(label, default?)` | `type: 'range'` 0.5-5 | Advanced |
| `textScaleSetting(label, default?)` | `type: 'select'` scale choices | Preset-only (hidden) |

---

## Flag Reference

| Tier | `hidden` | `advanced` | `editorHint` | `group` |
|---|---|---|---|---|
| Essential | — | — | `'content'` or omit | any |
| Style | — | — | omit | `'Style'` |
| Advanced | — | `true` | omit | any |
| Preset-only | `true` | — | `'structural'` (opt.) | any |

---

## Enforcement

Architecture tests (`__tests__/architecture/settings-taxonomy.test.ts`) validate:

1. No section/chrome has >12 non-hidden, non-advanced settings
2. No content field paths overlap between `content.ts` and `meta.ts`
3. No visible (non-hidden, non-advanced) `textScaleSetting` in section metas
