# Current Sprint

> Active work. Managed by `/build`.

## Status

- **Branch:** _none_
- **State:** idle

## Items

| Item | Status | Iteration | Notes |
|------|--------|-----------|-------|
| - | - | - | - |

## Active Item

_No active item. Run `/build [item]` to start._

## Format Reference

When building:
```markdown
## Status

- **Branch:** sprint/hero-widgets
- **State:** building

## Items

| Item | Status | Iteration | Notes |
|------|--------|-----------|-------|
| WIDGET-001 | completed | 1 | - |
| WIDGET-002 | in_progress | 2 | Type error on line 42 |
| WIDGET-003 | pending | 0 | Depends on WIDGET-002 |

## Active Item

**WIDGET-002** - Hero text widget

**Iteration 2/3**

**Last issue:**
TypeScript error: Property 'variant' does not exist on type...

**Files:**
- `creativeshire/components/content/widgets/HeroText/HeroText.tsx`
```
