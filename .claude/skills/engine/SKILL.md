---
name: engine
description: Creativeshire engine architecture. Reference when building widgets, sections, behaviours, drivers, triggers, chrome, presets, or other engine components.
user-invocable: false
---

# Creativeshire Engine Architecture

Layered architecture separating **Content** (what renders) from **Experience** (how it animates).

## Specs Index

Read the relevant spec before implementing any component.

### Core Concepts

| Topic | Spec |
|-------|------|
| Philosophy | [specs/core/philosophy.spec.md](specs/core/philosophy.spec.md) |
| Contracts | [specs/core/contracts.spec.md](specs/core/contracts.spec.md) |
| Glossary | [specs/core/glossary.spec.md](specs/core/glossary.spec.md) |
| Extension | [specs/core/extension.spec.md](specs/core/extension.spec.md) |

### Content Layer

| Component | Spec |
|-----------|------|
| Widget | [specs/components/content/widget.spec.md](specs/components/content/widget.spec.md) |
| Widget Composite | [specs/components/content/widget-composite.spec.md](specs/components/content/widget-composite.spec.md) |
| Section | [specs/components/content/section.spec.md](specs/components/content/section.spec.md) |
| Section Pattern | [specs/components/content/section-pattern.spec.md](specs/components/content/section-pattern.spec.md) |
| Chrome | [specs/components/content/chrome.spec.md](specs/components/content/chrome.spec.md) |

### Experience Layer

| Component | Spec |
|-----------|------|
| Behaviour | [specs/components/experience/behaviour.spec.md](specs/components/experience/behaviour.spec.md) |
| Effect | [specs/components/experience/effect.spec.md](specs/components/experience/effect.spec.md) |
| Driver | [specs/components/experience/driver.spec.md](specs/components/experience/driver.spec.md) |
| Trigger | [specs/components/experience/trigger.spec.md](specs/components/experience/trigger.spec.md) |
| Mode | [specs/components/experience/mode.spec.md](specs/components/experience/mode.spec.md) |
| Provider | [specs/components/experience/provider.spec.md](specs/components/experience/provider.spec.md) |

### Other Components

| Component | Spec |
|-----------|------|
| Schema | [specs/components/schema/schema.spec.md](specs/components/schema/schema.spec.md) |
| Preset | [specs/components/preset/preset.spec.md](specs/components/preset/preset.spec.md) |
| Site | [specs/components/site/site.spec.md](specs/components/site/site.spec.md) |
| Renderer | [specs/components/renderer/renderer.spec.md](specs/components/renderer/renderer.spec.md) |

### Patterns

| Topic | Spec |
|-------|------|
| Common Patterns | [specs/patterns/common.spec.md](specs/patterns/common.spec.md) |
| Anti-Patterns | [specs/patterns/anti-patterns.spec.md](specs/patterns/anti-patterns.spec.md) |

### Reference

| Topic | Spec |
|-------|------|
| Folders | [specs/reference/folders.spec.md](specs/reference/folders.spec.md) |
| File Patterns | [specs/reference/file-patterns.spec.md](specs/reference/file-patterns.spec.md) |
| Naming | [specs/reference/naming.spec.md](specs/reference/naming.spec.md) |
| Styling | [specs/reference/styling.spec.md](specs/reference/styling.spec.md) |
| Caching | [specs/reference/caching.spec.md](specs/reference/caching.spec.md) |

## Output Templates

| Template | Use For |
|----------|---------|
| [templates/backlog-item.md](templates/backlog-item.md) | Creating backlog entries |

## Quick Lookup

| I need to... | Read |
|--------------|------|
| Understand core rules | [specs/core/philosophy.spec.md](specs/core/philosophy.spec.md) |
| Build a widget | [specs/components/content/widget.spec.md](specs/components/content/widget.spec.md) |
| Build animation | [specs/components/experience/behaviour.spec.md](specs/components/experience/behaviour.spec.md) |
| Define animation CSS | [specs/components/experience/effect.spec.md](specs/components/experience/effect.spec.md) |
| Create a preset | [specs/components/preset/preset.spec.md](specs/components/preset/preset.spec.md) |
| Know folder layout | [specs/reference/folders.spec.md](specs/reference/folders.spec.md) |
| See what to avoid | [specs/patterns/anti-patterns.spec.md](specs/patterns/anti-patterns.spec.md) |
