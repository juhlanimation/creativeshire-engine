---
name: chrome-builder
description: Builds persistent UI chrome components - regions (header, footer, sidebar) and overlays (cursor, loader, modal)
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/chrome-builder.validator.ts"
---

# Chrome Builder

Read your contract: `.claude/architecture/agentic-framework/chrome-builder.agent.md`
