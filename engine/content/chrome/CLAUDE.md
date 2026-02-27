# Chrome

**Site-wide persistent UI.**

- `patterns/` — Factory functions for regions (Header, Footer) and overlays (FloatingContact, CursorTracker)
- `overlays/` — React components for overlays needing state (Modal, CursorLabel, SlideIndicators)

Regions use **widget-based patterns only** (factory functions → WidgetSchema).
Overlays may use either widget-based patterns or React components (for state).

Before creating:
- Region or Overlay?
- Is it site-wide persistent UI, not page content?
- Is it generalized with configurable settings?

Action system:
- Action infrastructure lives in `engine/content/actions/` (pub/sub, scanner, resolver)
- `pattern-registry.ts` — Chrome patterns with `providesActions` declarations
- Overlays register actions via `registerAction('{key}.{verb}', handler)`

Specs:
- [chrome.spec.md](/.claude/skills/engine/specs/components/content/chrome.spec.md)
- [action-system.spec.md](/.claude/skills/engine/specs/components/content/action-system.spec.md)

## Creating a New Chrome Pattern

```bash
npm run create:chrome {Name} --slot header   # header/footer region
npm run create:chrome {Name} --slot overlay   # modal/floating overlay
```

This generates factory files (including content.ts) and registers in pattern-registry.ts.
