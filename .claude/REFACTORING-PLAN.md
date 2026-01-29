# Refactoring Plan: Creativeshire Engine Architecture

## Goal
Align the codebase with the documented architecture to be fully generalized and preset-based.

**Related docs:**
- `.claude/ARCHITECTURE-AUDIT.md` - Original audit
- `CLAUDE.md` - Architecture overview

---

# COMPREHENSIVE AUDIT FINDINGS

## Widget Layer Issues

### Misclassified Widgets (CRITICAL)

| Widget | Current | Correct | Reason |
|--------|---------|---------|--------|
| `ContactPrompt` | `primitives/` | `composite/` | Has state machine (copyState: idle/copied/failed), multiple nested elements, flip animation, icon toggle. NOT atomic. |
| `LogoLink` | `primitives/` | `composite/` | Combines Image + Text with navigation. Composition pattern, not primitive. |
| `ExpandableGalleryRow` | `layout/` | `composite/` | Has state (expandedId), modal integration, video playback, metadata rendering. NOT a pure layout. |

### L1/L2 Violations (CRITICAL)

Widgets contain CSS transitions that belong in L2 effects:

**ContactPrompt/styles.css:**
```css
/* Line 62, 72 */ transition: transform 500ms ease-in-out;  /* VIOLATION */
/* Line 103, 113 */ transition: opacity 200ms ease-in-out;  /* VIOLATION */
```

**ExpandableGalleryRow/styles.css:**
```css
/* Line 41, 56 */ transition: opacity 300ms ease-out;  /* VIOLATION */
```

**Fix:** Extract transitions to `experience/effects/` and use `data-effect` attributes.

### Widget Naming Issues

| Current | Suggested | Reason |
|---------|-----------|--------|
| `LogoLink` | `Link` or `NavLink` | Site-specific. Should be CMS-generic. |
| `ContactPrompt` | `CopyButton` or `FlipCard` | Site-specific. Should describe the pattern, not the use case. |

### Missing Widgets

| Category | Widget | Reason |
|----------|--------|--------|
| Primitives | `Icon` | Currently inline SVGs in ContactPrompt |
| Primitives | `Button` | No interactive button primitive exists |
| Layout | `Stack` | Common vertical layout (Flex column) |
| Layout | `Grid` | 2D layout capability |
| Layout | `Split` | 2-column split pattern |
| Layout | `Container` | Constrained width wrapper |

---

## Experience Layer Issues

### Behaviour Auto-Registration (CRITICAL)

**File:** `creativeshire/experience/behaviours/index.ts`

Only 5 behaviours are imported for auto-registration:
```typescript
import './contact-reveal'
import './scroll-fade'
import './scroll-fade-out'
import './modal'
import './reveal'
```

**MISSING imports (10+ behaviours not registered):**
- `fade-in/`
- `hover-reveal/`
- `project-card-hover/`
- `logo-marquee-animation/`
- `gallery-thumbnail-expand/`
- `scroll-background-slideshow/`
- `hero-text-color-transition/`
- `floating-contact-cta/`
- `scroll-indicator-fade/`
- `video-modal/`

### Behaviour Naming Violations (HIGH)

**Rule:** Behaviours named by TRIGGER (scroll, hover, visibility), NOT by effect or widget.

**13 out of 18 behaviours violate this rule:**

| Behaviour | Current Name | Problem | Suggested |
|-----------|-------------|---------|-----------|
| `fade-in` | fade-in | Named by EFFECT | `visibility/fade-in` |
| `scroll-fade` | scroll-fade | Named by EFFECT | `scroll/fade` |
| `scroll-fade-out` | scroll-fade-out | Named by EFFECT | `scroll/fade-out` |
| `hover-reveal` | hover-reveal | Named by EFFECT | `hover/reveal` |
| `contact-reveal` | contact-reveal | Widget-specific | `hover/reveal` (generalize) |
| `floating-contact-cta` | floating-contact-cta | Widget-specific | `hover/scale` (generalize) |
| `project-card-hover` | project-card-hover | Widget-specific | `hover/scale` (generalize) |
| `gallery-thumbnail-expand` | gallery-thumbnail-expand | Widget-specific | `hover/expand` (generalize) |
| `logo-marquee-animation` | logo-marquee-animation | Widget-specific | `animation/marquee` (generalize) |
| `scroll-indicator-fade` | scroll-indicator-fade | Widget-specific | `scroll/progress` (generalize) |
| `scroll-background-slideshow` | scroll-background-slideshow | Widget-specific | `scroll/image-cycle` (generalize) |
| `hero-text-color-transition` | hero-text-color-transition | Widget-specific | `scroll/color-shift` (generalize) |
| `video-modal` | video-modal | Widget-specific | Use `modal/*` behaviours |

### Widget-Specific Behaviours (Should Generalize or Colocate)

| Behaviour | Consuming Widget | Action |
|-----------|-----------------|--------|
| `scroll-indicator-fade` | ScrollIndicator widget | Colocate OR generalize to `scroll/progress` |
| `contact-reveal` | FloatingContact overlay | Merge with `hover-reveal` |
| `floating-contact-cta` | FloatingContact overlay | Generalize to `hover/scale` |
| `project-card-hover` | ProjectCard composite | Generalize to `hover/scale` |
| `gallery-thumbnail-expand` | GalleryThumbnail composite | Generalize to `hover/expand` |
| `logo-marquee-animation` | LogoMarquee widget | Generalize to `animation/marquee` |
| `hero-text-color-transition` | HeroTitle widget | Generalize to `scroll/color-shift` |
| `video-modal` | VideoModal overlay | Use existing `modal/*` behaviours |

### Hooks Colocation (Centralized Should Be Colocated)

| Hook | Current Location | Consumer | Move To |
|------|-----------------|----------|---------|
| `useVisibilityPlayback` | `experience/hooks/` | Video widget | `widgets/primitives/Video/` |
| `useScrollIndicatorFade` | `experience/hooks/` | SiteRenderer | `renderer/hooks/` |
| `useGsapReveal` | `experience/hooks/` | RevealTransition | `experience/transitions/` (already there) |
| `useScrollFadeBehaviour` | `experience/hooks/` | SectionRenderer | `experience/behaviours/scroll/` |
| `useTransitionComplete` | `experience/hooks/` | Modal | `chrome/overlays/Modal/` |

---

## Effects Layer (Mostly Correct)

Effects are correctly named by MECHANISM. Minor restructuring needed:

### Current Structure (Flat)
```
effects/
├── color-shift.css
├── contact-reveal.css     # Widget-specific → colocate
├── fade-reveal.css
├── marquee-scroll.css     # Widget-specific → colocate or keep
├── mask-reveal.css
├── modal-backdrop.css
├── modal-fade.css
├── modal-mask.css
├── modal-scale.css
├── overlay-darken.css
├── scale-hover.css
├── scale-reveal.css
├── text-reveal.css
├── thumbnail-expand.css   # Widget-specific → colocate
└── index.css
```

### Target Structure (Organized)
```
effects/
├── fade.css              # Merge: fade-reveal, modal-fade, modal-backdrop
├── transform/
│   ├── scale.css         # Merge: scale-reveal, scale-hover, modal-scale
│   └── slide.css         # Rename: text-reveal
├── mask/
│   ├── wipe.css          # Rename: modal-mask
│   └── reveal.css        # Keep: mask-reveal
├── color-shift.css       # Keep at root
├── overlay-darken.css    # Keep at root
└── index.css
```

### Widget-Specific Effects → Colocate
- `contact-reveal.css` → `composite/ContactPrompt/styles.css`
- `thumbnail-expand.css` → `composite/GalleryThumbnail/styles.css`
- `marquee-scroll.css` → Keep generic OR colocate with marquee widget

---

## Preset/Site Layer (Mostly Correct)

### Behaviour Mappings Use Widget-Specific Names

**File:** `creativeshire/presets/bojuhl/site.ts`

```typescript
behaviours: {
  HeroTitle: 'hero-text-color-transition',      // Widget-specific name
  ScrollIndicator: 'scroll-indicator-fade',     // Widget-specific name
  // ...
}
```

**After restructure:** Update to use trigger-based names:
```typescript
behaviours: {
  HeroTitle: 'scroll/color-shift',
  ScrollIndicator: 'scroll/progress',
  // ...
}
```

### Minor Hardcoded Styles

| File | Line | Content | Fix |
|------|------|---------|-----|
| `About/index.ts` | 188 | `backgroundColor: 'rgb(0, 0, 0)'` | Add to `AboutProps.backgroundColor` |
| `FeaturedProjects/index.ts` | 62 | `backgroundColor: '#fff'` | Add to `FeaturedProjectsProps.backgroundColor` |

---

# REFACTORING PHASES

## Phase 1: Widget Reclassification (Low Risk)

### 1.1 Move ContactPrompt
```
From: creativeshire/content/widgets/primitives/ContactPrompt/
To:   creativeshire/content/widgets/composite/ContactPrompt/
```
**Files to move:** `index.tsx`, `styles.css`, `types.ts`

### 1.2 Move LogoLink
```
From: creativeshire/content/widgets/primitives/LogoLink/
To:   creativeshire/content/widgets/composite/LogoLink/
```
**Files to move:** `index.tsx`, `styles.css`, `types.ts`

### 1.3 Move ExpandableGalleryRow
```
From: creativeshire/content/widgets/layout/ExpandableGalleryRow/
To:   creativeshire/content/widgets/composite/ExpandableGalleryRow/
```
**Files to move:** `index.tsx`, `styles.css`, `types.ts`

### 1.4 Update Registry
**File:** `creativeshire/content/widgets/registry.ts`

Change imports:
```typescript
// Before
import ContactPrompt from './primitives/ContactPrompt'
import LogoLink from './primitives/LogoLink'
import ExpandableGalleryRow from './layout/ExpandableGalleryRow'

// After
import ContactPrompt from './composite/ContactPrompt'
import LogoLink from './composite/LogoLink'
import ExpandableGalleryRow from './composite/ExpandableGalleryRow'
```

### 1.5 Update Barrel Exports
**File:** `creativeshire/content/widgets/composite/index.ts`

Add exports for moved widgets.

**Verify:** `npm run build` passes, site renders correctly

---

## Phase 2: Fix Behaviour Auto-Registration (CRITICAL)

**File:** `creativeshire/experience/behaviours/index.ts`

Add ALL missing imports:
```typescript
// Existing
import './contact-reveal'
import './scroll-fade'
import './scroll-fade-out'
import './modal'
import './reveal'

// ADD THESE
import './fade-in'
import './hover-reveal'
import './project-card-hover'
import './logo-marquee-animation'
import './gallery-thumbnail-expand'
import './scroll-background-slideshow'
import './hero-text-color-transition'
import './floating-contact-cta'
import './scroll-indicator-fade'
import './video-modal'
```

**Verify:** All behaviours resolve via `resolveBehaviour()`, no console errors

---

## Phase 3: Extract L1/L2 Violations (CRITICAL)

### 3.1 ContactPrompt Transitions → Effects

**From:** `widgets/composite/ContactPrompt/styles.css`
**To:** `experience/effects/contact-reveal.css` (already exists, merge if needed)

Remove these lines from widget CSS:
- Line 62: `transition: transform 500ms ease-in-out;`
- Line 72: `transition: transform 500ms ease-in-out;`
- Line 103: `transition: opacity 200ms ease-in-out;`
- Line 113: `transition: opacity 200ms ease-in-out;`

Add `data-effect="contact-reveal"` to widget markup.

### 3.2 ExpandableGalleryRow Transitions → Effects

**From:** `widgets/composite/ExpandableGalleryRow/styles.css`
**To:** `experience/effects/thumbnail-expand.css` (already exists, merge if needed)

Remove these lines from widget CSS:
- Line 41: `transition: opacity 300ms ease-out;`
- Line 56: `transition: opacity 300ms ease-out;`

Add `data-effect="thumbnail-expand"` to widget markup.

**Verify:** Animations still work via CSS variables + effects

---

## Phase 4: Hook Colocation (Medium Risk)

### 4.1 Move useVisibilityPlayback
```
From: creativeshire/experience/hooks/useVisibilityPlayback.ts
To:   creativeshire/content/widgets/primitives/Video/useVisibilityPlayback.ts
```
Update import in `Video/index.tsx`

### 4.2 Move useScrollIndicatorFade
```
From: creativeshire/experience/hooks/useScrollIndicatorFade.ts
To:   creativeshire/renderer/hooks/useScrollIndicatorFade.ts
```
Create `renderer/hooks/` folder if needed. Update import in `SiteRenderer.tsx`

### 4.3 Move useScrollFadeBehaviour
```
From: creativeshire/experience/hooks/useScrollFadeBehaviour.ts
To:   creativeshire/experience/behaviours/scroll/useScrollFadeBehaviour.ts
```
Update import in `SectionRenderer.tsx`

### 4.4 Move useTransitionComplete
```
From: creativeshire/experience/hooks/useTransitionComplete.ts
To:   creativeshire/content/chrome/overlays/Modal/useTransitionComplete.ts
```
Update import in `Modal/index.tsx`

### 4.5 Delete Hooks Folder
After all moves, delete `creativeshire/experience/hooks/`

**Verify:** All animations work, no import errors

---

## Phase 5: Behaviours Restructuring (Higher Risk)

### Target Folder Structure
```
behaviours/
├── scroll/
│   ├── fade.ts           # Renamed from scroll-fade
│   ├── fade-out.ts       # Renamed from scroll-fade-out
│   ├── progress.ts       # Generalized scroll-indicator-fade
│   ├── color-shift.ts    # Generalized hero-text-color-transition
│   ├── image-cycle.ts    # Generalized scroll-background-slideshow
│   └── useDriver.ts      # Moved useScrollFadeBehaviour
├── hover/
│   ├── reveal.ts         # Merged: contact-reveal, hover-reveal
│   ├── scale.ts          # Merged: floating-contact-cta, project-card-hover
│   └── expand.ts         # Generalized gallery-thumbnail-expand
├── visibility/
│   └── fade-in.ts        # Renamed from fade-in
├── animation/
│   └── marquee.ts        # Generalized logo-marquee-animation
├── modal/                # Keep as-is (well-structured)
│   ├── fade/
│   ├── mask-wipe/
│   └── scale/
├── reveal/               # Keep as-is (well-structured)
│   ├── fade-reveal/
│   ├── mask-reveal/
│   └── scale-reveal/
├── registry.ts
├── resolve.ts
├── types.ts
├── BehaviourWrapper.tsx
└── index.ts              # CRITICAL: barrel imports for auto-registration
```

### Behaviour ID Mapping (Preserve Compatibility)

Old IDs must still resolve. Update `resolveBehaviour()` with aliases:

```typescript
const BEHAVIOUR_ALIASES: Record<string, string> = {
  'scroll-fade': 'scroll/fade',
  'scroll-fade-out': 'scroll/fade-out',
  'fade-in': 'visibility/fade-in',
  'hover-reveal': 'hover/reveal',
  'contact-reveal': 'hover/reveal',
  'floating-contact-cta': 'hover/scale',
  'project-card-hover': 'hover/scale',
  'gallery-thumbnail-expand': 'hover/expand',
  'logo-marquee-animation': 'animation/marquee',
  'scroll-indicator-fade': 'scroll/progress',
  'hero-text-color-transition': 'scroll/color-shift',
  'scroll-background-slideshow': 'scroll/image-cycle',
}
```

**Verify:** All behaviours resolve via old AND new IDs

---

## Phase 6: Effects Restructuring (Medium Risk)

### Merge Similar Effects

**fade.css** (merge into):
- `fade-reveal.css`
- `modal-fade.css`
- `modal-backdrop.css`

**transform/scale.css** (merge into):
- `scale-reveal.css`
- `scale-hover.css`
- `modal-scale.css`

**transform/slide.css**:
- Rename `text-reveal.css`

**mask/wipe.css**:
- Rename `modal-mask.css`

**mask/reveal.css**:
- Keep `mask-reveal.css`

### Colocate Widget-Specific Effects

Move to widget folders:
- `contact-reveal.css` → `composite/ContactPrompt/effects.css`
- `thumbnail-expand.css` → `composite/GalleryThumbnail/effects.css`

### Update index.css
Import all reorganized effects.

**Verify:** All `data-effect` attributes resolve, animations work

---

## Phase 7: Preset Updates (After All Above)

### Update Behaviour Mappings

**File:** `creativeshire/presets/bojuhl/site.ts`

```typescript
// Before (widget-specific names)
behaviours: {
  HeroTitle: 'hero-text-color-transition',
  ScrollIndicator: 'scroll-indicator-fade',
  ContactPrompt: 'contact-reveal',
  // ...
}

// After (trigger-based names)
behaviours: {
  HeroTitle: 'scroll/color-shift',
  ScrollIndicator: 'scroll/progress',
  ContactPrompt: 'hover/reveal',
  // ...
}
```

---

## Phase 8: Optional Improvements

### Add Missing Primitives
- `Icon` widget (wrap SVG rendering)
- `Button` widget (interactive primitive)

### Add Missing Layouts
- `Stack` (vertical Flex)
- `Grid` (2D layout)
- `Split` (2-column)
- `Container` (max-width wrapper)

### Make Styles Configurable
- `About/index.ts`: Add `backgroundColor` to props
- `FeaturedProjects/index.ts`: Add `backgroundColor` to props

---

# CRITICAL FILES

| File | Why Critical |
|------|-------------|
| `creativeshire/content/widgets/registry.ts` | All widget moves update this |
| `creativeshire/experience/behaviours/index.ts` | Barrel imports for auto-registration |
| `creativeshire/experience/behaviours/resolve.ts` | Behaviour lookup + aliases |
| `creativeshire/experience/effects/index.css` | CSS imports for effects |
| `creativeshire/renderer/SectionRenderer.tsx` | Uses scroll behaviours |
| `creativeshire/content/chrome/overlays/Modal/index.tsx` | Uses transitions |
| `creativeshire/presets/bojuhl/site.ts` | Behaviour mappings |

---

# VERIFICATION CHECKLIST (Per Phase)

1. **Build:** `npm run build` passes
2. **Type check:** `npx tsc --noEmit` passes
3. **Visual check in browser:**
   - [ ] Hero section renders with video
   - [ ] Scroll-fade animations work (sections fade in/out)
   - [ ] Hover effects work (contact, logo, project cards)
   - [ ] Modal opens with wipe/expand/fade animation
   - [ ] Modal closes with reverse animation
   - [ ] Footer renders correctly
   - [ ] Gallery expands on hover
   - [ ] Marquee scrolls continuously
4. **Console:** No errors, no warnings about missing behaviours

---

# EXECUTION ORDER

```
Phase 1 (Widget Moves)
    ↓
Phase 2 (Fix Auto-Registration) ← CRITICAL FIRST
    ↓
Phase 3 (Extract L1/L2 Violations)
    ↓
Phase 4 (Hook Colocation)
    ↓
Phase 5 (Behaviours Restructure) ← HIGHEST RISK
    ↓
Phase 6 (Effects Restructure)
    ↓
Phase 7 (Preset Updates)
    ↓
Phase 8 (Optional Improvements)
```

**Each phase = one git commit.** Rollback: `git revert <phase-commit>`

---

# NOTES FOR FUTURE AGENTS

1. **Behaviour auto-registration:** Behaviours register themselves when imported. The `behaviours/index.ts` barrel file MUST import all behaviour modules or they won't work.

2. **CSS variable bridge:** L1 (content) and L2 (experience) communicate ONLY via CSS variables. Never directly couple them. Widgets READ variables, behaviours WRITE them.

3. **GSAP as Driver pattern:** `useScrollFadeBehaviour` bypasses React, sets CSS vars directly via `element.style.setProperty()` for 60fps performance.

4. **Reduced motion:** All behaviours check `state.prefersReducedMotion`. Respect this.

5. **Behaviour aliases:** When restructuring, add aliases to `resolveBehaviour()` so old IDs still work. This prevents breaking presets.

6. **Widget CSS rule:** Widgets define WHAT is visible (opacity, transform initial values). Effects define HOW it transitions. Never put `transition:` in widget CSS.

7. **Testing animations:** Browser tools can only capture static snapshots. Test animations by running the dev server and interacting manually.
