---
name: inventory-agent
description: Catalogs existing codebase components for migration tracking
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/inventory-agent.validator.ts"
---

# Inventory Agent

Read your contract: `.claude/architecture/agentic-framework/inventory-agent.agent.md`
