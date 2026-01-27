# Hero Text Blend Mode Effect

## Overview
The PORT12 logo text uses CSS `mix-blend-mode: difference` to create a knockout/mask effect where the video background shows through the text with inverted colors.

## Breakpoint: Mobile (375x812)

### Implementation
- **Text Element**: `<h1>` with white text
- **Parent Container**: Fixed position div with `mix-blend-mode: difference`
- **Effect**: Creates inverted color text that reveals the video beneath

### Structure
```html
<section class="h-svh relative overflow-hidden">
  <!-- Video background (z-index: 0) -->
  <video>...</video>

  <!-- Text container with blend mode -->
  <div class="fixed inset-x-0 top-0 z-0 h-svh flex flex-col items-center justify-center pointer-events-none"
       style="mix-blend-mode: difference;">
    <h1 class="font-title font-bold uppercase text-center text-white">
      PORT12
    </h1>
    <span>DROM DEL SKAB</span>
  </div>
</section>
```

### CSS Properties
```css
/* Parent container */
.hero-text-container {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 0;
}

/* Heading */
h1 {
  font-family: var(--font-title);
  font-weight: 900;
  text-transform: uppercase;
  text-align: center;
  line-height: 1;
  letter-spacing: 0.025em;
  color: white;
}
```

### Typography (Mobile)
| Property | Value |
|----------|-------|
| font-size | ~47px (responsive) |
| font-weight | 900 (black) |
| line-height | ~0.95 |
| letter-spacing | 1.2px |
| text-transform | uppercase |

### Visual Effect
1. White text overlays the video
2. `mix-blend-mode: difference` inverts colors where text overlaps video
3. Creates dynamic "knockout" effect as video plays
4. Light areas of video make text appear dark
5. Dark areas of video make text appear light

### Trigger
- **Type**: Static (always active)
- **Animation**: None on the text itself - effect is driven by video movement

### Mobile Considerations
- Fixed positioning maintains centered layout
- `pointer-events: none` allows scrolling through the hero
- Uses `h-svh` for Safari viewport handling

### Related Behaviours
- [hero-video-background.md](./hero-video-background.md) - Video that creates the effect
- [scroll-indicator.md](./scroll-indicator.md) - Indicator below the text

## Responsive Notes
- **Mobile (375px):** Font-size ~47px, centered layout
- **Tablet (768px):** Font-size scales up proportionally (~60-70px estimated), same blend mode effect, text remains centered in viewport
- **Desktop (1440px):** Font-size scales significantly (~80-100px estimated), dramatic mix-blend-mode effect with video. Text creates strong visual impact with inverted colors. Letters "PORT12" and tagline "DROM * DEL * SKAB" clearly visible with knockout effect revealing video beneath.
