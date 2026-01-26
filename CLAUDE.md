# Creativeshire Engine

**Agentic framework for building websites with Claude Code.**

## Commands

| Command | Use When |
|---------|----------|
| `/plan [desc]` | New feature, investigation, unknown scope |
| `/plan analyze <url>` | Analyze reference site, create backlog |
| `/build [item]` | Implement from backlog (supports parallel builds) |
| `/validate` | Review and merge sprint to main |
| `/fix [path] "what"` | Quick fix, known cause |

## Quick Start

```sh
# Copy .claude/ folder to your project
cp -r .claude/ /path/to/your/project/

# Start planning
/plan analyze https://example.com
```

## Architecture

### Skill-Based (Anthropic Agent Skills Model)

| Folder | Purpose |
|--------|---------|
| `.claude/skills/creativeshire/` | Main engine skill |
| `.claude/skills/creativeshire/SKILL.md` | Entry point (progressive disclosure) |
| `.claude/skills/creativeshire/agents/` | 5 generic agent definitions |
| `.claude/skills/creativeshire/workflows/` | Workflow docs (plan, build, validate, fix) |
| `.claude/skills/creativeshire/specs/` | Component and layer specs |
| `.claude/skills/react-best-practices/` | React optimization patterns |
| `.claude/skills/tailwind-v4/` | Tailwind CSS v4 patterns |

### Agents (5 Generic Types)

| Agent | Purpose |
|-------|---------|
| `builder` | Build any component (reads relevant spec) |
| `reviewer` | Review for compliance (read-only) |
| `coordinator` | Plan and delegate to other agents |
| `analyst` | Analyze references, create backlog |
| `validator` | Runtime checks (page loads, no errors) |

## Parallel Builds

The framework supports wave-based parallel builds:

```
/build WIDGET-001 to WIDGET-003, SECTION-001

Dependencies parsed from backlog:
  WIDGET-001: None
  WIDGET-002: None
  SECTION-001: WIDGET-001, WIDGET-002

Waves:
  Wave 1: [WIDGET-001, WIDGET-002] → parallel
  Wave 2: [SECTION-001] → after wave 1
```

## Workflow

```
/plan → backlog.md → /build → sprint branch → /validate → merge to main
```

## Progressive Disclosure

Claude loads context as needed:

1. **SKILL.md** - Quick reference, component mapping
2. **workflows/** - Detailed workflow steps
3. **agents/** - Agent capabilities and constraints
4. **specs/** - Full component specifications

## Branches

- `sprint/YYYY-MM-DD` - Active sprint work
- `fix/YYYY-MM-DD-desc` - Quick fixes

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

## Legacy Structure

The old 41-agent model is preserved in:
- `.claude/settings.old.json` - Old settings backup
- `.claude/architecture/agentic-framework/` - Old agent contracts
- `.claude/commands/` - Old command files

To restore: `cp .claude/settings.old.json .claude/settings.json`

## Learned Rules

<!-- Add rules here when Claude does something wrong -->
