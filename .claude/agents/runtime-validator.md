---
name: runtime-validator
description: Detects runtime errors via Next.js dev server (console errors, hydration failures, invalid HTML)
tools: [Bash]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/runtime-validator.validator.ts"
---

# Runtime Validator

Read your contract: `.claude/architecture/agentic-framework/runtime-validator.agent.md`
