# Renderer

**Renders schema → React components.**

- SiteRenderer → PageRenderer → SectionRenderer → WidgetRenderer
- Maps schema types to registered components
- Handles layout, chrome, themes

Before modifying:
- Are you changing how schema maps to components?
- Registry changes affect all sites.

Specs:
- [renderer.spec.md](/.claude/skills/engine/specs/components/renderer/renderer.spec.md)
- [registry.spec.md](/.claude/skills/engine/specs/components/renderer/registry.spec.md)

## CSS Variable Timing

Theme CSS variables are set as **inline styles on `[data-site-renderer]`** in `SiteRenderer.tsx` via `buildThemeStyle()`. This makes them available in server-rendered HTML — zero FOUC.

`useThemeVariables` only handles side effects that inline styles can't:
- `document.documentElement` vars (scrollbar, outer-bg) — CSS rules on `html` can't inherit from children
- Font `<link>` injection — dynamically loads web font stylesheets

Pattern: prefer inline styles for CSS vars. Only use hooks for DOM side effects that require imperative access.

## Max-Width & Section Backgrounds

Opt-in max-width via `constrained: true` toggle — backgrounds always extend full-width:

```
[data-site-renderer]  ← background: var(--site-outer-bg), full width, SSR-ready
  [data-site-content]  ← full-width structural wrapper (no max-width)
    [data-section-id]  ← full-width, section backgroundColor (edge-to-edge)
      <section data-constrained>  ← max-width: var(--site-max-width) when constrained
        widgets...
```

- Sections are full-width by default — no max-width constraint
- Set `constrained: true` on SectionSchema to opt into `--site-max-width` constraint
- Section wrappers (`[data-section-id]`) carry `backgroundColor` and span the full viewport
- Chrome regions: same pattern — `constrained: true` on RegionSchema applies max-width to content
- Chrome wrappers carry `region.style` for edge-to-edge backgrounds
- Overlays: positions auto-adjust to stay within max-width boundary (CSS calc)
- Contained mode: `[data-engine-container]` keeps its max-width (iframe boundary)
