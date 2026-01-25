# Entry Point Template

> Template for agent entry points in `.claude/agents/`.

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{name}` | Agent name in kebab-case | `widget-gallery-builder` |
| `{title}` | Title case name | `Widget Gallery Builder` |
| `{description}` | One-line description | `Builds widget gallery components` |
| `{tools}` | Comma-separated tool list | `Read, Write, Edit, Glob, Grep` |

## Template (Builder/Coordinator with hooks)

```markdown
---
name: {name}
description: {description}
tools: [{tools}]
model: inherit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "npx tsx .claude/architecture/agentic-framework/{name}.validator.ts"
---

# {title}

Read your contract: `.claude/architecture/agentic-framework/{name}.agent.md`
```

## Template (Reviewer - read-only, no hooks)

```markdown
---
name: {name}
description: {description}
tools: [{tools}]
model: inherit
---

# {title}

Read your contract: `.claude/architecture/agentic-framework/{name}.agent.md`
```

## Notes

- **Builders/Coordinators**: Include hooks for PostToolUse validation
- **Reviewers**: Read-only, no hooks needed (tools: Glob, Grep, Read only)
- The `/agent` skill determines which variant to use based on agent type
