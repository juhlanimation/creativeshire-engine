# Plan Workflow

> `/plan [description]` | `/plan {name}/{domain}`

Creates backlog items. Does NOT implement.

## Pre-Flight

```bash
git checkout main
git pull origin main
```

**CRITICAL:** `/plan` ONLY operates on main. Never update backlog on a feature branch.

## Input Types

| Input | Example | Behavior |
|-------|---------|----------|
| Site reference | `/plan portfolio/stripe.com` | Creates backlog from existing analysis |
| Description | `/plan "horizontal gallery widget"` | Creates backlog from description |

## Workflow

### 0. Analysis Check (for site references)

If input matches `{name}/{domain}` pattern:

```bash
# Check if analysis exists
ls .claude/analyze/{name}/{domain}/
```

**If analysis NOT found:**
```markdown
Analysis not found for `{name}/{domain}`.

Run `/analyze <url>` first to create analysis files.
```
Stop here. Do not proceed.

**If analysis found:**
Read all analysis files to inform backlog creation:
- `.claude/analyze/{name}/{domain}/SUMMARY.md`
- `.claude/analyze/{name}/{domain}/sections.md`
- `.claude/analyze/{name}/{domain}/widgets.md`
- etc.

### 1. Discovery

Parse what the user wants:
- **Site:** Use analysis files from `/analyze` output
- **Feature:** "Plan a horizontal gallery widget"
- **Enhancement:** "Add loading states to all sections"
- **Refactor:** "Plan migration to new component structure"

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

### 4. Identify Relevant Knowledge

Map the task to relevant skills/specs for the **References** field:

| Domain | Primary Reference | Common Supporting Skills |
|--------|-------------------|--------------------------|
| WIDGET | `specs/components/content/widget.spec.md` | composition-patterns, tailwind-design-system |
| SECTION | `specs/components/content/section.spec.md` | composition-patterns, frontend-design |
| CHROME | `specs/components/content/chrome.spec.md` | composition-patterns |
| BEHAVIOUR | `specs/components/experience/behaviour.spec.md` | gsap (if animation) |
| DRIVER | `specs/components/experience/driver.spec.md` | zustand |
| TRIGGER | `specs/components/experience/trigger.spec.md` | - |
| MODE | `specs/components/experience/mode.spec.md` | gsap |
| PRESET | `specs/components/preset/preset.spec.md` | - |
| SCHEMA | `specs/components/schema/schema.spec.md` | - |
| SITE | `specs/components/site/site.spec.md` | - |

**Additional skills to consider based on task:**
- **Animations:** gsap
- **State management:** zustand
- **Styling patterns:** tailwind-v4-skill, tailwind-design-system
- **Component patterns:** composition-patterns, react-best-practices
- **Visual design:** frontend-design, web-design-guidelines

### 5. Backlog Creation

Read the backlog item template:
- `../creativeshire/templates/backlog-item.md`

**Determine next ID:**
```bash
# Find highest existing ID for domain
grep -o "WIDGET-[0-9]*" .claude/tasks/backlog.md | sort -t- -k2 -n | tail -1
# If WIDGET-005 is highest, use WIDGET-006
```

**Check for ID collisions:**
```bash
# Verify ID doesn't already exist
grep "DOMAIN-XXX" .claude/tasks/backlog.md
grep "DOMAIN-XXX" .claude/tasks/completed/index.md
```

Create item(s) in `.claude/tasks/backlog.md`:
- Use correct domain prefix (WIDGET, SECTION, BEHAVIOUR, etc.)
- Use next sequential ID for each domain
- Include context from exploration
- Define clear acceptance criteria
- **Set Dependencies field** (critical for parallel builds)
- **Set References field** with relevant specs/skills from step 4

### 6. Commit

```bash
git add .claude/tasks/backlog.md
git commit -m "plan: add DOMAIN-XXX to backlog

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Reference

See `../creativeshire/templates/backlog-item.md` for:
- Domain prefixes (WIDGET, SECTION, etc.)
- Priority guide (P0-P3)
- Estimate guide (S/M/L/XL)

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
