---
name: creativeshire
description: Build websites using the Creativeshire layered architecture. Separates Content (widgets, sections, chrome) from Experience (behaviours, drivers, triggers). Use when building components, adding animations, configuring presets, or understanding the engine architecture.
---

# Creativeshire Engine

Layered architecture separating **Content** (what renders) from **Experience** (how it animates).

## Workflows

| Command | Workflow | When |
|---------|----------|------|
| `/plan` | [workflows/plan.md](workflows/plan.md) | New feature, investigation, analyze reference |
| `/build` | [workflows/build.md](workflows/build.md) | Implement backlog items |
| `/validate` | [workflows/validate.md](workflows/validate.md) | Review and merge to main |
| `/fix` | [workflows/fix.md](workflows/fix.md) | Quick fix, known cause |

## Agents

| Agent | Use For | Definition |
|-------|---------|------------|
| `builder` | Create/modify any component | [agents/builder.md](agents/builder.md) |
| `reviewer` | Check architecture compliance | [agents/reviewer.md](agents/reviewer.md) |
| `coordinator` | Plan and delegate tasks | [agents/coordinator.md](agents/coordinator.md) |
| `analyst` | Analyze references, create backlog | [agents/analyst.md](agents/analyst.md) |
| `validator` | Runtime checks | [agents/validator.md](agents/validator.md) |

## Component Specs

### Content Layer
| Component | Spec |
|-----------|------|
| Widget | [components/content/widget.spec.md](.claude/architecture/creativeshire/components/content/widget.spec.md) |
| Section | [components/content/section.spec.md](.claude/architecture/creativeshire/components/content/section.spec.md) |
| Chrome | [components/content/chrome.spec.md](.claude/architecture/creativeshire/components/content/chrome.spec.md) |
| Feature | [components/content/feature.spec.md](.claude/architecture/creativeshire/components/content/feature.spec.md) |

### Experience Layer
| Component | Spec |
|-----------|------|
| Behaviour | [components/experience/behaviour.spec.md](.claude/architecture/creativeshire/components/experience/behaviour.spec.md) |
| Driver | [components/experience/driver.spec.md](.claude/architecture/creativeshire/components/experience/driver.spec.md) |
| Trigger | [components/experience/trigger.spec.md](.claude/architecture/creativeshire/components/experience/trigger.spec.md) |
| Mode | [components/experience/mode.spec.md](.claude/architecture/creativeshire/components/experience/mode.spec.md) |

### Other
| Component | Spec |
|-----------|------|
| Schema | [components/schema/schema.spec.md](.claude/architecture/creativeshire/components/schema/schema.spec.md) |
| Renderer | [components/renderer/renderer.spec.md](.claude/architecture/creativeshire/components/renderer/renderer.spec.md) |
| Preset | [components/preset/preset.spec.md](.claude/architecture/creativeshire/components/preset/preset.spec.md) |

## Core Docs

| Topic | Doc |
|-------|-----|
| Philosophy | [core/philosophy.spec.md](.claude/architecture/creativeshire/core/philosophy.spec.md) |
| Patterns | [patterns/common.spec.md](.claude/architecture/creativeshire/patterns/common.spec.md) |
| Anti-patterns | [patterns/anti-patterns.spec.md](.claude/architecture/creativeshire/patterns/anti-patterns.spec.md) |

## Quick Architecture

```
Site Instance → Preset → Content + Experience → Schema
                         ↓           ↓
                    Sections    Behaviours
                    Widgets     Drivers
                    Chrome      Triggers
```

## Validation

After writing code: `npx tsc --noEmit`

## Related Skills

- [react-best-practices](../react-best-practices/SKILL.md) - React optimization
- [tailwind-v4-skill](../tailwind-v4-skill/SKILL.md) - Tailwind CSS v4
