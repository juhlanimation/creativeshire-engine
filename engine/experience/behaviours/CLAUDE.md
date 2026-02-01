# Behaviours

**Named by TRIGGER, not effect.**

Structure:
- `scroll/` — Scroll-based (progress, direction, velocity)
- `hover/` — Hover-based (sets --hover: 0|1)
- `visibility/` — IntersectionObserver (sets --visible, --visibility)
- `animation/` — Continuous/looping (marquee, pulse)
- `interaction/` — Click/tap (sets --active: 0|1)

Behaviours:
- `scroll/progress` — Section scroll progress (0-1)
- `scroll/fade` — Fade based on scroll position
- `scroll/fade-out` — Fade out as section scrolls away
- `scroll/color-shift` — Color transitions on scroll
- `scroll/image-cycle` — Cycle through images on scroll
- `hover/reveal` — Reveal content on hover
- `hover/scale` — Scale on hover
- `hover/expand` — Expand element on hover
- `visibility/fade-in` — Fade in when visible
- `animation/marquee` — Continuous horizontal scroll
- `interaction/toggle` — Toggle state (--active: 0|1)

Before creating:
- Is this named by TRIGGER (scroll, hover, visibility, animation, interaction)?
- NOT by effect (fade, scale, mask) — that's Effects.
- Does it only set CSS variable VALUES?
- Is the name generic? No widget names (not `project-card-hover`).

Spec: [behaviour.spec.md](/.claude/skills/engine/specs/components/experience/behaviour.spec.md)
