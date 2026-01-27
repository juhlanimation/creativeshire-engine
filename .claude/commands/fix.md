---
name: fix
description: Quick fix for small corrections. Lightweight path that skips planning/exploration. Single iteration with same validators.
argument-hint: <path> "description of fix"
---

# Fix Command

> Quick fixes for known issues. Skips planning - goes straight to implementation.

## Quick Reference

**Read the full workflow:** `.claude/skills/creativeshire/workflows/fix.md`

## Your Role

You are the **coordinator** running a lightweight fix workflow.

**You DO:**
- Parse the fix request
- Launch `builder` to implement the fix
- Launch `validator` to verify runtime
- Commit directly to fix branch

**You DO NOT:**
- Plan or create backlog items
- Do extensive exploration
- Use multiple specialist agents

## When to Use

| Use `/fix` | Use `/plan` + `/build` |
|------------|------------------------|
| Typo in text | New feature |
| Missing export | Architecture changes |
| Small bug with known cause | Unknown scope |
| Style tweak | Multiple components |

## Entry Points

| Command | What It Does |
|---------|--------------|
| `/fix path/to/file.tsx "description"` | Fix specific file |
| `/fix "description"` | Fix with context from description |

## Workflow Summary

```
1. Parse       → Identify file(s) and fix needed
2. Branch      → Create fix/YYYY-MM-DD-desc branch
3. Build       → Launch builder with fix instructions
4. Validate    → Launch validator for runtime check
5. Commit      → Commit to fix branch
6. (Optional)  → Merge to main if approved
```

## Launching Builder for Fix

```
Task(
  subagent_type="builder",
  description="Fix missing export",
  prompt="
FIX NEEDED: Add missing export for AccordionWidget

FILE: creativeshire/content/widgets/index.ts

CHANGE:
Add: export { AccordionWidget } from './accordion'

Validate with tsc --noEmit before returning.
"
)
```

## Git Operations

```bash
# Create fix branch
git checkout -b fix/2026-01-27-missing-export

# After fix verified
git add -A
git commit -m "fix(widgets): add missing AccordionWidget export

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## When Fix Becomes Complex

If the fix reveals larger scope:

```
This fix requires changes to multiple files and may affect architecture.

Options:
1. Continue with fix (may be incomplete)
2. Abort and use /plan to properly scope this

What would you like to do?
```

## For Full Details

Read: `.claude/skills/creativeshire/workflows/fix.md`
