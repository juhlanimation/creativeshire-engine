---
name: validate
description: Quality gate - type check, runtime validation, visual verification. Run before merging.
argument-hint: [item] | all
disable-model-invocation: true
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - mcp__next-devtools__nextjs_index
  - mcp__next-devtools__nextjs_call
  - mcp__claude-in-chrome__computer
  - mcp__claude-in-chrome__navigate
  - mcp__claude-in-chrome__tabs_context_mcp
  - mcp__claude-in-chrome__tabs_create_mcp
---

# Validate

Quality gate before merging to main.

See [workflow.md](workflow.md) for detailed steps.

## Quick Reference

1. Type check: `npx tsc --noEmit`
2. Runtime check: Next.js MCP for errors
3. Visual check: Browser automation
4. Spec compliance: Review against creativeshire specs
5. If pass: Merge to main
