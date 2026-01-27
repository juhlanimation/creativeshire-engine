# Backlog Item Template

Use this **exact format** when creating backlog items in `.claude/tasks/backlog.md`.

## Format

```markdown
#### [DOMAIN-XXX] Title

- **Type:** Feature | Bug | Refactor
- **Priority:** P0 | P1 | P2 | P3
- **Estimate:** S | M | L | XL
- **Dependencies:** DOMAIN-XXX | None
- **Added:** YYYY-MM-DD
- **Description:** What needs to be done
- **Context:** Key files, patterns to follow
- **Approach:** How to implement
- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
```

## Domain Prefixes

| Prefix | Component |
|--------|-----------|
| WIDGET | Widgets |
| SECTION | Sections |
| CHROME | Chrome |
| BEHAVIOUR | Behaviours |
| DRIVER | Drivers |
| TRIGGER | Triggers |
| MODE | Modes |
| PRESET | Presets |
| SCHEMA | Schema types |
| SITE | Site configuration |
| APP | App/routing |
| UTIL | Utilities |

## Priority Guide

| Priority | When |
|----------|------|
| P0 | Blocking, critical path |
| P1 | Important, needed soon |
| P2 | Good to have |
| P3 | Nice to have, backlog |

## Estimate Guide

| Size | Complexity |
|------|------------|
| S | 1-2 files, simple change |
| M | 3-5 files, moderate |
| L | 5-10 files, complex |
| XL | 10+ files (consider splitting) |

## Example

```markdown
#### [WIDGET-005] VideoBackground

- **Type:** Feature
- **Priority:** P1
- **Estimate:** M
- **Dependencies:** None
- **Added:** 2026-01-27
- **Description:** Create video background widget for hero sections
- **Context:** See existing BackgroundImage widget for patterns
- **Approach:**
  1. Create VideoBackground component with autoplay, muted, loop
  2. Support poster image fallback
  3. Add to widget registry
- **Acceptance Criteria:**
  - [ ] VideoBackground renders video element
  - [ ] Supports mp4 and webm sources
  - [ ] Falls back to poster image
  - [ ] Passes tsc --noEmit
```
