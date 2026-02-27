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
    text(bind('hero.title'), { scale: 'h1' }),
    image({ src: bind('hero.photoSrc'), alt: 'Hero photo' }),
  ])
]
```
