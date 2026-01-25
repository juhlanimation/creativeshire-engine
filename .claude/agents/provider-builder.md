---
name: provider-builder
description: Build React context providers for experience and driver distribution
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/provider-builder.validator.ts"
---

# Provider Builder

Read your contract: `.claude/architecture/agentic-framework/provider-builder.agent.md`
