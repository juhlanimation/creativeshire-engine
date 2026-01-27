# Provider Spec

> React context providers that distribute experience mode and driver access throughout the component tree.

## Purpose

Providers distribute Experience Layer (L2) resources to the component tree. ExperienceProvider supplies mode configuration and store access. DriverProvider supplies element registration for animation. Together they enable widgets to participate in the experience system without direct coupling.

## Concepts

| Term | Definition |
|------|------------|
| ExperienceProvider | Distributes mode and store to tree |
| DriverProvider | Distributes driver registration API |
| useExperience | Hook to access ExperienceProvider context |
| useDriver | Hook to access DriverProvider context |

## Folder Structure

```
creativeshire/experience/
├── ExperienceProvider.tsx     # Mode and store distribution
├── DriverProvider.tsx         # Driver registration API
├── types.ts                   # Provider interfaces
└── index.ts                   # Barrel exports
```

## Interface

```typescript
// experience/types.ts
export interface ExperienceContextValue {
  mode: Mode                              // Active mode configuration
  store: StoreApi<any>                    // Zustand store instance
  options: Record<string, any>            // Mode options
}

export interface DriverContextValue {
  register: (id: string, element: HTMLElement, behaviour: Behaviour, options: Record<string, any>) => void
  unregister: (id: string) => void
}

// ExperienceProvider.tsx
export interface ExperienceProviderProps {
  mode: Mode
  store: StoreApi<any>
  children: ReactNode
}

export function ExperienceProvider(props: ExperienceProviderProps): JSX.Element
export function useExperience(): ExperienceContextValue

// DriverProvider.tsx
export interface DriverProviderProps {
  children: ReactNode
}

export function DriverProvider(props: DriverProviderProps): JSX.Element
export function useDriver(): DriverContextValue
```

## Provider Hierarchy

```
<ExperienceProvider mode={mode} store={store}>
  <DriverProvider>
    <ChromeRenderer />
    <main>
      <PageRenderer />
    </main>
    <ChromeRenderer />
  </DriverProvider>
</ExperienceProvider>
```

ExperienceProvider wraps DriverProvider. This order matters because:
- Driver needs mode configuration from ExperienceProvider
- BehaviourWrapper needs both contexts

## Rules

### Must

1. ExperienceProvider wraps DriverProvider (not vice versa)
2. Driver created in useEffect (not during render)
3. `driver.destroy()` called in useEffect cleanup
4. `useExperience` throws if context is null
5. `useDriver` throws if context is null
6. Exports hook alongside provider
7. Provider receives mode/store from props (stateless)
8. useRef for driver instance

### Must Not

1. useState for mode or store (causes sync issues)
2. Create driver during render
3. Missing cleanup in useEffect
4. Direct DOM manipulation in provider
5. Silent failures when context missing

## Validation Rules

> Each rule maps 1:1 to `provider.validator.ts`

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Exports useExperience hook | `checkExportsUseExperience` | `ExperienceProvider.tsx` |
| 2 | Exports useDriver hook | `checkExportsUseDriver` | `DriverProvider.tsx` |
| 3 | Hook throws on missing context | `checkHookThrows` | `*Provider.tsx` |
| 4 | Driver in useEffect | `checkDriverInEffect` | `DriverProvider.tsx` |
| 5 | Cleanup in useEffect | `checkCleanupReturn` | `DriverProvider.tsx` |
| 6 | No useState for mode | `checkNoModeState` | `*Provider.tsx` |
| 7 | Uses useRef for driver | `checkUsesRef` | `DriverProvider.tsx` |
| 8 | No DOM manipulation | `checkNoDom` | `*Provider.tsx` |

## Cleanup Requirements

| Resource | Cleanup Action |
|----------|----------------|
| ScrollDriver | `driver.destroy()` removes listeners, clears targets |
| GSAPDriver | `ScrollTrigger.kill()` on all triggers |
| Store subscriptions | Zustand handles automatically |

Failure to cleanup causes memory leaks and animation conflicts.

## Template

```typescript
// experience/ExperienceProvider.tsx
import { createContext, useContext, ReactNode } from 'react'
import { Mode } from './modes/types'
import { StoreApi } from 'zustand'

interface ExperienceContextValue {
  mode: Mode
  store: StoreApi<any>
  options: Record<string, any>
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null)

interface ExperienceProviderProps {
  mode: Mode
  store: StoreApi<any>
  options?: Record<string, any>
  children: ReactNode
}

export function ExperienceProvider({
  mode,
  store,
  options = {},
  children
}: ExperienceProviderProps) {
  const value: ExperienceContextValue = { mode, store, options }

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  )
}

export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext)
  if (!context) {
    throw new Error('useExperience must be used within ExperienceProvider')
  }
  return context
}
```

```typescript
// experience/DriverProvider.tsx
import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { ScrollDriver } from './drivers/ScrollDriver'
import { Behaviour } from './behaviours/types'

interface DriverContextValue {
  register: (id: string, element: HTMLElement, behaviour: Behaviour, options: Record<string, any>) => void
  unregister: (id: string) => void
}

const DriverContext = createContext<DriverContextValue | null>(null)

interface DriverProviderProps {
  children: ReactNode
}

export function DriverProvider({ children }: DriverProviderProps) {
  const driverRef = useRef<ScrollDriver | null>(null)

  useEffect(() => {
    driverRef.current = new ScrollDriver()
    return () => driverRef.current?.destroy()
  }, [])

  const value: DriverContextValue = {
    register: (id, element, behaviour, options) => {
      driverRef.current?.register(id, element, behaviour, options)
    },
    unregister: (id) => {
      driverRef.current?.unregister(id)
    }
  }

  return (
    <DriverContext.Provider value={value}>
      {children}
    </DriverContext.Provider>
  )
}

export function useDriver(): DriverContextValue {
  const context = useContext(DriverContext)
  if (!context) {
    throw new Error('useDriver must be used within DriverProvider')
  }
  return context
}
```

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Create driver in render | New instance each render, leaks listeners | Use `useRef` + `useEffect` |
| Missing cleanup | Listeners accumulate, memory leaks | Return cleanup function from `useEffect` |
| useState for mode | State creates sync issues | Use props directly (source of truth) |
| Silent context failures | Callers crash mysteriously | Throw with helpful message in hooks |

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `driver` | Creates | DriverProvider instantiates driver |
| `behaviour` | Distributes | Provides driver to BehaviourWrapper |
| `preset` | Receives | Mode comes from preset configuration |
| SiteRenderer | Used by | Renderer wraps tree in providers |

## Validator

Validated by: `./provider.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
