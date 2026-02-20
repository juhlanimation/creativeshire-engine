# Action System Spec

> Discrete event dispatch from widgets to chrome overlays via pub/sub registry.

## Purpose

The action system enables widgets to emit discrete events (click, mouseenter, mouseleave) that chrome overlays respond to. This is the **L1** event pipeline — separate from L2 continuous behaviours (CSS variables, GSAP).

## Architecture

```
WIDGET META        declares: triggers: ['mouseenter', 'mouseleave', 'click']
                   (what events this widget type can emit)
       |
WIDGET SCHEMA      on: { mouseenter: 'cursorLabelWatch.show', mouseleave: 'cursorLabelWatch.hide' }
                   (wiring - which action responds to which event)
       |
WIDGET RENDERER    wires DOM events -> executeAction(actionId, { element, event })
                   (bridges schema to runtime)
       |
ACTION REGISTRY    registerAction('cursorLabelWatch.show', handler)
                   (pub/sub - overlays register handlers)
       |
OVERLAY            on show: setActive(true), setTargetElement(el)
                   on hide: setActive(false)
```

## L1 vs L2 Separation

```
L2 BEHAVIOURS (continuous, CSS variables)
  scroll/progress  ->  GSAP ScrollTrigger  ->  --scroll-progress: 0.5
  hover/state      ->  BehaviourWrapper     ->  --hover: 0|1
  visibility/      ->  IntersectionObserver ->  --visible: 0|1

L1 TRIGGERS (discrete, action pub/sub)
  mouseenter       ->  WidgetRenderer prop  ->  executeAction('cursorLabel.show')
  click            ->  WidgetRenderer prop  ->  executeAction('modal.open')
```

A single widget can have BOTH a hover behaviour (CSS variable) and a hover trigger (action dispatch). No conflict.

## Action ID Convention

Format: `{handlerKey}.{verb}`

```
cursorLabelWatch.show     cursorLabelWatch.hide
modal.open                modal.close
floatingContact.toggle
```

- First segment = overlay key in `chrome.overlays` (direct lookup)
- Second segment = verb/method (parseable via `actionId.split('.')`)
- Standard verbs: `show`/`hide`, `open`/`close`, `toggle`, `activate`/`deactivate`

All action IDs follow `{overlayKey}.{verb}` format — no legacy formats.

## Key Files

| File | Purpose |
|------|---------|
| `engine/content/actions/index.ts` | Action registry (`registerAction`, `executeAction`, `unregisterAction`) |
| `engine/content/actions/scanner.ts` | Scans widget trees for action IDs and triggerable widgets |
| `engine/content/actions/resolver.ts` | Resolves which overlays provide which actions |
| `engine/renderer/WidgetRenderer.tsx` | Wires widget `on` events to action dispatch |
| `engine/content/chrome/pattern-registry.ts` | Chrome patterns with `providesActions` |

## Widget Triggers

Widget metas declare triggers (available events):

```typescript
// Link widget meta
triggers: ['mouseenter', 'mouseleave', 'click']
```

Widget schemas wire events to actions:

```typescript
// Widget instance in a section
on: {
  click: 'modal.open',
  mouseenter: 'cursorLabelWatch.show',
  mouseleave: 'cursorLabelWatch.hide',
}
```

Multiple actions per event (array syntax):

```typescript
on: { click: ['modal.open', 'analytics.track'] }
```

## Action Payload

Every action dispatch includes:

```typescript
interface BaseActionPayload {
  element?: HTMLElement | null  // DOM element that fired the event
  event?: string               // Event name (mouseenter, click, etc.)
}
```

Widgets can provide rich payloads (e.g., Video adds `videoUrl`, `poster`, `rect`). Schema can inject/override payload fields via object-form ActionBinding:

```typescript
// String form (simple)
on: { click: 'modal.open' }

// Object form (with schema params)
on: { click: { action: 'modal.open', params: { animationType: 'expand' } } }
```

Merge order: schema params (lowest) → widget enrichment (highest) → element/event (always).

## Chrome Pattern Actions

Overlay patterns declare what actions they provide:

```typescript
// CursorTracker meta
providesActions: ['{key}.show', '{key}.hide']

// VideoModal meta
providesActions: ['{key}.open']
```

The `{key}` template resolves to the overlay key at runtime (e.g., `cursorLabelWatch`).

## Section Required Overlays

Section metas declare which overlays they require:

```typescript
// FeaturedProjects meta
requiredOverlays: ['VideoModal']
```

These overlays are locked in the authoring UI and cannot be removed.

## Action Scanner

`collectTriggerableWidgets(pages)` returns all widgets with triggers:

```typescript
interface TriggerableWidget {
  pageId: string
  sectionIndex: number
  sectionId: string
  widgetPath: string[]
  widgetId: string
  widgetType: string
  triggers: string[]
  currentOn: WidgetEventMap
}
```

## Action Resolver

- `resolveRequiredOverlays(actions, existingKeys)` - finds missing overlay patterns
- `getActionResolution(actionId, existingKeys)` - checks if an action has a handler
