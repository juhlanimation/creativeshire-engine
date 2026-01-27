---
name: build
description: Implement items from the sprint or continue current sprint. Full implementation loop with PM coordination between agents. Continues until sprint is complete.
argument-hint: [item(s)] | continue | next | all
---

# Build Command

> Implements backlog items. Supports parallel builds with dependency tracking.

## Quick Reference

**Read the full workflow:** `.claude/skills/creativeshire/workflows/build.md`

## Your Role

You are the **coordinator** running the build workflow.

**You DO:**
- Read backlog and sprint files
- Launch `builder` agents to implement code
- Launch `validator` agents to check runtime
- Manage sprint branch and commits
- Track iterations (max 3 per item)

**You DO NOT:**
- Write code yourself (delegate to builder)
- Read source files directly (builder does that)
- Use 15+ specialist agents (use generic builder)

## Agents Available

| Agent | Use For |
|-------|---------|
| `builder` | Implement any component (reads spec based on type) |
| `validator` | Runtime checks (page loads, no errors) |

## Entry Points

| Command | What It Does |
|---------|--------------|
| `/build DOMAIN-XXX` | Build specific item |
| `/build continue` | Resume current sprint |
| `/build next` | Build highest priority item |
| `/build all` | Build entire backlog (parallel) |
| `/build WIDGET-001 to WIDGET-010` | Build range (parallel) |
| `/build SECTION-001, WIDGET-001` | Build list (parallel) |

## Workflow Summary

```
1. Pre-flight    → Sprint branch, dev server
2. Build         → Launch builder agent
3. Validate      → Launch validator agent
4. Fix loop      → If errors, builder fixes (max 3 iterations)
5. Commit        → Commit to sprint branch
```

## Parallel Builds

For multiple items:

```
/build WIDGET-001 to WIDGET-003, SECTION-001

1. Parse dependencies from backlog
2. Group into waves:
   - Wave 1: WIDGET-001, WIDGET-002 (no deps)
   - Wave 2: WIDGET-003, SECTION-001 (depend on wave 1)
3. Launch wave 1 in parallel (multiple Task calls in single message)
4. Wait, commit
5. Launch wave 2 in parallel
6. Wait, commit, done
```

## Launching Builder

```
Task(
  subagent_type="builder",
  description="Build WIDGET-003",
  prompt="
TASK: Implement WIDGET-003 - Accordion Widget

COMPONENT TYPE: Widget
SPEC: .claude/architecture/creativeshire/components/content/widget.spec.md

CONTEXT FROM BACKLOG:
[Paste approach and context from backlog item]

WORKFLOW:
1. Read the widget spec
2. Find existing widgets for patterns
3. Implement following spec rules
4. Run: tsc --noEmit (fix errors before returning)
5. Return files created/modified
"
)
```

## Launching Validator

```
Task(
  subagent_type="validator",
  description="Validate WIDGET-003 runtime",
  prompt="
FILES CHANGED:
[List from builder output]

CHECK:
1. localhost:3000 loads
2. No console errors
3. No hydration failures

Return 'Pass' or list of errors.
"
)
```

## Iteration Limits

**Max 3 attempts per item.** If limit reached, ask user:
1. Continue iterating (override)
2. Commit with known issues
3. Abort item

## Git Operations

- Work on `sprint/YYYY-MM-DD` branch
- Commit each completed item
- DO NOT merge to main (that's `/validate`)

## For Full Details

Read: `.claude/skills/creativeshire/workflows/build.md`
