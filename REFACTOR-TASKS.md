# Refactoring Tasks

Master plan for architecture improvements. A PM agent should use this to spawn workers.

---

## Overview

The creativeshire engine needs these architectural fixes:

1. **Triggers Layer** - Create missing infrastructure for store updates
2. **Remove Backward Compatibility** - Delete aliases, use canonical names
3. **Colocate Widget-Specific Code** - Move effects/hooks to their widgets
4. **Systematic Audit** - Verify every file follows architecture via bojuhl preset trace

---

## Phase 1: Triggers Layer (BLOCKING)

Creates the missing `triggers/` folder that writes browser events to the global store.

### Problem

- Store exists (`ExperienceState`) but values never update
- `VisibilityDriver` acts as trigger (wrong folder, wrong pattern)
- No `scrollProgress` trigger exists
- BehaviourWrapper doesn't subscribe to store

### Solution

```
Browser Event → Trigger → Store → BehaviourWrapper → CSS Variables
```

### Files to Create

| File | Purpose |
|------|---------|
| `experience/triggers/types.ts` | TriggerConfig interface |
| `experience/triggers/useScrollProgress.ts` | Writes scroll 0-1 to store |
| `experience/triggers/useIntersection.ts` | Writes section visibility to store |
| `experience/triggers/usePrefersReducedMotion.ts` | Writes a11y preference to store |
| `experience/triggers/index.ts` | Barrel export |
| `experience/TriggerInitializer.tsx` | Orchestrates trigger initialization |

### Files to Modify

| File | Change |
|------|--------|
| `experience/types.ts` | Add `prefersReducedMotion` to ExperienceState |
| `experience/DriverProvider.tsx` | Remove VisibilityDriver logic |
| `experience/modes/stacking/index.ts` | Add `prefersReducedMotion` to initial state |
| `renderer/SiteRenderer.tsx` | Add TriggerInitializer to provider hierarchy |
| `renderer/SectionRenderer.tsx` | Remove `driver.observe()` calls |
| `experience/index.ts` | Export TriggerInitializer |

### Files to Delete

| File | Reason |
|------|--------|
| `experience/drivers/VisibilityDriver.ts` | Functionality moved to trigger |

---

## Phase 2: Remove Backward Compatibility

Delete all aliases and use canonical trigger-based names everywhere.

### Files to Modify

| File | Change |
|------|--------|
| `experience/behaviours/resolve.ts` | Delete `BEHAVIOUR_ALIASES` object entirely |
| `presets/bojuhl/chrome/floating-contact.ts` | `contact-reveal` → `hover/reveal` |
| `presets/bojuhl/chrome/footer.ts` | Replace "Bo Juhl" with placeholder |

### Pattern Changes

| Old Pattern | Canonical Pattern |
|-------------|-------------------|
| `contact-reveal` | `hover/reveal` |
| `scroll-fade` | `scroll/fade` |
| `project-card-hover` | `hover/scale` |
| `fade-in` | `visibility/fade-in` |
| `logo-marquee-animation` | `animation/marquee` |

---

## Phase 3: Colocate Widget-Specific Code

Move effects and hooks that serve a single widget INTO that widget's folder.

### Effects to Move

| From | To |
|------|-----|
| `effects/contact-reveal.css` | `widgets/composite/ContactPrompt/styles.css` (merge) |
| `effects/thumbnail-expand.css` | `widgets/composite/GalleryThumbnail/styles.css` (merge) |

### Hooks Already Colocated (Good)

- `widgets/composite/Video/useVisibilityPlayback.ts` ✅
- `widgets/composite/VideoPlayer/hooks/` ✅
- `chrome/overlays/Modal/useSmoothModalScroll.ts` ✅
- `chrome/overlays/Modal/useTransitionComplete.ts` ✅

---

## Phase 4: Refactor Reveal Behaviours

The `reveal/` behaviours combine trigger + effect. They should be split.

### Current (Wrong)

```
behaviours/reveal/
├── fade-reveal/     # Combines visibility trigger + fade effect
├── mask-reveal/     # Combines visibility trigger + mask effect
└── scale-reveal/    # Combines visibility trigger + scale effect
```

### Should Be

- **Trigger:** `visibility/in-view` sets `--visible: 0|1`
- **Effect:** CSS responds to `--visible` variable

### Decision Needed

Option A: Delete `reveal/` folder, use `visibility/fade-in` + effect CSS
Option B: Keep `reveal/` as convenience wrappers that compose visibility + effect

**Depends on:** Phase 1 (Triggers Layer)

---

## Phase 5: Systematic Audit (bojuhl trace)

Walk through bojuhl preset and verify every file follows architecture.

### Execution Order

```
1. Preset config (bojuhl/) → verify wiring
2. Pages (home.ts) → verify section usage
3. Sections (Hero, About, etc.) → verify widget usage
4. Widgets (composites → layout → primitives) → verify rules
5. Behaviours → verify trigger-based naming
6. Effects → verify mechanism-based naming
7. Chrome → verify regions/overlays
```

### Checklist (PM tracks completion)

**Preset Configuration**
- [ ] `presets/bojuhl/index.ts`
- [ ] `presets/bojuhl/site.ts`
- [ ] `presets/bojuhl/pages/home.ts`
- [ ] `presets/bojuhl/chrome/footer.ts`
- [ ] `presets/bojuhl/chrome/floating-contact.ts`

**Section Patterns**
- [ ] `sections/patterns/Hero/`
- [ ] `sections/patterns/About/`
- [ ] `sections/patterns/FeaturedProjects/`
- [ ] `sections/patterns/OtherProjects/`

**Composite Widgets**
- [ ] `widgets/composite/ProjectCard/`
- [ ] `widgets/composite/ExpandableGalleryRow/`
- [ ] `widgets/composite/GalleryThumbnail/`
- [ ] `widgets/composite/Video/`
- [ ] `widgets/composite/ContactPrompt/`
- [ ] `widgets/composite/LogoLink/`
- [ ] `widgets/composite/VideoPlayer/`

**Layout Widgets**
- [ ] `widgets/layout/Stack/`
- [ ] `widgets/layout/Flex/`
- [ ] `widgets/layout/Box/`
- [ ] `widgets/layout/Grid/`
- [ ] `widgets/layout/Container/`
- [ ] `widgets/layout/Split/`

**Primitive Widgets**
- [ ] `widgets/primitives/Text/`
- [ ] `widgets/primitives/Image/`
- [ ] `widgets/primitives/Button/`
- [ ] `widgets/primitives/Icon/`

**Chrome**
- [ ] `chrome/regions/Footer/`
- [ ] `chrome/overlays/Modal/`
- [ ] `chrome/overlays/CursorLabel/`

**Behaviours**
- [ ] `behaviours/scroll/` (all files)
- [ ] `behaviours/hover/` (all files)
- [ ] `behaviours/visibility/` (all files)
- [ ] `behaviours/animation/` (all files)
- [ ] `behaviours/reveal/` (decision on refactor)

**Effects**
- [ ] `effects/fade.css`
- [ ] `effects/color-shift.css`
- [ ] `effects/marquee-scroll.css`
- [ ] `effects/mask/`
- [ ] `effects/transform/`

---

## Verification Rules (for audit)

### Widgets (Primitives)
- No viewport units (100vh, 100vw, 100dvh)
- No scroll/resize listeners
- No imports from `experience/`
- CSS variables have fallbacks
- Generic name (not site-specific)

### Widgets (Layout)
- Only arranges children
- No business logic
- Generic props (gap, direction, etc.)

### Widgets (Composite)
- Returns WidgetSchema (factory) OR React component (state)
- Uses Layout + Primitives
- Generic, configurable via props

### Section Patterns
- Factory function returning SectionSchema
- Generic name and props
- No hardcoded content

### Behaviours
- Named by TRIGGER (scroll/, hover/, visibility/)
- Only computes CSS variables
- No DOM manipulation
- Generic (not widget-specific name)

### Effects
- Named by MECHANISM (fade, scale, mask/)
- Pure CSS
- Uses CSS variables from behaviours
- Has fallback values

---

## Dependency Graph

```
Phase 1: Triggers Layer
    ↓
Phase 2: Remove Backward Compatibility
    ↓
Phase 3: Colocate Widget-Specific Code
    ↓
Phase 4: Refactor Reveal Behaviours
    ↓
Phase 5: Systematic Audit
```

Phases 2 and 3 can run in parallel after Phase 1.
Phase 4 depends on Phase 1.
Phase 5 should run last to verify everything.

---

## Completed

### Remove Dead Modal Behaviours
**Date:** Session start

Deleted dead code:
- `behaviours/modal/` folder
- `behaviours/video-modal/` folder
- `ModalBehaviourWrapper.tsx`

**Reason:** Modal uses `RevealTransition` directly, not behaviour system.
