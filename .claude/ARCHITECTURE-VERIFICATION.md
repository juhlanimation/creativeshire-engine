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
| 2. Schema | `[x] Complete` | agent:a5e0dd5 |
| 3. Content - Primitives | `[x] Complete` | agent:ae0cd9f |
| 4. Content - Layout | `[x] Complete` | agent:aca84b9 |
| 5. Content - Composite | `[x] Complete` | agent:a91aa4b |
| 6. Content - Sections | `[x] Complete` | agent:ae0ecfb |
| 7. Content - Chrome | `[x] Complete` | agent:aa7b299 |
| 8. Experience - Behaviours | `[x] Complete` | agent:aed01f2 |
| 9. Experience - Effects | `[x] Complete` | agent:ad02457 |
| 10. Experience - Drivers | `[x] Complete` | agent:a0254df |
| 11. Experience - Triggers | `[x] Complete` | agent:ae2bc61 |
| 12. Experience - Modes | `[x] Complete` | agent:a3f8fde |
| 13. Renderer | `[x] Complete` | agent:af5c2ae |

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
| [!] | `index.ts` | Barrel exports | Missing ModeDefaults export; 22+ types vs spec's 14-type minimal list |
| [x] | `types.ts` | Base schema types | Verified - SerializableValue correctly defined |
| [!] | `site.ts` | SiteSchema definition | ModeDefaults interface not defined (required by spec) |
| [x] | `page.ts` | PageSchema definition | Verified - correct structure |
| [x] | `section.ts` | SectionSchema definition | Verified - correct structure |
| [x] | `widget.ts` | WidgetSchema definition | Verified - correct structure |
| [!] | `chrome.ts` | ChromeSchema definition | TriggerCondition uses flat structure, spec requires discriminated union |
| [x] | `experience.ts` | ExperienceSchema definition | Verified - correct structure |
| [?] | `theme.ts` | ThemeSchema definition | Not in canonical specs - unclear if intentional extension |

---

## PHASE 3: CONTENT - PRIMITIVES

**Rule:** Atomic, no children, single purpose

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `widgets/index.ts` | Barrel exports | Verified - correct documentation |
| [x] | `widgets/types.ts` | Widget type definitions | Verified - WidgetBaseProps correct |
| [x] | `widgets/registry.ts` | Widget registry | Verified - correct mapping |

### `primitives/Button/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Clickable element, no children | onClick prop breaks RSC serialization |
| [!] | `types.ts` | Props interface | MouseEventHandler type incompatible with RSC |
| [!] | `styles.css` | Visual styles | Missing :focus-visible; calc(var(--y)) violates rule 19 |

### `primitives/Icon/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | SVG display, no children | computedStyle inline object; always aria-hidden (no semantic option) |
| [x] | `types.ts` | Props interface | Verified - correct structure |
| [!] | `styles.css` | Visual styles | calc(var(--y)) violates rule 19 |

### `primitives/Image/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Image display, no children | computedStyle inline object without useMemo |
| [x] | `types.ts` | Props interface | Verified - good accessibility with decorative prop |
| [!] | `styles.css` | Visual styles | calc(var(--y)) violates rule 19 |

### `primitives/Text/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Typography, no children | computedClassName inline without memoization |
| [x] | `types.ts` | Props interface | Verified - semantic variants |
| [!] | `styles.css` | Visual styles | calc(var(--y)) violates rule 19 |

### Missing Primitives

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `primitives/Link/` | Link primitive | NOT IMPLEMENTED - required per architecture |
| [!] | `primitives/Video/` | Video primitive | NOT IMPLEMENTED - required per architecture |

---

## PHASE 4: CONTENT - LAYOUT

**Rule:** Structure containers, accepts widgets array, renders via WidgetRenderer

### `layout/Box/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Schema-driven with widgets array | Uses React children instead of widgets array |
| [!] | `types.ts` | Props with widgets?: WidgetSchema[] | Uses children?: ReactNode (spec violation) |
| [x] | `styles.css` | Layout styles | Verified - correct CSS variables |

### `layout/Container/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Schema-driven with widgets array | Uses React children instead of widgets array |
| [!] | `types.ts` | Props with widgets?: WidgetSchema[] | Uses children?: ReactNode (spec violation) |
| [x] | `styles.css` | Layout styles | Verified - correct CSS variables |

### `layout/Flex/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Schema-driven with widgets array | Uses React children instead of widgets array |
| [!] | `types.ts` | Props with widgets?: WidgetSchema[] | Uses children?: ReactNode (spec violation) |
| [x] | `styles.css` | Layout styles | Verified - correct CSS variables |

### `layout/Grid/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Schema-driven with widgets array | Uses React children instead of widgets array |
| [!] | `types.ts` | Props with widgets?: WidgetSchema[] | Uses children?: ReactNode (spec violation) |
| [x] | `styles.css` | Layout styles | Verified - correct CSS variables |

### `layout/Split/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Schema-driven with widgets array | Uses React children instead of widgets array |
| [!] | `types.ts` | Props with widgets?: WidgetSchema[] | Uses children?: ReactNode (spec violation) |
| [x] | `styles.css` | Layout styles | Verified - correct CSS variables |

### `layout/Stack/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Schema-driven with widgets array | Uses React children instead of widgets array |
| [!] | `types.ts` | Props with widgets?: WidgetSchema[] | Uses children?: ReactNode (spec violation) |
| [x] | `styles.css` | Layout styles | Verified - correct CSS variables |

---

## PHASE 5: CONTENT - COMPOSITE

**Rule:** Factory functions return WidgetSchema OR components with colocated hooks; NO CSS files per spec

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `composite/index.ts` | Barrel exports | Verified - exports factories and components |

### `composite/ContactPrompt/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.tsx` | Contact CTA composite | Verified - proper component |
| [x] | `types.ts` | Props interface | Verified |
| [!] | `styles.css` | Should NOT exist | CSS file present (spec says no CSS files in composites) |

### `composite/ExpandableGalleryRow/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.tsx` | Expanding gallery row | Verified |
| [x] | `types.ts` | Props interface | Verified |
| [!] | `styles.css` | Should NOT exist | CSS file present (spec violation) |

### `composite/GalleryThumbnail/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.tsx` | Gallery item thumbnail | Verified |
| [x] | `types.ts` | Props interface | Verified |
| [!] | `styles.css` | Should NOT exist | CSS file present (spec violation) |

### `composite/LogoLink/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Logo link factory | FIXED (TASK-030) - Converted to factory function returning WidgetSchema |
| [x] | `types.ts` | Config interface | FIXED - Renamed to LogoLinkConfig for factory pattern |
| [x] | N/A | No styles.css | FIXED (TASK-033) - CSS moved to composite/styles/logo-link.css |

### `composite/ProjectCard/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Project card factory | Verified - returns WidgetSchema |
| [x] | `types.ts` | Props interface | Verified |
| [x] | N/A | No styles.css | FIXED (TASK-033) - CSS moved to composite/styles/project-card.css |

### `composite/Video/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Video with auto-play | Imports L2 hook useVisibilityPlayback (layer violation) |
| [x] | `types.ts` | Props interface | Verified |
| [!] | `styles.css` | Should NOT exist | CSS file present (spec violation) |
| [x] | `useVisibilityPlayback.ts` | Colocated hook | FIXED: Removed L2 label - is component-specific (no store/CSS vars) |

### `composite/VideoPlayer/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.tsx` | Full video player | Verified |
| [x] | `types.ts` | Props interface | Verified |
| [!] | `styles.css` | Should NOT exist | CSS file present (spec violation) |
| [x] | `hooks/index.ts` | Hook barrel | Verified - properly colocated |
| [x] | `hooks/usePlaybackPosition.ts` | Colocated hook | Verified |
| [x] | `hooks/useVideoControls.ts` | Colocated hook | Verified |

---

## PHASE 6: CONTENT - SECTIONS

**Rule:** Factory functions, configurable patterns, build from primitives/layouts/composites

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `sections/index.ts` | Barrel exports | Verified |
| [x] | `sections/types.ts` | Section type definitions | Verified |
| [!] | `sections/styles.css` | Base section styles | CRITICAL: Contains 100svh, position:absolute, site-specific Bojuhl CSS |
| [x] | `sections/Section.tsx` | Base Section component | Verified - minor design notes |

### `sections/patterns/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `patterns/index.ts` | Barrel exports (factories) | Verified |

### `sections/patterns/About/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | About section factory | Verified - minor type cast workaround |
| [x] | `types.ts` | About config types | Verified |

### `sections/patterns/Hero/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Hero section factory | Verified - correct factory pattern |
| [x] | `types.ts` | Hero config types | Verified |

### `sections/patterns/FeaturedProjects/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | FeaturedProjects factory | Verified |
| [x] | `types.ts` | FeaturedProjects types | Verified |

### `sections/patterns/OtherProjects/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | OtherProjects factory | Verified - minor type cast |
| [x] | `types.ts` | OtherProjects types | Verified |

---

## PHASE 7: CONTENT - CHROME

**Rule:** Persistent UI, regions (fixed) + overlays (floating)

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `chrome/index.ts` | Barrel exports | Verified |
| [x] | `chrome/types.ts` | Chrome type definitions | Verified |
| [x] | `chrome/registry.ts` | Chrome component registry | Verified |

### `chrome/regions/Footer/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.tsx` | Footer region component | Verified - proper role="contentinfo" |
| [x] | `types.ts` | Props interface | Verified |
| [x] | `styles.css` | Styles | Verified - correct CSS variable fallbacks |

### `chrome/overlays/CursorLabel/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.tsx` | Cursor follower label | Document event listeners (L2 violation) |
| [x] | `styles.css` | Styles | Verified (position:fixed OK for portal) |

### `chrome/overlays/Modal/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.tsx` | Modal overlay component | [EXCEPTION] RevealTransition import from drivers/gsap/ allowed - documented |
| [x] | `types.ts` | Props interface | [EXCEPTION] Type imports from drivers/ allowed for overlay animations |
| [x] | `store.ts` | Colocated modal state | Verified - Zustand store correctly colocated |
| [x] | `styles.css` | Styles | Verified - correct for portal overlay |
| [x] | `ModalRoot.tsx` | Portal root | Verified |
| [!] | `useSmoothModalScroll.ts` | Colocated hook | Document wheel listener; imports from experience/ |
| [x] | `useTransitionComplete.ts` | Colocated hook | Verified |

---

## PHASE 8: EXPERIENCE - BEHAVIOURS

**Rule:** Named by TRIGGER, output CSS variable VALUE, know nothing about effects

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `behaviours/index.ts` | Barrel exports | Verified - triggers registration |
| [x] | `behaviours/types.ts` | Behaviour type definitions | Verified - minimal and correct |
| [x] | `behaviours/registry.ts` | Behaviour registry | Verified - manual registration pattern |
| [x] | `behaviours/resolve.ts` | Resolution logic | Verified - O(1) Set lookups |
| [!] | `behaviours/BehaviourWrapper.tsx` | Applies behaviours to children | Missing cleanup return; no driver integration |

### `behaviours/animation/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Barrel | Verified |
| [!] | `marquee.ts` | Marquee animation behaviour | Missing `requires` array |

### `behaviours/hover/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Barrel | Verified |
| [!] | `expand.ts` | Hover expand (sets --hover) | Missing `requires`; reads widget-specific state (hoveredThumbnailIndex) |
| [!] | `scale.ts` | Hover scale (sets --hover) | Missing `requires`; outputs config as values |
| [!] | `reveal.ts` | Hover reveal (sets --hover) | Missing `requires`; outputs config as values |

### `behaviours/scroll/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Barrel | Verified |
| [!] | `color-shift.ts` | Scroll color shift (sets --scroll) | Reads invalid state key (`--bg-index` from state) |
| [!] | `fade.ts` | Scroll fade in (sets --scroll) | Missing `requires` array |
| [!] | `fade-out.ts` | Scroll fade out (sets --scroll) | Missing `requires` array |
| [!] | `image-cycle.ts` | Scroll image cycling (sets --scroll) | Missing `requires` array |
| [!] | `progress.ts` | Scroll progress (sets --scroll) | Missing `will-change` in cssTemplate |

### `behaviours/visibility/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Barrel | Verified |
| [!] | `fade-in.ts` | Visibility fade in (sets --visible) | Missing `requires` array |

---

## PHASE 9: EXPERIENCE - EFFECTS

**Rule:** Named by MECHANISM, respond to CSS variable changes, generic/reusable

### Infrastructure

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `effects/index.css` | Effect imports | Verified - organized by mechanism |

### Root Effects

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `fade.css` | Opacity transitions | Verified - 8 variants, all compliant |
| [x] | `color-shift.css` | Color transitions | Verified - CSS variables with fallbacks |
| [x] | `marquee-scroll.css` | Marquee animation | Verified - reduced motion support |
| [x] | `overlay-darken.css` | Overlay darkening | Verified - data-attribute selectors |

### `effects/mask/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `index.ts` | Should NOT exist | TS barrel in CSS-only folder (layer violation) |
| [x] | `wipe.css` | Wipe mask effect | Verified |
| [x] | `reveal.css` | Reveal mask effect | Verified |
| [!] | `RevealTransition.tsx` | Should NOT be in effects/ | React component belongs in behaviours/ or drivers/ |
| [!] | `useGsapReveal.ts` | Should NOT be in effects/ | Hook belongs in behaviours/ or drivers/ |

### `effects/transform/`

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `slide.css` | Slide transform | Verified |
| [x] | `scale.css` | Scale transform | Verified - 3 variants |

---

## PHASE 10: EXPERIENCE - DRIVERS

**Rule:** Connect behaviour outputs to DOM, handle platform-specific updates

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [!] | `drivers/index.ts` | Barrel exports | Exports hook instead of Driver class |
| [!] | `drivers/types.ts` | Driver type definitions | Missing Driver and Target interfaces |
| [!] | `drivers/useScrollFadeDriver.ts` | Scroll fade driver | Hook pattern instead of Driver class; missing register/unregister |

**Critical:** Architecture mismatch - uses React hooks instead of Driver classes with register/unregister lifecycle

---

## PHASE 11: EXPERIENCE - TRIGGERS

**Rule:** Connect DOM events to state, feed data to behaviours

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `triggers/index.ts` | Barrel exports | Verified |
| [x] | `triggers/types.ts` | Trigger type definitions | Verified |
| [!] | `triggers/useIntersection.ts` | IntersectionObserver | Missing SSR guard |
| [x] | `triggers/usePrefersReducedMotion.ts` | Motion preference | Verified - only one with proper SSR guard |
| [!] | `triggers/useScrollProgress.ts` | Scroll progress | Missing SSR guard |
| [!] | `triggers/useViewport.ts` | Viewport size | Missing SSR guard |

**Critical:** 3 triggers missing `typeof window !== 'undefined'` SSR check

---

## PHASE 12: EXPERIENCE - MODES

**Rule:** Bundle behaviours + effects, site-wide or section-specific

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `modes/index.ts` | Barrel exports | Verified |
| [x] | `modes/types.ts` | Mode type definitions | [FIXED] Now defines Mode locally; experience/types.ts re-exports |
| [x] | `modes/registry.ts` | Mode registry | Verified - Map-based O(1) lookup |
| [!] | `modes/stacking/index.ts` | Stacking mode | Missing spec fields: name, description, provides, triggers, options |

**Critical:** Mode interface has 3 fields, spec requires 8

---

## PHASE 13: RENDERER

**Rule:** Declarative config → React tree, Site → Page → Section → Widget

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `index.ts` | Barrel exports | Verified |
| [x] | `types.ts` | Renderer type definitions | Verified |
| [x] | `chrome.css` | Chrome base styles | Verified |
| [x] | `ChromeRenderer.tsx` | Renders chrome | Verified - registry lookup, portals |
| [x] | `ErrorBoundary.tsx` | Error boundary | Verified - proper fallback UI |
| [x] | `PageRenderer.tsx` | Renders page | Verified |
| [x] | `SectionRenderer.tsx` | Renders sections | FIXED (TASK-040) - Now uses BehaviourWrapper for all behaviours |
| [x] | `SiteRenderer.tsx` | Top-level renderer | Verified - correct provider order |
| [x] | `ThemeProvider.tsx` | Theme context | Verified |
| [x] | `WidgetRenderer.tsx` | Renders widgets | Verified - registry, recursion, error boundary |
| [x] | `hooks/index.ts` | Hook barrel | Verified |
| [x] | `hooks/useScrollIndicatorFade.ts` | Colocated hook | Verified |

**Overall:** 100% compliant - all renderers use resolveBehaviour() pattern

---

## EXPERIENCE ROOT

| Status | File | Expected | Findings |
|--------|------|----------|----------|
| [x] | `experience/index.ts` | Barrel exports | Verified |
| [x] | `experience/types.ts` | Experience type defs | Verified (Mode interface simplified from spec) |
| [x] | `experience/ExperienceProvider.tsx` | Context provider | Verified |
| [x] | `experience/SmoothScrollProvider.tsx` | Lenis scroll | Verified |
| [x] | `experience/TriggerInitializer.tsx` | Initialize triggers | Verified |

---

## FINDINGS LOG

> Agents add issues here as discovered during verification

### Critical Issues (Architecture Violations)

| File | Issue | Impact |
|------|-------|--------|
| `schema/site.ts` | ModeDefaults interface not defined | Required by spec for mode-specific defaults |
| `schema/chrome.ts` | TriggerCondition uses flat struct instead of discriminated union | Loses type safety; missing timer/visibility events |
| `primitives/Button/index.tsx` | onClick prop breaks RSC serialization | Functions can't serialize across server/client |
| `primitives/*/styles.css` | calc(var(--y)) violates rule 19 | Behaviours should output final values, not numbers |
| `primitives/Image,Icon,Text` | Inline objects without useMemo | Breaks memo effectiveness |
| `layout/*/types.ts` | Uses children prop instead of widgets array | Spec requires WidgetSchema[] for schema-driven rendering |
| `composite/*/styles.css` | [RESOLVED] Factory composites (ProjectCard, LogoLink) CSS moved to composite/styles/; React component composites (Video, VideoPlayer, etc.) CSS allowed per spec Pattern 2 |
| `composite/Video/index.tsx` | [RESOLVED] useVisibilityPlayback is component-specific, not L2 | Hook doesn't write to store or set CSS vars - stays colocated |
| `sections/styles.css` | Contains 100svh, position:absolute | Viewport units and positioning belong to L2 |
| `sections/styles.css` | Contains site-specific Bojuhl CSS | Should be in preset, not generic section styles |
| `chrome/CursorLabel/index.tsx` | Document event listeners | Event handling belongs in L2 triggers |
| `chrome/Modal/index.tsx` | [EXCEPTION] Imports RevealTransition from drivers/gsap/ | Documented exception: Overlays may import driver utilities for enter/exit animations |
| `behaviours/*/` | All 8 behaviours missing `requires` array | Spec rule #2 - must list state dependencies |
| `behaviours/BehaviourWrapper.tsx` | Missing cleanup and driver integration | Spec rule #9 - must return cleanup function |
| `behaviours/scroll/color-shift.ts` | Reads `--bg-index` from state | CSS variables are output, not input |
| `behaviours/hover/expand.ts` | Reads widget-specific state | Breaks generalization - couples to widget |
| `effects/mask/*.ts,*.tsx` | 3 React/GSAP files in effects/ folder | Effects must be pure CSS; move to behaviours/ |
| `drivers/*.ts` | Hook pattern instead of Driver class | Spec requires register/unregister/destroy lifecycle |
| `triggers/useScrollProgress,useIntersection,useViewport` | Missing SSR guard | Will crash on server-side render |
| `modes/stacking/index.ts` | Mode has 3 fields, spec requires 8 | Missing name, description, provides, triggers, options |

### Naming Issues

| File | Current | Should Be |
|------|---------|-----------|
| | | |

### Layer Violations

| File | Current Layer | Correct Layer | Reason |
|------|---------------|---------------|--------|
| `presets/bojuhl/chrome/footer.ts` | Component-based approach | Widget-based approach | Spec says widget-based is preferred for composability |
| All 6 layout widgets | React children pattern | widgets array + WidgetRenderer | Schema-driven rendering required |
| `composite/Video/` | [RESOLVED] | Stays as pure L1 | useVisibilityPlayback is component-specific, not L2 (no store/CSS vars) |
| `sections/styles.css` | L1 with viewport units | L2 BehaviourWrapper | 100svh, position:absolute belong to L2 |
| `chrome/Modal/index.tsx` | [EXCEPTION] L1 importing drivers/ | Documented exception | RevealTransition is driver infrastructure; overlays may import for enter/exit animations |
| `chrome/CursorLabel/index.tsx` | L1 with DOM listeners | L2 driver/trigger | Mouse tracking is L2 concern |
| `effects/mask/RevealTransition.tsx` | React component in effects/ | behaviours/ or drivers/ | Effects must be pure CSS |
| `effects/mask/useGsapReveal.ts` | Hook in effects/ | behaviours/ or drivers/ | Effects must be pure CSS |
| `drivers/useScrollFadeDriver.ts` | React hook pattern | Driver class pattern | Spec requires register/unregister lifecycle |

### Missing Files

| Expected Location | Purpose |
|-------------------|---------|
| `schema/index.ts` | Missing ModeDefaults export (type exists but not exported) |
| `primitives/Link/` | Link primitive - required per architecture |
| `primitives/Video/` | Video primitive - required per architecture |
| `primitives/Button/styles.css` | :focus-visible accessibility styling |
| `primitives/Icon/` | aria-label/decorative prop for semantic icons |

### Duplicate/Redundant Code

| Files | Duplication |
|-------|-------------|
| | |

### Colocation Violations

| File | Should Be Colocated With |
|------|--------------------------|
| | |

### Cross-Component Misalignments

| # | Issue | Spec Says | Actually | Severity |
|---|-------|-----------|----------|----------|
| 1 | Video layer placement | Primitive (atomic, no state) | Composite with useState, L2 hooks | HIGH |
| 2 | Widget-specific effect naming | Named by MECHANISM (fade, scale) | FIXED: Renamed to mechanism-based (color-shift, flex-expand, label-fade) | RESOLVED |
| 3 | LogoLink complexity | Composites have local state/hooks | FIXED: Converted to factory function (TASK-030) | LOW |
| 4 | Animation/interaction behaviours | Only scroll/, hover/, visibility/ | animation/marquee exists, interaction/ missing | LOW |
| 5 | VideoPlayer effects missing | Effects have CSS files | RESOLVED: All 4 effects exist in fade.css (lines 78-128) | RESOLVED |
| 6 | Section folder naming | `sections/composites/` | `sections/patterns/` (better name) | LOW |
| 7 | Effect colocation inconsistent | Widget effects colocated OR in effects/ | RESOLVED: VideoPlayer effects exist in fade.css | RESOLVED |

---

## IMPLEMENTATION TASKS

> Generated from findings after verification complete

### Priority 1: Critical Fixes (Must Fix)

| Task | Files | Description |
|------|-------|-------------|
| TASK-001 | `layout/*/types.ts`, `layout/*/index.tsx` | Change all 6 layout widgets from `children: ReactNode` to `widgets: WidgetSchema[]` and render via WidgetRenderer |
| TASK-002 | `behaviours/scroll/*.ts`, `behaviours/hover/*.ts`, `behaviours/visibility/*.ts`, `behaviours/animation/*.ts` | Add `requires` array to all 8 behaviours declaring state dependencies |
| TASK-003 | `triggers/useScrollProgress.ts`, `triggers/useIntersection.ts`, `triggers/useViewport.ts` | Add `typeof window === 'undefined'` SSR guard at start of useEffect |
| TASK-004 | `effects/mask/RevealTransition.tsx`, `effects/mask/useGsapReveal.ts`, `effects/mask/index.ts` | Move GSAP components from effects/ to behaviours/ or drivers/ (effects must be CSS-only) |
| TASK-005 | `drivers/types.ts`, `drivers/` | Define Driver/Target interfaces and implement ScrollDriver class with register/unregister/destroy |
| TASK-006 | `primitives/*/styles.css` | Change `calc(var(--y, 0) * 1px)` to `var(--y, 0px)` - behaviours output final values |
| TASK-007 | `sections/styles.css` | [DONE] Extracted Bojuhl-specific CSS to `presets/bojuhl/styles/sections.css`; cleaned generic sections/styles.css |
| TASK-008 | `modes/stacking/index.ts`, `experience/types.ts` | Extend Mode interface with: name, description, provides, triggers, options |

### Priority 2: Refactoring (Should Fix)

| Task | Files | Description |
|------|-------|-------------|
| TASK-009 | `primitives/Button/index.tsx`, `primitives/Button/types.ts` | Remove onClick prop - use BehaviourWrapper for event handling (RSC serialization) |
| TASK-010 | `primitives/Image/index.tsx`, `primitives/Icon/index.tsx`, `primitives/Text/index.tsx` | Wrap inline style/className with useMemo to prevent memo breakage |
| TASK-011 | `schema/chrome.ts` | Change TriggerCondition from flat struct to discriminated union per spec |
| TASK-012 | `schema/site.ts`, `schema/index.ts` | Define and export ModeDefaults interface |
| TASK-013 | `composite/Video/index.tsx` | DONE: useVisibilityPlayback stays colocated (not L2 - no store/CSS vars) |
| TASK-014 | `chrome/CursorLabel/index.tsx` | Move document event listeners to L2 trigger |
| TASK-015 | `chrome/Modal/index.tsx` | [DONE] Decision: Keep RevealTransition import (driver infrastructure exception for overlays) |
| TASK-016 | `behaviours/scroll/color-shift.ts` | Fix reading `--bg-index` from state - should use options |
| TASK-017 | `behaviours/hover/expand.ts` | Remove widget-specific state reads (hoveredThumbnailIndex) |
| TASK-018 | `behaviours/BehaviourWrapper.tsx` | Add driver integration and cleanup return from useEffect |

### Priority 2.5: Cross-Component Alignment (Should Fix)

| Task | Files | Description |
|------|-------|-------------|
| TASK-027 | `composite/Video/`, `CLAUDE.md` | DONE: Video stays as composite (complex state). Updated CLAUDE.md files. |
| TASK-028 | `composite/VideoPlayer/styles.css` | DONE: All 4 effects already exist in fade.css (lines 78-128): media-crossfade, controls-fade, button-hover, scrubber-fade |
| TASK-029 | Widget-specific effects | DONE: Renamed contact-reveal→color-shift, thumbnail-expand→flex-expand, cursor-label→label-fade |
| TASK-030 | `composite/LogoLink/` | DONE: Converted to factory function createLogoLink(). Uses Link + Image/Text primitives. |
| TASK-031 | `CLAUDE.md`, `behaviours/` | DONE: animation/ documented in CLAUDE.md + behaviours/CLAUDE.md; interaction/ folder created with toggle.ts |
| TASK-032 | `specs/reference/folders.spec.md` | Update line 57: change `composites/` to `patterns/` for sections |

### Priority 3: Cleanup (Nice to Have)

| Task | Files | Description |
|------|-------|-------------|
| TASK-033 | `composite/*/styles.css` | [DONE] Factory composite CSS (ProjectCard, LogoLink) moved to composite/styles/; React component composites CSS allowed per spec |
| TASK-034 | `primitives/Button/styles.css` | Add `:focus-visible` accessibility styling |
| TASK-035 | `primitives/Icon/index.tsx`, `primitives/Icon/types.ts` | Add `decorative` and `label` props for semantic icons |
| TASK-036 | `primitives/Link/` | Create missing Link primitive |
| TASK-037 | `presets/bojuhl/chrome/footer.ts` | Migrate from component-based to widget-based chrome (preferred) |
| TASK-038 | `modes/types.ts` | [DONE] Mode interface now defined here; experience/types.ts re-exports |
| TASK-039 | `behaviours/scroll/progress.ts` | Add `will-change` to cssTemplate |
| TASK-040 | `renderer/SectionRenderer.tsx` | [DONE] Refactored - now uses BehaviourWrapper for all behaviours (resolveBehaviour pattern) |

### Implementation Order (Dependency-Verified)

> **Consensus achieved through 6-agent analysis (2 rounds)**
> Hard dependencies verified against actual codebase imports/types

#### Phase 1: Schema Foundation
*Types that all other code depends on - must exist first*

| Order | Task | Description | Parallel |
|-------|------|-------------|----------|
| 1.1 | TASK-011 | TriggerCondition discriminated union in schema/chrome.ts | ✅ |
| 1.2 | TASK-012 | Define ModeDefaults interface in schema/site.ts | ✅ |

**Hard deps:** None - these are leaf types

---

#### Phase 2: Experience Infrastructure
*Driver and Mode interfaces that behaviours/wrapper depend on*

| Order | Task | Description | Depends On | Parallel |
|-------|------|-------------|------------|----------|
| 2.1 | TASK-005 | Define Driver/Target interfaces, implement ScrollDriver class | - | ✅ |
| 2.2 | TASK-002 | Add `requires` array to all 8 behaviours | - | ✅ |
| 2.3 | TASK-008 | Extend Mode interface (name, description, provides, triggers, options) | TASK-012 | ⏳ |
| 2.4 | TASK-038 | Move Mode interface definition to modes/types.ts | TASK-008 | ⏳ |

**Hard deps:** TASK-008 uses ModeDefaults type from TASK-012

---

#### Phase 3: Structural Cleanup & SSR Safety
*Independent fixes with no downstream dependencies*

| Order | Task | Description | Parallel |
|-------|------|-------------|----------|
| 3.1 | TASK-003 | SSR guards for 3 triggers (useScrollProgress, useIntersection, useViewport) | ✅ |
| 3.2 | TASK-004 | Move GSAP files from effects/mask/ to behaviours/ | ✅ |
| 3.3 | TASK-016 | Fix color-shift reading from state (use options not CSS vars) | ✅ |
| 3.4 | TASK-017 | Fix expand.ts widget-specific state reads | ✅ |
| 3.5 | TASK-039 | Add will-change to scroll/progress cssTemplate | ✅ |

**Hard deps:** None - all independent. TASK-004 does NOT require Driver interface.

---

#### Phase 4: Primitive Widget Fixes
*Fix leaf components before containers render them*

| Order | Task | Description | Parallel |
|-------|------|-------------|----------|
| 4.1 | TASK-006 | CSS vars: `calc(var(--y, 0) * 1px)` → `var(--y, 0px)` | ✅ |
| 4.2 | TASK-009 | Remove onClick from Button (RSC serialization) | ✅ |
| 4.3 | TASK-010 | Add useMemo to Image, Icon, Text inline objects | ✅ |
| 4.4 | TASK-034 | Add :focus-visible to Button | ✅ |
| 4.5 | TASK-035 | Add decorative/label props to Icon | ✅ |
| 4.6 | TASK-036 | Create Link primitive | ⏳ |

**Hard deps:** None between these - different files. Do BEFORE layout refactor.

---

#### Phase 5: BehaviourWrapper Integration
*Connect behaviours to drivers - requires Driver interface*

| Order | Task | Description | Depends On |
|-------|------|-------------|------------|
| 5.1 | TASK-018 | Add driver integration + cleanup to BehaviourWrapper | TASK-005 |

**Hard deps:** TASK-005 (Driver interface) MUST exist first

---

#### Phase 6: Layout Widget Refactor
*Major breaking change - children → widgets array*

| Order | Task | Description | Depends On |
|-------|------|-------------|------------|
| 6.1 | TASK-001 | Change all 6 layout widgets from `children: ReactNode` to `widgets: WidgetSchema[]` | Phase 4 complete |

**Hard deps:** Primitives should be fixed first (Phase 4) so WidgetRenderer renders them correctly

---

#### Phase 7: Section & Chrome Fixes
*Remove site-specific code, fix layer violations*

| Order | Task | Description | Depends On | Parallel |
|-------|------|-------------|------------|----------|
| 7.1 | TASK-007 | Extract Bojuhl CSS to preset, remove 100svh from sections/styles.css | - | ✅ |
| 7.2 | TASK-014 | Move CursorLabel event listeners to L2 trigger | Phase 3 | ✅ |
| 7.3 | TASK-015 | Modal RevealTransition design decision | TASK-004 | ⏳ |
| 7.4 | TASK-037 | Footer: migrate to widget-based chrome | TASK-001 | ⏳ |

**Hard deps:** TASK-015 affected by TASK-004 (GSAP file locations); TASK-037 needs widget-based layouts

---

#### Phase 8: Composite Layer Resolution
*Video decision gates other composite work*

| Order | Task | Description | Depends On | Parallel |
|-------|------|-------------|------------|----------|
| 8.1 | TASK-027 | Video: decide primitives vs composite | - | ✅ |
| 8.2 | TASK-030 | LogoLink: DONE - converted to factory function | - | ✅ COMPLETE |
| 8.3 | TASK-013 | DONE: useVisibilityPlayback stays colocated (not L2) | TASK-027 | ✅ COMPLETE |
| 8.4 | TASK-028 | DONE: All 4 effects already exist in fade.css | TASK-013 | ✅ COMPLETE |
| 8.5 | TASK-033 | DONE: Factory CSS (ProjectCard, LogoLink) moved to composite/styles/; React composites keep CSS per spec | TASK-028 | ✅ COMPLETE |

**Hard deps:** TASK-027 decision gates TASK-013; TASK-013 gates TASK-028

---

#### Phase 9: Naming & Documentation
*Finalize naming conventions after structure is stable*

| Order | Task | Description | Parallel |
|-------|------|-------------|----------|
| 9.1 | TASK-029 | Rename widget-specific effects to mechanism-based names | ✅ |
| 9.2 | TASK-031 | Document animation/ folder, add interaction/ folder | ✅ |
| 9.3 | TASK-032 | Update spec: composites/ → patterns/ | ✅ |

**Hard deps:** None - all documentation/naming

---

#### Phase 10: Renderer Integration (Final)
*Wire up corrected patterns - must be last*

| Order | Task | Description | Depends On |
|-------|------|-------------|------------|
| 10.1 | TASK-040 | [DONE] SectionRenderer: use resolveBehaviour() pattern | TASK-018, Phase 8 complete |

**Hard deps:** Requires stable behaviours (TASK-018) and composites (Phase 8)

---

### Dependency Graph

```
PHASE 1 (Schema)
  TASK-011, TASK-012
         │
         ▼
PHASE 2 (Infrastructure)
  TASK-005, TASK-002, TASK-008←TASK-012, TASK-038←TASK-008
         │
         ├────────────────────────────────┐
         ▼                                ▼
PHASE 3 (Cleanup)                  PHASE 5 (Wrapper)
  TASK-003, TASK-004,                TASK-018←TASK-005
  TASK-016, TASK-017, TASK-039              │
         │                                  │
         ▼                                  │
PHASE 4 (Primitives)                        │
  TASK-006, TASK-009, TASK-010,             │
  TASK-034, TASK-035, TASK-036              │
         │                                  │
         ▼                                  │
PHASE 6 (Layout)                            │
  TASK-001                                  │
         │                                  │
         ▼                                  │
PHASE 7 (Chrome)                            │
  TASK-007, TASK-014, TASK-015←TASK-004,    │
  TASK-037←TASK-001                         │
         │                                  │
         ▼                                  │
PHASE 8 (Composites)                        │
  TASK-027, TASK-030, TASK-013←TASK-027,    │
  TASK-028←TASK-013, TASK-033←TASK-028      │
         │                                  │
         ▼                                  │
PHASE 9 (Docs)                              │
  TASK-029, TASK-031, TASK-032              │
         │                                  │
         ▼                                  │
PHASE 10 (Renderer) ←───────────────────────┘
  TASK-040←(TASK-018 + Phase 8)
```

### Parallelization Summary

| Phase | Max Parallel | Sequential |
|-------|--------------|------------|
| 1 | 2 | - |
| 2 | 2 | TASK-008→038 |
| 3 | 5 | - |
| 4 | 5 | TASK-036 after others |
| 5 | 1 | - |
| 6 | 1 | - |
| 7 | 2 | TASK-015→037 |
| 8 | 2 | TASK-027→013→028→033 |
| 9 | 3 | - |
| 10 | 1 | - |

**Critical Path:** TASK-012 → TASK-008 → TASK-038 (types) + TASK-005 → TASK-018 → TASK-040 (drivers)

---

## SUMMARY

| Metric | Value |
|--------|-------|
| Total Files | ~164 |
| Verified | 98 |
| Issues Found | 70 |
| Cross-Component Misalignments | 7 |
| Tasks Generated | 40 |

### Issues by Phase

| Phase | Verified | Issues | Critical |
|-------|----------|--------|----------|
| 1. Presets | 8 | 1 | 0 |
| 2. Schema | 6 | 3 | 2 |
| 3. Primitives | 8 | 12 | 4 |
| 4. Layout | 6 | 12 | 12 |
| 5. Composite | 16 | 8 | 2 |
| 6. Sections | 11 | 1 | 1 |
| 7. Chrome | 11 | 4 | 3 |
| 8. Behaviours | 8 | 10 | 4 |
| 9. Effects | 9 | 3 | 3 |
| 10. Drivers | 0 | 3 | 3 |
| 11. Triggers | 3 | 3 | 3 |
| 12. Modes | 2 | 2 | 1 |
| 13. Renderer | 10 | 1 | 0 |
| **TOTAL** | **98** | **63** | **38** |

### Top Priority Fixes

1. **Layout widgets**: Change from React children to widgets array (12 files)
2. **Behaviours**: Add `requires` array to all 8 behaviours
3. **Triggers**: Add SSR guard to 3 triggers
4. **Effects**: Move GSAP files from effects/ to behaviours/ or drivers/
5. **Drivers**: Implement Driver class pattern with register/unregister
6. **Primitives**: Remove calc(var(--y)), add useMemo, remove onClick from Button
7. **Sections styles.css**: Extract Bojuhl CSS to preset, remove viewport units
8. **Modes**: Extend Mode interface to match spec (add 5 missing fields)
9. **Video alignment**: Either move to primitives (remove L2 hooks) OR update spec
10. **VideoPlayer effects**: Create missing CSS (button-hover, controls-fade, etc.)
