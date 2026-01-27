---
name: creativeshire
description: Build websites using the Creativeshire layered architecture. Separates Content (widgets, sections, chrome) from Experience (behaviours, drivers, triggers). Use when building components, adding animations, or configuring presets.
---

# Creativeshire Engine

Layered architecture separating **Content** (what renders) from **Experience** (how it animates).

## When to Use

- Building components (widgets, sections, chrome, features)
- Adding animations/interactions (behaviours, drivers, triggers)
- Configuring presets and modes
- Understanding architecture boundaries

## Commands

| Command | When | Reference |
|---------|------|-----------|
| `/plan` | New feature, investigation | [workflows/plan.md](workflows/plan.md) |
| `/build` | Implement from backlog | [workflows/build.md](workflows/build.md) |
| `/validate` | Review and merge | [workflows/validate.md](workflows/validate.md) |
| `/fix` | Quick fix, known cause | [workflows/fix.md](workflows/fix.md) |

## Component Specs

Read the relevant spec before building:

### Content Layer
| Component | Spec |
|-----------|------|
| Widget | [widget.spec.md](.claude/architecture/creativeshire/components/content/widget.spec.md) |
| Section | [section.spec.md](.claude/architecture/creativeshire/components/content/section.spec.md) |
| Chrome | [chrome.spec.md](.claude/architecture/creativeshire/components/content/chrome.spec.md) |
| Feature | [feature.spec.md](.claude/architecture/creativeshire/components/content/feature.spec.md) |

### Experience Layer
| Component | Spec |
|-----------|------|
| Behaviour | [behaviour.spec.md](.claude/architecture/creativeshire/components/experience/behaviour.spec.md) |
| Driver | [driver.spec.md](.claude/architecture/creativeshire/components/experience/driver.spec.md) |
| Trigger | [trigger.spec.md](.claude/architecture/creativeshire/components/experience/trigger.spec.md) |

### Other
| Component | Spec |
|-----------|------|
| Schema | [schema.spec.md](.claude/architecture/creativeshire/components/schema/schema.spec.md) |
| Preset | [preset.spec.md](.claude/architecture/creativeshire/components/preset/preset.spec.md) |

## Core Principles

| Topic | Reference |
|-------|-----------|
| Philosophy | [philosophy.spec.md](.claude/architecture/creativeshire/core/philosophy.spec.md) |
| Patterns | [common.spec.md](.claude/architecture/creativeshire/patterns/common.spec.md) |
| Anti-patterns | [anti-patterns.spec.md](.claude/architecture/creativeshire/patterns/anti-patterns.spec.md) |

## Build Process

1. **Read spec** for the component type
2. **Find existing** similar components for patterns
3. **Implement** following spec boundaries
4. **Validate** with `npx tsc --noEmit`
5. **Check runtime** at localhost:3000

## File Paths

| Component | Path |
|-----------|------|
| Widgets | `creativeshire/components/content/widgets/` |
| Sections | `creativeshire/components/content/sections/` |
| Chrome | `creativeshire/components/content/chrome/` |
| Behaviours | `creativeshire/components/experience/behaviours/` |
| Drivers | `creativeshire/components/experience/drivers/` |
| Schema | `creativeshire/schema/` |

## Related Skills

- [react-best-practices](../react-best-practices/SKILL.md) - React optimization
- [tailwind-v4-skill](../tailwind-v4-skill/SKILL.md) - Tailwind CSS v4
