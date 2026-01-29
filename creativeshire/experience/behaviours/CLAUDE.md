# Behaviours

**Named by TRIGGER, not effect.**

Structure:
- `scroll/` — Scroll-based (progress, direction, velocity)
- `hover/` — Hover-based (sets --hover: 0|1)
- `visibility/` — IntersectionObserver (sets --visible, --visibility)
- `interaction/` — Click/tap (sets --active: 0|1)

Before creating:
- Is this named by TRIGGER (scroll, hover, visibility)?
- NOT by effect (fade, scale, mask) — that's Effects.
- Does it only set CSS variable VALUES?
- Is the name generic? No widget names (not `project-card-hover`).

Spec: [behaviour.spec.md](/.claude/skills/creativeshire/specs/components/experience/behaviour.spec.md)
