---
name: build
description: Implement backlog items following Creativeshire architecture with validation.
argument-hint: [item] | continue | next | all
disable-model-invocation: true
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsc --noEmit --pretty false 2>&1 | head -20"
---

# Build

Implement backlog items with validation.

See [workflow.md](workflow.md) for detailed steps.

## Quick Reference

1. Create sprint branch
2. Read backlog item
3. Read relevant spec from creativeshire skill
4. Find existing similar components
5. Implement following spec
6. Validate (tsc + runtime)
7. Commit

## Entry Points

| Command | Action |
|---------|--------|
| `/build DOMAIN-XXX` | Build specific item |
| `/build continue` | Resume current sprint |
| `/build next` | Build highest priority item |
| `/build all` | Build entire backlog |
