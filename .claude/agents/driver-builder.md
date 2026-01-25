---
name: driver-builder
description: Builds drivers that apply CSS variables to DOM elements for 60fps animation
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/driver-builder.validator.ts"
---

# Driver Builder

Read your contract: `.claude/architecture/agentic-framework/driver-builder.agent.md`
