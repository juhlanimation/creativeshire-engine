# Creativeshire Engine

## Commands

| Command | Use |
|---------|-----|
| `/analyze <url>` | Analyze reference → `.claude/analyze/{name}/{domain}/` |
| `/plan [desc]` | Create backlog from analysis or description |
| `/build [item]` | Implement from backlog |
| `/validate [item]` | Quality gate, merge to main |
| `/fix [path] "desc"` | Quick fix |

## References

| Topic | Location |
|-------|----------|
| **Architecture** | [SKILL.md](.claude/skills/creativeshire/SKILL.md) |
| **All Specs** | [specs/index.spec.md](.claude/skills/creativeshire/specs/index.spec.md) |
| **Backlog** | [backlog.md](.claude/tasks/backlog.md) |

## Workflow

```
/analyze → /plan → backlog.md → /build → /validate → main
```

## Top-Down Analysis

Always work **SITE → PAGE → SECTION → WIDGET**. Never start with atoms.

```
SITE     Mode (parallax, reveal) + Chrome (nav, footer)
PAGE     Transitions + Chrome overrides
SECTION  Purpose + Behaviour + Features
WIDGET   Compose from registry first, create only if missing
```

**Why:** Matches perception, finds patterns early, avoids unneeded widgets.

## Self-Improvement

**Goal:** Build ANY site with ease.

1. Follow specs → Question when blocked → Propose improvements → Update on approval
2. Trigger: Spec gap, unnecessary complexity, repeated workaround, inexpressible pattern

**Propose format:** `Current → Issue → Proposed → Impact`

## Branches

- `sprint/{summary}` - Feature work
- `fix/{desc}` - Quick fixes

## Learned Rules

<!-- Add patterns here when mistakes repeat -->
