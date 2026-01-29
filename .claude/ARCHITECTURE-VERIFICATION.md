# Creativeshire Architecture Verification Workbook

> **Purpose:** Trackable structure for verifying every file follows our SOLID architecture.
> **Method:** Agents add findings progressively → Issues collected → Implementation at end.

---

## HOW TO USE THIS DOCUMENT

1. **Agents verify files** → Add findings to relevant section
2. **Mark status** → `[ ]` pending, `[x]` verified, `[!]` issue found
3. **Issues go to FINDINGS** → With file path + description
4. **Implementation tasks** → Generated from findings at end

---

## VERIFICATION STATUS

| Phase | Status | Agent |
|-------|--------|-------|
| 1. Presets (bojuhl) | `[x] Complete` | agent:a6a3bb6 |
| 2. Schema | `[ ] Not started` | |
| 3. Content - Primitives | `[ ] Not started` | |
| 4. Content - Layout | `[ ] Not started` | |
| 5. Content - Composite | `[ ] Not started` | |
| 6. Content - Sections | `[ ] Not started` | |
| 7. Content - Chrome | `[ ] Not started` | |
| 8. Experience - Behaviours | `[ ] Not started` | |
| 9. Experience - Effects | `[ ] Not started` | |
| 10. Experience - Drivers | `[ ] Not started` | |
| 11. Experience - Triggers | `[ ] Not started` | |
| 12. Experience - Modes | `[ ] Not started` | |
| 13. Renderer | `[ ] Not started` | |

---

## ARCHITECTURE RULES (Reference)

### L1/L2 Separation
- L1 Content renders once
- L2 Experience animates at 60fps
- Communication via CSS variables ONLY

### Naming Conventions
- Behaviours: Named by TRIGGER (`scroll/`, `hover/`, `visibility/`)
- Effects: Named by MECHANISM (`fade`, `transform/`, `mask/`)

### Layer Responsibilities
| Layer | Rule |
|-------|------|
| Primitives | Atomic, no children, single purpose |
| Layout | Structure containers, accepts children |
| Composite | Pre-assembled trees, can have local state |
| Sections | Factory functions, configurable patterns |
| Chrome | Persistent UI (regions + overlays) |
| Behaviours | Trigger → CSS variable value |
| Effects | CSS variable → visual animation |
| Drivers | Apply CSS variables to DOM |
| Triggers | Events → state updates |
| Modes | Bundled configurations |

### Other Rules
- **Colocation:** Hooks/stores live WITH consumers
- **No Aliases:** Delete old, use canonical names
- **Generalization:** No site-specific names

---

## PHASE 1: PRESETS (Starting Point)

### `presets/bojuhl/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Barrel export aggregating site, chrome, pages | Verified - exports named constant, bundles correctly |
| [x] | `site.ts` | Experience mode + behaviour defaults config | Verified - all 4 behaviours exist, naming correct |
| [x] | `chrome/index.ts` | Barrel for chrome configs | Verified - direct imports |
| [!] | `chrome/footer.ts` | Footer region config (PresetRegionConfig) | Uses component-based (legacy) instead of widget-based (preferred) |
| [x] | `chrome/floating-contact.ts` | Overlay config (PresetOverlayConfig) | Verified - uses widget-based approach |
| [x] | `pages/index.ts` | Barrel for page templates | Verified - direct path imports |
| [x] | `pages/home.ts` | Page assembly using section factories | Verified - 4 section patterns, placeholders correct |

### `presets/` Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Barrel exports | Verified - exports bojuhlPreset and types |
| [x] | `types.ts` | Preset type definitions | Verified - SitePreset, PresetExperienceConfig, PresetChromeConfig |

---

## PHASE 2: SCHEMA

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Barrel exports | |
| [ ] | `types.ts` | Base schema types | |
| [ ] | `site.ts` | SiteSchema definition | |
| [ ] | `page.ts` | PageSchema definition | |
| [ ] | `section.ts` | SectionSchema definition | |
| [ ] | `widget.ts` | WidgetSchema definition | |
| [ ] | `chrome.ts` | ChromeSchema definition | |
| [ ] | `experience.ts` | ExperienceSchema definition | |
| [ ] | `theme.ts` | ThemeSchema definition | |

---

## PHASE 3: CONTENT - PRIMITIVES

**Rule:** Atomic, no children, single purpose

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `widgets/index.ts` | Barrel exports | |
| [ ] | `widgets/types.ts` | Widget type definitions | |
| [ ] | `widgets/registry.ts` | Widget registry | |

### `primitives/Button/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Clickable element, no children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Visual styles | |

### `primitives/Icon/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | SVG display, no children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Visual styles | |

### `primitives/Image/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Image display, no children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Visual styles | |

### `primitives/Text/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Typography, no children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Visual styles | |

---

## PHASE 4: CONTENT - LAYOUT

**Rule:** Structure containers, accepts children, defines positioning

### `layout/Box/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Generic container with children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Layout styles | |

### `layout/Container/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Max-width centered, children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Layout styles | |

### `layout/Flex/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Flexbox container, children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Layout styles | |

### `layout/Grid/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | CSS Grid container, children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Layout styles | |

### `layout/Split/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Two-panel layout, children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Layout styles | |

### `layout/Stack/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Vertical stacking, children | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Layout styles | |

---

## PHASE 5: CONTENT - COMPOSITE

**Rule:** Pre-assembled widget trees, can have local state, colocate hooks

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `composite/index.ts` | Barrel exports | |

### `composite/ContactPrompt/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Contact CTA composite | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Styles | |

### `composite/ExpandableGalleryRow/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Expanding gallery row | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Styles | |

### `composite/GalleryThumbnail/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Gallery item thumbnail | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Styles | |

### `composite/LogoLink/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Logo with link | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Styles | |

### `composite/ProjectCard/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Project card factory | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Styles | |

### `composite/Video/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Video with auto-play | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Styles | |
| [ ] | `useVisibilityPlayback.ts` | Colocated hook | |

### `composite/VideoPlayer/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Full video player | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Styles | |
| [ ] | `hooks/index.ts` | Hook barrel | |
| [ ] | `hooks/usePlaybackPosition.ts` | Colocated hook | |
| [ ] | `hooks/useVideoControls.ts` | Colocated hook | |

---

## PHASE 6: CONTENT - SECTIONS

**Rule:** Factory functions, configurable patterns, build from primitives/layouts/composites

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `sections/index.ts` | Barrel exports | |
| [ ] | `sections/types.ts` | Section type definitions | |
| [ ] | `sections/styles.css` | Base section styles | |
| [ ] | `sections/Section.tsx` | Base Section component | |

### `sections/patterns/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `patterns/index.ts` | Barrel exports (factories) | |

### `sections/patterns/About/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | About section factory | |
| [ ] | `types.ts` | About config types | |

### `sections/patterns/Hero/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Hero section factory | |
| [ ] | `types.ts` | Hero config types | |

### `sections/patterns/FeaturedProjects/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | FeaturedProjects factory | |
| [ ] | `types.ts` | FeaturedProjects types | |

### `sections/patterns/OtherProjects/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | OtherProjects factory | |
| [ ] | `types.ts` | OtherProjects types | |

---

## PHASE 7: CONTENT - CHROME

**Rule:** Persistent UI, regions (fixed) + overlays (floating)

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `chrome/index.ts` | Barrel exports | |
| [ ] | `chrome/types.ts` | Chrome type definitions | |
| [ ] | `chrome/registry.ts` | Chrome component registry | |

### `chrome/regions/Footer/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Footer region component | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `styles.css` | Styles | |

### `chrome/overlays/CursorLabel/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Cursor follower label | |
| [ ] | `styles.css` | Styles | |

### `chrome/overlays/Modal/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.tsx` | Modal overlay component | |
| [ ] | `types.ts` | Props interface | |
| [ ] | `store.ts` | Colocated modal state | |
| [ ] | `styles.css` | Styles | |
| [ ] | `ModalRoot.tsx` | Portal root | |
| [ ] | `useSmoothModalScroll.ts` | Colocated hook | |
| [ ] | `useTransitionComplete.ts` | Colocated hook | |

---

## PHASE 8: EXPERIENCE - BEHAVIOURS

**Rule:** Named by TRIGGER, output CSS variable VALUE, know nothing about effects

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `behaviours/index.ts` | Barrel exports | |
| [ ] | `behaviours/types.ts` | Behaviour type definitions | |
| [ ] | `behaviours/registry.ts` | Behaviour registry | |
| [ ] | `behaviours/resolve.ts` | Resolution logic | |
| [ ] | `behaviours/BehaviourWrapper.tsx` | Applies behaviours to children | |

### `behaviours/animation/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Barrel | |
| [ ] | `marquee.ts` | Marquee animation behaviour | |

### `behaviours/hover/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Barrel | |
| [ ] | `expand.ts` | Hover expand (sets --hover) | |
| [ ] | `scale.ts` | Hover scale (sets --hover) | |
| [ ] | `reveal.ts` | Hover reveal (sets --hover) | |

### `behaviours/scroll/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Barrel | |
| [ ] | `color-shift.ts` | Scroll color shift (sets --scroll) | |
| [ ] | `fade.ts` | Scroll fade in (sets --scroll) | |
| [ ] | `fade-out.ts` | Scroll fade out (sets --scroll) | |
| [ ] | `image-cycle.ts` | Scroll image cycling (sets --scroll) | |
| [ ] | `progress.ts` | Scroll progress (sets --scroll) | |

### `behaviours/visibility/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Barrel | |
| [ ] | `fade-in.ts` | Visibility fade in (sets --visible) | |

---

## PHASE 9: EXPERIENCE - EFFECTS

**Rule:** Named by MECHANISM, respond to CSS variable changes, generic/reusable

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `effects/index.css` | Effect imports | |

### Root Effects

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `fade.css` | Opacity transitions | |
| [ ] | `color-shift.css` | Color transitions | |
| [ ] | `marquee-scroll.css` | Marquee animation | |
| [ ] | `overlay-darken.css` | Overlay darkening | |

### `effects/mask/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Barrel | |
| [ ] | `wipe.css` | Wipe mask effect | |
| [ ] | `reveal.css` | Reveal mask effect | |
| [ ] | `RevealTransition.tsx` | Reveal component | |
| [ ] | `useGsapReveal.ts` | GSAP reveal hook | |

### `effects/transform/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `slide.css` | Slide transform | |
| [ ] | `scale.css` | Scale transform | |

---

## PHASE 10: EXPERIENCE - DRIVERS

**Rule:** Connect behaviour outputs to DOM, handle platform-specific updates

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `drivers/index.ts` | Barrel exports | |
| [ ] | `drivers/types.ts` | Driver type definitions | |
| [ ] | `drivers/useScrollFadeDriver.ts` | Scroll fade driver | |

---

## PHASE 11: EXPERIENCE - TRIGGERS

**Rule:** Connect DOM events to state, feed data to behaviours

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `triggers/index.ts` | Barrel exports | |
| [ ] | `triggers/types.ts` | Trigger type definitions | |
| [ ] | `triggers/useIntersection.ts` | IntersectionObserver | |
| [ ] | `triggers/usePrefersReducedMotion.ts` | Motion preference | |
| [ ] | `triggers/useScrollProgress.ts` | Scroll progress | |
| [ ] | `triggers/useViewport.ts` | Viewport size | |

---

## PHASE 12: EXPERIENCE - MODES

**Rule:** Bundle behaviours + effects, site-wide or section-specific

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `modes/index.ts` | Barrel exports | |
| [ ] | `modes/types.ts` | Mode type definitions | |
| [ ] | `modes/registry.ts` | Mode registry | |
| [ ] | `modes/stacking/index.ts` | Stacking mode | |

---

## PHASE 13: RENDERER

**Rule:** Declarative config → React tree, Site → Page → Section → Widget

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `index.ts` | Barrel exports | |
| [ ] | `types.ts` | Renderer type definitions | |
| [ ] | `chrome.css` | Chrome base styles | |
| [ ] | `ChromeRenderer.tsx` | Renders chrome | |
| [ ] | `ErrorBoundary.tsx` | Error boundary | |
| [ ] | `PageRenderer.tsx` | Renders page | |
| [ ] | `SectionRenderer.tsx` | Renders sections | |
| [ ] | `SiteRenderer.tsx` | Top-level renderer | |
| [ ] | `ThemeProvider.tsx` | Theme context | |
| [ ] | `WidgetRenderer.tsx` | Renders widgets | |
| [ ] | `hooks/index.ts` | Hook barrel | |
| [ ] | `hooks/useScrollIndicatorFade.ts` | Colocated hook | |

---

## EXPERIENCE ROOT

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [ ] | `experience/index.ts` | Barrel exports | |
| [ ] | `experience/types.ts` | Experience type defs | |
| [ ] | `experience/ExperienceProvider.tsx` | Context provider | |
| [ ] | `experience/SmoothScrollProvider.tsx` | Lenis scroll | |
| [ ] | `experience/TriggerInitializer.tsx` | Initialize triggers | |

---

## FINDINGS LOG

> Agents add issues here as discovered during verification

### Critical Issues (Architecture Violations)

| File | Issue | Impact |
|------|-------|--------|
| | | |

### Naming Issues

| File | Current | Should Be |
|------|---------|-----------|
| | | |

### Layer Violations

| File | Current Layer | Correct Layer | Reason |
|------|---------------|---------------|--------|
| `presets/bojuhl/chrome/footer.ts` | Component-based approach | Widget-based approach | Spec says widget-based is preferred for composability |

### Missing Files

| Expected Location | Purpose |
|-------------------|---------|
| | |

### Duplicate/Redundant Code

| Files | Duplication |
|-------|-------------|
| | |

### Colocation Violations

| File | Should Be Colocated With |
|------|--------------------------|
| | |

---

## IMPLEMENTATION TASKS

> Generated from findings after verification complete

### Priority 1: Critical Fixes

| Task | Files | Description |
|------|-------|-------------|
| | | |

### Priority 2: Refactoring

| Task | Files | Description |
|------|-------|-------------|
| | | |

### Priority 3: Cleanup

| Task | Files | Description |
|------|-------|-------------|
| | | |

---

## SUMMARY

| Metric | Value |
|--------|-------|
| Total Files | ~164 |
| Verified | 0 |
| Issues Found | 0 |
| Tasks Generated | 0 |
