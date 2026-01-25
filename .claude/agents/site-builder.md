---
name: site-builder
description: Builds site configuration and instance data
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/site-builder.validator.ts"
---

# Site Builder

Read your contract: `.claude/architecture/agentic-framework/site-builder.agent.md`
