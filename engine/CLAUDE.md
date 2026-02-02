# Creativeshire Engine

**CMS engine core. Think Squarespace/Webflow.**

Everything here is GENERIC and CONFIGURABLE. No site-specific code.

Structure:
```
engine/
├── content/          # L1: Renders once
│   ├── widgets/      # primitives/, layout/, composite/
│   ├── sections/     # patterns/
│   └── chrome/       # regions/, overlays/
├── experience/       # L2: Animates 60fps
│   ├── behaviours/   # Named by TRIGGER
│   ├── effects/      # Named by MECHANISM
│   ├── drivers/      # Infrastructure
│   └── experiences/  # Experience definitions
├── presets/          # Templates (copied to site/)
├── renderer/         # Schema → React
└── schema/           # TypeScript types
```

Key rules:
1. **Generalized** — No site names in components
2. **L1/L2 split** — Content renders, Experience animates
3. **CSS variables** — Bridge between L1 and L2
4. **Behaviours = TRIGGER** — scroll/, hover/, visibility/
5. **Effects = MECHANISM** — fade, mask/, transform/

See: [Root CLAUDE.md](/CLAUDE.md) for full architecture details.
