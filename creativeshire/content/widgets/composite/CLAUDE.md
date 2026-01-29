# Composites

**Layout + Primitives assembled.**

Two patterns:
- `create*` factory → returns WidgetSchema (declarative)
- React component → for complex local state

## React Component Composites

Some components are React components (not factories) because they require:
- Local state (`useState`, `useRef`)
- Complex effects (`useEffect`, `useCallback`)
- Multiple render modes (e.g., default vs hover-play)

Examples:
- **Video** - Has hover state, visibility playback, modal integration
- **VideoPlayer** - Has playback controls, scrubber state, fullscreen logic

These are NOT factory functions because they need React hooks.

## Before Creating

- Is this Layout(Primitives)? Not a primitive or layout alone?
- Is the name generic? (not `BojuhlCard`, just `ProjectCard`)
- Enough settings for different sites?

Spec: [widget-composite.spec.md](/.claude/skills/creativeshire/specs/components/content/widget-composite.spec.md)
