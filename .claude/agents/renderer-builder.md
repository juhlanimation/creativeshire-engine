---
name: renderer-builder
description: Builds renderer components for page rendering
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/renderer-builder.validator.ts"
---

# Renderer Builder

Read your contract: `.claude/architecture/agentic-framework/renderer-builder.agent.md`
