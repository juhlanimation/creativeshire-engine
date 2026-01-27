# Hero Video Background

## Overview
Full-screen video background in the hero section that plays automatically and creates the base visual layer for the mix-blend-mode text effect.

## Breakpoint: Mobile (375x812)

### Implementation
- **Element**: `<video>` with `<source>` elements (webm + mp4 fallback)
- **Position**: `fixed` - stays in place while content scrolls over it
- **Z-index**: `0` - lowest layer, behind all content
- **Size**: Full viewport (`100vw x 100vh`)
- **Object-fit**: `cover` - maintains aspect ratio, fills container

### Video Properties
| Property | Value |
|----------|-------|
| autoplay | true |
| muted | true |
| loop | false (plays through showreel) |
| playsinline | true (required for iOS) |

### Video Sources
```
Primary: /video/showreel.webm
Fallback: /video/showreel.mp4
```

### CSS Implementation
```css
video {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  object-fit: cover;
  z-index: 0;
}
```

### Trigger
- **Type**: Page load
- **Behavior**: Video starts playing immediately on page load (autoplay)

### Mobile Considerations
- Uses `playsinline` attribute for iOS autoplay support
- Video is muted (required for autoplay on mobile)
- Uses `100dvh` for proper mobile viewport handling

### Related Behaviours
- [hero-text-blend-mode.md](./hero-text-blend-mode.md) - Text that blends with this video

## Responsive Notes
- **Mobile (375px):** Full viewport video, `100dvh` for mobile viewport handling
- **Tablet (768px):** Same implementation, video scales to fill 768x1024 viewport, aspect ratio maintained via `object-fit: cover`
- **Desktop (1440px):** Same implementation, video scales to fill 1440x900 viewport. `object-fit: cover` maintains aspect ratio, video may be cropped on sides. Higher resolution video quality visible. Fixed positioning keeps video in place during scroll.
