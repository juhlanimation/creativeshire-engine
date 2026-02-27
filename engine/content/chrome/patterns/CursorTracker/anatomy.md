# CursorTracker — Visual Anatomy

## Layout
**Slot: overlay (free overlay, chromeSlot: null)**

A custom cursor label that follows the mouse pointer when activated. Not a header or footer — it is a free overlay that wraps the CursorLabel React component. Activation is handled via the action system: widgets trigger `{overlayKey}.show` and `{overlayKey}.hide` actions.

```
                    ┌─────────┐
       cursor →     │  View   │  ← label follows mouse
                    └─────────┘
                    offset: (24, 8) px
```

## Widget Composition
This is a **component-based overlay**, not a widget-based pattern. It returns a `PresetOverlayConfig` with:
- `component: 'CursorLabel'` — references the registered overlay component
- `props: { label, offsetX, offsetY, targetSelector }`

No WidgetSchema tree is produced.

## Typography (factory-hardcoded scales)
Typography is handled internally by the CursorLabel React component.

## Settings (CMS-configurable via meta.ts)
| Setting | Type | Default | Visual Effect |
|---------|------|---------|---------------|
| offsetX | number | `24` | Horizontal offset from cursor in pixels (Position, Advanced) |
| offsetY | number | `8` | Vertical offset from cursor in pixels (Position, Advanced) |
| targetSelector | text | `''` | CSS selector for native DOM target elements (Targeting, Advanced) |

## Content Fields (from content.ts)
| Field | Type | Required | Sample |
|-------|------|----------|--------|
| label | text | yes | `'View'` |

## Provided Actions
| Action | Description |
|--------|-------------|
| `{key}.show` | Show the cursor label (triggered by widget mouseenter) |
| `{key}.hide` | Hide the cursor label (triggered by widget mouseleave) |

Where `{key}` is the overlay key assigned in the preset (e.g., `cursorLabelWatch`).

## Region Config
Not a region. Returns `PresetOverlayConfig`:
```ts
{ component: 'CursorLabel', props: { label, offsetX?, offsetY?, targetSelector? } }
```

## Theme Variable Mapping
No theme variables used directly. Cursor label styling is handled by the CursorLabel component's own CSS.

## Gotchas
- This is one of two overlay patterns that uses `component` instead of `widgets` (the other is VideoModal)
- `chromeSlot: null` means it is a free overlay — not bound to header or footer
- Activation is via the action system, not via CSS or direct prop changes
- Widgets trigger it via `on: { mouseenter: '{overlayKey}.show', mouseleave: '{overlayKey}.hide' }`
- `targetSelector` enables targeting native DOM elements (e.g., `<a>` tags in rich text) that are not engine widgets
- The CursorLabel component self-registers its action handlers on mount
