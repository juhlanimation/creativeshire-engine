---
name: widget-builder
description: Builds atomic widget components that render content and layout structure
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/widget-builder.validator.ts"
---

# Widget Builder

Read your contract: `.claude/architecture/agentic-framework/widget-builder.agent.md`
