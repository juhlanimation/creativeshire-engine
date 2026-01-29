# Effects

**Named by MECHANISM, not trigger.**

Structure:
```
effects/
├── fade.css              # Opacity (fade-reveal, modal-fade, modal-backdrop)
├── transform/
│   ├── scale.css         # Scale (scale-reveal, scale-hover, modal-scale)
│   └── slide.css         # Slide/translate (text-reveal)
├── mask/
│   ├── wipe.css          # Clip-path wipe (modal-mask)
│   └── reveal.css        # Clip-path reveal (mask-reveal)
├── color-shift.css       # Color transitions
├── overlay-darken.css    # Background overlay
├── marquee-scroll.css    # Infinite scroll animation
├── contact-reveal.css    # Widget-specific (consider colocating)
├── thumbnail-expand.css  # Widget-specific (consider colocating)
└── index.css             # Barrel imports
```

Before creating:
- Is this named by VISUAL MECHANISM (fade, mask, scale)?
- NOT by trigger (scroll, hover) - that's Behaviours.
- Does it only define HOW values animate (transitions)?
- Is the name generic? No widget names (not `thumbnail-expand`).

Spec: [effect.spec.md](/.claude/skills/creativeshire/specs/components/experience/effect.spec.md)
