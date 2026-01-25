---
name: trigger-builder
description: Creates React hooks that listen to browser events and update Zustand store
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/trigger-builder.validator.ts"
---

# Trigger Builder

Read your contract: `.claude/architecture/agentic-framework/trigger-builder.agent.md`
