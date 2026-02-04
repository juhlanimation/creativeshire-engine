# Interface

**Contract between platform and engine for schema delivery and live updates.**

## What This Folder Contains

- `types.ts` - EngineInput, EngineController, EngineEvents, etc.
- `EngineStore.ts` - Zustand store for schema state
- `EngineProvider.tsx` - Root provider exposing controller
- `useEngineController.ts` - Hook for platform to access controller
- `validation/` - Constraint validators
- `index.ts` - Barrel exports

## Key Patterns

1. **Controller pattern** - Platform controls engine via EngineController
2. **Validation on write** - Constraints checked before state changes
3. **Event callbacks** - Engine notifies platform of state changes
4. **Zustand + immer** - Immutable updates with mutable syntax

## Architecture

```
Platform (CMS UI)
       │
       │ Passes: EngineInput
       ▼
EngineProvider
       │
       ├─► EngineStore (Zustand)
       │     └─ site, page, experienceId, isPreview
       │
       ├─► EngineController
       │     └─ updateSection, addSection, removeSection...
       │
       └─► ExperienceProvider (nested)
             └─ Children (SiteRenderer, etc.)
```

## Usage

```typescript
// Platform wraps engine
<EngineProvider
  input={{
    site: siteConfig,
    page: homePage,
    isPreview: true,
    events: {
      onReady: () => console.log('Ready'),
      onError: (e) => console.error(e),
    },
  }}
>
  <SiteRenderer site={site} page={page} />
</EngineProvider>

// Platform uses controller
function Sidebar() {
  const controller = useEngineController()

  const handleAddSection = () => {
    const result = controller.addSection({ id: 'new', widgets: [] })
    if (!result.valid) toast.error(result.error.message)
  }
}
```

## Before Modifying

- Review types.ts for interface contracts
- Keep all data JSON-serializable (RSC boundary)
- Add validation for new operations
- Update specs if interface changes

Spec: [interface.spec.md](/.claude/skills/engine/specs/layers/interface.spec.md)

## Container-Aware Event Pattern

When adding event listeners, use container-scoped targets for iframe/contained mode support:

```typescript
import { useContainer } from '../../interface/ContainerContext'

function MyComponent() {
  const { mode, containerRef } = useContainer()

  useEffect(() => {
    // Choose event target based on mode
    const target = mode === 'contained' && containerRef?.current
      ? containerRef.current
      : document

    target.addEventListener('click', handler)
    return () => target.removeEventListener('click', handler)
  }, [mode, containerRef])
}
```

**ESLint enforces this:** `local/no-document-events` warns on `document.addEventListener` in engine code.
