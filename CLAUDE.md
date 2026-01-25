# Creativeshire Engine

**Agentic framework for building websites with Claude Code.**

## Commands

| Command | Use When |
|---------|----------|
| `/plan [desc]` | New feature, investigation, unknown scope |
| `/plan analyze <url>` | Analyze reference site, create backlog |
| `/build [item]` | Implement from backlog |
| `/validate [item]` | Quality gate before merge |
| `/fix [path] "what"` | Quick fix, known cause |

## Quick Start

```sh
# Copy .claude/ folder to your project
cp -r .claude/ /path/to/your/project/

# Start planning
/plan analyze https://example.com
```

## Architecture

| Folder | Purpose |
|--------|---------|
| `.claude/architecture/creativeshire/` | Engine specs (layers, components, patterns) |
| `.claude/architecture/agentic-framework/` | Agent definitions and validators |
| `.claude/commands/` | Skill definitions (plan, build, validate, fix) |
| `.claude/scripts/` | Tooling (agent-factory, knowledge-mapper) |
| `.claude/skills/` | External skills (react-best-practices, tailwind-v4) |

## Agents

Read your contract at `.claude/architecture/agentic-framework/{name}.agent.md` before working.

## Workflow

```
/plan → backlog.md → /build → sprint branch → /validate → merge to main
```

## Branches

- `feature/DOMAIN-XXX-desc` - New features
- `fix/YYYY-MM-DD-desc` - Quick fixes
- `sprint/YYYY-MM-DD` - Active sprint work

## Commits

`<type>(<scope>): description` in imperative mood

## For Projects Using This Engine

Your project structure:
```
your-project/
├── .claude/              # Copy from this repo
├── creativeshire/        # Engine implementation
├── site/                 # Your site-specific data
├── app/                  # Next.js routing
└── CLAUDE.md             # Project-specific instructions
```

## Learned Rules

<!-- Add rules here when Claude does something wrong -->
