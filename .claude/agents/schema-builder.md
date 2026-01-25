---
name: schema-builder
description: Builds schema definitions for site configuration
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/schema-builder.validator.ts"
---

# Schema Builder

Read your contract: `.claude/architecture/agentic-framework/schema-builder.agent.md`
