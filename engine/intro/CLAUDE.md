# Intro

**Optional pre-experience sequences (splash screens, cinematic reveals, timed gates).**

L2 sub-layer that wraps ExperienceProvider. Manages phase lifecycle, scroll locking, and reveal animations.

Structure:
```
intro/
├── types.ts                    # IntroPhase, IntroState, IntroConfig, IntroPattern
├── IntroProvider.tsx           # Provider, store, scroll locking
├── IntroContext.ts             # React context, useIntro()
├── IntroTriggerInitializer.tsx # Wires triggers based on pattern
├── registry.ts                 # Pattern registry
├── patterns/                   # Pattern definitions
│   ├── video-gate/             # Video playback gate
│   ├── timed/                  # Timer-based gate
│   └── scroll-reveal/          # Non-blocking reveal
└── triggers/                   # Trigger hooks
    ├── useVideoTime.ts         # Video currentTime monitor
    ├── useTimer.ts             # RAF-based timer
    └── usePhaseController.ts   # Phase orchestrator
```

Behaviours live in `experience/behaviours/intro/` (they are L2 behaviours).

Key rules:
1. **Phase lifecycle:** locked -> revealing -> ready
2. **Wraps Experience** — never replaces it
3. **CSS variables only** — behaviours output `--intro-*` variables
4. **Patterns are generic** — no site names, CMS-configurable settings
5. **No content/ imports** — intro is L2, not L1

Spec: [intro.spec.md](/.claude/skills/engine/specs/layers/intro.spec.md)
