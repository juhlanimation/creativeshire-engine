# Intro Component Contracts

> Component-level contracts for the intro layer.

---

## IntroPattern Interface

```typescript
interface IntroPattern {
  id: string                       // Unique identifier (kebab-case, matches folder name)
  name: string                     // Human-readable name
  description: string              // What this pattern does
  triggers: IntroTriggerConfig[]   // What triggers completion
  revealDuration: number           // Reveal animation duration (ms)
  hideChrome: boolean              // Whether to hide chrome during intro
  settings?: SettingsConfig        // CMS-configurable settings
}
```

### Requirements

- `id` must be kebab-case and match the pattern folder name
- `triggers` must have at least one entry
- `revealDuration` must be a positive number
- `settings` must define type, label, and default for each setting

---

## IntroProvider Contract

```typescript
interface IntroProviderProps {
  pattern: IntroPattern | null     // Pattern to use (null = no intro)
  settings?: Record<string, unknown>  // Pattern-specific settings
  children: ReactNode
}
```

### Responsibilities

1. Creates Zustand store with `IntroState + IntroActions`
2. Manages scroll locking via `document.body.style.overflow`
3. Provides pattern and store via `IntroContext`
4. Renders `IntroTriggerInitializer` when pattern exists

### State Management

Default state (with pattern):
```typescript
{
  phase: 'locked',
  videoTime: 0,
  timerElapsed: 0,
  revealProgress: 0,
  isScrollLocked: true,
  chromeVisible: !pattern.hideChrome,
  introCompleted: false,
}
```

Default state (no pattern):
```typescript
{
  phase: 'ready',
  isScrollLocked: false,
  chromeVisible: true,
  introCompleted: true,
  // ...zeroed values
}
```

### Phase Transitions

When `setPhase('revealing')`: sets `isScrollLocked: false`
When `setPhase('ready')`: sets `isScrollLocked: false, chromeVisible: true, introCompleted: true, revealProgress: 1`
When `completeIntro()`: same as `setPhase('ready')`

---

## IntroTriggerInitializer Contract

```typescript
interface IntroTriggerInitializerProps {
  pattern: IntroPattern
  store: StoreApi<IntroStore>
  settings?: Record<string, unknown>
  children: ReactNode
}
```

### Responsibilities

1. Calls `usePhaseController` (always active)
2. Checks pattern triggers and conditionally enables:
   - `useVideoTime` if pattern has `video-time` trigger
   - `useTimer` if pattern has `timer` trigger
3. Renders children (no DOM output)

---

## Trigger Hook Contracts

### useVideoTime

```typescript
interface UseVideoTimeOptions {
  selector: string           // CSS selector for video element (default: '[data-intro-video]')
  targetTime: number         // Time in seconds to trigger
  onTargetReached?: () => void  // Callback when target reached
}
```

- Polls video `currentTime` via RAF and `timeupdate` events
- Updates `videoTime` in store
- Fires `onTargetReached` once when target met

### useTimer

```typescript
interface UseTimerOptions {
  duration: number           // Timer duration in ms
  enabled: boolean           // Whether timer is active
  onComplete?: () => void    // Callback when duration reached
}
```

- Uses `performance.now()` via RAF for precision
- Updates `timerElapsed` in store
- Fires `onComplete` once when duration reached

### usePhaseController

```typescript
interface UsePhaseControllerOptions {
  pattern: IntroPattern
  settings?: Record<string, unknown>
}

// Returns:
{ triggerReveal: () => void }
```

- Orchestrates `locked -> revealing -> ready` transitions
- `triggerReveal()` animates `revealProgress` 0->1 via RAF over `revealDuration`
- Calls `completeIntro()` when animation finishes
- Auto-triggers for non-blocking patterns (scroll-reveal)

---

## Registry API

```typescript
registerIntroPattern(pattern: IntroPattern): void
getIntroPattern(id: string): IntroPattern | undefined
getIntroPatternIds(): string[]
getAllIntroPatterns(): IntroPattern[]
```

Simple `Map<string, IntroPattern>` storage. Warns on duplicate registration.

---

## Context API

```typescript
interface IntroContextValue {
  pattern: IntroPattern
  store: StoreApi<IntroStore>
}

// Hooks
useIntro(): IntroContextValue | null        // Returns null if no provider
useIntroRequired(): IntroContextValue       // Throws if no provider
```

---

## Creating a New Pattern

1. **Create folder:** `engine/intro/patterns/{pattern-name}/`
2. **Add meta.ts:**
   ```typescript
   import type { SettingsConfig } from '../../../schema/settings'

   export const settings: SettingsConfig<YourSettings> = {
     settingName: {
       type: 'range',
       label: 'Setting Label',
       default: 100,
       min: 0,
       max: 1000,
       step: 50,
     }
   }
   ```
3. **Add index.ts:**
   ```typescript
   import type { IntroPattern } from '../../types'

   export const myPattern: IntroPattern = {
     id: 'my-pattern',
     name: 'My Pattern',
     description: 'What this pattern does',
     triggers: [{ type: 'timer', options: {} }],
     revealDuration: 800,
     hideChrome: true,
     settings,
   }
   ```
4. **Register in patterns/index.ts:** Import and call `registerIntroPattern(myPattern)`
5. **Update types.ts:** Add `'my-pattern'` to `IntroConfig.pattern` union

---

## Related Documents

- Intro Layer: [intro.spec.md](../../layers/intro.spec.md)
- Behaviour Contract: [behaviour.spec.md](../experience/behaviour.spec.md)
- Provider Contract: [provider.spec.md](../experience/provider.spec.md)
