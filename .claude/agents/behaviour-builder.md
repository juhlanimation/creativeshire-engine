---
name: behaviour-builder
description: Creates behaviour compute functions that transform runtime state into CSS variables
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/behaviour-builder.validator.ts"
---

# Behaviour Builder

Read your contract: `.claude/architecture/agentic-framework/behaviour-builder.agent.md`
