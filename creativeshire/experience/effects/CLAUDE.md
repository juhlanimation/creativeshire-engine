# Effects

**Named by MECHANISM, not trigger.**

Structure:
- `fade.css` — Opacity (single file at root)
- `transform/` — Position, scale, rotation (slide, scale, rotate, flip)
- `mask/` — Clip-path based (wipe, expand)
- `emphasis/` — Attention/looping (pulse, shake, bounce)
- `page/` — Route transitions (later)

Before creating:
- Is this named by VISUAL MECHANISM (fade, mask, scale)?
- NOT by trigger (scroll, hover) — that's Behaviours.
- Does it only define HOW values animate (transitions)?
- Is the name generic? No widget names (not `thumbnail-expand`).

Spec: [effect.spec.md](/.claude/skills/creativeshire/specs/components/experience/effect.spec.md)
