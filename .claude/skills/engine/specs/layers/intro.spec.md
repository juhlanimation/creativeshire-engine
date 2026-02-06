# Intro Layer (L2 Sub-Layer)

> Optional pre-experience sequences: splash screens, cinematic reveals, timed gates.

---

## Purpose

The **Intro Layer** runs before the Experience layer takes over. It manages choreographed reveal sequences — scroll locking, phased content reveals, chrome show/hide — then hands control to the normal Experience flow.

Intro is an **L2 concept**: it manages state (phase lifecycle), controls interaction (scroll locking), feeds CSS variables (via intro behaviours), and uses triggers (event -> store updates). It wraps `ExperienceProvider` and composes with any experience.

---

## Owns

```
engine/intro/
├── types.ts                    # IntroPhase, IntroState, IntroConfig, IntroPattern
├── IntroProvider.tsx           # Provider, store creation, scroll locking
├── IntroContext.ts             # React context, useIntro(), useIntroRequired()
├── IntroTriggerInitializer.tsx # Wires trigger hooks based on pattern
├── registry.ts                 # Pattern registry (Map-based)
├── index.ts                    # Barrel export
├── patterns/
│   ├── index.ts                # Registers all patterns, exports
│   ├── video-gate/             # Video playback gate pattern
│   │   ├── index.ts
│   │   └── meta.ts
│   ├── timed/                  # Timer-based pattern
│   │   ├── index.ts
│   │   └── meta.ts
│   └── scroll-reveal/          # Scroll-based reveal pattern
│       ├── index.ts
│       └── meta.ts
└── triggers/
    ├── index.ts                # Barrel export
    ├── useVideoTime.ts         # Video currentTime monitor
    ├── useTimer.ts             # RAF-based timer
    └── usePhaseController.ts   # Phase orchestrator
```

**Behaviours** live in `engine/experience/behaviours/intro/` (they are L2 behaviours that read intro state):
```
engine/experience/behaviours/intro/
├── index.ts                    # Auto-registers all, re-exports
├── content-reveal.ts           # --intro-opacity, --intro-y, --intro-scale
├── text-reveal.ts              # --intro-text-opacity, --intro-text-y, --intro-text-clip
├── chrome-reveal.ts            # --chrome-opacity, --chrome-y, --chrome-visible
└── scroll-indicator.ts         # --scroll-indicator-opacity, --scroll-indicator-visible
```

---

## Phase Lifecycle

```
locked → revealing → ready
```

| Phase | Scroll | Chrome | Description |
|-------|--------|--------|-------------|
| `locked` | Blocked | Hidden (if hideChrome) | Intro running, user can't scroll |
| `revealing` | Unlocked | Transitioning | Trigger fired, content animating in |
| `ready` | Unlocked | Visible | Intro complete, normal interaction |

Phase transitions are managed by `usePhaseController`. Triggers (video-time, timer) call `triggerReveal()` which animates `revealProgress` 0->1 via RAF, then calls `completeIntro()`.

---

## Patterns

Patterns define **what kind of intro** a site uses. Each pattern bundles triggers, reveal timing, and chrome visibility.

| Pattern | Triggers | Chrome Hidden | Use Case |
|---------|----------|---------------|----------|
| `video-gate` | video-time | Yes | Wait for video to reach target time, then reveal |
| `timed` | timer | Yes | Wait N milliseconds, then reveal |
| `scroll-reveal` | scroll, visibility | No | Reveal immediately, no blocking |

### video-gate

Locks scroll while a background video plays. When video reaches `targetTime`, triggers content reveal. Chrome stays hidden until complete.

Settings: `targetTime` (3s), `fps` (30), `revealDuration` (800ms)

### timed

Simple timer gate. Locks scroll for `duration` milliseconds, then reveals. Good for splash screens.

Settings: `duration` (2000ms), `revealDuration` (800ms)

### scroll-reveal

Non-blocking pattern. Content reveals immediately without scroll locking. Uses scroll and visibility triggers for staggered reveals.

Settings: `revealDuration` (600ms), `scrollDelay` (0ms)

---

## Triggers

Trigger hooks monitor conditions and fire `triggerReveal()` when met.

| Trigger | File | Watches | Updates |
|---------|------|---------|---------|
| `useVideoTime` | `triggers/useVideoTime.ts` | Video `currentTime` via RAF + timeupdate | `videoTime` in store |
| `useTimer` | `triggers/useTimer.ts` | `performance.now()` via RAF | `timerElapsed` in store |
| `usePhaseController` | `triggers/usePhaseController.ts` | Phase transitions | `phase`, `revealProgress`, `completeIntro()` |

`usePhaseController` is always active. It provides `triggerReveal()` which other triggers call.

---

## Behaviours

Intro behaviours live in `experience/behaviours/intro/` because they are standard L2 behaviours that read from the intro store.

| Behaviour | CSS Variables | Purpose |
|-----------|---------------|---------|
| `intro/content-reveal` | `--intro-opacity`, `--intro-y`, `--intro-scale`, `--intro-progress` | Main content fade+slide+scale |
| `intro/text-reveal` | `--intro-text-opacity`, `--intro-text-y`, `--intro-text-clip`, `--intro-text-progress` | Staggered text reveals |
| `intro/chrome-reveal` | `--chrome-opacity`, `--chrome-y`, `--chrome-visible` | Header/footer slide in |
| `intro/scroll-indicator` | `--scroll-indicator-opacity`, `--scroll-indicator-visible`, `--scroll-indicator-pulse` | Scroll hint after intro |

All behaviours respect `prefersReducedMotion`.

---

## Schema Integration

### Site Level

```typescript
// engine/schema/site.ts
interface SiteSchema {
  intro?: IntroConfig    // Optional site-wide intro
  // ...
}
```

### Page Level

```typescript
// engine/schema/page.ts
interface PageSchema {
  intro?: IntroConfig | 'disabled'   // Override or disable site intro
  // ...
}
```

Resolution: `page.intro === 'disabled'` -> no intro. `page.intro` -> use page's. Fallback -> `site.intro`.

---

## Provider Hierarchy

```
ThemeProvider
  └── IntroProvider          ← Creates store, manages scroll lock
        └── ExperienceProvider
              └── ...
```

IntroProvider wraps ExperienceProvider. If no pattern is configured, IntroProvider renders children directly (no context overhead). The store starts in `ready` state when no pattern exists.

---

## Skip Logic

| Condition | Result |
|-----------|--------|
| No `site.intro` config | No intro (provider passes through) |
| `page.intro === 'disabled'` | No intro for this page |
| Page has own `page.intro` | Uses page intro instead of site intro |
| Deep link to non-home page | Respects page-level config |

---

## Relationship to Experience Layer

Intro is **not** an Experience. It's a layer that **wraps** any Experience.

| Aspect | Intro | Experience |
|--------|-------|------------|
| **Scope** | Pre-reveal sequence | Ongoing interaction |
| **Duration** | Finite (completes) | Continuous |
| **Scroll** | Can lock | Never locks |
| **Provider position** | Wraps ExperienceProvider | Inside IntroProvider |
| **Composable** | Yes, with any experience | Independent |

The deprecated `intro-sequence` experience attempted to handle intro as an Experience. This was incorrect because intros are finite sequences that compose with (not replace) the site's experience.

---

## Creating a New Pattern

1. Create folder: `engine/intro/patterns/{name}/`
2. Add `meta.ts` with `SettingsConfig` (type, label, default for each setting)
3. Add `index.ts` exporting `IntroPattern` definition
4. Register in `patterns/index.ts`
5. Add pattern ID to `IntroConfig.pattern` union type in `types.ts`

---

## Related Documents

- Experience Layer: [experience.spec.md](./experience.spec.md)
- Intro Component Contract: [intro.spec.md](../components/intro/intro.spec.md)
- Behaviour Contract: [behaviour.spec.md](../components/experience/behaviour.spec.md)
- Glossary: [glossary.spec.md](../core/glossary.spec.md)
