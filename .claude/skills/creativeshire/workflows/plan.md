# Plan Workflow

> `/plan [description]` | `/plan analyze <URL|path>`

## Purpose

Create well-formed backlog items. **NO implementation.**

## Workflow

```
User Request
     │
     ▼
Phase 0: Git Setup
     │  - Ensure on main branch
     │  - Pull latest
     │
     ▼
Phase 1: Discovery
     │  - Parse request type
     │  - Route to workflow
     │
     ▼
Phase 2: Exploration
     │  - Launch Explore agent
     │  - Find existing patterns
     │
     ▼
Phase 3: Architecture Analysis
     │  - Identify boundaries
     │  - Determine specialists
     │
     ▼
Phase 4: Backlog Creation
     │  - Create items in backlog.md
     │
     ▼
Phase 5: Commit to Main
```

## Entry Points

| Command | What It Does |
|---------|--------------|
| `/plan [description]` | Plan any feature, investigation, or enhancement |
| `/plan analyze <URL>` | Analyze website and create backlog items |
| `/plan analyze <path>` | Analyze local code and create backlog items |
| `/plan analyze "description"` | Plan from conceptual description |

---

## Phase 0: Git Setup

**Always work on main for planning.**

```bash
# Check current branch
git branch --show-current

# If not on main:
git checkout main
git pull origin main
```

---

## Phase 1: Discovery

Parse what the user wants:

- **Feature:** "Plan a horizontal gallery widget"
- **Investigation:** "Analyze performance bottlenecks"
- **Enhancement:** "Add loading states to all sections"
- **Analysis:** "Break down this website into components"

---

## Phase 2: Exploration

Launch `Explore` agent to understand the codebase:

```
Task(
  subagent_type="Explore",
  description="Explore codebase for [request]",
  prompt="
TASK: Analyze codebase for [user request]

FIND:
1. Existing components/patterns relevant to this request
2. Integration points and dependencies
3. Conventions and standards to follow
4. Key files (5-10 most important)

OUTPUT: Structured exploration report with file paths and patterns.
"
)
```

---

## Phase 3: Architecture Analysis

Analyze scope and identify what needs to be built:

1. **Which layers are touched?** (Content, Experience, Schema, etc.)
2. **Which component types?** (Widget, Section, Behaviour, etc.)
3. **What dependencies exist?** (Build order)
4. **Any architectural concerns?**

For complex requests, this can be done by analyzing the exploration results.

---

## Phase 4: Backlog Creation

### Read Existing Backlog First

```bash
cat .claude/tasks/backlog.md
```

Get the next item ID for each domain.

### Create Backlog Items

```markdown
#### [DOMAIN-XXX] Title

- **Type:** Feature | Bug | Refactor | Migration
- **Priority:** P0 | P1 | P2 | P3
- **Estimate:** S | M | L | XL
- **Dependencies:** DOMAIN-XXX, DOMAIN-YYY | None
- **Added:** YYYY-MM-DD
- **Description:**
  Clear description of what needs to be done.

- **Context:**
  - Key files: `path/to/file.tsx`
  - Patterns to follow: [patterns identified]

- **Approach:**
  Recommended implementation approach.

- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3
```

### Priority Guidelines

| Priority | When to Use |
|----------|-------------|
| **P0** | Blocking other work, critical bug |
| **P1** | Important feature, significant improvement |
| **P2** | Good to have, improvement |
| **P3** | Nice to have, polish |

### Estimate Guidelines

| Size | Complexity |
|------|------------|
| **S** | 1-2 files, clear solution |
| **M** | 3-5 files, some decisions |
| **L** | 5-10 files, architecture decisions |
| **XL** | 10+ files, consider splitting |

---

## Phase 5: Commit to Main

```bash
git add .claude/tasks/backlog.md
git commit -m "chore: add ITEM-XXX to backlog

- [Brief description]

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## /plan analyze - Analysis Workflow

For analyzing external references.

### Website Analysis

```
/plan analyze https://example.com

1. Fetch page content
2. Launch analyst agent(s) to identify:
   - Sections (hero, gallery, about, etc.)
   - Widgets (buttons, cards, forms, etc.)
   - Chrome (header, footer, nav)
   - Experience (animations, interactions)
3. Create backlog items for each
4. Set dependencies and build order
5. Commit to main
```

### Parallel Analysis

For comprehensive analysis, launch multiple analysts in parallel:

```
Task(subagent_type="analyst", description="Analyze sections", prompt="Focus on page sections...")
Task(subagent_type="analyst", description="Analyze widgets", prompt="Focus on widgets...")
Task(subagent_type="analyst", description="Analyze experience", prompt="Focus on animations...")
```

### Backlog Naming Convention

| Domain | Prefix | Example |
|--------|--------|---------|
| Section | `SECTION-XXX` | `SECTION-001` |
| Widget | `WIDGET-XXX` | `WIDGET-001` |
| Chrome | `CHROME-XXX` | `CHROME-001` |
| Experience | `EXPERIENCE-XXX` | `EXPERIENCE-001` |
| Layout | `LAYOUT-XXX` | `LAYOUT-001` |
| Preset | `PRESET-XXX` | `PRESET-001` |

---

## Example Session

**User:** `/plan add a horizontal gallery for project screenshots`

```
Phase 0: Git Setup
  ✓ On main branch
  ✓ Pulled latest

Phase 1: Discovery
  → Feature request for Content layer widget

Phase 2: Exploration
  → Launched Explore agent
  → Found: video-gallery-widget.tsx, project-gallery-section.tsx
  → Pattern: CSS scroll-snap, local state for interactions

Phase 3: Architecture Analysis
  → Boundary: Content Layer → Widgets
  → No dependencies on other items
  → Approach: New horizontal-gallery.widget.tsx with CSS scroll-snap

Phase 4: Backlog Creation
  → Next ID: WIDGET-003
  → Created item in backlog.md

Phase 5: Commit
  ✓ Committed to main

## Result

Added WIDGET-003 to backlog at P2 priority.

To implement: /build WIDGET-003
```

---

## Output Format

```markdown
## Planning Complete

### Item Added
- **ID:** WIDGET-003
- **Title:** Horizontal Gallery Widget
- **Priority:** P2
- **Dependencies:** None

### Context Found
- Existing pattern: video-gallery-widget.tsx
- Key files: widgets/, content/index.ts

### Next Steps
- `/build WIDGET-003` to implement
```
