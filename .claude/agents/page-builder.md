---
name: page-builder
description: Builds page definitions and routing configuration
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/page-builder.validator.ts"
---

# Page Builder

Read your contract: `.claude/architecture/agentic-framework/page-builder.agent.md`
