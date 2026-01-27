# Creativeshire Architecture

> Table of contents for the Creativeshire architecture documentation.

---

## Folders

| Folder | Purpose |
|--------|---------|
| `core/` | Foundational concepts everyone must understand |
| `layers/` | How the system is organized into layers |
| `components/` | Contracts for building specific component types |
| `patterns/` | Proven solutions and what to avoid |
| `testing/` | How to test components |
| `reference/` | Quick lookup for naming, files, folders |
| `diagrams/` | Visual diagrams of the architecture |

---

## Files

### core/ — Foundation

| File | Describes |
|------|-----------|
| [philosophy.spec.md](core/philosophy.spec.md) | The core principles: content/experience separation, the contract, frame pattern |
| [contracts.spec.md](core/contracts.spec.md) | What each layer owns, layer boundaries, CSS variable rules |
| [glossary.spec.md](core/glossary.spec.md) | Definitions of all architectural terms |
| [extension.spec.md](core/extension.spec.md) | Check → Extend → Create: reuse before invention |
| [platform.spec.md](core/platform.spec.md) | Creativeshire platform wrapper relationship, engine scope |

### layers/ — System Organization

| File | Describes |
|------|-----------|
| [schema.spec.md](layers/schema.spec.md) | TypeScript types that define the entire system |
| [content.spec.md](layers/content.spec.md) | Widgets, sections, chrome, features (L1 - static content) |
| [experience.spec.md](layers/experience.spec.md) | Experiences, behaviours, drivers, triggers, modes (L2 - animation/interaction) |
| [interface.spec.md](layers/interface.spec.md) | Platform ↔ Engine contract for live updates and events |
| [renderer.spec.md](layers/renderer.spec.md) | How schema gets converted to React components |
| [preset.spec.md](layers/preset.spec.md) | Bundled configurations for entire sites |
| [site-instance.spec.md](layers/site-instance.spec.md) | How individual sites use the engine |

### components/content/ — Content Layer Contracts

| File | Describes |
|------|-----------|
| [widget.spec.md](components/content/widget.spec.md) | Atomic content units (Text, Image, Button, etc.) |
| [widget-composite.spec.md](components/content/widget-composite.spec.md) | Factory functions that create widget trees |
| [section.spec.md](components/content/section.spec.md) | Scrollable groups of widgets |
| [section-composite.spec.md](components/content/section-composite.spec.md) | Factory functions that create section presets |
| [chrome.spec.md](components/content/chrome.spec.md) | Persistent UI (navigation, overlays) |
| [feature.spec.md](components/content/feature.spec.md) | Static styling (spacing, typography, backgrounds) |

### components/experience/ — Experience Layer Contracts

| File | Describes |
|------|-----------|
| [experience.spec.md](components/experience/experience.spec.md) | User-selectable experience definitions (wrapping rules, appended sections) |
| [behaviour.spec.md](components/experience/behaviour.spec.md) | Functions that compute CSS variables from state |
| [driver.spec.md](components/experience/driver.spec.md) | Applies CSS variables to DOM elements |
| [trigger.spec.md](components/experience/trigger.spec.md) | Connects events (scroll, click) to store updates |
| [mode.spec.md](components/experience/mode.spec.md) | Bundles of behaviours and triggers |
| [provider.spec.md](components/experience/provider.spec.md) | React context providers for experience state |
| [infrastructure.spec.md](components/experience/infrastructure.spec.md) | Registries, resolution logic, BehaviourWrapper |

### components/renderer/ — Renderer Contracts

| File | Describes |
|------|-----------|
| [renderer.spec.md](components/renderer/renderer.spec.md) | Schema-to-component mapping |

### components/schema/ — Schema Contracts

| File | Describes |
|------|-----------|
| [schema.spec.md](components/schema/schema.spec.md) | TypeScript interface requirements |

### components/preset/ — Preset Contracts

| File | Describes |
|------|-----------|
| [preset.spec.md](components/preset/preset.spec.md) | Bundled site configurations (content + experience + chrome) |

### components/site/ — Site Instance Contracts

| File | Describes |
|------|-----------|
| [site.spec.md](components/site/site.spec.md) | Instance-specific config, pages, and data |

### patterns/ — Patterns & Anti-Patterns

| File | Describes |
|------|-----------|
| [common.spec.md](patterns/common.spec.md) | Proven solutions: Frame pattern, CSS variable bridge, cleanup |
| [anti-patterns.spec.md](patterns/anti-patterns.spec.md) | What to avoid: scroll in widgets, viewport units, React state for animation |

### testing/ — Testing Guides

| File | Describes |
|------|-----------|
| [strategy.spec.md](testing/strategy.spec.md) | Overall testing philosophy and coverage requirements |
| [unit.spec.md](testing/unit.spec.md) | How to unit test widgets, behaviours, drivers |
| [integration.spec.md](testing/integration.spec.md) | Testing component composition |
| [visual.spec.md](testing/visual.spec.md) | CSS variable fallback verification |

### reference/ — Quick References

| File | Describes |
|------|-----------|
| [folders.spec.md](reference/folders.spec.md) | Complete folder layout of creativeshire/ |
| [file-patterns.spec.md](reference/file-patterns.spec.md) | File naming conventions by component type |
| [naming.spec.md](reference/naming.spec.md) | Naming rules for components, variables, schema |
| [tech-stack.spec.md](reference/tech-stack.spec.md) | Core technologies and versions |
| [tech-stack/styling.md](reference/tech-stack/styling.md) | Tailwind vs CSS variables, design tokens, `cn()` utility |
| [tech-stack/caching.md](reference/tech-stack/caching.md) | Next.js 16 cache components, profiles, revalidation |

### diagrams/ — Visual References

| File | Describes |
|------|-----------|
| [index.md](diagrams/index.md) | 20+ Mermaid diagrams covering all architectural concepts |

---

## Quick Lookup

| I need to... | Read |
|--------------|------|
| Understand the core rules | [philosophy.spec.md](core/philosophy.spec.md) |
| Understand platform vs engine | [platform.spec.md](core/platform.spec.md) |
| Know what a layer can/cannot do | [contracts.spec.md](core/contracts.spec.md) |
| Look up a term | [glossary.spec.md](core/glossary.spec.md) |
| Check before creating something new | [extension.spec.md](core/extension.spec.md) |
| Find existing CSS variables | [tech-stack/styling.md](reference/tech-stack/styling.md#css-variable-catalog) |
| Build a widget | [widget.spec.md](components/content/widget.spec.md) |
| Build animation | [behaviour.spec.md](components/experience/behaviour.spec.md) |
| Create an experience | [experience.spec.md](components/experience/experience.spec.md) |
| Create a preset | [preset.spec.md](components/preset/preset.spec.md) |
| Configure a site instance | [site.spec.md](components/site/site.spec.md) |
| Define platform interface | [interface.spec.md](layers/interface.spec.md) |
| See folder layout | [folders.spec.md](reference/folders.spec.md) |
| See diagrams | [diagrams/index.md](diagrams/index.md) |
| Know when to use Tailwind vs CSS vars | [tech-stack/styling.md](reference/tech-stack/styling.md) |
| Add caching to data functions | [tech-stack/caching.md](reference/tech-stack/caching.md) |
