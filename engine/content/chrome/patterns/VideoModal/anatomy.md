# VideoModal — Visual Anatomy

## Layout
**Slot: overlay (free overlay, chromeSlot: null)**

A full-screen modal overlay for video playback. Wraps the ModalRoot chrome component with zero configuration. Activation is via the action system: sections/widgets dispatch `{overlayKey}.open` with a video source payload.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│            ┌─────────────────────────┐               │
│            │                         │               │
│            │     [Video Player]      │               │
│            │                         │               │
│            └─────────────────────────┘               │
│                                            [X Close] │
│                                                      │
└──────────────────────────────────────────────────────┘
     Full-screen overlay backdrop
```

## Widget Composition
This is a **component-based overlay**, not a widget-based pattern. It returns a `PresetOverlayConfig` with:
- `component: 'ModalRoot'` — references the registered overlay component

No WidgetSchema tree is produced. No props are passed.

## Typography (factory-hardcoded scales)
Not applicable — all rendering is handled by the ModalRoot React component.

## Settings (CMS-configurable via meta.ts)
No settings. Zero-configuration pattern.

## Content Fields
No content.ts file exists for this pattern. The VideoModal has no content fields — video source is provided at runtime via the action payload.

## Provided Actions
| Action | Description |
|--------|-------------|
| `{key}.open` | Open the modal with video content (payload includes video source) |

Where `{key}` is the overlay key assigned in the preset (e.g., `modal`).

## Region Config
Not a region. Returns `PresetOverlayConfig`:
```ts
{ component: 'ModalRoot' }
```

## Theme Variable Mapping
No theme variables used directly. Modal styling is handled by the ModalRoot component's own CSS (overlay backdrop, close button, video player).

## Gotchas
- This is the simplest chrome pattern in the engine — the factory function takes no arguments and returns a fixed config
- `VideoModalProps` is an empty interface — exists for type system compliance
- `chromeSlot: null` means free overlay
- Video-specific handler logic lives in `chrome/overlays/ModalRoot/handlers/video.tsx` — the ModalRoot is a thin mount point
- Sections that need video modal must declare `requiredOverlays` to lock the modal in the authoring UI
- The modal registers `${overlayKey}.open` action on mount — sections trigger it via widget `on` bindings
