---
name: section-builder
description: Builds and maintains the base Section component and types
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/section-builder.validator.ts"
---

# Section Builder

Read your contract: `.claude/architecture/agentic-framework/section-builder.agent.md`
