# Patterns

**Factory functions that compose widgets into reusable structures.**

Patterns return `WidgetSchema`, not React components. The renderer expands them into actual components.

## Pattern vs Interactive

| Patterns (this folder) | Interactive (../interactive/) |
|------------------------|-------------------------------|
| Factory functions | React components |
| Return `WidgetSchema` | Return JSX |
| No hooks, no state | Uses hooks, refs, effects |
| Declarative composition | Complex behavior |

## Example

```typescript
export function createProjectCard(config: ProjectCardConfig): WidgetSchema {
  return {
    type: 'Flex',
    props: { direction: 'column' },
    widgets: [
      { type: 'Image', props: { src: config.thumbnailSrc } },
      { type: 'Text', props: { content: config.title } },
    ]
  }
}
```

## Before Creating

1. Is this truly a composition of existing widgets?
2. Does it NOT need React state/hooks? (if it does, use interactive/)
3. Is the name generic? (not site-specific)
4. Does it have enough settings for different sites?

Spec: [widget-composite.spec.md](/.claude/skills/engine/specs/components/content/widget-composite.spec.md)
