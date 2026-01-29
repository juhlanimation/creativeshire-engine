# Refactoring Plan: Creativeshire Engine Architecture

## Goal
Align the codebase with the documented architecture while keeping everything working.

**Related docs:**
- [ARCHITECTURE-AUDIT.md](.claude/ARCHITECTURE-AUDIT.md) - Issues found
- [CLAUDE.md](CLAUDE.md) - Target architecture

---

## Phase 1: Widget Reclassification (Low Risk)
Simple file moves with import updates. No logic changes.

### 1.1 Move ContactPrompt
- **From:** `creativeshire/content/widgets/primitives/ContactPrompt/`
- **To:** `creativeshire/content/widgets/composite/ContactPrompt/`
- **Reason:** Has icons, state machine, multiple elements - not atomic
- **Update:**
  - `creativeshire/content/widgets/registry.ts`
  - `creativeshire/content/widgets/composite/index.ts`

### 1.2 Move LogoLink
- **From:** `creativeshire/content/widgets/primitives/LogoLink/`
- **To:** `creativeshire/content/widgets/composite/LogoLink/`
- **Reason:** Combines image/text with link - composition pattern
- **Update:**
  - `creativeshire/content/widgets/registry.ts`
  - `creativeshire/content/widgets/composite/index.ts`

### 1.3 Move ExpandableGalleryRow
- **From:** `creativeshire/content/widgets/layout/ExpandableGalleryRow/`
- **To:** `creativeshire/content/widgets/composite/ExpandableGalleryRow/`
- **Reason:** Has state, modal integration, content - not pure layout
- **Update:**
  - `creativeshire/content/widgets/registry.ts`
  - `creativeshire/content/widgets/composite/index.ts`

**Verify:** `npm run build` passes, all components render correctly

---

## Phase 2: Hook Colocation (Low-Medium Risk)
Delete `experience/hooks/` by colocating hooks with their consumers.

| Hook | Current Location | Move To | Consumer |
|------|-----------------|---------|----------|
| `useVisibilityPlayback` | `experience/hooks/` | `content/widgets/primitives/Video/` | Video widget |
| `useScrollIndicatorFade` | `experience/hooks/` | `renderer/hooks/` | SiteRenderer |
| `useGsapReveal` | `experience/hooks/` | `experience/transitions/` | RevealTransition |
| `useScrollFadeBehaviour` | `experience/hooks/` | `experience/behaviours/scroll/` | SectionRenderer |
| `useTransitionComplete` | `experience/hooks/` | `content/chrome/overlays/Modal/` | Modal |

Then delete `experience/hooks/` folder entirely.

**Verify:** All animations work, no import errors

---

## Phase 3: Effects Restructuring (Medium Risk)
Organize effects by visual mechanism instead of flat files.

### Current State (flat)
```
effects/
├── color-shift.css
├── contact-reveal.css     # Widget-specific
├── fade-reveal.css
├── marquee-scroll.css     # Widget-specific
├── mask-reveal.css
├── modal-backdrop.css
├── modal-fade.css
├── modal-mask.css
├── modal-scale.css
├── overlay-darken.css
├── scale-hover.css
├── scale-reveal.css
├── text-reveal.css
├── thumbnail-expand.css   # Widget-specific
└── index.css
```

### Target Structure
```
effects/
├── fade.css              # Opacity (merge: fade-reveal, modal-fade, modal-backdrop)
├── transform/
│   ├── scale.css         # Merge: scale-reveal, scale-hover, modal-scale
│   └── slide.css         # Rename: text-reveal (Y-axis transform)
├── mask/
│   ├── wipe.css          # Rename: modal-mask
│   └── reveal.css        # Move: mask-reveal
├── color-shift.css       # Keep at root (unique effect)
├── overlay-darken.css    # Keep or merge into fade.css
└── index.css
```

### Widget-specific effects → Colocate with widget
- `contact-reveal.css` → `composite/ContactPrompt/styles.css` (merge)
- `thumbnail-expand.css` → `composite/GalleryThumbnail/styles.css` (merge)
- `marquee-scroll.css` → Keep generic or colocate with marquee widget

**Verify:** All `data-effect` attributes resolve, animations work

---

## Phase 4: Transitions Merge (Medium Risk)
Move `experience/transitions/` into `effects/mask/` since RevealTransition uses clip-path animations.

### Steps
1. Move `RevealTransition.tsx` to `experience/effects/mask/RevealTransition.tsx`
2. Move `useGsapReveal.ts` to `experience/effects/mask/useGsapReveal.ts`
3. Update `experience/index.ts` exports
4. Update Modal component imports
5. Delete `experience/transitions/` folder

**Verify:** Modal wipe/expand/fade animations work

---

## Phase 5: Behaviours Restructuring (Higher Risk)
Reorganize by trigger type, not effect type.

### Current State (mixed naming)
```
behaviours/
├── contact-reveal/              # Named by widget
├── fade-in/                     # Named by effect
├── floating-contact-cta/        # Named by widget
├── gallery-thumbnail-expand/    # Named by widget
├── hero-text-color-transition/  # Named by widget
├── hover-reveal/                # OK - trigger based
├── logo-marquee-animation/      # Named by widget
├── modal/                       # OK - grouped
├── project-card-hover/          # Named by widget
├── reveal/                      # Named by effect
├── scroll-fade/                 # Mixed (trigger + effect)
├── scroll-fade-out/             # Mixed
├── scroll-indicator-fade/       # Named by widget
└── video-modal/                 # Named by widget
```

### Target Structure
```
behaviours/
├── scroll/                      # Scroll-based triggers
│   ├── fade-in.ts              # Renamed from scroll-fade
│   ├── fade-out.ts             # Renamed from scroll-fade-out
│   ├── progress.ts             # Generic scroll progress (0-1)
│   └── useDriver.ts            # useScrollFadeBehaviour
├── hover/                       # Hover-based triggers
│   ├── reveal.ts               # Merged: contact-reveal, hover-reveal
│   └── scale.ts                # Generic hover scale
├── visibility/                  # IntersectionObserver triggers
│   └── in-view.ts              # Generic visibility (--visible: 0|1)
├── modal/                       # Keep grouped (complex, interdependent)
│   ├── fade/
│   ├── mask-wipe/
│   └── scale/
├── reveal/                      # Keep grouped (animation patterns)
│   ├── fade-reveal/
│   ├── mask-reveal/
│   └── scale-reveal/
├── registry.ts
├── resolve.ts
├── types.ts
├── BehaviourWrapper.tsx
└── index.ts                     # CRITICAL: barrel imports for auto-registration
```

**Critical:** Behaviour IDs must stay the same to avoid breaking presets.
Map old IDs to new locations in registry if needed.

**Verify:** All behaviours auto-register, `resolveBehaviour()` works, animations work

---

## Phase 6: Legacy Cleanup (Optional, Lower Priority)
Generalize widget-specific behaviours to use generic ones with options.

| Widget-Specific | Replace With |
|-----------------|--------------|
| `floating-contact-cta` | `hover/reveal` with options |
| `gallery-thumbnail-expand` | `hover/reveal` with options |
| `hero-text-color-transition` | `scroll/progress` with color interpolation |
| `logo-marquee-animation` | CSS animation or `scroll/velocity` |
| `project-card-hover` | `hover/reveal` with options |
| `scroll-indicator-fade` | `scroll/progress` |
| `video-modal` | `modal/*` behaviours |

**Note:** Requires updating preset configurations to pass options.

---

## Execution Order
```
Phase 1 (Widgets)
    ↓
Phase 2 (Hooks)
    ↓
Phase 3 + 4 (Effects + Transitions)
    ↓
Phase 5 (Behaviours)
    ↓
Phase 6 (Cleanup) - Optional
```

**Each phase = one git commit.** Rollback: `git revert <phase-commit>`

---

## Critical Files

| File | Why Critical |
|------|-------------|
| `creativeshire/content/widgets/registry.ts` | All widget moves update this |
| `creativeshire/experience/behaviours/index.ts` | Barrel imports for auto-registration |
| `creativeshire/experience/effects/index.css` | CSS imports for effects |
| `creativeshire/renderer/SectionRenderer.tsx` | Uses scroll behaviours |
| `creativeshire/content/chrome/overlays/Modal/index.tsx` | Uses transitions |

---

## Verification Checklist (Per Phase)

1. **Build:** `npm run build` passes
2. **Type check:** No TypeScript errors
3. **Visual check in browser:**
   - [ ] Hero section renders with video
   - [ ] Scroll-fade animations work (sections fade in/out)
   - [ ] Hover effects work (contact, logo, cards)
   - [ ] Modal opens with wipe/expand animation
   - [ ] Modal closes with reverse animation
   - [ ] Footer renders correctly
   - [ ] Other Projects gallery expands on hover
4. **Console:** No errors

---

## Notes for Future Agents

- **Behaviour auto-registration:** Behaviours register themselves when their module is imported. The `behaviours/index.ts` barrel file must import all behaviour modules.
- **CSS variable bridge:** L1 (content) and L2 (experience) communicate ONLY via CSS variables. Never directly couple them.
- **GSAP as Driver pattern:** `useScrollFadeBehaviour` bypasses React, sets CSS vars directly via `element.style.setProperty()` for 60fps performance.
- **Reduced motion:** All behaviours check `state.prefersReducedMotion`. Respect this.
