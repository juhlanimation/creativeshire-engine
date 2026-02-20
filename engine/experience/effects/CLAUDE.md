# Effects

**Named by MECHANISM, not trigger.**

Structure:
```
effects/
├── color-shift/         # Color/blend transitions
│   └── color-shift.css
├── emphasis/            # Attention/looping (spin, pulse, shake, bounce)
│   └── spin.css
├── fade/                # Opacity-based animations
│   └── fade.css
├── marquee/             # Infinite scroll animation
│   └── marquee-scroll.css
├── mask/                # Clip-path based
│   ├── wipe.css
│   └── reveal.css
├── overlay/             # Background overlay darkening
│   └── overlay-darken.css
├── reveal/              # Progressive clip-path reveals
│   ├── clip-path.css
│   └── index.css
├── transform/           # Position, scale, rotation
│   ├── scale.css
│   └── slide.css
└── index.css            # Barrel imports
```

Widget-specific effects (colocated with widgets):
- `color-shift` (EmailCopy) → widgets/interactive/EmailCopy/styles.css
- `flex-expand` (ExpandRowThumbnail) → widgets/repeaters/ExpandRowImageRepeater/ExpandRowThumbnail/styles.css

Before creating:
- Is this named by VISUAL MECHANISM (fade, mask, scale)?
- NOT by trigger (scroll, hover) - that's Behaviours.
- Does it only define HOW values animate (transitions)?
- Is the name generic? No widget names.

Spec: [effect.spec.md](/.claude/skills/engine/specs/components/experience/effect.spec.md)
