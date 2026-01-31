# EngineProvider Spec

> Root provider for the engine interface layer.

---

## Purpose

EngineProvider wraps the engine and exposes controller access to the platform. It:

1. **Creates schema state** - Zustand store for site/page data
2. **Exposes controller** - Methods for platform to update schema
3. **Nests ExperienceProvider** - Integrates with experience layer
4. **Emits events** - Notifies platform of state changes

---

## Folder Structure

```
creativeshire/interface/
├── CLAUDE.md               # Folder context
├── index.ts                # Barrel exports
├── types.ts                # EngineInput, Controller, Events
├── EngineStore.ts          # Zustand store factory
├── EngineProvider.tsx      # Root provider component
├── useEngineController.ts  # Controller hook
└── validation/             # Constraint validators
```

---

## Key Interfaces

### EngineProviderProps

```typescript
interface EngineProviderProps {
  input: EngineInput
  children: ReactNode
}
```

### EngineInput

```typescript
interface EngineInput {
  site: SiteSchema
  page: PageSchema
  experienceId?: string
  isPreview?: boolean
  shell?: ShellConfig
  events?: EngineEvents
}
```

### EngineController

```typescript
interface EngineController {
  // Section operations
  updateSection(id: string, changes: Partial<SectionSchema>): ValidationResult
  addSection(section: SectionSchema, position?: number): ValidationResult
  removeSection(id: string): ValidationResult
  reorderSections(order: string[]): ValidationResult

  // Widget operations
  updateWidget(path: WidgetPath, changes: Partial<WidgetSchema>): ValidationResult
  addWidget(sectionId: string, widget: WidgetSchema, position?: number): ValidationResult
  removeWidget(path: WidgetPath): ValidationResult

  // Experience
  setExperience(id: string): void

  // Site
  updateTheme(changes: Partial<ThemeSchema>): void
  updateChrome(changes: Partial<ChromeSchema>): void

  // State
  getState(): EngineStateSnapshot
  subscribe(listener: (state: EngineStateSnapshot) => void): () => void
}
```

---

## Usage

### Platform Integration

```tsx
import { EngineProvider, useEngineController } from '@/creativeshire/interface'

function CMSPreview({ site, page }) {
  return (
    <EngineProvider
      input={{
        site,
        page,
        isPreview: true,
        events: {
          onReady: () => console.log('Ready'),
          onError: (e) => console.error(e),
          onConstraintViolation: (v) => console.warn(v),
          onStateChange: (s) => console.log('State:', s),
        },
      }}
    >
      <SiteRenderer site={site} page={page} />
    </EngineProvider>
  )
}

function Sidebar() {
  const controller = useEngineController()

  const handleAddSection = () => {
    const result = controller.addSection({
      id: `section-${Date.now()}`,
      layout: { type: 'stack' },
      widgets: [],
    })
    if (!result.valid) {
      toast.error(result.error.message)
    }
  }

  return <button onClick={handleAddSection}>Add Section</button>
}
```

### Accessing State

```tsx
import { useEngineState } from '@/creativeshire/interface'

function SectionCount() {
  // Re-renders only when section count changes
  const count = useEngineState((s) => s.page.sections.length)
  return <span>{count} sections</span>
}
```

---

## Rules

### Must

1. Wrap children in ExperienceProvider
2. Create controller before render
3. Emit onReady after initial render
4. Validate all mutations before applying
5. Emit events for state changes

### Must Not

1. Recreate store on every render
2. Skip validation for any operation
3. Mutate input objects
4. Throw on constraint violations (return result instead)
5. Block render on async operations

---

## Store Architecture

### Zustand + Immer

```typescript
const store = createStore<EngineState>()(
  immer((set, get) => ({
    site: input.site,
    page: input.page,
    // ...actions
  }))
)
```

**Why Zustand?**
- Better performance for frequent updates than Context
- Selector pattern prevents unnecessary re-renders
- Works with immer for immutable updates

**Why Immer?**
- Mutable syntax for complex nested updates
- Automatically produces immutable result
- Cleaner code for deep updates

---

## Validation Flow

```
Controller method called
         ↓
    Validate input
         ↓
    ┌────┴────┐
    ↓         ↓
 Invalid    Valid
    ↓         ↓
 Return    Apply to store
 error          ↓
    ↓      Emit onStateChange
 Emit           ↓
 onConstraint   Return { valid: true }
```

---

## Constraints

| Constraint | Default | Description |
|------------|---------|-------------|
| maxSections | 20 | Maximum sections per page |
| maxWidgetNesting | 3 | Maximum widget nesting depth |
| maxWidgetsPerSection | 50 | Maximum widgets per section |

---

## Hooks

### useEngineController

```typescript
function useEngineController(): EngineController
```

Returns the controller for platform to update schema.

### useEngineState

```typescript
function useEngineState<T>(selector: (state: EngineState) => T): T
```

Returns selected state with automatic re-render on change.

### useEngineStore

```typescript
function useEngineStore(): StoreApi<EngineState>
```

Returns the raw Zustand store (advanced use only).

---

## Testing

```typescript
describe('EngineProvider', () => {
  it('emits onReady after mount', async () => {
    const onReady = vi.fn()
    render(
      <EngineProvider input={{ site, page, events: { onReady } }}>
        <div />
      </EngineProvider>
    )
    await waitFor(() => expect(onReady).toHaveBeenCalled())
  })

  it('validates section limit', () => {
    const { result } = renderHook(() => useEngineController(), {
      wrapper: ({ children }) => (
        <EngineProvider input={{ site, page }}>{children}</EngineProvider>
      ),
    })

    // Add 21 sections
    for (let i = 0; i < 21; i++) {
      const res = result.current.addSection({ id: `s${i}`, widgets: [] })
      if (i === 20) {
        expect(res.valid).toBe(false)
        expect(res.error?.type).toBe('section-limit')
      }
    }
  })
})
```

---

## Related Documents

- [interface.spec.md](../../layers/interface.spec.md) - Interface layer overview
- [versioning.spec.md](../../core/versioning.spec.md) - Version rules
- [site-validator.spec.md](../validation/site-validator.spec.md) - Build-time validation
