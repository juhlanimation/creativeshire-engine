# Sections

**Page-level containers for widgets.**

Before creating:
- Is this a page-level container for widgets?
- Does the pattern exist already? Check patterns/ first.
- Is it generalized? Settings should allow many visual variations.

## Section-Scoped Components

Section patterns can include colocated components for single-use widgets:

```
sections/patterns/{Section}/
  index.ts              -- Factory function
  types.ts              -- Props
  meta.ts               -- Metadata
  styles.css            -- Section CSS (theme vars only)
  components/           -- Section-internal React components
    {Widget}/
      index.tsx          -- registerScopedWidget('{Section}__{Widget}', ...)
      styles.css
      types.ts
      meta.ts
```

**Scoped widget rules:**
- Self-register via `registerScopedWidget()` at module bottom
- Side-effect imported in section factory (`import './components/{Widget}'`)
- Factory uses `type: '{Section}__{Widget}'` in schemas
- NOT in global widget registry or meta-registry
- Use `__` (double underscore) separator between section and widget name

Specs:
- [section.spec.md](/.claude/skills/engine/specs/components/content/section.spec.md)
- [section-pattern.spec.md](/.claude/skills/engine/specs/components/content/section-pattern.spec.md)
