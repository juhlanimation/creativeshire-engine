---
name: section-composite-builder
description: Build section composite factory functions (Hero, Gallery, etc.). Pure data functions that return SectionSchema.
tools: [Read, Write, Edit, Glob, Grep]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/section-composite-builder.validator.ts"
---

# Section Composite Builder

Read your contract: `.claude/architecture/agentic-framework/section-composite-builder.agent.md`
