# Renderer

**Renders schema → React components.**

- SiteRenderer → PageRenderer → SectionRenderer → WidgetRenderer
- Maps schema types to registered components
- Handles layout, chrome, themes

Before modifying:
- Are you changing how schema maps to components?
- Registry changes affect all sites.

Specs:
- [renderer.spec.md](/.claude/skills/creativeshire/specs/components/renderer/renderer.spec.md)
- [registry.spec.md](/.claude/skills/creativeshire/specs/components/renderer/registry.spec.md)
