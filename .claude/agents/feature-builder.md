---
name: feature-builder
description: Builds static feature decorators (spacing, background, typography, border) for widgets and sections.
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/feature-builder.validator.ts"
---

# Feature Builder

Read your contract: `.claude/architecture/agentic-framework/feature-builder.agent.md`
