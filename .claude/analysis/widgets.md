# Widget Analysis

> Widget components identified from external references.

## Reference

| Reference | Type | Analyzed |
|-----------|------|----------|
| bo-juhl-portfolio | GitHub Repo | 2026-01-26 |

## Findings

### [WIDGET-001] Copy Email Button

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/ui/copy-email-button.tsx`
- **Description:**
  Button that copies email to clipboard with visual feedback (copy icon, checkmark, X).

- **Things to consider:**
  - States: idle, copied, failed
  - CSS variable: --interaction for hover color
  - 2-second auto-reset to idle
  - Reusable clipboard copy pattern

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

### [WIDGET-002] Video Background

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/ui/video-background.tsx`
- **Description:**
  Full-coverage video background with scroll-based play/pause optimization. Fallback chain: video -> poster -> solid color.

- **Things to consider:**
  - Depends on SmoothScroll context (tight coupling to fix)
  - Uses GSAP ticker for scroll monitoring
  - Autoplay retry logic for browser restrictions
  - Graceful fallback chain

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

### [WIDGET-003] Hover Video Container

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/ui/hover-video-container.tsx`
- **Description:**
  Image/video overlay that transitions from static thumbnail to playing video on hover.

- **Things to consider:**
  - Pure content widget with controlled isActive prop
  - Uses Next.js Image component
  - Video preloads metadata only
  - Fallback content slot

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

### [WIDGET-004] Progressive Image

- **Type:** Feature
- **Priority:** P2
- **Reference:** `components/features/sections/about-section/progressive-image.tsx`
- **Description:**
  Image component with low-res placeholder that transitions to high-res on load.

- **Things to consider:**
  - Two-stage loading: lowRes -> highRes
  - Object-fit cover
  - Loading state handling

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

### [WIDGET-005] Logo Marquee

- **Type:** Feature
- **Priority:** P2
- **Reference:** `components/features/sections/about-section/logo-marquee.tsx`
- **Description:**
  Infinite horizontal scrolling logo carousel with configurable speed.

- **Things to consider:**
  - CSS animation for infinite scroll
  - Configurable speed prop
  - Logo array support
  - Seamless loop

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

### [WIDGET-006] Project Card

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/features/sections/projects-section/project-card.tsx`
- **Dependencies:** WIDGET-003
- **Description:**
  Portfolio project card with hover video, title, role, and client information. Alternating left/right alignment.

- **Things to consider:**
  - Uses HoverVideoContainer
  - Props: project, alignment, textColor
  - Cursor label integration
  - Left/right alignment support

- **Specialists:**
  - Builder: widget-composite-builder
  - Reviewer: widget-composite-reviewer

---

### [WIDGET-007] Expandable Thumbnail

- **Type:** Feature
- **Priority:** P2
- **Reference:** `components/features/sections/more-projects-section/expandable-thumbnail.tsx`
- **Dependencies:** WIDGET-003
- **Description:**
  Thumbnail that expands on hover with video player modal. Shows project metadata when expanded.

- **Things to consider:**
  - Controlled expansion state
  - Video player modal integration
  - Transition duration configuration
  - Project metadata display

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

### [WIDGET-008] Video Player

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/features/blocks/video-player/video-player.tsx`
- **Dependencies:** WIDGET-009, WIDGET-010
- **Description:**
  Full-screen modal video player with animated open/close (wipe/expand). Includes play/pause, progress, volume controls.

- **Things to consider:**
  - Portal-rendered modal (chrome layer concern)
  - GSAP animations (wipe-left, wipe-right, expand)
  - Keyboard shortcuts (Escape, Space)
  - Auto-close after video ends
  - Consider splitting: modal chrome + video controls widget

- **Specialists:**
  - Builder: chrome-builder, widget-builder
  - Reviewer: chrome-reviewer, widget-reviewer

---

### [WIDGET-009] Video Progress Bar

- **Type:** Feature
- **Priority:** P2
- **Reference:** `components/features/blocks/video-player/video-player-progress.tsx`
- **Description:**
  Video progress bar with seeking, time display, and scrubber handle.

- **Things to consider:**
  - Controlled component (props-driven state)
  - Mouse drag for seeking
  - Time formatting utility
  - Scrubber handle on hover

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

### [WIDGET-010] Video Volume Control

- **Type:** Feature
- **Priority:** P2
- **Reference:** `components/features/blocks/video-player/video-player-volume.tsx`
- **Description:**
  Volume slider with mute toggle. Three-state icon (muted, low, high).

- **Things to consider:**
  - Pure presentational widget
  - Three-state icon
  - Range input with custom styling
  - Backdrop blur for floating controls

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

### [WIDGET-011] Crossroad Link

- **Type:** Feature
- **Priority:** P3
- **Reference:** `components/features/sections/about-section/crossroad-link.tsx`
- **Description:**
  Styled external link with hover effects for inline text links.

- **Things to consider:**
  - External link (target="_blank")
  - Hover color transition
  - Inline display

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

---

## Summary

| ID | Name | Priority | Dependencies |
|----|------|----------|--------------|
| WIDGET-001 | Copy Email Button | P1 | None |
| WIDGET-002 | Video Background | P1 | EXPERIENCE-001 |
| WIDGET-003 | Hover Video Container | P1 | None |
| WIDGET-004 | Progressive Image | P2 | None |
| WIDGET-005 | Logo Marquee | P2 | None |
| WIDGET-006 | Project Card | P1 | WIDGET-003 |
| WIDGET-007 | Expandable Thumbnail | P2 | WIDGET-003 |
| WIDGET-008 | Video Player | P1 | WIDGET-009, WIDGET-010 |
| WIDGET-009 | Video Progress Bar | P2 | None |
| WIDGET-010 | Video Volume Control | P2 | None |
| WIDGET-011 | Crossroad Link | P3 | None |
