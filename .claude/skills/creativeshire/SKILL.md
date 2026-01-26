---
name: creativeshire
description: Build websites using the Creativeshire engine architecture. Use when building widgets, sections, chrome, behaviours, drivers, triggers, presets, or any component of the layered architecture.
---

# Creativeshire Engine

A layered architecture separating **Content** (what renders) from **Experience** (how it animates).

## When to Use This Skill

- Building new components (widgets, sections, chrome, features)
- Adding animations/interactions (behaviours, drivers, triggers)
- Configuring site presets and modes
- Understanding the engine architecture

## Quick Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SITE INSTANCE                         │
│  (Your site's pages, content, configuration)            │
├─────────────────────────────────────────────────────────┤
│                       PRESET                             │
│  (Bundled chrome + modes + triggers)                    │
├─────────────────────────────────────────────────────────┤
│     CONTENT LAYER          │      EXPERIENCE LAYER      │
│  ┌─────────────────────┐   │   ┌─────────────────────┐  │
│  │ Sections            │   │   │ Behaviours          │  │
│  │ (Hero, Gallery...)  │   │   │ (compute CSS vars)  │  │
│  ├─────────────────────┤   │   ├─────────────────────┤  │
│  │ Widgets             │   │   │ Drivers             │  │
│  │ (Button, Card...)   │   │   │ (apply to DOM)      │  │
│  ├─────────────────────┤   │   ├─────────────────────┤  │
│  │ Chrome              │   │   │ Triggers            │  │
│  │ (Header, Footer...) │   │   │ (listen to events)  │  │
│  ├─────────────────────┤   │   └─────────────────────┘  │
│  │ Features            │   │                            │
│  │ (Spacing, BG...)    │   │                            │
│  └─────────────────────┘   │                            │
├─────────────────────────────────────────────────────────┤
│                       SCHEMA                             │
│  (TypeScript types - SectionSchema, WidgetSchema, etc.) │
└─────────────────────────────────────────────────────────┘
```

## Workflows

For multi-step tasks, read the relevant workflow:

| Command | Workflow | When to Use |
|---------|----------|-------------|
| `/plan` | `workflows/plan.md` | New feature, investigation, analyze reference |
| `/build` | `workflows/build.md` | Implement backlog items (supports parallel) |
| `/validate` | `workflows/validate.md` | Review and merge to main |
| `/fix` | `workflows/fix.md` | Quick fix with known cause |

## Agents

For complex tasks, use specialized subagents:

| Agent | Use For | Definition |
|-------|---------|------------|
| `builder` | Creating/modifying any component | `agents/builder.md` |
| `reviewer` | Checking architecture compliance | `agents/reviewer.md` |
| `coordinator` | Planning and delegating tasks | `agents/coordinator.md` |
| `analyst` | Exploring references, creating backlog | `agents/analyst.md` |
| `validator` | Runtime checks (page loads, no errors) | `agents/validator.md` |

### Parallel Builds

The coordinator can spawn multiple builders in parallel:

```
/build WIDGET-001 to WIDGET-003, SECTION-001

Wave 1 (no deps):     WIDGET-001, WIDGET-002  → parallel
Wave 2 (after wave 1): WIDGET-003, SECTION-001 → parallel
```

Each builder reads the relevant spec for what it's building.

## Component Specs

When building a specific component, read its spec:

### Content Layer
| Component | Spec |
|-----------|------|
| Widget | `specs/components/content/widget.spec.md` |
| Widget Composite | `specs/components/content/widget-composite.spec.md` |
| Section | `specs/components/content/section.spec.md` |
| Section Composite | `specs/components/content/section-composite.spec.md` |
| Chrome | `specs/components/content/chrome.spec.md` |
| Feature | `specs/components/content/feature.spec.md` |

### Experience Layer
| Component | Spec |
|-----------|------|
| Behaviour | `specs/components/experience/behaviour.spec.md` |
| Driver | `specs/components/experience/driver.spec.md` |
| Trigger | `specs/components/experience/trigger.spec.md` |
| Provider | `specs/components/experience/provider.spec.md` |
| Mode | `specs/components/experience/mode.spec.md` |

### Other Layers
| Component | Spec |
|-----------|------|
| Schema | `specs/components/schema/schema.spec.md` |
| Renderer | `specs/components/renderer/renderer.spec.md` |
| Preset | `specs/components/preset/preset.spec.md` |
| Site | `specs/components/site/site.spec.md` |

## Core Principles

Read these for architectural understanding:

- `specs/core/philosophy.spec.md` - Content/experience separation
- `specs/core/contracts.spec.md` - Layer boundaries
- `specs/patterns/common.spec.md` - Frame pattern, CSS variable bridge
- `specs/patterns/anti-patterns.spec.md` - What NOT to do

## Layer Reference

For layer-level understanding:

- `specs/layers/schema.spec.md` - Type definitions
- `specs/layers/content.spec.md` - Static content rendering
- `specs/layers/experience.spec.md` - Animation and interaction
- `specs/layers/renderer.spec.md` - Schema to React mapping
- `specs/layers/preset.spec.md` - Bundled configurations

## Validation

After writing code, always run:

```bash
npx tsc --noEmit
```

Fix any type errors before committing.

## File Structure

```
creativeshire/
├── schema/           # TypeScript types
├── components/
│   ├── content/      # Widgets, sections, chrome, features
│   └── experience/   # Behaviours, drivers, triggers
├── presets/          # Bundled configurations
└── renderers/        # Schema-to-component mapping

site/                 # Site-specific data
├── pages/            # Page schemas
└── config/           # Site configuration

app/                  # Next.js routing
└── [routes]/         # Route files
```

## Additional Skills

These skills provide best practices:

- `react-best-practices/` - React optimization patterns
- `tailwind-v4/` - Tailwind CSS v4 patterns
