---
name: validate
description: Validate sprint items and move to completed or mark for retake. Runs verification checks before archiving.
argument-hint: [item] | (no args = validate all sprint items)
---

# Validate Command

> Reviews sprint work, fixes issues, merges to main, archives completed items.

## Quick Reference

**Read the full workflow:** `.claude/skills/creativeshire/workflows/validate.md`

## Your Role

You are the **coordinator** running the validation workflow.

**You DO:**
- Launch `reviewer` agents to check compliance
- Launch `builder` agents to fix issues
- Merge sprint branch to main
- Archive completed items

**You DO NOT:**
- Review code yourself (delegate to reviewer)
- Fix code yourself (delegate to builder)

## Agents Available

| Agent | Use For |
|-------|---------|
| `reviewer` | Check architecture compliance (read-only) |
| `builder` | Fix issues found by reviewer |

## Entry Points

| Command | What It Does |
|---------|--------------|
| `/validate` | Validate all items in current sprint |
| `/validate DOMAIN-XXX` | Validate specific item only |

## Workflow Summary

```
1. Review       → Launch reviewer for each item
2. Fix loop     → If issues, launch builder to fix (max 3 iterations)
3. Merge        → Merge sprint branch to main
4. Archive      → Move completed items to completed/
```

## Launching Reviewer

```
Task(
  subagent_type="reviewer",
  description="Review WIDGET-003",
  prompt="
COMPONENT TYPE: Widget
SPEC: .claude/architecture/creativeshire/components/content/widget.spec.md

FILES TO REVIEW:
- creativeshire/content/widgets/accordion/index.tsx
- creativeshire/content/widgets/accordion/types.ts
- creativeshire/content/widgets/index.ts

CHECK:
1. Follows widget.spec.md patterns
2. Correct folder structure
3. Proper exports
4. No anti-patterns
5. No boundary violations

Return 'Approved' or list of issues with severity.
"
)
```

## If Issues Found

Launch builder to fix, then re-review:

```
Task(
  subagent_type="builder",
  description="Fix WIDGET-003 review issues",
  prompt="
ISSUES TO FIX:
1. [Issue from reviewer]
2. [Issue from reviewer]

FILES:
[Files that need fixing]

Fix these issues and validate with tsc --noEmit.
"
)
```

## Iteration Limits

**Max 3 review iterations per item.** If limit reached, ask user:
1. Continue iterating (override)
2. Merge with known issues (document in PR)
3. Abort validation

## Git Operations

```bash
# After all reviews pass
git checkout main
git pull origin main
git merge sprint/2026-01-27 --no-ff -m "Merge sprint/2026-01-27

Items completed:
- WIDGET-003: Accordion Widget

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

## Archive

Move completed items from `backlog.md` to `.claude/tasks/completed/YYYY-MM.md`

## For Full Details

Read: `.claude/skills/creativeshire/workflows/validate.md`
