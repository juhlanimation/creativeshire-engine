# Effects

**Named by MECHANISM, not trigger.**

Structure:
```
effects/
├── fade.css              # Opacity (fade-reveal, modal-fade, modal-backdrop, label-fade)
├── transform/
│   ├── scale.css         # Scale (scale-reveal, scale-hover, modal-scale)
│   └── slide.css         # Slide/translate (text-reveal)
├── mask/
│   ├── wipe.css          # Clip-path wipe (modal-mask)
│   └── reveal.css        # Clip-path reveal (mask-reveal)
├── color-shift.css       # Color transitions
├── overlay-darken.css    # Background overlay
├── marquee-scroll.css    # Infinite scroll animation
└── index.css             # Barrel imports
```

Widget-specific effects (colocated with widgets):
- `color-shift` (ContactPrompt) → widgets/composite/ContactPrompt/styles.css
- `flex-expand` (GalleryThumbnail) → widgets/composite/GalleryThumbnail/styles.css

Before creating:
- Is this named by VISUAL MECHANISM (fade, mask, scale)?
- NOT by trigger (scroll, hover) - that's Behaviours.
- Does it only define HOW values animate (transitions)?
- Is the name generic? No widget names.

Spec: [effect.spec.md](/.claude/skills/creativeshire/specs/components/experience/effect.spec.md)
