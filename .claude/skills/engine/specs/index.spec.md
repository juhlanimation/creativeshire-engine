# Creativeshire Architecture

> Table of contents for the Creativeshire architecture documentation.

---

## Folders

| Folder | Purpose |
|--------|---------|
| `core/` | Foundational concepts everyone must understand |
| `architecture/` | High-level architectural models and composition patterns |
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
| [versioning.spec.md](core/versioning.spec.md) | Schema versioning, compatibility rules, migration triggers |

### architecture/ — Architectural Models

| File | Describes |
|------|-----------|
| [composable-containers.spec.md](architecture/composable-containers.spec.md) | Composable site model: L1 Content + L2 Experience + Theme containers |

### layers/ — System Organization

| File | Describes |
|------|-----------|
| [schema.spec.md](layers/schema.spec.md) | TypeScript types that define the entire system |
| [content.spec.md](layers/content.spec.md) | Widgets, sections, chrome, features (L1 - static content) |
| [experience.spec.md](layers/experience.spec.md) | Experiences, behaviours, drivers, triggers, modes (L2 - animation/interaction) |
| [intro.spec.md](layers/intro.spec.md) | Intro sequences, patterns, triggers, phase lifecycle (L2 sub-layer) |
| [interface.spec.md](layers/interface.spec.md) | Platform ↔ Engine contract for live updates and events |
| [renderer.spec.md](layers/renderer.spec.md) | How schema gets converted to React components |
| [preset.spec.md](layers/preset.spec.md) | Bundled configurations for entire sites |
| [site-instance.spec.md](layers/site-instance.spec.md) | How individual sites use the engine |

### components/content/ — Content Layer Contracts

| File | Describes |
|------|-----------|
| [widget.spec.md](components/content/widget.spec.md) | Atomic content units (Text, Image, Button, etc.) |
| [widget-composite.spec.md](components/content/widget-composite.spec.md) | Factory functions that create widget trees |
| [layout-widget.spec.md](components/content/layout-widget.spec.md) | Layout widgets (Stack, Flex, Grid, Carousel, Tabs) |
| [section.spec.md](components/content/section.spec.md) | Scrollable groups of widgets |
| [section-pattern.spec.md](components/content/section-pattern.spec.md) | Factory functions that create section patterns |
| [chrome.spec.md](components/content/chrome.spec.md) | Persistent UI (navigation, overlays) |
| [action-system.spec.md](components/content/action-system.spec.md) | Widget event triggers, action dispatch, overlay activation |

### components/intro/ — Intro Layer Contracts

| File | Describes |
|------|-----------|
| [intro.spec.md](components/intro/intro.spec.md) | IntroPattern, IntroProvider, triggers, registry, context |

### components/experience/ — Experience Layer Contracts

| File | Describes |
|------|-----------|
| [experience.spec.md](components/experience/experience.spec.md) | User-selectable experience definitions (wrapping rules, appended sections) |
| [behaviour.spec.md](components/experience/behaviour.spec.md) | Functions that compute CSS variables from state |
| [effect.spec.md](components/experience/effect.spec.md) | Reusable CSS that defines HOW elements animate (transitions, transforms) |
| [driver.spec.md](components/experience/driver.spec.md) | Applies CSS variables to DOM elements |
| [trigger.spec.md](components/experience/trigger.spec.md) | Connects events (scroll, click) to store updates |
| [mode.spec.md](components/experience/mode.spec.md) | Bundles of behaviours and triggers |
| [provider.spec.md](components/experience/provider.spec.md) | React context providers for experience state |
| [infrastructure.spec.md](components/experience/infrastructure.spec.md) | Registries, resolution logic, BehaviourWrapper |
| [chrome-behaviour.spec.md](components/experience/chrome-behaviour.spec.md) | Chrome-specific behaviours (header, footer, cursor) |

### components/renderer/ — Renderer Contracts

| File | Describes |
|------|-----------|
| [renderer.spec.md](components/renderer/renderer.spec.md) | Schema-to-component mapping |
| [registry.spec.md](components/renderer/registry.spec.md) | Widget registry auto-discovery and resolution |

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

### components/interface/ — Interface Layer Contracts

| File | Describes |
|------|-----------|
| [engine-provider.spec.md](components/interface/engine-provider.spec.md) | EngineProvider, controller, state management |

### components/migrations/ — Migration System

| File | Describes |
|------|-----------|
| [migrations.spec.md](components/migrations/migrations.spec.md) | Schema migrations, version transforms |

### components/validation/ — Validation System

| File | Describes |
|------|-----------|
| [site-validator.spec.md](components/validation/site-validator.spec.md) | Build-time schema validation |

### patterns/ — Patterns & Anti-Patterns

| File | Describes |
|------|-----------|
| [collections.spec.md](patterns/collections.spec.md) | `__repeat` pattern for hierarchy-visible collections |
| [common.spec.md](patterns/common.spec.md) | Proven solutions: Frame pattern, CSS variable bridge, cleanup |
| [anti-patterns.spec.md](patterns/anti-patterns.spec.md) | What to avoid: scroll in widgets, viewport units, React state for animation |
| [analytics-integration.spec.md](patterns/analytics-integration.spec.md) | Analytics patterns: page views, events, consent, lazy loading |
| [error-handling.spec.md](patterns/error-handling.spec.md) | Error boundaries, fallback UI, recovery patterns |

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
| [folders.spec.md](reference/folders.spec.md) | Complete folder layout of engine/ |
| [file-patterns.spec.md](reference/file-patterns.spec.md) | File naming conventions by component type |
| [naming.spec.md](reference/naming.spec.md) | Naming rules for components, variables, schema |
| [tech-stack.spec.md](reference/tech-stack.spec.md) | Core technologies and versions |
| [tech-stack/styling.md](reference/tech-stack/styling.md) | Tailwind vs CSS variables, design tokens, `cn()` utility |
| [tech-stack/caching.md](reference/tech-stack/caching.md) | Next.js 16 cache components, profiles, revalidation |
| [accessibility.spec.md](reference/accessibility.spec.md) | ARIA, keyboard nav, focus management, reduced motion |
| [metadata.spec.md](reference/metadata.spec.md) | SEO, Open Graph, JSON-LD, sitemap generation |
| [responsive-design.spec.md](reference/responsive-design.spec.md) | Breakpoints, responsive props, layout adaptation |
| [development-workflow.spec.md](reference/development-workflow.spec.md) | HMR, debugging, React DevTools, profiling |
| [hierarchy-panel.spec.md](reference/hierarchy-panel.spec.md) | Platform editor hierarchy panel structure |

### diagrams/ — Visual References

| File | Describes |
|------|-----------|
| [index.md](diagrams/index.md) | 20+ Mermaid diagrams covering all architectural concepts |

---

## Quick Lookup

| I need to... | Read |
|--------------|------|
| Understand composable site model | [composable-containers.spec.md](architecture/composable-containers.spec.md) |
| Understand the core rules | [philosophy.spec.md](core/philosophy.spec.md) |
| Understand platform vs engine | [platform.spec.md](core/platform.spec.md) |
| Know what a layer can/cannot do | [contracts.spec.md](core/contracts.spec.md) |
| Look up a term | [glossary.spec.md](core/glossary.spec.md) |
| Check before creating something new | [extension.spec.md](core/extension.spec.md) |
| Find existing CSS variables | [tech-stack/styling.md](reference/tech-stack/styling.md#css-variable-catalog) |
| Build a widget | [widget.spec.md](components/content/widget.spec.md) |
| Build a collection widget | [collections.spec.md](patterns/collections.spec.md) |
| Build a layout widget | [layout-widget.spec.md](components/content/layout-widget.spec.md) |
| Build an intro pattern | [intro.spec.md](components/intro/intro.spec.md) |
| Build animation | [behaviour.spec.md](components/experience/behaviour.spec.md) |
| Define animation CSS | [effect.spec.md](components/experience/effect.spec.md) |
| Build chrome behaviour | [chrome-behaviour.spec.md](components/experience/chrome-behaviour.spec.md) |
| Create an experience | [experience.spec.md](components/experience/experience.spec.md) |
| Create a preset | [preset.spec.md](components/preset/preset.spec.md) |
| Configure a site instance | [site.spec.md](components/site/site.spec.md) |
| Define platform interface | [interface.spec.md](layers/interface.spec.md) |
| Build EngineProvider | [engine-provider.spec.md](components/interface/engine-provider.spec.md) |
| Understand versioning | [versioning.spec.md](core/versioning.spec.md) |
| Add a migration | [migrations.spec.md](components/migrations/migrations.spec.md) |
| Validate at build time | [site-validator.spec.md](components/validation/site-validator.spec.md) |
| See folder layout | [folders.spec.md](reference/folders.spec.md) |
| See diagrams | [diagrams/index.md](diagrams/index.md) |
| Know when to use Tailwind vs CSS vars | [tech-stack/styling.md](reference/tech-stack/styling.md) |
| Add caching to data functions | [tech-stack/caching.md](reference/tech-stack/caching.md) |
| Make it accessible | [accessibility.spec.md](reference/accessibility.spec.md) |
| Add SEO/metadata | [metadata.spec.md](reference/metadata.spec.md) |
| Handle responsive design | [responsive-design.spec.md](reference/responsive-design.spec.md) |
| Debug during development | [development-workflow.spec.md](reference/development-workflow.spec.md) |
| Add analytics | [analytics-integration.spec.md](patterns/analytics-integration.spec.md) |
| Handle errors gracefully | [error-handling.spec.md](patterns/error-handling.spec.md) |
| Understand widget registry | [registry.spec.md](components/renderer/registry.spec.md) |
