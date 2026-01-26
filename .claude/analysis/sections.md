# Section Analysis

> Section patterns identified from external references.

## Reference

| Reference | Type | Analyzed |
|-----------|------|----------|
| bo-juhl-portfolio | GitHub Repo | 2026-01-26 |

## Findings

### [SECTION-001] Hero Section

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/features/sections/hero-section/hero-section.tsx`
- **Dependencies:** WIDGET-002
- **Description:**
  Full-viewport hero with video background, multi-line titles, and scroll indicator.

- **Things to consider:**
  - Server component with "use cache" + cacheLife("days")
  - VideoBackground widget for background media
  - ScrollIndicator for call-to-action
  - mix-blend-mode: difference for text contrast
  - Newline-separated titles parsing
  - 100svh height with safe area handling

- **Specialists:**
  - Builder: section-composite-builder
  - Reviewer: section-composite-reviewer

---

### [SECTION-002] About Section

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/features/sections/about-section/about-section.tsx`
- **Dependencies:** WIDGET-004, WIDGET-005, WIDGET-011
- **Description:**
  Split-layout about section with progressive image, logo marquee, and inline link parsing.

- **Things to consider:**
  - Server component with "use cache"
  - ScrollFade wrapper for entrance animation
  - ProgressiveImage for two-stage loading
  - LogoMarquee at bottom (desktop only)
  - CrossroadLink inline text replacement
  - Mobile: background image with opacity
  - Desktop: 50/50 split layout

- **Specialists:**
  - Builder: section-composite-builder
  - Reviewer: section-composite-reviewer

---

### [SECTION-003] Projects Section

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/features/sections/projects-section/projects-section.tsx`
- **Dependencies:** WIDGET-006
- **Description:**
  Featured projects grid with alternating left/right card alignment.

- **Things to consider:**
  - Server component with "use cache"
  - JSON parsing for project data with fallback
  - CSS custom properties for responsive gap
  - ProjectCard with hover video
  - Alternating alignment based on index

- **Specialists:**
  - Builder: section-composite-builder
  - Reviewer: section-composite-reviewer

---

### [SECTION-004] More Projects Section

- **Type:** Feature
- **Priority:** P2
- **Reference:** `components/features/sections/more-projects-section/more-projects-section.tsx`
- **Dependencies:** WIDGET-007
- **Description:**
  Horizontal expandable thumbnail gallery for secondary projects (desktop only).

- **Things to consider:**
  - Client component (useState for expansion)
  - Desktop-only (hidden on mobile)
  - ExpandableThumbnail with video player
  - Coordinated expansion state across thumbnails
  - Labels row synced with expansion
  - Transition duration configurable

- **Specialists:**
  - Builder: section-composite-builder
  - Reviewer: section-composite-reviewer

---

### [SECTION-005] Footer Section

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/features/sections/footer-section/footer-section.tsx`
- **Dependencies:** WIDGET-001
- **Description:**
  Multi-column footer with navigation, contact info, and studio links.

- **Things to consider:**
  - Server component with "use cache"
  - Three-column layout (nav, contact, studio)
  - CopyEmailButton for email copy
  - --interaction CSS variable for hover
  - External links with proper rel attributes
  - Safe area handling for copyright

- **Specialists:**
  - Builder: section-composite-builder
  - Reviewer: section-composite-reviewer

---

## Summary

| ID | Name | Priority | Dependencies |
|----|------|----------|--------------|
| SECTION-001 | Hero Section | P1 | WIDGET-002 |
| SECTION-002 | About Section | P1 | WIDGET-004, WIDGET-005, WIDGET-011 |
| SECTION-003 | Projects Section | P1 | WIDGET-006 |
| SECTION-004 | More Projects Section | P2 | WIDGET-007 |
| SECTION-005 | Footer Section | P1 | WIDGET-001 |
