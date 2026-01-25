# Interface Layer

> Defines the contract between the Creativeshire Platform and the Engine for schema delivery, live updates, and event communication.

---

## Purpose

The Interface Layer handles communication between the Creativeshire Platform and the Engine. It specifies how external systems control the engine without touching internals. The platform delivers schema data; the engine renders and animates. Events flow back to inform the platform of state changes.

---

## Owns

```
creativeshire/interface/
├── types.ts              # EngineInput, EngineController, EngineEvents
├── EngineProvider.tsx    # Root provider wrapping the engine
└── useEngineController.ts # Hook for platform to control engine
```

**Concepts owned:** EngineInput, EngineController, EngineEvents, EngineProvider

---

## Receives From

| From | What | Shape |
|------|------|-------|
| Platform | Site schema | `SiteSchema` |
| Platform | Experience selection | `experienceId: string` |
| Platform | Preview mode flag | `isPreview: boolean` |
| Platform | Content updates | `{ sectionId, changes }` |

---

## Provides To

| To | What | Shape |
|----|------|-------|
| Platform | Ready event | `onReady(): void` |
| Platform | Error events | `onError(error): void` |
| Platform | Constraint violations | `onConstraintViolation(v): void` |
| Renderer | Schema + Experience | Processed data for rendering |

---

## Core Concepts

### EngineInput

Describes what the engine receives from the platform at initialization.

| Property | Type | Description |
|----------|------|-------------|
| `schema` | `SiteSchema` | Complete site content structure |
| `experienceId` | `string` | Selected animation mode |
| `isPreview` | `boolean` | Enables draft content rendering |

### EngineController

Exposes methods for live updates during preview sessions.

| Method | Parameters | Description |
|--------|------------|-------------|
| `updateSection` | `sectionId, changes` | Patch section content |
| `setExperience` | `experienceId` | Swap animation mode |
| `reorderSections` | `order[]` | Change section sequence |
| `addSection` | `section, position?` | Insert new section |
| `removeSection` | `sectionId` | Delete section |

### EngineEvents

Callbacks the platform provides to receive engine notifications.

| Event | Payload | When |
|-------|---------|------|
| `onReady` | None | Engine initialized and rendered |
| `onError` | `EngineError` | Render or animation failure |
| `onConstraintViolation` | `ConstraintViolation` | Schema rule violated |

---

## Live Preview Flow

```
Platform (CMS UI)
    │
    ├─ Content Update ──────────────┐
    │  { sectionId, changes }       │
    │                               ▼
    ├─ Experience Swap ────────► Interface Layer
    │  { experienceId }             │
    │                               ▼
    └─────────────────────────► Engine re-renders
```

Content updates and experience swaps flow through the Interface Layer. The engine processes changes and re-renders affected sections. React Fast Refresh applies changes without full page reload.

---

## Constraint Validation

The Interface Layer validates changes before applying them.

| Constraint | Check | Response |
|------------|-------|----------|
| Section limit | `sections.length <= 20` | Emit `onConstraintViolation` |
| Widget nesting | `depth <= 3` | Emit `onConstraintViolation` |
| Required fields | Schema validation | Emit `onError` |
| Unknown widget type | Registry lookup | Emit `onError` |

Validation prevents invalid state from reaching the renderer.

---

## Serialization Contract

All data crossing the RSC boundary must be JSON-serializable.

### Allowed Types

| Type | Serializes To |
|------|---------------|
| `string` | `"value"` |
| `number` | `123` |
| `boolean` | `true` |
| `null` | `null` |
| Plain objects | `{ key: value }` |
| Arrays | `[...]` |
| Date | ISO string |
| Map | Not serializable |
| Set | Not serializable |

### Not Allowed

| Type | Why | Alternative |
|------|-----|-------------|
| Functions | Can't serialize closures | Pass string identifier, resolve at runtime |
| React elements | Component references lost | Pass schema, render at runtime |
| Class instances | Prototype chain lost | Use plain objects |
| Symbols | No JSON representation | Use string keys |
| WeakMap/WeakSet | References lost | Use Map/Set (if serializable values) |

### Validation

```typescript
// Type guard for serializable values
type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue }

// Widget props must be serializable
interface WidgetSchema {
  type: string
  props?: Record<string, SerializableValue>
}
```

---

## Server/Client Boundary

Components are categorized by their execution context.

| Component | Side | Why | Directive |
|-----------|------|-----|-----------|
| Schema types | Both | Type-only, no runtime | None |
| SiteSchema data | Server | Fetched at build/request | None |
| PageRenderer | Server | Can be RSC | None (default) |
| Widget | Server | Pure render, no state | None (default) |
| ExperienceProvider | Client | Needs Zustand store | `'use client'` |
| DriverProvider | Client | Needs RAF, DOM APIs | `'use client'` |
| BehaviourWrapper | Client | Needs refs, effects | `'use client'` |
| Trigger hooks | Client | Event listeners | `'use client'` |

### Boundary Crossing

```
Server Components              Client Components
─────────────────              ─────────────────
     PageRenderer
           │
           ▼ (props = serializable data)
     ExperienceProvider ──────────────────────
           │                                  │
           ▼                                  │
     Widget (can stay server)                 │
           │                                  │
           ▼ (needs animation)                │
     BehaviourWrapper ◄───────────────────────┘
           │
           ▼
     DOM with CSS variables
```

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | Schema contains no functions | Type check |
| 2 | Schema contains no React elements | Type check |
| 3 | Client components marked "use client" | Directive present |
| 4 | Props crossing boundary are serializable | Type check |

---

## Boundaries

### This layer CAN:

- Receive schema from platform
- Expose controller for live updates
- Emit events back to platform
- Validate constraints before applying changes
- Transform schema for renderer consumption

### This layer CANNOT:

- Access platform auth or user data
- Modify platform state
- Persist data (platform handles persistence)
- Import from platform codebase
- Render components directly (belongs in Renderer)
- Compute animation values (belongs in Experience Layer)

---

## Key Interfaces

```typescript
// creativeshire/interface/types.ts

interface EngineInput {
  schema: SiteSchema
  experienceId: string
  isPreview: boolean
}

interface EngineController {
  updateSection(sectionId: string, changes: Partial<SectionSchema>): void
  setExperience(experienceId: string): void
  reorderSections(order: string[]): void
  addSection(section: SectionSchema, position?: number): void
  removeSection(sectionId: string): boolean
}

interface EngineEvents {
  onReady(): void
  onError(error: EngineError): void
  onConstraintViolation(violation: ConstraintViolation): void
}

interface EngineError {
  code: string
  message: string
  context?: Record<string, unknown>
}

interface ConstraintViolation {
  type: 'section-limit' | 'nesting-depth' | 'unknown-widget'
  message: string
  path: string[]
}
```

---

## Provider Structure

```typescript
// creativeshire/interface/EngineProvider.tsx

function EngineProvider({ input, events, children }: EngineProviderProps) {
  const controller = useEngineController(input, events)

  return (
    <EngineContext.Provider value={controller}>
      <ExperienceProvider mode={input.experienceId}>
        {children}
      </ExperienceProvider>
    </EngineContext.Provider>
  )
}
```

The EngineProvider wraps the entire engine. It initializes the controller and nests the Experience Provider.

---

## Related Documents

- [platform.spec.md](../core/platform.spec.md) - Platform overview
- [experience.spec.md](./experience.spec.md) - Experience definitions
- [schema.spec.md](./schema.spec.md) - Schema types
- [renderer.spec.md](./renderer.spec.md) - Schema-to-component bridges
