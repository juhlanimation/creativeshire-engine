# Interactive Widgets

**Stateful React components with complex behavior.**

Interactive widgets are React components (not factory functions) because they require:
- Local state (`useState`, `useRef`)
- Complex effects (`useEffect`, `useCallback`)
- Event handling (hover, click, keyboard)
- Multiple render modes

## Current Global Interactive Widgets

- **Video** - hover-play mode, visibility playback, modal integration
- **VideoPlayer** - playback controls, scrubber, volume, fullscreen
- **EmailCopy** - copy-to-clipboard, flip animation

Single-use interactive widgets should be section-scoped, not global.
See `sections/patterns/{Section}/components/` for scoped widget examples.

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

1. Does this require React hooks?
2. Is the name generic? (not site-specific)
3. Are all hooks colocated with the component?
4. Does meta.ts have `component: true`?

Spec: [widget.spec.md](/.claude/skills/engine/specs/components/content/widget.spec.md)
