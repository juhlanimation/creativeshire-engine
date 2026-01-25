---
name: project-assistant
description: Maintains task file hygiene, manages sequential item IDs, and keeps completion indexes accurate
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/project-assistant.validator.ts"
---

# Project Assistant

Read your contract: `.claude/architecture/agentic-framework/project-assistant.agent.md`
