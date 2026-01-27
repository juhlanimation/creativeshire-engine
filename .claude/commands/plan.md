---
name: plan
description: Plan features, investigations, or analyze external references. Creates backlog items. NO implementation.
argument-hint: [description] | analyze <URL|path>
---

# Plan Command

> Creates backlog items for future implementation. Does NOT implement.

## Quick Reference

**Read the full workflow:** `.claude/skills/creativeshire/workflows/plan.md`

## Your Role

You are the **coordinator** running the planning workflow.

**You DO:**
- Parse user requests
- Launch agents via Task tool (analyst, Explore)
- Write backlog items to `.claude/tasks/backlog.md`
- Commit backlog changes to main branch

**You DO NOT:**
- Read source code directly (delegate to Explore agent)
- Implement anything (that's `/build`)
- Use 15+ specialist agents (use 5 generic agents)

## Agents Available

| Agent | Use For |
|-------|---------|
| `Explore` | Search codebase, find patterns |
| `analyst` | Analyze URLs/screenshots, identify components |

## Workflow Summary

```
1. Git Setup     → Ensure on main, pull latest
2. Discovery     → Parse what user wants
3. Exploration   → Launch Explore agent for codebase context
4. Analysis      → Launch analyst for external references (if URL provided)
5. Backlog       → Create well-formed items in backlog.md
6. Commit        → Commit to main
```

## Entry Points

| Command | What It Does |
|---------|--------------|
| `/plan [description]` | Plan a feature or investigation |
| `/plan analyze <url>` | Analyze external site, create backlog items |

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

| Prefix | Component Type |
|--------|---------------|
| WIDGET | Widgets |
| SECTION | Sections |
| CHROME | Chrome (header, footer, overlay) |
| BEHAVIOUR | Behaviours |
| DRIVER | Drivers |
| TRIGGER | Triggers |
| PRESET | Presets |
| SCHEMA | Schema types |
| SITE | Site configuration |

## Example: Planning a Widget

```
User: /plan add an accordion widget

1. Parse: User wants a new widget
2. Explore: Find existing widgets, check patterns
3. Create backlog item:

   #### [WIDGET-XXX] Accordion Widget

   - **Type:** Feature
   - **Priority:** P2
   - **Estimate:** M
   - **Dependencies:** None
   - **Description:** Expandable accordion widget
   - **Context:** See existing widgets at creativeshire/content/widgets/
   - **Approach:** Follow widget.spec.md patterns
   - **Acceptance Criteria:**
     - [ ] Renders collapsed by default
     - [ ] Expands on click
     - [ ] Exported from widgets/index.ts

4. Commit to main
```

## For Full Details

Read: `.claude/skills/creativeshire/workflows/plan.md`
