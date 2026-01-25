---
name: tailwind-v4-best-practices
description: Tailwind CSS v4 patterns and best practices for AI coding agents. CSS-first configuration, new directives (@theme, @utility, @variant, @source), migration from v3, and anti-patterns to avoid. Triggers on tasks involving Tailwind styling, theme configuration, or CSS utilities.
license: MIT
metadata:
  author: community
  version: "1.0.0"
  upstream: https://github.com/tlq5l/tailwindcss-v4-skill
---

# Tailwind CSS v4 Best Practices

Comprehensive styling guide for Tailwind CSS v4 applications, designed for AI agents and LLMs. Contains 21 rules across 3 categories, prioritized by impact from critical (setup & configuration) to incremental (customization patterns). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations.

## When to Apply

Reference these guidelines when:
- Writing new components with Tailwind classes
- Configuring Tailwind v4 in a project
- Migrating from Tailwind v3 to v4
- Creating custom utilities, variants, or themes
- Reviewing code for Tailwind best practices

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Setup & Configuration | CRITICAL | `setup-` |
| 2 | Migration from v3 | HIGH | `migration-` |
| 3 | Customization Patterns | MEDIUM | `custom-` |

## Quick Reference

### 1. Setup & Configuration (CRITICAL)

- `setup-entry-point` - Use @import 'tailwindcss' instead of @tailwind directives
- `setup-nextjs` - PostCSS configuration for Next.js App Router
- `setup-vite` - Use @tailwindcss/vite plugin for best performance
- `setup-source-detection` - Control class detection with @source directive
- `setup-theme` - Define design tokens with @theme blocks

### 2. Migration from v3 (HIGH)

- `migration-container-queries` - Native container queries, remove plugin
- `migration-dark-mode` - Use @variant for class-based dark mode
- `migration-var-syntax` - Explicit var() in arbitrary values
- `migration-oklch-colors` - v4 uses OKLCH color space by default
- `migration-ring-width` - Ring requires explicit width in v4
- `migration-shadow-scale` - Shadow scale shifted down one step

### 3. Customization Patterns (MEDIUM)

- `custom-utility` - Create utilities with @utility directive
- `custom-variant` - Define variants with @variant directive
- `custom-theme-inline` - Use @theme inline for CSS variable output
- `custom-gradients` - New gradient syntax (bg-linear-to-r)

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/setup-entry-point.md
rules/migration-container-queries.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
