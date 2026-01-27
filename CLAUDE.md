# Creativeshire Engine

**Skill-based framework for building websites with Claude Code.**

## Commands

| Command | Use When |
|---------|----------|
| `/plan [desc]` | New feature, create backlog items |
| `/analyze <url>` | Analyze reference site, create backlog |
| `/build [item]` | Implement from backlog |
| `/validate [item]` | Quality gate before merge |
| `/fix [path] "what"` | Quick fix, known cause |

## Quick Start

```sh
# Copy .claude/ folder to your project
cp -r .claude/ /path/to/your/project/

# Analyze a reference site
/analyze https://example.com

# Or plan a feature
/plan horizontal image gallery

# Build from backlog
/build WIDGET-001
```

## Skills Structure

```
.claude/skills/
├── creativeshire/          # Architecture knowledge (user-invocable: false)
│   ├── SKILL.md            # Specs index
│   ├── specs/              # Component specifications
│   │   ├── components/     # Widget, section, behaviour specs
│   │   ├── patterns/       # Common patterns, anti-patterns
│   │   └── core/           # Philosophy, contracts
│   └── templates/          # Output format templates
│
├── plan/                   # /plan command
├── analyze/                # /analyze command
├── build/                  # /build command
├── validate/               # /validate command
└── fix/                    # /fix command
```

## Progressive Disclosure

Claude loads context as needed:

1. **Command SKILL.md** - Entry point, quick reference
2. **workflow.md** - Detailed steps (if needed)
3. **creativeshire specs** - Architecture rules (when building specific component)
4. **templates** - Output formats (when producing output)

## Workflow

```
/analyze or /plan → backlog.md → /build → sprint branch → /validate → main
```

## Branches

- `sprint/YYYY-MM-DD` - Active sprint work
- `fix/YYYY-MM-DD-desc` - Quick fixes

## Commits

`<type>(<scope>): description` in imperative mood

## For Projects Using This Engine

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
