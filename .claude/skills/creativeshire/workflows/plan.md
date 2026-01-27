# Plan Workflow

> `/plan [description]` | `/plan analyze <url>`

Creates backlog items. Does NOT implement.

## Entry Points

| Command | Action |
|---------|--------|
| `/plan [description]` | Plan a feature |
| `/plan analyze <url>` | Analyze external site |

## Workflow

```
1. Git setup   → Ensure on main, pull latest
2. Discovery   → Parse what user wants
3. Exploration → Search codebase for context
4. Backlog     → Create well-formed items
5. Commit      → Commit to main
```

## Git Setup

```bash
git checkout main
git pull origin main
```

## Exploration

Search codebase for:
1. Existing components/patterns relevant to request
2. Integration points and dependencies
3. Conventions to follow

## Backlog Item Format

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
| PRESET | Presets |

## Priority Guide

| Priority | When |
|----------|------|
| P0 | Blocking, critical |
| P1 | Important |
| P2 | Good to have |
| P3 | Nice to have |

## Estimate Guide

| Size | Complexity |
|------|------------|
| S | 1-2 files |
| M | 3-5 files |
| L | 5-10 files |
| XL | 10+ files (split) |

## Commit

```bash
git add .claude/tasks/backlog.md
git commit -m "plan: add DOMAIN-XXX to backlog

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Output

```markdown
## Planned

Added to backlog:
- [WIDGET-XXX] Description

Next: `/build WIDGET-XXX`
```
