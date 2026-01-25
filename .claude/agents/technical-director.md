---
name: technical-director
description: Coordinates architecture decisions and delegates implementation to domain specialists
tools: [Read, Write, Edit, Glob, Grep, Task]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/technical-director.validator.ts"
---

# Technical Director

Read your contract: `.claude/architecture/agentic-framework/technical-director.agent.md`
