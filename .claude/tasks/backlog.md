# Backlog

> Items to build. Created by `/plan`.

## Format

See [template](../skills/creativeshire/templates/backlog-item.md) for item format.

---

## Items

### Chrome

#### [CHROME-001] Footer

- **Type:** Feature
- **Priority:** P1
- **Estimate:** M
- **Dependencies:** None
- **Added:** 2026-01-27
- **References:** [chrome.spec.md](../skills/creativeshire/specs/components/content/chrome.spec.md), [tailwind-design-system](../skills/tailwind-design-system/SKILL.md)
- **Description:** Global site footer with navigation, contact info, and studio section
- **Context:** Analysis at `.claude/analyze/bojuhl/site/chrome/footer.md`
- **Approach:**
  1. Create Footer chrome component with 3-column responsive layout
  2. Mobile: single column stacked
  3. Tablet+: three-column flex (Navigation | Contact | Studio)
  4. Register in chrome registry
- **Acceptance Criteria:**
  - [ ] Footer renders navigation links (Home, About, Projects)
  - [ ] Contact section with email and LinkedIn
  - [ ] Studio section with Crossroad Studio info
  - [ ] Responsive: 1-col mobile → 3-col tablet+
  - [ ] Passes tsc --noEmit

#### [CHROME-002] FloatingContact

- **Type:** Feature
- **Priority:** P2
- **Estimate:** S
- **Dependencies:** None
- **Added:** 2026-01-27
- **References:** [chrome.spec.md](../skills/creativeshire/specs/components/content/chrome.spec.md), [chrome-behaviour.spec.md](../skills/creativeshire/specs/components/experience/chrome-behaviour.spec.md)
- **Description:** "How can I help you?" floating CTA button
- **Context:** Analysis at `.claude/analyze/bojuhl/site/chrome/floating-contact.md`
- **Approach:**
  1. Create FloatingContact chrome component
  2. Mobile: inline in page flow
  3. Tablet+: fixed position top-right overlay
  4. Purple accent background with white text
- **Acceptance Criteria:**
  - [ ] Renders contact CTA with link
  - [ ] Inline on mobile, fixed on tablet+
  - [ ] Purple (#9933FF) accent styling
  - [ ] Passes tsc --noEmit

---

### Widgets

#### [WIDGET-001] HeroTitle

- **Type:** Feature
- **Priority:** P0
- **Estimate:** S
- **Dependencies:** None
- **Added:** 2026-01-27
- **References:** [widget.spec.md](../skills/creativeshire/specs/components/content/widget.spec.md), [responsive-design.spec.md](../skills/creativeshire/specs/reference/responsive-design.spec.md)
- **Description:** Large display heading with mix-blend-mode difference effect
- **Context:** Analysis at `.claude/analyze/bojuhl/content/widget/hero-title.md`
- **Approach:**
  1. Create HeroTitle widget with Inter font, weight 900
  2. Apply mix-blend-mode: difference for dynamic color
  3. Responsive sizing: 32px → 47px → 60-72px
  4. Register in widget registry
- **Acceptance Criteria:**
  - [ ] Renders uppercase heading with configurable text
  - [ ] mix-blend-mode: difference applied
  - [ ] Responsive font scaling across breakpoints
  - [ ] Supports h1/h2/h3 semantic tags
  - [ ] Passes tsc --noEmit

#### [WIDGET-002] ScrollIndicator

- **Type:** Feature
- **Priority:** P2
- **Estimate:** S
- **Dependencies:** None
- **Added:** 2026-01-27
- **References:** [widget.spec.md](../skills/creativeshire/specs/components/content/widget.spec.md)
- **Description:** "(SCROLL)" text prompt at bottom of hero section
- **Context:** Analysis at `.claude/analyze/bojuhl/content/widget/scroll-indicator.md`
- **Approach:**
  1. Create simple text widget with scroll prompt
  2. Position at bottom of container
  3. Color matches hero text (inherits blend mode context)
- **Acceptance Criteria:**
  - [ ] Renders "(SCROLL)" text
  - [ ] Positioned at bottom of parent
  - [ ] Inherits text color from context
  - [ ] Passes tsc --noEmit

#### [WIDGET-003] VideoThumbnail

- **Type:** Feature
- **Priority:** P0
- **Estimate:** M
- **Dependencies:** None
- **Added:** 2026-01-27
- **References:** [widget.spec.md](../skills/creativeshire/specs/components/content/widget.spec.md), [composition-patterns](../skills/composition-patterns/SKILL.md)
- **Description:** Clickable video preview with WATCH overlay
- **Context:** Analysis at `.claude/analyze/bojuhl/content/widget/video-thumbnail.md`
- **Approach:**
  1. Create VideoThumbnail with 16:9 aspect ratio container
  2. Image with object-fit: cover
  3. Centered "WATCH" overlay text
  4. onClick handler for video modal trigger
- **Acceptance Criteria:**
  - [ ] Renders thumbnail image in 16:9 container
  - [ ] Shows "WATCH" label overlay
  - [ ] Hover state enhances overlay (desktop)
  - [ ] Fires onClick when clicked
  - [ ] Passes tsc --noEmit

#### [WIDGET-004] ProjectCard

- **Type:** Feature
- **Priority:** P0
- **Estimate:** M
- **Dependencies:** WIDGET-003
- **Added:** 2026-01-27
- **References:** [widget.spec.md](../skills/creativeshire/specs/components/content/widget.spec.md), [composition-patterns](../skills/composition-patterns/SKILL.md)
- **Description:** Featured project display with thumbnail, metadata, description
- **Context:** Analysis at `.claude/analyze/bojuhl/content/widget/project-card.md`
- **Approach:**
  1. Create ProjectCard composing VideoThumbnail
  2. Meta row: Client | Studio labels and values
  3. Title (H3), description, year, role
  4. Mobile: stacked vertical; Tablet+: two-column horizontal
  5. Alternating layout pattern (odd=thumb left, even=thumb right)
- **Acceptance Criteria:**
  - [ ] Renders VideoThumbnail with all metadata fields
  - [ ] Responsive layout: stacked → two-column
  - [ ] Supports alternating thumbnail position
  - [ ] All typography matches analysis specs
  - [ ] Passes tsc --noEmit

#### [WIDGET-005] LogoMarquee

- **Type:** Feature
- **Priority:** P2
- **Estimate:** M
- **Dependencies:** None
- **Added:** 2026-01-27
- **References:** [widget.spec.md](../skills/creativeshire/specs/components/content/widget.spec.md), [gsap](../skills/gsap/SKILL.md)
- **Description:** Animated horizontal scroll of client logos
- **Context:** Analysis at `.claude/analyze/bojuhl/content/widget/logo-marquee.md`
- **Approach:**
  1. Create LogoMarquee with CSS animation or GSAP
  2. Hidden on mobile, visible tablet+
  3. Logos rendered white via filter: brightness(0) invert(1)
  4. Infinite loop with duplicated content for seamless scroll
  5. Respect prefers-reduced-motion
- **Acceptance Criteria:**
  - [ ] Renders array of logo images
  - [ ] Continuous horizontal scroll animation
  - [ ] Hidden on mobile (display: none)
  - [ ] Respects prefers-reduced-motion
  - [ ] Passes tsc --noEmit

---

### Sections

#### [SECTION-001] HeroSection

- **Type:** Feature
- **Priority:** P0
- **Estimate:** L
- **Dependencies:** WIDGET-001, WIDGET-002
- **Added:** 2026-01-27
- **References:** [section.spec.md](../skills/creativeshire/specs/components/content/section.spec.md), [frontend-design](../skills/frontend-design/SKILL.md)
- **Description:** Full viewport hero with video background and role titles
- **Context:** Analysis at `.claude/analyze/bojuhl/content/section/hero.md`
- **Approach:**
  1. Create HeroSection with 100vh height
  2. Video background with object-fit: cover
  3. Compose HeroTitle widgets for role titles
  4. Intro text "I'm Bo Juhl"
  5. ScrollIndicator at bottom
- **Acceptance Criteria:**
  - [ ] Full viewport height (100vh)
  - [ ] Video background plays (autoplay, muted, loop)
  - [ ] HeroTitle widgets render with blend effect
  - [ ] ScrollIndicator visible at bottom
  - [ ] Passes tsc --noEmit

#### [SECTION-002] AboutSection

- **Type:** Feature
- **Priority:** P1
- **Estimate:** M
- **Dependencies:** WIDGET-005
- **Added:** 2026-01-27
- **References:** [section.spec.md](../skills/creativeshire/specs/components/content/section.spec.md)
- **Description:** Bio section with photo background and logo marquee
- **Context:** Analysis at `.claude/analyze/bojuhl/content/section/about.md`
- **Approach:**
  1. Create AboutSection with dark background
  2. Mobile: single column with bio text
  3. Tablet+: two-column (text left, photo right)
  4. LogoMarquee positioned at bottom (tablet+ only)
  5. Signature "Bo Juhl" element
- **Acceptance Criteria:**
  - [ ] Bio text with Crossroad links
  - [ ] Responsive: 1-col → 2-col layout
  - [ ] Photo background on tablet+
  - [ ] LogoMarquee at bottom (tablet+)
  - [ ] Passes tsc --noEmit

#### [SECTION-003] FeaturedProjectsSection

- **Type:** Feature
- **Priority:** P0
- **Estimate:** M
- **Dependencies:** WIDGET-004
- **Added:** 2026-01-27
- **References:** [section.spec.md](../skills/creativeshire/specs/components/content/section.spec.md)
- **Description:** Featured projects grid with ProjectCard widgets
- **Context:** Analysis at `.claude/analyze/bojuhl/content/section/featured-projects.md`
- **Approach:**
  1. Create section with white background
  2. Map array of projects to ProjectCard widgets
  3. Alternating card layout (odd/even positioning)
  4. Large gap between cards (64px mobile, 256px tablet+)
- **Acceptance Criteria:**
  - [ ] Renders array of ProjectCard widgets
  - [ ] Alternating thumbnail positions
  - [ ] Correct spacing between cards
  - [ ] White background with black text
  - [ ] Passes tsc --noEmit

#### [SECTION-004] OtherProjectsSection

- **Type:** Feature
- **Priority:** P2
- **Estimate:** M
- **Dependencies:** WIDGET-003
- **Added:** 2026-01-27
- **References:** [section.spec.md](../skills/creativeshire/specs/components/content/section.spec.md)
- **Description:** Horizontal thumbnail gallery (hidden on mobile)
- **Context:** Analysis at `.claude/analyze/bojuhl/content/section/other-projects.md`
- **Approach:**
  1. Create section hidden on mobile (display: none)
  2. Horizontal flex row of thumbnails
  3. Compressed thumbnails expand on hover (desktop)
  4. 7 project thumbnails with 4px gap
- **Acceptance Criteria:**
  - [ ] Hidden on mobile
  - [ ] Horizontal gallery on tablet+
  - [ ] Thumbnails compress/expand on hover
  - [ ] Shows year, role, title on expanded state
  - [ ] Passes tsc --noEmit

---

### Behaviours

#### [BEHAVIOUR-001] ScrollBackgroundSlideshow

- **Type:** Feature
- **Priority:** P1
- **Estimate:** L
- **Dependencies:** SECTION-001
- **Added:** 2026-01-27
- **References:** [behaviour.spec.md](../skills/creativeshire/specs/components/experience/behaviour.spec.md), [gsap](../skills/gsap/SKILL.md)
- **Description:** Scroll-triggered background image cycling in hero
- **Context:** Analysis at `.claude/analyze/bojuhl/experience/behaviour/scroll-background-slideshow.md`
- **Approach:**
  1. Create behaviour that maps scroll position to image index
  2. Array of portfolio background images
  3. Instant crossfade based on scroll thresholds
  4. Desktop: may also auto-cycle with timer
- **Acceptance Criteria:**
  - [ ] Background changes based on scroll position
  - [ ] Smooth transitions between images
  - [ ] Works on touch scroll (mobile)
  - [ ] Passes tsc --noEmit

#### [BEHAVIOUR-002] HeroTextColorTransition

- **Type:** Feature
- **Priority:** P1
- **Estimate:** M
- **Dependencies:** SECTION-001
- **Added:** 2026-01-27
- **References:** [behaviour.spec.md](../skills/creativeshire/specs/components/experience/behaviour.spec.md)
- **Description:** Dynamic text color changes synchronized with background
- **Context:** Analysis at `.claude/analyze/bojuhl/experience/behaviour/hero-text-color-transition.md`
- **Approach:**
  1. Track current background via CSS custom property
  2. Map background index to text color palette
  3. Purple on light, cyan on orange, white on dark
  4. Coordinate with ScrollBackgroundSlideshow
- **Acceptance Criteria:**
  - [ ] Text color changes with background
  - [ ] High contrast maintained at all states
  - [ ] Smooth color transitions
  - [ ] Passes tsc --noEmit

#### [BEHAVIOUR-003] VideoModal

- **Type:** Feature
- **Priority:** P0
- **Estimate:** L
- **Dependencies:** WIDGET-003
- **Added:** 2026-01-27
- **References:** [behaviour.spec.md](../skills/creativeshire/specs/components/experience/behaviour.spec.md), [composition-patterns](../skills/composition-patterns/SKILL.md)
- **Description:** Fullscreen video player modal triggered from thumbnails
- **Context:** Analysis at `.claude/analyze/bojuhl/experience/behaviour/video-modal.md`
- **Approach:**
  1. Create modal overlay component (black background)
  2. Centered video player with native controls
  3. Close button (X) top-left
  4. Auto-play on open, body overflow hidden
  5. ESC key and click-outside to close
- **Acceptance Criteria:**
  - [ ] Modal opens on thumbnail click
  - [ ] Video auto-plays on open
  - [ ] Close button works
  - [ ] ESC key closes modal
  - [ ] Focus trap within modal
  - [ ] Passes tsc --noEmit

#### [BEHAVIOUR-004] ProjectCardHover

- **Type:** Feature
- **Priority:** P2
- **Estimate:** S
- **Dependencies:** WIDGET-004
- **Added:** 2026-01-27
- **References:** [behaviour.spec.md](../skills/creativeshire/specs/components/experience/behaviour.spec.md)
- **Description:** Hover effects on project card thumbnails
- **Context:** Analysis at `.claude/analyze/bojuhl/experience/behaviour/project-card-hover.md`
- **Approach:**
  1. Add CSS transitions for scale (1.02-1.05x)
  2. Darken overlay on hover
  3. WATCH label becomes more prominent
  4. Cursor: pointer
- **Acceptance Criteria:**
  - [ ] Subtle scale on thumbnail hover
  - [ ] Overlay darkens for contrast
  - [ ] WATCH label enhanced
  - [ ] Passes tsc --noEmit

#### [BEHAVIOUR-005] ScrollIndicatorFade

- **Type:** Feature
- **Priority:** P3
- **Estimate:** S
- **Dependencies:** WIDGET-002
- **Added:** 2026-01-27
- **References:** [behaviour.spec.md](../skills/creativeshire/specs/components/experience/behaviour.spec.md)
- **Description:** Fade out scroll indicator as user scrolls
- **Context:** Analysis at `.claude/analyze/bojuhl/experience/behaviour/scroll-indicator.md`
- **Approach:**
  1. Track scroll position
  2. Fade opacity from 1 → 0 as user scrolls down
  3. Disappears by ~20% scroll through hero
- **Acceptance Criteria:**
  - [ ] Indicator visible at top
  - [ ] Fades out on scroll
  - [ ] Smooth opacity transition
  - [ ] Passes tsc --noEmit

#### [BEHAVIOUR-006] LogoMarqueeAnimation

- **Type:** Feature
- **Priority:** P2
- **Estimate:** S
- **Dependencies:** WIDGET-005
- **Added:** 2026-01-27
- **References:** [behaviour.spec.md](../skills/creativeshire/specs/components/experience/behaviour.spec.md), [gsap](../skills/gsap/SKILL.md)
- **Description:** Continuous horizontal scroll animation for logo marquee
- **Context:** Analysis at `.claude/analyze/bojuhl/experience/behaviour/logo-marquee.md`
- **Approach:**
  1. CSS animation or GSAP timeline
  2. translateX animation looping infinitely
  3. Duplicate content for seamless loop
  4. Pause on prefers-reduced-motion
- **Acceptance Criteria:**
  - [ ] Smooth continuous scroll
  - [ ] Seamless loop (no jump)
  - [ ] Respects prefers-reduced-motion
  - [ ] Passes tsc --noEmit

#### [BEHAVIOUR-007] GalleryThumbnailExpand

- **Type:** Feature
- **Priority:** P2
- **Estimate:** M
- **Dependencies:** SECTION-004
- **Added:** 2026-01-27
- **References:** [behaviour.spec.md](../skills/creativeshire/specs/components/experience/behaviour.spec.md), [gsap](../skills/gsap/SKILL.md)
- **Description:** Thumbnail expansion effect in Other Projects gallery
- **Context:** Analysis at `.claude/analyze/bojuhl/experience/behaviour/gallery-thumbnail-expand.md`
- **Approach:**
  1. Default: compressed thumbnails (~78px width)
  2. Hover: expand to ~268px with project details
  3. Animate width transition
  4. Show year, role, title, client, studio, WATCH button
- **Acceptance Criteria:**
  - [ ] Thumbnails compress by default
  - [ ] Expand on hover with details
  - [ ] Smooth width animation
  - [ ] Details visible in expanded state
  - [ ] Passes tsc --noEmit

#### [BEHAVIOUR-008] FloatingContactCTA

- **Type:** Feature
- **Priority:** P3
- **Estimate:** S
- **Dependencies:** CHROME-002
- **Added:** 2026-01-27
- **References:** [chrome-behaviour.spec.md](../skills/creativeshire/specs/components/experience/chrome-behaviour.spec.md)
- **Description:** Hover/interaction effects for floating contact button
- **Context:** Analysis at `.claude/analyze/bojuhl/experience/behaviour/floating-contact-cta.md`
- **Approach:**
  1. Hover state with slight scale or shadow
  2. Active state feedback
  3. Smooth transitions
- **Acceptance Criteria:**
  - [ ] Hover effect visible
  - [ ] Click feedback
  - [ ] Smooth transitions
  - [ ] Passes tsc --noEmit
