# Naming Conventions

> Consistent naming patterns for the Creativeshire architecture.

---

## Files and Folders

| Location | Convention | Example | Notes |
|----------|------------|---------|-------|
| Component folders | PascalCase | `Image/`, `Flex/`, `Hero/` | Match TypeScript component name |
| Behaviour folders | kebab-case | `depth-layer/`, `scroll-stack/` | Match registry key |
| Mode folders | kebab-case | `parallax/`, `scroll-snap/` | Match mode identifier |
| Widget folders | kebab-case | `video-grid/`, `credits-card/` | Match registry key |
| Entry files | `index.ts` | `index.ts`, `index.tsx` | Barrel exports only |
| Implementation files | kebab-case + suffix | `stack.behaviour.tsx` | Suffix indicates type |
| Type files | `types.ts` | `types.ts`, `*.types.ts` | Pure type definitions |
| Registry files | `registry.ts` | `registry.ts` | Maps keys to implementations |

### File Suffixes

| Suffix | Layer | Example |
|--------|-------|---------|
| `.widget.tsx` | Content | `video-grid.widget.tsx` |
| `.section.tsx` | Content | `backdrop.section.tsx` |
| `.layout.tsx` | Content | `card.layout.tsx` |
| `.chrome.tsx` | Content | `nav-timeline.chrome.tsx` |
| `.behaviour.tsx` | Experience | `stack.behaviour.tsx` |
| `.experience.tsx` | Experience | `infinite-carousel.experience.tsx` |
| `.preset.tsx` | Preset | `infinite-carousel.preset.tsx` |

---

## TypeScript

### Interfaces

| Pattern | Convention | Example |
|---------|------------|---------|
| Component props | `{Name}Props` | `ImageProps`, `VideoGridWidgetProps` |
| Schema definitions | `{Name}Schema` | `SectionSchema`, `WidgetSchema` |
| Configuration | `{Name}Config` | `BehaviourConfig`, `LayoutConfig` |
| Imperative handles | `{Name}Handle` | `VideoGridHandle`, `ProjectGalleryHandle` |

### Types

| Pattern | Convention | Example |
|---------|------------|---------|
| Union types | PascalCase | `WidgetType`, `LayoutDirection` |
| CSS variable maps | `CSSVariables` | `Record<\`--${string}\`, string \| number>` |
| Literal unions | PascalCase | `TypographySize`, `AlignValue` |

### Functions

| Pattern | Convention | Example |
|---------|------------|---------|
| Factory functions | `create{Name}` | `createHeroSection`, `createProjectCard` |
| React hooks | `use{Name}` | `useScrollProgress`, `useBehaviour` |
| Registry getters | `get{Name}` | `getBehaviour`, `getWidget` |
| Registry setters | `register{Name}` | `registerBehaviour`, `registerWidget` |
| Event handlers | `on{Event}` | `onVideoSelect`, `onClick` |
| Compute functions | `compute{Name}` | `computeDepthOffset`, `computeOpacity` |

### Constants

| Category | Convention | Example |
|----------|------------|---------|
| True constants | SCREAMING_SNAKE_CASE | `MAX_SECTIONS`, `DEFAULT_GAP` |
| Registry maps | camelCase | `behaviourRegistry`, `widgetRegistry` |
| Configuration objects | camelCase | `defaultConfig`, `siteConfig` |
| Enum-like objects | SCREAMING_SNAKE_CASE keys | `BUILT_IN_BEHAVIOURS.STACK` |

---

## CSS Variables

| Pattern | Convention | Example |
|---------|------------|---------|
| All variables | Prefix with `--` | `--scroll-progress` |
| Word separation | kebab-case | `--depth-y`, `--card-opacity` |
| Scoped variables | `--{scope}-{name}` | `--widget-opacity`, `--section-height` |
| State variables | `--{element}-{state}` | `--button-hover`, `--card-active` |
| Computed values | `--{source}-{property}` | `--scroll-y`, `--viewport-height` |

### Variable Naming Examples

| Category | Good | Bad |
|----------|------|-----|
| Scroll-based | `--scroll-progress` | `--scrollProgress`, `--SCROLL_PROGRESS` |
| Component scope | `--section-opacity` | `--sectionOpacity`, `--opacity` |
| Depth calculations | `--depth-layer-y` | `--depthLayerY`, `--y` |
| Animation timing | `--fade-duration` | `--fadeDuration`, `--duration` |

---

## Schema Fields

| Field | Purpose | Value Convention |
|-------|---------|------------------|
| `type` | Discriminator | PascalCase for widgets (`Image`, `Flex`), kebab-case for behaviours (`stack`, `fade`) |
| `id` | Unique identifier | kebab-case (`hero-section`, `main-gallery`) |
| `behaviour` | Animation reference | kebab-case string (`stack`, `card-entrance`) or `BehaviourConfig` object |
| `features` | Static styling | Object with camelCase keys |
| `layout` | Container config | Object with `type` as kebab-case |
| `props` | Component props | camelCase keys matching TypeScript interface |

### Schema Examples

```typescript
// Good: Consistent field naming
const section: SectionSchema = {
  id: 'hero-section',
  layout: { type: 'flex', direction: 'column' },
  behaviour: 'stack',
  features: { spacing: { padding: '2rem' } },
  widgets: [{ type: 'Image', props: { src: '/hero.jpg' } }]
}

// Bad: Inconsistent naming
const section = {
  ID: 'HeroSection',           // Should be kebab-case
  Layout: { Type: 'Flex' },    // Should be lowercase
  Behaviour: 'Stack',          // Should be kebab-case
}
```

---

## Registry Keys

### Widget Registry

| Pattern | Key Convention | Example |
|---------|----------------|---------|
| Content widgets | PascalCase | `VideoGrid`, `ProjectGallery` |
| Layout widgets | PascalCase | `Flex`, `Grid`, `Stack` |
| Composite widgets | PascalCase | `ProjectCard`, `Testimonial` |

### Behaviour Registry

| Pattern | Key Convention | Example |
|---------|----------------|---------|
| Section behaviours | kebab-case | `stack`, `fade`, `card-entrance` |
| Widget behaviours | kebab-case | `parallax`, `depth-layer` |
| Mode identifiers | kebab-case | `infinite-carousel`, `scroll-snap` |

### Registry Code Examples

```typescript
// Widget registry: PascalCase keys
registerWidget('VideoGrid', VideoGridWidget)
registerWidget('ProjectGallery', ProjectGalleryWidget)

// Behaviour registry: kebab-case keys
registerBehaviour('stack', StackBehaviour)
registerBehaviour('card-entrance', CardEntranceBehaviour)

// Built-in constants: SCREAMING_SNAKE_CASE
export const BUILT_IN_BEHAVIOURS = {
  STACK: 'stack',
  FADE: 'fade',
  CARD_ENTRANCE: 'card-entrance',
} as const
```

---

## Quick Reference Table

| Element | Convention | Example |
|---------|------------|---------|
| Component name | PascalCase | `VideoGridWidget` |
| Component folder | kebab-case | `video-grid/` |
| Implementation file | kebab-case + suffix | `video-grid.widget.tsx` |
| Props interface | PascalCase + Props | `VideoGridWidgetProps` |
| Registry key (widget) | PascalCase | `VideoGrid` |
| Registry key (behaviour) | kebab-case | `card-entrance` |
| CSS variable | kebab-case with `--` | `--scroll-progress` |
| Schema id | kebab-case | `hero-section` |
| Hook | camelCase with `use` | `useScrollProgress` |
| Factory function | camelCase with `create` | `createHeroSection` |

---

## See Also

- [Glossary](../core/glossary.spec.md) - Term definitions
- [Schema Contract](../components/schema/schema.spec.md) - Schema interface requirements
- [Content Layer](../layers/content.spec.md) - Widget and section conventions
- [Experience Layer](../layers/experience.spec.md) - Behaviour and driver conventions
