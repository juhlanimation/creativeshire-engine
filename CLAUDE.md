# Creativeshire Engine

## Commands

| Command | Use |
|---------|-----|
| `/plan [desc]` | Create backlog items |
| `/analyze <url>` | Analyze reference, create backlog |
| `/build [item]` | Implement from backlog |
| `/validate [item]` | Quality gate, merge to main |
| `/fix [path] "desc"` | Quick fix |

## References

| Topic | Location |
|-------|----------|
| **Architecture** | [.claude/skills/creativeshire/SKILL.md](.claude/skills/creativeshire/SKILL.md) |
| **Folder Structure** | [.claude/skills/creativeshire/specs/reference/folders.spec.md](.claude/skills/creativeshire/specs/reference/folders.spec.md) |
| **Naming Conventions** | [.claude/skills/creativeshire/specs/reference/naming.spec.md](.claude/skills/creativeshire/specs/reference/naming.spec.md) |
| **Tech Stack** | [.claude/skills/creativeshire/specs/reference/tech-stack.spec.md](.claude/skills/creativeshire/specs/reference/tech-stack.spec.md) |
| **Backlog** | [.claude/tasks/backlog.md](.claude/tasks/backlog.md) |
| **Current Sprint** | [.claude/tasks/current-sprint.md](.claude/tasks/current-sprint.md) |

## Workflow

```
/plan or /analyze → backlog.md → /build → sprint branch → /validate → main
```

## Branches

- `sprint/YYYY-MM-DD` - Active sprint work
- `fix/YYYY-MM-DD-desc` - Quick fixes

## Learned Rules

<!-- Add rules here when Claude makes repeated mistakes -->
