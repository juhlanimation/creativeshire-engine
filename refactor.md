# Unified Registry Pattern: Experiences, Transitions, Intros, Chrome

## Context

Four core concepts — experiences, transitions, intros, chrome — all serve as configurable, CMS-discoverable components. Currently they're at different levels of maturity:

| System | Registry | Meta + Settings | Site/Page Model |
|--------|----------|-----------------|-----------------|
| **Experiences** | Full (lazy loading, Map) | Full | Site default + page override |
| **Transitions** | None (inline config on Experience) | None | Coupled to experience |
| **Intros** | Partial (eager Map, missing fields) | Partial (no icon/tags/category) | Site default + page override |
| **Chrome** | Basic (Record, no meta aggregation) | Has meta.ts files but orphaned | Site default + page override |

**Goals:**
1. All four follow the same registry pattern (meta, register, lazy loading, CMS discovery)
2. Experiences → page-specific (site-level as optional default)
3. Transitions → site-specific with page-pair overrides (decoupled from experiences)
4. Intros + Chrome → upgraded to match the canonical pattern

## The Canonical Pattern

Every registry follows this structure:

```
{X}Meta<T>             { id, name, description, icon?, tags?, category?, settings?, preview?, docs? }
define{X}Meta<T>()     Type-safe meta helper
RegistryEntry          { type: 'loaded', item } | { type: 'lazy', meta, loader }
Map<string, Entry>     Registry store
register{X}()          Eager registration
registerLazy{X}()      Lazy registration (meta + loader)
get{X}(id)             Sync get (undefined for unloaded lazy)
get{X}Async(id)        Async get (loads lazy entries, caches)
getAll{X}Metas()       All metas without loading
get{X}Ids()            All registered IDs
ensure{X}Registered()  Anti-tree-shaking marker
```

---

## Phase 1: Schema Foundation

### 1a. New transition schema types

**Create** `engine/schema/transition.ts`

```typescript
/** Site-level: default transition for all page navigations */
export interface TransitionConfig {
  /** Registered page transition ID (e.g., 'fade') */
  id: string
  /** Override transition settings */
  settings?: Record<string, unknown>
}

/**
 * Page-level: this page is the "from" route.
 * When navigating AWAY from this page, these transitions apply.
 */
export interface PageTransitionOverride {
  /** Default transition when leaving this page (overrides site default) */
  default?: TransitionConfig
  /** Per-destination overrides — each can use a different transition type */
  routes?: PageTransitionRoute[]
}

/** A specific from→to route transition */
export interface PageTransitionRoute {
  /** Target page ID */
  to: string
  /** Registered transition ID for this route */
  id: string
  /** Override transition settings for this route */
  settings?: Record<string, unknown>
}
```

**Resolution order** (navigate from page A → page B):
1. Check A's `transition.routes` for `{ to: B.id }` → use that transition
2. Check A's `transition.default` → use that
3. Check `site.transition` → use that
4. No transition → instant navigation

### 1b. Update `SiteSchema` and `PageSchema`

**`engine/schema/site.ts`**
```diff
- experience: ExperienceConfig
+ experience?: ExperienceConfig
+ transition?: TransitionConfig
```

**`engine/schema/page.ts`**
```diff
+ transition?: PageTransitionOverride | 'disabled'
```

The page IS the "from" route. If `routes` are specified, each from→to connection can set its own transition type. If only `default` is set, it overrides the site default for all navigations away from this page. `'disabled'` disables transitions when leaving this page.

### 1c. Update schema exports

**`engine/schema/index.ts`** — Export `TransitionConfig`, `PageTransitionOverride`, `PageTransitionRoute`

### 1d. Extend `IntroPatternMeta`

**`engine/intro/types.ts`** — Add missing fields to `IntroPatternMeta`:
```diff
  interface IntroPatternMeta<T = unknown> {
    id: string; name: string; description: string;
+   icon?: string; tags?: string[];
+   category?: IntroCategory;
    settings?: SettingsConfig<T>;
+   preview?: string; docs?: string;
  }
+ type IntroCategory = 'gate' | 'reveal' | 'sequence'
```

---

## Phase 2: Transition Registry (New)

New folder: `engine/experience/transitions/` (parallel to `engine/experience/experiences/`)

### 2a. Types (`engine/experience/transitions/types.ts`)

```typescript
export type PageTransitionCategory = 'fade' | 'directional' | 'none'

export interface PageTransitionMeta<T = unknown> {
  id: string; name: string; description: string;
  icon?: string; tags?: string[];
  category?: PageTransitionCategory;
  settings?: SettingsConfig<T>;
  preview?: string; docs?: string;
}

export interface PageTransition {
  id: string; name: string; description: string;
  icon?: string; tags?: string[];
  category?: PageTransitionCategory;
  settings?: SettingsConfig<unknown>;
  defaults: {
    exitDuration: number   // ms
    entryDuration: number  // ms
    timeout: number        // ms
  }
  respectReducedMotion?: boolean
  // CSS class names for the existing PageTransitionWrapper animation system
  exitClass: string
  entryClass: string
}
```

> Named `PageTransition` to avoid collision with existing GSAP container `Transition` type in `engine/experience/drivers/gsap/transitions/types.ts`.

### 2b. Registry (`engine/experience/transitions/registry.ts`)

Clone pattern from `engine/experience/experiences/registry.ts`:

- `definePageTransitionMeta<T>()`
- `registerPageTransition()` / `registerLazyPageTransition()`
- `getPageTransition()` / `getPageTransitionAsync()`
- `getAllPageTransitionMetas()` / `getPageTransitionIds()`

### 2c. Built-in transition: `fade`

```
engine/experience/transitions/
├── types.ts
├── registry.ts
├── index.ts
└── fade/
    ├── meta.ts
    └── index.ts
```

**`fade/meta.ts`:**
```typescript
export const meta = definePageTransitionMeta<FadeSettings>({
  id: 'fade',
  name: 'Fade to Black',
  description: 'Smooth black overlay fade between pages.',
  icon: 'fade',
  tags: ['fade', 'opacity', 'smooth'],
  category: 'fade',
  settings: {
    exitDuration: { type: 'number', label: 'Exit Duration (ms)', default: 400 },
    entryDuration: { type: 'number', label: 'Entry Duration (ms)', default: 400 },
  },
})
```

**`fade/index.ts`:**
```typescript
export const fadePageTransition: PageTransition = {
  ...meta,
  defaults: { exitDuration: 400, entryDuration: 400, timeout: 2000 },
  exitClass: 'page-transition--exiting',
  entryClass: 'page-transition--entering',
  respectReducedMotion: true,
}
registerPageTransition(fadePageTransition)
```

### 2d. Barrel (`engine/experience/transitions/index.ts`)

Lazy registration + barrel exports, same pattern as `engine/experience/experiences/index.ts`.

---

## Phase 3: Experience Cleanup

### 3a. Remove `pageTransition` from `Experience` interface

**`engine/experience/experiences/types.ts`** — Delete:
- `pageTransition?: PageTransitionConfig` (line 414)
- Update JSDoc (line 363)

> Keep `PageTransitionConfig` and `TransitionTask` types in the same file since they're still used by `TransitionProvider` and `TransitionStack` internally.

### 3b. Remove from slideshow experience

**`engine/experience/experiences/slideshow/index.ts`** — Remove `pageTransition` block (~line 99)

### 3c. Delete `simple-transitions` experience

- **Delete** `engine/experience/experiences/simple-transitions/` (both files)
- **`engine/experience/experiences/index.ts`** — Remove all `simpleTransitions*` imports, lazy registration, direct export
- **`engine/experience/index.ts`** — Remove `simpleTransitionsExperience` export

---

## Phase 4: Renderer Rewiring

**`engine/renderer/SiteRenderer.tsx`** — the central consumer:

1. Remove `simpleTransitionsExperience` import + `void` anti-shake (lines 24, 73)
2. Add `import { getPageTransition, ensurePageTransitionsRegistered } from '../experience/transitions'`
3. Call `ensurePageTransitionsRegistered()` at module top
4. Resolve transition with page→site fallback:
   ```typescript
   // Resolve which TransitionConfig to use for this navigation
   // (Page transition override uses resolution order: route match → page default → site default)
   function resolveTransitionConfig(
     site: SiteSchema,
     page: PageSchema
   ): TransitionConfig | undefined {
     const pageTransition = page.transition
     if (pageTransition === 'disabled') return undefined

     // 1. Check page default (leaving this page)
     if (pageTransition?.default) return pageTransition.default

     // 2. Site default
     return site.transition
   }
   ```
5. Wire into providers:
   ```diff
   - <TransitionProvider config={experience.pageTransition}>
   + <TransitionProvider config={pageTransitionConfig}>
   - <PageTransitionProvider enabled={!!experience.pageTransition} ...>
   + <PageTransitionProvider enabled={!!pageTransitionConfig} ...>
   - <PageTransitionWrapper enabled={!!experience.pageTransition} ...>
   + <PageTransitionWrapper enabled={!!pageTransitionConfig} ...>
   ```

**Untouched internally:** `TransitionProvider`, `PageTransitionWrapper`, `TransitionStack`, `EffectTimeline`, `animateElement` — they still consume `PageTransitionConfig` props. Only the source changes.

---

## Phase 5: Preset Changes

### 5a. Preset types

**`engine/presets/types.ts`:**
```diff
+ import type { TransitionConfig } from '../schema/transition'

- experience: PresetExperienceConfig
+ experience?: PresetExperienceConfig
+ transition?: TransitionConfig
```

### 5b. test-multipage preset

**`engine/presets/test-multipage/site.ts`:**
```typescript
export const transitionConfig: TransitionConfig = {
  id: 'fade',
}
// Remove experienceConfig and pageTransitionConfig
```

**`engine/presets/test-multipage/index.ts`:**
```diff
- experience: experienceConfig,
+ transition: transitionConfig,
```

### 5c. App entry point

**`app/[[...slug]]/page.tsx`** — in `getSiteConfigForPreset`:
```diff
  const presetConfig: SiteSchema = {
    ...
    experience: preset.experience,    // now optional
+   transition: preset.transition,
    ...
  }
```

---

## Phase 6: Intro Registry Upgrade

### 6a. Upgrade registry to support lazy loading

**`engine/intro/registry.ts`** — Rewrite to match canonical pattern:

```typescript
type RegistryEntry =
  | { type: 'loaded'; pattern: IntroPattern }
  | { type: 'lazy'; meta: IntroPatternMeta; loader: () => Promise<IntroPattern> }

const registry = new Map<string, RegistryEntry>()
```

Add: `registerLazyIntroPattern()`, `getIntroPatternAsync()`, `preloadIntroPattern()`

Update: `getIntroPattern()` (sync, loaded only), `getAllIntroPatternMetas()` (extract from both types)

### 6b. Convert to lazy registration

**`engine/intro/patterns/index.ts`** — Change from eager:
```typescript
registerIntroPattern(videoGatePattern)
```
To lazy:
```typescript
import { meta as videoGateMeta } from './video-gate/meta'
registerLazyIntroPattern(videoGateMeta, () =>
  import('./video-gate').then(m => m.videoGatePattern)
)
```

### 6c. Update all four pattern metas

Add `icon`, `tags`, `category` to:
- `engine/intro/patterns/video-gate/meta.ts` → category: 'gate'
- `engine/intro/patterns/timed/meta.ts` → category: 'gate'
- `engine/intro/patterns/scroll-reveal/meta.ts` → category: 'reveal'
- `engine/intro/patterns/sequence-timed/meta.ts` → category: 'sequence'

### 6d. Barrel exports

**`engine/intro/index.ts`** — Export new functions: `registerLazyIntroPattern`, `getIntroPatternAsync`, `preloadIntroPattern`, `IntroCategory`

---

## Phase 7: Chrome Registry Upgrade

### 7a. Upgrade registry to Map-based with meta

**`engine/content/chrome/registry.ts`** — Rewrite:

```typescript
type RegistryEntry =
  | { type: 'loaded'; component: ComponentType<any>; meta?: ComponentMeta }
  | { type: 'lazy'; meta: ComponentMeta; loader: () => Promise<ComponentType<any>> }

const registry = new Map<string, RegistryEntry>()

export function registerChromeComponent(id: string, component: ComponentType<any>, meta?: ComponentMeta): void
export function registerLazyChromeComponent(meta: ComponentMeta, loader: () => Promise<ComponentType<any>>): void
export function getChromeComponent(id: string): ComponentType<any> | undefined  // SAME signature
export function getChromeComponentAsync(id: string): Promise<ComponentType<any> | undefined>
export function getAllChromeMetas(): ComponentMeta[]
export function getChromeComponentIds(): string[]
export function ensureChromeRegistered(): void
```

### 7b. Registration

Move from static Record to explicit registration calls. Each component registers eagerly (chrome components are always needed):

```typescript
// In registry.ts or a separate registrations file
import Header from './regions/Header'
registerChromeComponent('Header', Header)
// ... repeat for Footer, CursorLabel, ModalRoot, etc.
```

### 7c. Barrel exports

**`engine/content/chrome/index.ts`** — Export registry functions + `ensureChromeRegistered()`

### 7d. SiteRenderer

**`engine/renderer/SiteRenderer.tsx`** — Add `ensureChromeRegistered()` call at module top (alongside existing `ensureExperiencesRegistered()`)

---

## Phase 8: Architecture Tests

- Update tests validating `experience` as required on `SiteSchema` / `SitePreset`
- Remove references to `simple-transitions`
- Add tests for new transition registry (folder structure, meta files, registration)
- Validate intro metas have `icon`, `tags`, `category`
- Validate chrome components are registered with meta

---

## Files Summary

| File | Action |
|------|--------|
| **Schema** | |
| `engine/schema/transition.ts` | **NEW** — TransitionConfig, PageTransitionOverride, PageTransitionRoute |
| `engine/schema/site.ts` | Modify — experience optional, add transition |
| `engine/schema/page.ts` | Modify — add transition field |
| `engine/schema/index.ts` | Modify — export new types |
| **Transition Registry** | |
| `engine/experience/transitions/types.ts` | **NEW** |
| `engine/experience/transitions/registry.ts` | **NEW** |
| `engine/experience/transitions/index.ts` | **NEW** |
| `engine/experience/transitions/fade/meta.ts` | **NEW** |
| `engine/experience/transitions/fade/index.ts` | **NEW** |
| **Experience Cleanup** | |
| `engine/experience/experiences/types.ts` | Modify — remove pageTransition |
| `engine/experience/experiences/slideshow/index.ts` | Modify — remove pageTransition |
| `engine/experience/experiences/simple-transitions/` | **DELETE** |
| `engine/experience/experiences/index.ts` | Modify — remove simple-transitions |
| `engine/experience/index.ts` | Modify — remove simpleTransitions, add transition exports |
| **Renderer + Presets** | |
| `engine/renderer/SiteRenderer.tsx` | Modify — resolve transition from registry |
| `engine/presets/types.ts` | Modify — experience optional, add transition |
| `engine/presets/test-multipage/site.ts` | Modify — TransitionConfig |
| `engine/presets/test-multipage/index.ts` | Modify — wire transition |
| `app/[[...slug]]/page.tsx` | Modify — pass transition |
| **Intro Upgrade** | |
| `engine/intro/types.ts` | Modify — extend IntroPatternMeta |
| `engine/intro/registry.ts` | Modify — add lazy loading |
| `engine/intro/patterns/index.ts` | Modify — lazy registration |
| `engine/intro/patterns/*/meta.ts` (x4) | Modify — add icon, tags, category |
| `engine/intro/index.ts` | Modify — export new functions |
| **Chrome Upgrade** | |
| `engine/content/chrome/registry.ts` | Modify — Map-based with meta |
| `engine/content/chrome/index.ts` | Modify — export registry functions |
| **Tests** | |
| `__tests__/architecture/*.test.ts` | Modify |

**Untouched:** TransitionProvider, PageTransitionWrapper, TransitionLink, EffectTimeline, TransitionStack, GSAP container transitions, all widgets, all sections, all behaviours/effects/drivers, bojuhl preset, bishoy-gendi preset.

---

## Reusable Sources

| What | Copy From |
|------|-----------|
| Transition registry | `engine/experience/experiences/registry.ts` |
| Lazy barrel pattern | `engine/experience/experiences/index.ts` |
| Meta type shape | `ExperienceMeta` in `engine/experience/experiences/registry.ts:21` |
| Settings types | `SettingsConfig<T>` in `engine/schema/settings.ts` |
| Define helper | `defineExperienceMeta<T>()` in registry.ts:45 |

---

## Verification

1. `npx tsc --noEmit` — type checking passes after each phase
2. `npm run test:arch` — architecture tests pass
3. `http://localhost:3000` (bojuhl) — renders, no transitions, intro works
4. `http://localhost:3000?_preset=test-multipage` — fade transitions between home/about
5. `http://localhost:3000?_preset=bishoy-gendi` — carousel works
6. `getAllPageTransitionMetas()` → returns `[{ id: 'fade', ... }]`
7. `getAllIntroPatternMetas()` → all have icon, tags, category
8. `getAllChromeMetas()` → returns metas for all chrome components
