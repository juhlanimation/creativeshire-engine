# Plan Workflow

> `/plan [description]`

Creates backlog items. Does NOT implement.

## Pre-Flight

```bash
git checkout main
git pull origin main
```

**CRITICAL:** `/plan` ONLY operates on main. Never update backlog on a feature branch.

## Workflow

### 1. Discovery

Parse what the user wants:
- **Feature:** "Plan a horizontal gallery widget"
- **Enhancement:** "Add loading states to all sections"
- **Refactor:** "Plan migration to new component structure"
- **Investigation:** "Analyze performance bottlenecks"

### 2. Exploration

Search codebase for:
1. Existing components/patterns relevant to request
2. Integration points and dependencies
3. Conventions to follow

Use the creativeshire skill specs index to understand component types.

### 3. Architecture Consideration

Before creating backlog items, consider:
- Which layer is touched (Content vs Experience)?
- Which component type (Widget, Section, Behaviour, etc.)?
- Are there multi-component dependencies?
- Read relevant spec from creativeshire skill to validate approach

### 4. Backlog Creation

Read the backlog item template:
- `../creativeshire/templates/backlog-item.md`

Create item(s) in `.claude/tasks/backlog.md`:
- Use correct domain prefix (WIDGET, SECTION, BEHAVIOUR, etc.)
- Include context from exploration
- Define clear acceptance criteria
- **Set Dependencies field** (critical for parallel builds)

### 5. Commit

```bash
git add .claude/tasks/backlog.md
git commit -m "plan: add DOMAIN-XXX to backlog

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Domain Prefixes

| Prefix | Component |
|--------|-----------|
| WIDGET | Widgets |
| SECTION | Sections |
| CHROME | Chrome (header, footer, overlays) |
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

## Dependency Declaration

**CRITICAL:** Dependencies field enables parallel builds.

```markdown
#### [WIDGET-001] Video Player
- **Dependencies:** None

#### [SECTION-001] Hero Section
- **Dependencies:** WIDGET-001, WIDGET-002
```

Items with dependencies MUST be placed AFTER their dependencies in backlog.

## Output Format

```markdown
## Planned

Added to backlog:
- [WIDGET-XXX] Description
- [SECTION-XXX] Description (depends on WIDGET-XXX)

Next: `/build WIDGET-XXX` (start with no dependencies)
```

## If Scope is Large

Split into multiple backlog items with dependencies:

```markdown
#### [WIDGET-010] Base gallery component
- **Dependencies:** None

#### [WIDGET-011] Gallery navigation
- **Dependencies:** WIDGET-010

#### [SECTION-005] Gallery section
- **Dependencies:** WIDGET-010, WIDGET-011
```
