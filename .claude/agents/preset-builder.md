---
name: preset-builder
description: Creates and modifies presets bundling mode configuration, chrome setup, and page structure templates
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/preset-builder.validator.ts"
---

# Preset Builder

Read your contract: `.claude/architecture/agentic-framework/preset-builder.agent.md`
