---
name: fix
description: Quick fix for small corrections. Skips planning, goes straight to implementation.
argument-hint: [path] "description"
disable-model-invocation: true
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsc --noEmit --pretty false 2>&1 | head -20"
---

# Fix

Quick fixes. Skips planning.

See [workflow.md](workflow.md) for detailed steps.

## When to Use

| Use `/fix` | Use `/plan` + `/build` |
|------------|------------------------|
| Typo | New feature |
| Missing export | Architecture change |
| Small bug, known cause | Unknown scope |
| Import error | Multiple components |

## Quick Reference

1. Create fix branch
2. Make the change
3. Validate (tsc + runtime)
4. Commit and merge to main
