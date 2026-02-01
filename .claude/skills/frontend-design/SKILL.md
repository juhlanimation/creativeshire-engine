---
name: frontend-design
description: Creating distinctive, production-grade interfaces that prioritize genuine design thinking over generic aesthetics. Use when building memorable UIs that stand out.
user-invocable: false
metadata:
  author: Anthropic
  version: "1.0.0"
  upstream: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design/skills/frontend-design
---

# Frontend Design

Guidelines for creating distinctive, memorable interfaces.

## When to Apply

Reference these guidelines when:
- Designing new pages or components from scratch
- Wanting to avoid generic "template" aesthetics
- Building portfolio pieces that need to stand out
- Creating brand-specific visual identity

## Core Philosophy

**Before coding, establish context:**

1. What is this interface's purpose?
2. What tonal direction fits? (minimal, maximal, retro-futuristic, etc.)
3. What technical constraints exist?
4. What will make this memorable?

**Success comes from intentional execution, not intensity level.**

---

## Typography

### The Principle

Choose fonts that are beautiful, unique, and interesting—not defaults.

### Guidelines

| Do | Don't |
|----|-------|
| Pair distinctive display fonts with refined body fonts | Use system fonts for everything |
| Create clear hierarchy through font pairing | Use more than 2-3 font families |
| Match typography to project tone | Default to Inter/System UI |

### Approach

```
Display Font (headlines, hero text)
    → Bold, distinctive, personality-driven
    → Used sparingly for impact

Body Font (paragraphs, UI text)
    → Highly readable, refined
    → Complements display font
```

### Anti-Patterns

- Using the same font for everything
- Overused fonts: Roboto, Open Sans for "safe" choices
- Mismatched pairings (casual display + formal body)

---

## Visual Composition

### The Principle

Employ asymmetry, overlap, diagonal flow, and unexpected layouts.

### Guidelines

| Technique | Purpose |
|-----------|---------|
| Asymmetry | Creates visual interest, avoids static feel |
| Overlap | Adds depth, connects elements |
| Diagonal flow | Guides eye, creates movement |
| Unexpected placement | Breaks monotony, memorable |

### Approach

```
Instead of:          Consider:
┌────────────────┐   ┌────────────────┐
│    Header      │   │         Header │
├────────────────┤   │    ┌──────────┤
│    Content     │   │    │ Content  │
│                │   │ ───┘          │
└────────────────┘   └────────────────┘
     (generic)          (distinctive)
```

### Creating Atmosphere

- Use contextual effects, textures, and layered details
- Avoid flat solid colors everywhere
- Consider gradients, subtle patterns, depth

---

## Motion & Interaction

### The Principle

Prioritize CSS animations and high-impact moments over scattered micro-interactions.

### High-Impact Opportunities

| Moment | Why It Matters |
|--------|----------------|
| Page load reveal | First impression, sets tone |
| Section transitions | Guides narrative flow |
| Hero animations | Captures attention |
| Exit transitions | Memorable conclusion |

### Approach

```typescript
// HIGH IMPACT: Staggered page load reveal
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
}

// LOW VALUE: Random hover effects everywhere
// (Avoid unless purposeful)
```

### Anti-Patterns

- Animating everything
- Inconsistent timing/easing
- Motion that doesn't serve the narrative
- Scroll-jacking (unless intentional experience)

---

## Code Quality

### The Principle

Produce functional, production-grade implementations that cohesively reflect the aesthetic vision.

### Guidelines

| Aspect | Requirement |
|--------|-------------|
| Functionality | Must work, not just look good |
| Cohesion | Every element serves the vision |
| Complexity | Match code complexity to design sophistication |
| Performance | Beautiful AND fast |

---

## What to Avoid

### Generic Patterns

| Pattern | Problem |
|---------|---------|
| Overused fonts | Forgettable, template-feel |
| Clichéd color schemes | Blue/white SaaS, dark mode default |
| Predictable layouts | Header → Hero → Features → Footer |
| Designs lacking context | One-size-fits-all approach |

### The "Template" Trap

Signs your design is too generic:
- Could be used for any company/project
- Follows obvious trends without adaptation
- No personality or distinctive character
- Looks like a purchased template

---

## Design Process

### 1. Establish Direction

Before writing code, answer:
- What emotion should this evoke?
- What's the single most important element?
- What makes this project unique?

### 2. Commit to a Concept

Pick a clear direction:
- Brutally minimal
- Maximalist chaos
- Retro-futuristic
- Editorial sophistication
- Playful and energetic

**Commit fully.** Half-measures create forgettable work.

### 3. Execute Intentionally

Every decision should serve the concept:
- Typography reinforces tone
- Colors support mood
- Motion enhances narrative
- Layout guides attention

### 4. Refine Details

The difference between good and great:
- Micro-interactions that delight
- Thoughtful hover states
- Considered empty states
- Polished transitions

---

## Quick Reference

| Question | Framework |
|----------|-----------|
| Is it distinctive? | Would someone remember this tomorrow? |
| Is it intentional? | Can you explain every design choice? |
| Is it cohesive? | Do all elements serve the same vision? |
| Is it functional? | Does it actually work well? |

---

## Integration with Creativeshire

In the creativeshire engine:

| Layer | Design Consideration |
|-------|---------------------|
| **Widgets** | Distinctive but flexible components |
| **Sections** | Unique layouts, not template grids |
| **Chrome** | Navigation/overlays with character |
| **Experience** | Motion that tells a story |
| **Presets** | Cohesive bundled aesthetics |

The Experience layer is where distinctive motion lives. The Content layer is where distinctive layouts and typography live.

---

## See Also

- [Styling Spec](../engine/specs/reference/styling.spec.md) - Tailwind/CSS patterns
- [Widget Spec](../engine/specs/components/content/widget.spec.md) - Component rules
- [Experience Layer](../engine/specs/layers/experience.spec.md) - Animation system
