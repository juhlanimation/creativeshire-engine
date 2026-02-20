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

### Intro Layer

| Component | Spec |
|-----------|------|
| Intro Layer | [specs/layers/intro.spec.md](specs/layers/intro.spec.md) |
| Intro Components | [specs/components/intro/intro.spec.md](specs/components/intro/intro.spec.md) |

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
| Build an intro pattern | [specs/components/intro/intro.spec.md](specs/components/intro/intro.spec.md) |
| Build animation | [specs/components/experience/behaviour.spec.md](specs/components/experience/behaviour.spec.md) |
| Define animation CSS | [specs/components/experience/effect.spec.md](specs/components/experience/effect.spec.md) |
| Create a preset | [specs/components/preset/preset.spec.md](specs/components/preset/preset.spec.md) |
| Know folder layout | [specs/reference/folders.spec.md](specs/reference/folders.spec.md) |
| See what to avoid | [specs/patterns/anti-patterns.spec.md](specs/patterns/anti-patterns.spec.md) |

---

## Implementing a Section from Figma

When the user designs a section in Figma and asks you to implement it, follow this workflow.

### 1. Read the Figma frame

Use the Figma MCP tools (`get_design_context`, `get_screenshot`) to inspect the frame. Identify the overall layout, visual hierarchy, and content elements.

### 2. Identify the layout structure

Map the visual arrangement to engine layout widgets:
- Vertical stack → `Stack`
- Horizontal row → `Flex`
- Grid of items → `Grid`
- Two-panel layout → `Split`
- Full-width wrapper → `Container` or `Box`

### 3. Map Figma elements to existing widgets

| Figma Element | Engine Widget | Notes |
|---------------|--------------|-------|
| Text layers | `Text` | Use `as` scale: `display`, `h1`, `h2`, `h3`, `p`, `small` |
| Images / rectangles with fills | `Image` | |
| Videos | `Video` or `VideoPlayer` | |
| Buttons | `Button` | Check variant: `primary`, `secondary`, `ghost` |
| Links / clickable text | `Link` | |
| Grouped items | Layout widgets | `Stack`, `Flex`, `Grid` |
| Repeated items | `__repeat` or scoped repeater | Use `__repeat` for simple cases, scoped widget for stateful |
| Icons | `Icon` | |

### 4. Map Figma variables to CSS variables

Every visual property must use theme tokens. Map from the Figma variable collections:

| Figma Variable | CSS Variable |
|----------------|-------------|
| `colors/*` | `var(--text-primary)`, `var(--accent)`, `var(--color-primary)`, etc. |
| `type/font-title` | `var(--font-title)` |
| `type/font-paragraph` | `var(--font-paragraph)` |
| `type/scale-*` | `var(--font-size-display)` through `var(--font-size-small)` |
| `spacing/*` | `var(--spacing-xs)` through `var(--spacing-2xl)` |
| `radius/*` | `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)` |
| `shadow/*` | `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)` |
| `motion/*` | `var(--duration-normal)`, `var(--ease-default)`, etc. |

If a Figma element uses a hardcoded color/size instead of a variable, find the closest theme token.

Full mapping table: [theme-contract.spec.md](specs/reference/theme-contract.spec.md#figma--css-variable-mapping)

### 5. Create the section

1. **`types.ts`** — Define the props interface with all CMS-configurable options
2. **`meta.ts`** — Section metadata with settings (type, label, default for each prop)
3. **`index.ts`** — Factory function `create{Section}Section(props)` composing widgets
4. **`preview.ts`** — Preview props for Storybook
5. **`styles.css`** — Section-specific CSS using only theme variables
6. **`{Section}.stories.tsx`** — Storybook story

### 6. Theme wiring checklist

Before considering the section done, verify:
- [ ] All colors use CSS variables (no hardcoded hex/rgb/hsl)
- [ ] All font-family uses `var(--font-title)`, `var(--font-paragraph)`, or `var(--font-ui)`
- [ ] All font-size uses `var(--font-size-*)` scale
- [ ] All spacing uses `var(--spacing-*)` tokens
- [ ] Section padding uses `var(--spacing-section-x)` / `var(--spacing-section-y)`
- [ ] All border-radius uses `var(--radius-*)`
- [ ] All shadows use `var(--shadow-*)`
- [ ] All transitions use `var(--duration-*) var(--ease-*)`
- [ ] Responsive sizing uses `cqw`/`cqh`, not `vw`/`vh`

### 7. Add settings for CMS control

Any visual option the user should be able to toggle belongs in `meta.ts` settings:
- Background color choices
- Layout variants (e.g., `layout: 'centered' | 'split'`)
- Content visibility toggles
- Spacing overrides
