# Experience Analysis

> Animation and interaction patterns identified from external references.

## Reference

| Reference | Type | Analyzed |
|-----------|------|----------|
| bo-juhl-portfolio | GitHub Repo | 2026-01-26 |

## Findings

### [EXPERIENCE-001] Smooth Scroll Provider

- **Type:** Feature
- **Priority:** P0
- **Reference:** `components/providers/smooth-scroll-provider.tsx`
- **Description:**
  GSAP ScrollSmoother wrapper providing inertial smooth scrolling with device-aware configuration.

- **Things to consider:**
  - Context provider pattern with getSmoother, stop, start, scrollTo, getScroll
  - Touch device detection (disables smooth scroll)
  - Mac detection (reduced smoothing due to native trackpad inertia)
  - Reduced motion preference respected
  - ScrollTrigger.normalizeScroll for non-Mac desktop
  - Orientation change handling with multiple refresh attempts
  - Anchor link interception for smooth scrollTo
  - Wrapper/content div structure required

- **Specialists:**
  - Builder: provider-builder
  - Reviewer: provider-reviewer

---

### [EXPERIENCE-002] Fade In

- **Type:** Feature
- **Priority:** P2
- **Reference:** `components/ui/fade-in.tsx`
- **Description:**
  Intersection Observer based fade-in animation component with configurable delay.

- **Things to consider:**
  - IntersectionObserver with 0.1 threshold
  - Configurable delay prop
  - GPU acceleration with translateZ(0)
  - willChange cleanup after animation
  - Single observation then disconnect
  - Client component

- **Specialists:**
  - Builder: behaviour-builder
  - Reviewer: behaviour-reviewer

---

### [EXPERIENCE-003] Scroll Fade

- **Type:** Feature
- **Priority:** P2
- **Reference:** `components/ui/scroll-fade.tsx`
- **Description:**
  ScrollTrigger-based fade component with configurable start/end viewport positions.

- **Things to consider:**
  - Delegates to useScrollFade hook (SRP)
  - Configurable start/end (% from viewport top)
  - Initial visibility: hidden
  - Scrub animation tied to scroll position
  - Works with ScrollSmoother

- **Specialists:**
  - Builder: behaviour-builder
  - Reviewer: behaviour-reviewer

---

### [EXPERIENCE-004] Scroll Indicator

- **Type:** Feature
- **Priority:** P3
- **Reference:** `components/ui/scroll-indicator.tsx`
- **Description:**
  "(SCROLL)" text that fades out as user scrolls, indicating scroll affordance.

- **Things to consider:**
  - GSAP autoAlpha animation (opacity + visibility)
  - ScrollTrigger scrub tied to scroll position
  - Touch device aware (immediate vs smooth tracking)
  - Safe area inset handling for bottom position
  - mix-blend-mode: difference
  - 100ms delay for ScrollSmoother init

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

## Summary

| ID | Name | Priority | Dependencies |
|----|------|----------|--------------|
| EXPERIENCE-001 | Smooth Scroll Provider | P0 | None |
| EXPERIENCE-002 | Fade In | P2 | EXPERIENCE-001 |
| EXPERIENCE-003 | Scroll Fade | P2 | EXPERIENCE-001 |
| EXPERIENCE-004 | Scroll Indicator | P3 | EXPERIENCE-001 |
