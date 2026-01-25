---
name: widget-composite-builder
description: Build widget composite factory functions that return WidgetSchema objects
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/widget-composite-builder.validator.ts"
---

# Widget Composite Builder

Read your contract: `.claude/architecture/agentic-framework/widget-composite-builder.agent.md`
