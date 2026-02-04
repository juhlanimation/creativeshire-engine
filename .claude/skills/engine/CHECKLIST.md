# Component Type Checklists

Comprehensive validation checklists for all Creativeshire Engine component types.
**Verified against codebase on 2026-02-04.**

---

## Quick Reference

| Type | Location | Required Files | Registered In |
|------|----------|----------------|---------------|
| **Primitive** | `widgets/primitives/` | index.tsx, types.ts, styles.css, meta.ts | widgetRegistry |
| **Layout** | `widgets/layout/` | index.tsx, types.ts, styles.css, meta.ts | widgetRegistry |
| **Interactive** | `widgets/interactive/` | index.tsx, types.ts, meta.ts, styles.css? | widgetRegistry |
| **Pattern** | `widgets/patterns/` | index.ts, types.ts, meta.ts | NOT registered |
| **Section** | `sections/patterns/` | index.ts, types.ts, meta.ts | NOT registered |
| **Region** | `chrome/regions/` | index.tsx, types.ts, styles.css, meta.ts | chromeRegistry |
| **Overlay** | `chrome/overlays/` | index.tsx, types.ts, styles.css?, meta.ts | chromeRegistry |
| **Behaviour** | `behaviours/{trigger}/` | {name}.ts | behaviourRegistry |
| **Effect** | `effects/` | {mechanism}.css | index.css |
| **Driver** | `drivers/` | {Name}.ts | index.ts |
| **Trigger** | `triggers/` | use{Name}.ts | index.ts |
| **Preset** | `presets/{name}/` | index.ts, site.ts, pages/*.ts, chrome/*.ts | N/A |

---

## 1. WIDGETS - Primitives

**Location:** `engine/content/widgets/primitives/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component (memo'd, forwardRef)
- [ ] `types.ts` - Props interface with standard props
- [ ] `styles.css` - Structural CSS with CSS variable mappings
- [ ] `meta.ts` - Component metadata

### Validation Rules
- [ ] No React state (`useState`, `useReducer` forbidden)
- [ ] No `onClick` handlers (except Link for navigation)
- [ ] No `@keyframes` in CSS (animations in L2 effects)
- [ ] No `hooks/` or `store/` folders
- [ ] Props include: `id?`, `className?`, `style?`, `data-behaviour?`

### Registration
- [ ] Exported from `engine/content/widgets/primitives/index.ts`
- [ ] Added to `engine/content/widgets/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<TextProps>({
  id: 'Text',                    // PascalCase, matches folder
  name: 'Text',                  // Display name
  description: '...',            // Tooltip
  category: 'primitive',         // Fixed value
  component: true,               // Fixed for primitives
  settings: { /* UI config */ }
})
```

**Current primitives:** Text, Image, Icon, Button, Link

---

## 2. WIDGETS - Layout

**Location:** `engine/content/widgets/layout/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component using WidgetRenderer
- [ ] `types.ts` - Props interface with `widgets` prop
- [ ] `styles.css` - Layout CSS (flex, grid)
- [ ] `meta.ts` - Component metadata

### Validation Rules
- [ ] Must accept `widgets?: WidgetSchema[]` prop (NOT `children`)
- [ ] No `{children}` or `props.children` in JSX
- [ ] Uses `<WidgetRenderer widgets={widgets} />` to render children
- [ ] No `@keyframes` in CSS
- [ ] No `hooks/` or `store/` folders
- [ ] No internal state
- [ ] Props include: `id?`, `className?`, `style?`, `data-behaviour?`, `data-effect?`

### Registration
- [ ] Exported from `engine/content/widgets/layout/index.ts`
- [ ] Added to `engine/content/widgets/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<FlexProps>({
  id: 'Flex',
  category: 'layout',
  component: true,
  // ... rest
})
```

**Current layouts:** Flex, Box, Stack, Grid, Split, Container

---

## 3. WIDGETS - Interactive

**Location:** `engine/content/widgets/interactive/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component with hooks/state
- [ ] `types.ts` - Props interface extending `WidgetBaseProps`
- [ ] `meta.ts` - Component metadata
- [ ] `styles.css` - (optional) Interactive-specific CSS
- [ ] `hooks/` - (optional) Colocated hooks folder

### Validation Rules
- [ ] CAN use `useState`, `useRef`, `useEffect`, `useCallback`
- [ ] Complex event handling allowed
- [ ] Multiple render modes allowed
- [ ] Hooks colocated: `{Widget}/hooks/use{Hook}.ts`
- [ ] Props MUST extend `WidgetBaseProps`
- [ ] May support binding expressions (return null if detected)

### Registration
- [ ] Exported from `engine/content/widgets/interactive/index.ts`
- [ ] Added to `engine/content/widgets/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<VideoPlayerProps>({
  id: 'VideoPlayer',
  category: 'interactive',
  component: true,
  // ... rest
})
```

### Binding Expression Pattern
```typescript
// For widgets that delegate to platform for dynamic content
function isBindingExpression(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('{{')
}

// In component
if (isBindingExpression(props.items)) {
  return null // Platform handles binding expansion
}
```

**Current interactive:** Video, VideoPlayer, ContactPrompt, ExpandableGalleryRow, GalleryThumbnail, HeroRoles, LogoMarquee, FeaturedProjectsGrid

---

## 4. WIDGETS - Patterns (Factory Functions)

**Location:** `engine/content/widgets/patterns/{PascalCaseName}/`

### Required Files
- [ ] `index.ts` - Factory function returning `WidgetSchema` (NO .tsx)
- [ ] `types.ts` - Config interface
- [ ] `meta.ts` - Component metadata with `component: false`
- [ ] NO `styles.css` (patterns don't have styling)

### Validation Rules
- [ ] Returns `WidgetSchema` object with `type:` field
- [ ] No JSX or React imports
- [ ] No React component definition
- [ ] Composes existing primitives and layouts
- [ ] Function name: `create{PatternName}(config)`

### Registration
- [ ] NOT registered in `widgetRegistry` (patterns are factories)
- [ ] Exported from `engine/content/widgets/patterns/index.ts`

### Meta.ts Structure
```typescript
export default defineMeta<ProjectCardConfig>({
  id: 'ProjectCard',
  category: 'pattern',
  component: false,  // KEY: Factory function, not React component
  // ... rest
})
```

### Factory Return Pattern
```typescript
export function createProjectCard(config: ProjectCardConfig): WidgetSchema {
  return {
    id: config.id ?? 'project-card',
    type: 'Flex',
    className: 'project-card',
    props: { align: 'start' },
    widgets: [
      { type: 'Box', widgets: [...] },
      { type: 'Box', widgets: [...] }
    ]
  }
}
```

**Current patterns:** ProjectCard, LogoLink

---

## 5. SECTIONS - Patterns

**Location:** `engine/content/sections/patterns/{PascalCaseName}/`

### Required Files
- [ ] `index.ts` - Factory function returning `SectionSchema`
- [ ] `types.ts` - Config interface with props and default styles
- [ ] `meta.ts` - Component metadata
- [ ] NO `styles.css` (preset-specific styling goes in presets)

### Validation Rules
- [ ] Factory pattern: `create{Section}Section(props)`
- [ ] Returns `SectionSchema` object
- [ ] Not a React component
- [ ] Composes widgets and section-level layout
- [ ] Supports binding expressions for dynamic content
- [ ] Uses `__repeat` for array expansion

### Registration
- [ ] NOT registered (sections are factories)
- [ ] Exported from `engine/content/sections/patterns/index.ts`

### Meta.ts Structure
```typescript
export default defineMeta<HeroProps>({
  id: 'Hero',
  category: 'section',
  component: false,
  // ... rest
})
```

### Binding + __repeat Pattern
```typescript
if (isBindingExpression(props.projects)) {
  // Use __repeat for platform expansion
  contentWidget = {
    type: 'Flex',
    widgets: [{
      __repeat: props.projects,  // e.g., '{{ content.projects }}'
      type: 'Box',
      widgets: [
        { type: 'Text', props: { content: '{{ item.title }}' } }
      ]
    }]
  }
}
```

**Current sections:** Hero, About, FeaturedProjects, OtherProjects

---

## 6. CHROME - Regions

**Location:** `engine/content/chrome/regions/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component
- [ ] `types.ts` - Props interface
- [ ] `styles.css` - Region styling
- [ ] `meta.ts` - Component metadata

### Validation Rules
- [ ] React components (can have state/hooks)
- [ ] Appears on every page (header, footer, sidebar)
- [ ] L1 only (no imports from `experience/`)
- [ ] Generic - no site-specific content

### Registration
- [ ] Exported from `engine/content/chrome/regions/index.ts`
- [ ] Added to `engine/content/chrome/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<FooterProps>({
  id: 'Footer',
  category: 'region',
  component: true,
  // ... rest
})
```

**Current regions:** Footer

---

## 7. CHROME - Overlays

**Location:** `engine/content/chrome/overlays/{PascalCaseName}/`

### Required Files
- [ ] `index.tsx` - React component
- [ ] `types.ts` - Props interface
- [ ] `meta.ts` - Component metadata
- [ ] `styles.css` - (optional) Overlay-specific styling
- [ ] `store.ts` - (optional) Zustand store for state

### Validation Rules
- [ ] L1/L2 hybrid (CAN import from `experience/`)
- [ ] React components with state
- [ ] Rendered conditionally (modals, tooltips, indicators)
- [ ] May read from experience store
- [ ] May use GSAP for animations

### Registration
- [ ] Exported from `engine/content/chrome/overlays/index.ts`
- [ ] Added to `engine/content/chrome/registry.ts`

### Meta.ts Structure
```typescript
export default defineMeta<ModalProps>({
  id: 'Modal',
  category: 'overlay',
  component: true,
  // ... rest
})
```

**Current overlays:** Modal (ModalRoot), CursorLabel, SlideIndicators, NavTimeline

---

## 8. BEHAVIOURS

**Location:** `engine/experience/behaviours/{trigger}/{kebab-case-name}.ts`

### Trigger Folders
- `scroll/` - Scroll-based (progress, direction, velocity)
- `hover/` - Hover state (--hover: 0|1)
- `visibility/` - IntersectionObserver (--visible: 0|1)
- `animation/` - Continuous/looping (marquee, pulse)
- `interaction/` - Click/tap (--active: 0|1)

### Required Structure
- [ ] `{trigger}/{name}.ts` - Behaviour file
- [ ] `{trigger}/index.ts` - Barrel export

### Validation Rules
- [ ] ID format: `trigger/name` (e.g., `scroll/fade`)
- [ ] ID matches folder structure
- [ ] ID is kebab-case
- [ ] Has `requires: string[]` array (state dependencies)
- [ ] Has `compute: (state, options) => Record<string, string>` function
- [ ] Returns CSS variables (--kebab-case names)
- [ ] NO imports from `effects/`
- [ ] NO imports from `content/`
- [ ] Checks `state.prefersReducedMotion` for accessibility

### Behaviour Object Structure
```typescript
const scrollFade: Behaviour = {
  id: 'scroll/fade',
  name: 'Scroll Fade',
  requires: ['sectionVisibility'],
  compute: (state, options) => ({
    '--section-opacity': String(state.sectionVisibility),
  }),
  optionConfig: { /* UI controls */ }
}

registerBehaviour(scrollFade)
export default scrollFade
```

### Registration
- [ ] Self-registers via `registerBehaviour(behaviour)`
- [ ] Import triggers registration in `engine/experience/behaviours/index.ts`

**Current behaviours:** scroll/fade, scroll/fade-out, scroll/progress, scroll/color-shift, scroll/image-cycle, hover/reveal, hover/scale, hover/expand, visibility/fade-in, animation/marquee, interaction/toggle

---

## 9. EFFECTS

**Location:** `engine/experience/effects/{mechanism}.css` or `effects/{mechanism}/{variant}.css`

### File Structure
- Single file: `fade.css`
- Folder: `transform/scale.css`, `mask/wipe.css`
- Barrel: `index.css`

### Validation Rules
- [ ] CSS ONLY (no .ts/.tsx files)
- [ ] No `@keyframes` (except animation-specific effects)
- [ ] No widget names in filenames
- [ ] Named by MECHANISM: fade, scale, slide, wipe, reveal
- [ ] Consumes CSS variables from behaviours
- [ ] Uses `[data-effect~="effect-name"]` selector
- [ ] Includes `@media (prefers-reduced-motion)` fallback

### Effect CSS Pattern
```css
/**
 * fade-reveal
 * Fades element based on visibility
 *
 * CSS Variables:
 * - --fade-opacity: Current opacity (0-1)
 */

[data-effect~="fade-reveal"] {
  opacity: var(--fade-opacity, 1);
  transition: opacity var(--fade-duration, 300ms) ease-out;
  will-change: opacity;
}

@media (prefers-reduced-motion: reduce) {
  [data-effect~="fade-reveal"] {
    transition: none;
  }
}
```

### Registration
- [ ] Imported in `effects/index.css`

**Current effects:** fade.css, transform/scale.css, transform/slide.css, mask/wipe.css, mask/reveal.css, emphasis/spin.css, color-shift.css, overlay-darken.css, marquee-scroll.css

---

## 10. DRIVERS

**Location:** `engine/experience/drivers/{Name}.ts`

### File Types
- Class: `{Name}Driver.ts` (PascalCase) - Core infrastructure
- Hook: `use{Name}.ts` (camelCase) - React integration
- Factory: `get{Name}.ts` - Singleton pattern
- Provider: `{Name}Provider.tsx` - React context

### Validation Rules
- [ ] Manages infrastructure/complex state
- [ ] Reference counting for cleanup (getDriver/releaseDriver pattern)
- [ ] Container-aware (supports fullpage and contained mode)
- [ ] 60fps optimized (only CSS variable updates, no React re-renders)
- [ ] Types in `types.ts`
- [ ] Exported from `drivers/index.ts`

### Driver Class Pattern
```typescript
export class ScrollDriver {
  private targets = new Map<string, Target>()

  register(target: Target): void { /* ... */ }
  unregister(id: string): void { /* ... */ }
  destroy(): void { /* cleanup listeners */ }
}
```

### Factory Pattern
```typescript
const drivers = new Map<HTMLElement | null, ScrollDriver>()
const refCounts = new Map<HTMLElement | null, number>()

export function getDriver(container: HTMLElement | null): ScrollDriver
export function releaseDriver(container: HTMLElement | null): void
```

**Current drivers:** ScrollDriver, MomentumDriver, getDriver, SmoothScrollProvider, useScrollFadeDriver, useGsapReveal, gsap/transitions/*

---

## 11. TRIGGERS

**Location:** `engine/experience/triggers/use{Name}.ts`

### Validation Rules
- [ ] SSR guard: `if (typeof window === 'undefined') return`
- [ ] Cleans up ALL event listeners in return function
- [ ] Cleans up requestAnimationFrame, timeouts, observers
- [ ] NO imports from `content/`
- [ ] NO imports from `behaviours/`
- [ ] Container-aware (supports containerRef for contained mode)
- [ ] Updates store via `store.setState()`

### Trigger Hook Pattern
```typescript
'use client'

export function useScrollProgress({
  store,
  containerMode,
  containerRef
}: TriggerProps): void {
  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return

    // Container-aware target
    const target = containerMode === 'contained'
      ? containerRef?.current
      : window

    const handler = () => {
      store.setState({ scrollProgress: /* ... */ })
    }

    target?.addEventListener('scroll', handler, { passive: true })

    // Cleanup
    return () => {
      target?.removeEventListener('scroll', handler)
    }
  }, [store, containerMode, containerRef])
}
```

### Registration
- [ ] Exported from `triggers/index.ts`
- [ ] Called by `TriggerInitializer.tsx`

**Current triggers:** useScrollProgress, useIntersection, usePrefersReducedMotion, useViewport, useCursorPosition

---

## 12. PRESETS

**Location:** `engine/presets/{kebab-case-name}/`

### Required Files
- [ ] `index.ts` - Main preset export (`{name}Preset: SitePreset`)
- [ ] `site.ts` - Experience configuration
- [ ] `pages/index.ts` - Page templates barrel
- [ ] `pages/{pageName}.ts` - Individual page schemas
- [ ] `chrome/index.ts` - Chrome configuration barrel
- [ ] `chrome/{region|overlay}.ts` - Chrome configs

### Validation Rules
- [ ] kebab-case folder name
- [ ] Uses binding expressions `{{ content.xxx }}` for all content
- [ ] Site-specific styling ONLY here (not in engine components)
- [ ] Chrome config uses widget schemas (not component references)

### Preset Structure
```typescript
export const bojuhlPreset: SitePreset = {
  theme: {
    scrollbar: { /* ... */ },
    smoothScroll: { /* ... */ },
    typography: { /* ... */ },
    sectionTransition: { /* ... */ }
  },
  experience: experienceConfig,
  chrome: {
    regions: {
      header: 'hidden',
      footer: footerConfig
    },
    overlays: {
      floatingContact: floatingContactConfig,
      modal: { component: 'ModalRoot' }
    }
  },
  pages: {
    home: homePageTemplate
  }
}
```

**Current presets:** bojuhl

---

## Architecture Rules Summary

### L1/L2 Split
- **L1 (Content):** Renders once. Primitives, layout, patterns, sections, chrome.
- **L2 (Experience):** Animates at 60fps. Behaviours, effects, drivers, triggers.
- **Bridge:** CSS variables only. L1 sets `data-behaviour`/`data-effect`, L2 updates `--var` values.

### Naming Conventions
- **Folders:** PascalCase for components, kebab-case for behaviours/effects
- **Behaviours:** Named by TRIGGER (scroll/, hover/, visibility/)
- **Effects:** Named by MECHANISM (fade, scale, slide, mask/)

### No Backward Compatibility
- Old patterns deleted and replaced, not aliased
- No `BEHAVIOUR_ALIASES` or compatibility layers
- One pattern, applied consistently
