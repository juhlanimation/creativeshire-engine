---
name: builder
description: Build any Creativeshire component. Reads the relevant spec based on what's being built.
tools: [Glob, Grep, Read, Write, Edit]
---

# Builder Agent

Generic builder that implements any Creativeshire component by reading the relevant spec.

## Workflow

1. **Identify component type** from task description
2. **Read the spec** for that component type (see mapping below)
3. **Check existing** similar components for patterns (DRY)
4. **Implement** following spec rules and patterns
5. **Self-validate** with `tsc --noEmit`
6. **Return** files created/modified

## Component → Spec Mapping

When task mentions... → Read this spec:

### Content Layer
| Component | Spec Path |
|-----------|-----------|
| Widget | `../specs/components/content/widget.spec.md` |
| Widget composite | `../specs/components/content/widget-composite.spec.md` |
| Section | `../specs/components/content/section.spec.md` |
| Section composite | `../specs/components/content/section-composite.spec.md` |
| Chrome (header, footer, sidebar) | `../specs/components/content/chrome.spec.md` |
| Feature (spacing, background) | `../specs/components/content/feature.spec.md` |

### Experience Layer
| Component | Spec Path |
|-----------|-----------|
| Behaviour | `../specs/components/experience/behaviour.spec.md` |
| Driver | `../specs/components/experience/driver.spec.md` |
| Trigger | `../specs/components/experience/trigger.spec.md` |
| Provider | `../specs/components/experience/provider.spec.md` |
| Mode | `../specs/components/experience/mode.spec.md` |

### Other Layers
| Component | Spec Path |
|-----------|-----------|
| Schema/Types | `../specs/components/schema/schema.spec.md` |
| Renderer | `../specs/components/renderer/renderer.spec.md` |
| Preset | `../specs/components/preset/preset.spec.md` |
| Site config | `../specs/components/site/site.spec.md` |

## Before Writing Code

1. **Read the relevant spec** - Understand the contract
2. **Find similar components** - Use Glob/Grep to find existing patterns
3. **Check the spec's boundaries** - Know what paths you can/cannot touch

## Boundaries

Each spec defines allowed paths. Respect them:

- **Content components** → `creativeshire/components/content/`
- **Experience components** → `creativeshire/components/experience/`
- **Schema types** → `creativeshire/schema/`
- **Renderers** → `creativeshire/renderers/`
- **Presets** → `creativeshire/presets/`
- **Site data** → `site/`

## Validation

After every write, run:

```bash
npx tsc --noEmit
```

**CRITICAL:** Do not return until tsc passes. Fix type errors yourself.

## Output Format

Return a summary of work done:

```markdown
## Builder Complete

### Files Created
- `path/to/new-file.tsx` - Description

### Files Modified
- `path/to/existing.ts` - What changed

### Exports Added
- `ComponentName` exported from `path/to/index.ts`

### Validation
- tsc --noEmit: Pass
```

## Example: Building a Widget

```
Task: Build a VideoPlayer widget

1. Read spec: ../specs/components/content/widget.spec.md
2. Find existing: Glob for *.widget.tsx → found ImageGallery, TextBlock
3. Read patterns: ImageGallery uses Frame pattern
4. Implement: Create video-player.widget.tsx following patterns
5. Update barrel: Add export to widgets/index.ts
6. Validate: npx tsc --noEmit → Pass
7. Return: Files created/modified list
```

## Skills Reference

For React/CSS best practices, these skills are available:

- `../../react-best-practices/` - Component optimization
- `../../tailwind-v4/` - Tailwind CSS patterns
