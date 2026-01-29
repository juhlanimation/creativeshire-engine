# Glossary

> Definitions of architectural terms. Alphabetically ordered.

---

| Term | Definition | See Also |
|------|------------|----------|
| **Behaviour** | Compute function that transforms state into CSS variables | [behaviour.spec.md](../components/experience/behaviour.spec.md) |
| **BehaviourWrapper** | Generic React component that wraps content and applies a behaviour | [experience.spec.md](../layers/experience.spec.md) |
| **Chrome** | Persistent UI outside page content (header, footer, overlays) | [chrome.spec.md](../components/content/chrome.spec.md) |
| **Composite** | Factory function that returns schema (widget or section) | [widget-composite.spec.md](../components/content/widget-composite.spec.md) |
| **Content Layer (L1)** | Layer owning what's on the page: widgets, sections, chrome | [content.spec.md](../layers/content.spec.md) |
| **Content Widget** | Leaf node widget holding actual content (Text, Image, Video) | [widget.spec.md](../components/content/widget.spec.md) |
| **CSS Variable Catalog** | Inventory of all CSS variables with ranges, fallbacks, and ownership | [styling.md](../reference/tech-stack/styling.md#css-variable-catalog) |
| **Driver** | Engine that applies CSS variables to DOM, bypassing React | [driver.spec.md](../components/experience/driver.spec.md) |
| **Effect** | Reusable CSS that defines HOW elements animate (transitions, transforms) driven by behaviour variables | [experience.spec.md](../layers/experience.spec.md#effects) |
| **Experience Layer (L2)** | Layer owning how the page feels: modes, behaviours, drivers, triggers, effects | [experience.spec.md](../layers/experience.spec.md) |
| **Extension Principle** | Check → Extend → Create: reuse existing before inventing new | [extension.spec.md](./extension.spec.md) |
| **Extrinsic** | Size imposed by context (viewport height, scroll position) | [philosophy.spec.md](./philosophy.spec.md) |
| **Frame Pattern** | L2 wrapper imposes constraints; L1 content fills or sizes intrinsically | [philosophy.spec.md](./philosophy.spec.md) |
| **Intrinsic** | Size determined by content (text flow, image dimensions) | [philosophy.spec.md](./philosophy.spec.md) |
| **L1** | Shorthand for Content Layer | [content.spec.md](../layers/content.spec.md) |
| **L2** | Shorthand for Experience Layer | [experience.spec.md](../layers/experience.spec.md) |
| **Layout Widget** | Container widget that arranges child widgets (Flex, Grid, Stack) | [widget.spec.md](../components/content/widget.spec.md) |
| **Mode** | Animation configuration providing store, triggers, and behaviour defaults | [mode.spec.md](../components/experience/mode.spec.md) |
| **Overlay** | Floating chrome element above content (cursor, loader, modal) | [chrome.spec.md](../components/content/chrome.spec.md) |
| **Preset** | Full site configuration bundling content and experience | [preset.spec.md](../layers/preset.spec.md) |
| **Region** | Fixed chrome position (header, footer, sidebar) | [chrome.spec.md](../components/content/chrome.spec.md) |
| **Renderer** | Component that interprets schema and outputs React components | [renderer.spec.md](../components/renderer/renderer.spec.md) |
| **Schema** | TypeScript interfaces describing data structure and intent | [schema.spec.md](../layers/schema.spec.md) |
| **Section** | Semantic container grouping widgets within a page | [section.spec.md](../components/content/section.spec.md) |
| **Section Pattern** | Factory function returning SectionSchema (Hero, Gallery) | [section-pattern.spec.md](../components/content/section-pattern.spec.md) |
| **Site Instance** | Instance data for a specific site extending presets | [site-instance.spec.md](../layers/site-instance.spec.md) |
| **Store** | Zustand state holding scroll progress, visibility, and other values | [experience.spec.md](../layers/experience.spec.md) |
| **Trigger** | Hook listening to events and updating the store | [trigger.spec.md](../components/experience/trigger.spec.md) |
| **Widget** | Building block component (content, layout, or composite) | [widget.spec.md](../components/content/widget.spec.md) |
| **Widget Composite** | Factory function returning WidgetSchema (ProjectCard, Testimonial) | [widget-composite.spec.md](../components/content/widget-composite.spec.md) |

---

## Disambiguation

| Term Pair | Distinction |
|-----------|-------------|
| **Mode vs Preset** | Mode configures animation behaviour. Preset bundles entire site configuration. |
| **Widget vs Section** | Widget holds content or arranges children. Section groups widgets semantically. |
| **Chrome vs Region** | Chrome is the category. Region is a chrome position (header, footer). |
| **Intrinsic vs Extrinsic** | Intrinsic sizing comes from content. Extrinsic sizing comes from context. |
| **L1 vs L2** | L1 owns content structure. L2 owns animation and interaction. |
| **Behaviour vs Effect** | Behaviour computes CSS variable VALUES. Effect defines CSS that USES those variables (transitions, transforms). |
| **Content Widget vs Layout Widget** | Content widget is a leaf node. Layout widget contains children. |
| **Widget Composite vs Section Pattern** | Widget composite returns WidgetSchema. Section pattern returns SectionSchema. |
| **style vs className** | `style` is for inline CSSProperties. `className` is for Tailwind/CSS classes. |

---

## See Also

- [Philosophy](./philosophy.spec.md) - Core principles governing the system
- [Content Layer](../layers/content.spec.md) - L1 primitives and constraints
- [Experience Layer](../layers/experience.spec.md) - L2 animation system
