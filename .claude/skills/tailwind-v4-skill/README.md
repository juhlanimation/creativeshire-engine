# Tailwind CSS v4 Skill

Tailwind CSS v4 patterns and best practices for AI coding agents. CSS-first configuration, new directives (@theme, @utility, @variant, @source), migration from v3, and anti-patterns to avoid.

## Overview

This skill teaches AI coding agents the correct patterns for Tailwind CSS v4. Agents read `AGENTS.md` and apply the knowledge when helping with Tailwind code.

## Installation

Copy this directory to your project:

```
.claude/skills/tailwind-v4-skill/
```

Your AI agent will automatically pick up the v4 patterns.

## Contents

```
tailwind-v4-skill/
├── SKILL.md         # Frontmatter + quick reference
├── AGENTS.md        # Full compiled document for agents
├── metadata.json    # Version, references
├── README.md        # This file
└── rules/           # Individual rule files
    ├── _sections.md
    ├── _template.md
    ├── setup-*.md
    ├── migration-*.md
    └── custom-*.md
```

## Rule Categories

| Category | Impact | Rules |
|----------|--------|-------|
| Setup & Configuration | CRITICAL | 5 rules |
| Migration from v3 | HIGH | 6 rules |
| Customization Patterns | MEDIUM | 4 rules |

## Key v4 Changes

1. **CSS-first configuration** - Use `@theme` in CSS instead of `tailwind.config.js`
2. **Single import** - Use `@import 'tailwindcss'` instead of `@tailwind` directives
3. **Native container queries** - Remove the plugin, use `@container` natively
4. **Explicit var()** - Arbitrary values require `var(--my-color)` not `--my-color`
5. **New directives** - `@utility`, `@variant`, `@source` for customization

## Upstream

Based on [tlq5l/tailwindcss-v4-skill](https://github.com/tlq5l/tailwindcss-v4-skill)

## License

MIT
