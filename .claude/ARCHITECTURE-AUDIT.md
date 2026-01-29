# Architecture Audit

## Summary

This document captures the full audit of the creativeshire engine structure, identifying issues and proposing a clean architecture.

---

## Widget Hierarchy (Correct)

```
PRIMITIVES (atoms - no children, single purpose)
  Text, Image, Video, Icon, Button, Link

LAYOUT (structure - holds children)
  Stack, Grid, Flex, Split, Container, Box

COMPOSITES (layout + primitives assembled)
  Any static content = Layout(Primitives)
```

---

## Folder Structure Issues

### 1. `content/widgets/primitives/`

| Widget | Status | Issue |
|--------|--------|-------|
| `Text` | ✓ | Primitive |
| `Image` | ✓ | Primitive |
| `Video` | ✓ | Primitive |
| `ContactPrompt` | ✗ | NOT primitive - has icons, state machine, multiple text. Move to `composite/` |
| `LogoLink` | ✗ | Too specific name. Rename to `Link` (generalized) |

**Missing primitives:** Icon, Button

---

### 2. `content/widgets/layout/`

| Widget | Status | Issue |
|--------|--------|-------|
| `Box` | ✓ | Layout |
| `Flex` | ✓ | Layout |
| `ExpandableGalleryRow` | ✗ | NOT layout - has images, videos, text, state, modal integration. Move to `composite/` |

**Missing layouts:** Stack, Grid, Split, Container

---

### 3. `content/widgets/composite/`

| Widget | Implementation | Status |
|--------|---------------|--------|
| `ProjectCard` | Factory → WidgetSchema | ✓ Good pattern |
| `GalleryThumbnail` | React component | ✓ Complex, needs local state |
| `VideoPlayer` | React component | ✓ Complex, needs local state |

**Pattern:** Two valid composite types:
- `create*` factories (return WidgetSchema) - declarative
- React components - for complex state

---

### 4. `content/sections/patterns/`

| Pattern | Status |
|---------|--------|
| `Hero` | ✓ Factory function, configurable |
| `About` | ✓ Factory function, configurable |
| `FeaturedProjects` | ✓ Factory function, configurable |
| `OtherProjects` | ✓ Factory function |

Section patterns are well-structured.

---

### 5. `content/chrome/`

| Folder | Contents | Status |
|--------|----------|--------|
| `regions/` | Footer | ✓ Correct location |
| `overlays/` | Modal, CursorLabel | ✓ Correct location |

Chrome is well-structured.

---

### 6. `experience/behaviours/` (MAJOR ISSUES)

**Problem:** Behaviours are named by EFFECT, not by TRIGGER.

Behaviours compute VALUES based on INPUT. The input is the TRIGGER:
- Scroll position
- Hover state
- Visibility (in-view)
- Click/interaction

The EFFECT (fade, mask, scale) should be SEPARATE.

**Current (problematic):**
```
behaviours/
├── fade-in                      # Effect name, not trigger
├── scroll-fade                  # Mixed
├── scroll-fade-out             # Mixed
├── hover-reveal                # Mixed
├── contact-reveal              # Widget-specific
├── floating-contact-cta        # Widget-specific
├── gallery-thumbnail-expand    # Widget-specific
├── hero-text-color-transition  # Widget-specific
├── logo-marquee-animation      # Widget-specific
├── project-card-hover          # Widget-specific
├── scroll-indicator-fade       # Widget-specific
├── video-modal                 # Widget-specific
├── reveal/
│   ├── fade-reveal             # Effect in behaviour folder
│   ├── mask-reveal             # Effect in behaviour folder
│   └── scale-reveal            # Effect in behaviour folder
└── modal/
    ├── modal-fade              # Modal-specific
    ├── modal-mask-wipe         # Modal-specific
    └── modal-scale             # Modal-specific
```

**Proposed (clean):**
```
behaviours/
├── scroll/           Scroll-based triggers
│   ├── progress.ts   # 0-1 based on scroll position
│   ├── direction.ts  # up/down detection
│   └── velocity.ts   # scroll speed
├── hover/            Hover-based triggers
│   └── state.ts      # sets --hover: 0|1
├── visibility/       IntersectionObserver triggers
│   └── in-view.ts    # sets --visible: 0|1, --visibility: 0-1
└── interaction/      Click/tap triggers
    └── toggle.ts     # sets --active: 0|1
```

Then EFFECTS handle HOW values animate.

---

### 7. `experience/effects/` (NEEDS RESTRUCTURE)

**Current (flat CSS files, some widget-specific):**
```
effects/
├── color-shift.css
├── contact-reveal.css     # Widget-specific
├── fade-reveal.css
├── marquee-scroll.css     # Widget-specific
├── mask-reveal.css
├── modal-backdrop.css
├── modal-fade.css
├── modal-mask.css
├── modal-scale.css
├── overlay-darken.css
├── scale-hover.css
├── scale-reveal.css
├── text-reveal.css
├── thumbnail-expand.css   # Widget-specific
└── index.css
```

**Proposed (organized by visual mechanism):**
```
effects/
├── fade.css              # Opacity (single file)
├── transform/            # Position, scale, rotation
│   ├── slide.css
│   ├── scale.css
│   ├── rotate.css
│   └── flip.css
├── mask/                 # Clip-path based
│   ├── wipe.css
│   └── expand.css
├── emphasis/             # Attention/looping
│   ├── pulse.css
│   └── shake.css
└── page/                 # Route transitions (later)
```

Widget-specific effects should be colocated WITH the widget or generalized.

---

### 8. `experience/hooks/` (DELETE)

**Current:**
```
hooks/
├── useGsapReveal.ts           # → effects/mask/
├── useScrollFadeBehaviour.ts  # → behaviours/scroll/
├── useScrollIndicatorFade.ts  # → colocate with widget
├── useTransitionComplete.ts   # → colocate with consumer
└── useVisibilityPlayback.ts   # → colocate with consumer
```

**Proposed:** Delete folder. Redistribute contents:
- Effect hooks → `effects/`
- Behaviour hooks → `behaviours/`
- Widget-specific → colocate with widget
- Generic utilities → colocate with consumer or `utils/`

---

### 9. `experience/transitions/` (DELETE)

Should be consolidated into `effects/`. The `RevealTransition` component moves to `effects/mask/`.

---

### 10. `experience/drivers/` ✓

Clean and generic.

---

### 11. `experience/modes/` ✓

Clean and generic.

---

## Key Principles

### 1. Generalization Rule
Everything is a CMS building block. No site-specific names.

| ❌ Site-specific | ✅ Generalized |
|-----------------|----------------|
| `BojuhlHero` | `Hero` with settings |
| `ContactPrompt` | `CopyButton` or composite |
| `logo-marquee-animation` | `marquee` behaviour |
| `project-card-hover` | `hover/state` behaviour |

### 2. Separation of Concerns

```
BEHAVIOUR (trigger)     →  Sets CSS variable VALUE
                            --visible: 1, --scroll: 0.5

EFFECT (transition)     →  Defines HOW value animates
                            transition: opacity 400ms ease
```

Behaviours don't know about effects. Effects don't know about triggers.

### 3. Naming by Function

| Layer | Named by |
|-------|----------|
| Behaviours | TRIGGER (scroll, hover, visibility) |
| Effects | VISUAL MECHANISM (fade, mask, transform) |
| Widgets | PURPOSE (Text, Image, ProjectCard) |

### 4. Colocation

Hooks, stores, and utilities live WITH the component that uses them.
- `VideoPlayer/hooks/` ✓
- `experience/hooks/useScrollIndicatorFade.ts` ✗ (move to widget)

---

## Refactoring Priority

1. ~~**High:** Multi-page App Router support~~ ✓ DONE
2. **High:** Behaviours restructure (trigger-based)
3. **High:** Effects restructure (mechanism-based)
4. **High:** Delete `hooks/` folder, redistribute contents
5. **High:** Delete `transitions/` folder, move to `effects/mask/`
6. **Medium:** Move misplaced widgets (ContactPrompt, ExpandableGalleryRow)
7. **Medium:** Rename primitives (LogoLink → Link)
8. **Low:** Add missing primitives (Icon, Button)
9. **Low:** Add missing layouts (Stack, Grid, Split)

---

## Multi-Page Architecture ✓ IMPLEMENTED

```
app/
└── [[...slug]]/
    └── page.tsx      # Dynamic catch-all with generateStaticParams

site/
├── config.ts         # pages: [{ id, slug }, ...]
└── pages/
    ├── index.ts      # getPageBySlug, getAllPages registry
    ├── home.ts       # slug: '/'
    └── {page}.ts     # Additional pages
```

**Next.js 16 Cache Components:** Async params access requires Suspense wrapper.
See `app/CLAUDE.md` for pattern.
