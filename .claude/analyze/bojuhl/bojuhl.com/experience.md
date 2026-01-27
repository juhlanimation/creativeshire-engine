# Experience Analysis: bojuhl.com

## Overview

The site uses scroll-driven experiences as the primary interaction pattern, with video modals for project deep-dives. No external animation libraries detected - likely CSS animations and React state management.

---

## Behaviours

### 1. Scroll-Driven Background Transition

**Location:** Hero section
**Type:** Background image swap based on scroll position

#### Observed Behaviour
- Hero section has multiple illustrated background images
- As user scrolls, background transitions between scenes:
  - Scene 1: Forest with blue creature carrying barrel
  - Scene 2: Yellow goblin characters in stone setting
  - Scene 3: Green nature scene (transition to about)

#### Technical Approach
```typescript
// Likely implementation
type ScrollBackgroundBehaviour = {
  trigger: 'scroll';
  property: 'backgroundImage' | 'opacity';
  keyframes: Array<{
    scrollProgress: number; // 0-1
    image: string;
    opacity?: number;
  }>;
};
```

#### Creativeshire Mapping
- **Behaviour:** `ScrollReveal` or custom `BackgroundSwap`
- **Driver:** `ScrollProgress` (tracks scroll position as 0-1)
- **Trigger:** `onScroll` with debounce

---

### 2. Logo Marquee Animation

**Location:** Client logos section
**Type:** Infinite horizontal scroll

#### Observed Behaviour
- Logos scroll continuously from right to left
- Seamless loop (logos duplicated for seamless transition)
- No pause on hover
- Consistent speed

#### Technical Approach
```css
/* CSS animation approach */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-track {
  animation: marquee 30s linear infinite;
}
```

#### Creativeshire Mapping
- **Behaviour:** `MarqueeScroll`
- **Props:** `direction: 'left'`, `speed: 30`, `pauseOnHover: false`

---

### 3. Video Modal System

**Location:** Project cards
**Type:** Click-triggered modal with video player

#### Observed Behaviour
- Project images are clickable
- Click opens modal overlay
- Video autoplays (likely)
- Custom controls: close, progress, mute, volume
- Click outside or close button dismisses

#### Technical Approach
```typescript
type VideoModalBehaviour = {
  trigger: 'click';
  target: 'projectImage';
  modal: {
    component: 'VideoPlayer';
    backdrop: 'dark';
    closeOnBackdropClick: true;
  };
};
```

#### Creativeshire Mapping
- **Behaviour:** `ModalReveal`
- **Trigger:** `onClick`
- **Content:** `VideoPlayer` widget

---

### 4. Contact Reveal

**Location:** Floating contact CTA
**Type:** Click/hover reveal

#### Observed Behaviour
- "How can I help you?" text
- Interaction reveals email address
- Email likely becomes copyable/clickable

#### Creativeshire Mapping
- **Behaviour:** `TextSwap` or `Reveal`
- **Trigger:** `onClick` or `onHover`

---

## Triggers

| Trigger | Target | Action |
|---------|--------|--------|
| `scroll` | Hero section | Background image transition |
| `scroll` | Scroll indicator | Fade out |
| `click` | Project image | Open video modal |
| `click` | Contact CTA | Reveal email |
| `click` | Gallery thumbnail | Show project info |
| `hover` | Project card | Subtle scale/shadow (possible) |

---

## Drivers

### ScrollProgress Driver
```typescript
type ScrollProgressDriver = {
  type: 'scroll';
  target: 'window' | 'element';
  output: {
    variable: '--scroll-progress';
    range: [0, 1];
  };
};
```

### ViewportVisibility Driver
```typescript
type ViewportVisibilityDriver = {
  type: 'intersection';
  threshold: 0.5;
  output: {
    variable: '--in-view';
    values: [0, 1];
  };
};
```

---

## Animation Timing

| Element | Duration | Easing |
|---------|----------|--------|
| Background transition | ~500ms | ease-out |
| Logo marquee | 30s | linear |
| Modal open | ~300ms | ease-out |
| Modal close | ~200ms | ease-in |
| Hover effects | ~200ms | ease |

---

## No External Libraries

The site appears to achieve all animations without GSAP, Framer Motion, or Locomotive Scroll. This suggests:

1. **CSS animations** for marquee and basic transitions
2. **React state** for scroll position tracking
3. **IntersectionObserver** for visibility triggers
4. **CSS transforms** for performance

---

## Creativeshire Implementation Plan

### Required Behaviours
1. `ScrollBackgroundSwap` - New behaviour for hero effect
2. `MarqueeScroll` - Existing or new for logo strip
3. `ModalReveal` - Standard modal pattern
4. `TextReveal` - Simple state toggle

### Required Drivers
1. `ScrollProgress` - Track page scroll as normalized value
2. `IntersectionDriver` - Track element visibility

### Required Triggers
1. `ScrollTrigger` - Fire on scroll thresholds
2. `ClickTrigger` - Standard click handler
3. `HoverTrigger` - Mouse enter/leave
