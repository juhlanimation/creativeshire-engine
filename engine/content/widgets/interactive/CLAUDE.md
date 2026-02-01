# Interactive Widgets

**Stateful React components with complex behavior.**

Interactive widgets are React components (not factory functions) because they require:
- Local state (`useState`, `useRef`)
- Complex effects (`useEffect`, `useCallback`)
- Event handling (hover, click, keyboard)
- Multiple render modes

## Interactive vs Patterns

| Interactive (this folder) | Patterns (../patterns/) |
|---------------------------|-------------------------|
| React components | Factory functions |
| Return JSX | Return `WidgetSchema` |
| Uses hooks, refs, effects | No hooks, no state |
| Complex behavior | Declarative composition |

## Examples

- **Video** - hover-play mode, visibility playback, modal integration
- **VideoPlayer** - playback controls, scrubber, volume, fullscreen
- **ContactPrompt** - copy-to-clipboard, flip animation
- **ExpandableGalleryRow** - coordinated hover expansion
- **GalleryThumbnail** - expand/collapse with metadata

## Colocated Hooks

Hooks for interactive widgets live WITH the widget, not in a central folder:

```
VideoPlayer/
├── index.tsx
├── types.ts
├── styles.css
├── meta.ts
└── hooks/
    ├── useVideoControls.ts
    └── usePlaybackPosition.ts
```

## Before Creating

1. Does this require React hooks? (if not, use patterns/)
2. Is the name generic? (not site-specific)
3. Are all hooks colocated with the component?
4. Does meta.ts have `component: true`?

Spec: [widget.spec.md](/.claude/skills/engine/specs/components/content/widget.spec.md)
