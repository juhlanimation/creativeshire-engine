# ProjectCardHover

**Purpose:** Reveals a "WATCH" label overlay on project card images when tapped/hovered, indicating video content is available
**Type:** behaviour
**Applies to:** Project card image thumbnails in Projects section

## Trigger (Observed Defaults -> Props)
- Event: tap (touch on mobile) / hover (desktop)
- Target: Project card image container
- Threshold: N/A

## Animation (Observed Defaults -> Props)

### Keyframes
- From: "WATCH" label hidden or transparent
- To: "WATCH" label visible with semi-transparent overlay

### Timing
- Duration: ~150-200ms (estimated)
- Easing: ease-out
- Delay: 0ms

### CSS Variables Set
- `--card-overlay-opacity`: 0 -> 0.3 (dark overlay)
- `--watch-label-opacity`: 0 -> 1

## States
| State | Properties |
|-------|------------|
| Default | Image visible, no overlay, no label |
| Hover/Active | Dark overlay on image, "WATCH" label visible in magenta/pink |
| Pressed | May have additional feedback (not clearly observed) |

## Visual Details
- **"WATCH" label**:
  - Color: Magenta/pink (#FF00FF or similar)
  - Position: Upper left of image
  - Font: Sans-serif, uppercase
  - Size: Small, readable
- **Overlay**:
  - Color: Black with ~30% opacity
  - Covers entire image area
- **Image**:
  - Slight dim effect when overlay active

## GIF Reference
- Mobile: `../../assets/home-mobile.gif` @ ~7-8s (card interaction before modal opens)
- Tablet: `../../assets/home-tablet.gif` @ ~10-15s (hover states on project cards)
- Desktop: `../../assets/home-desktop.gif` @ ~3-5s (project card hover interactions)

## Responsive Notes
- Mobile: Triggered by tap only, touch feedback important for usability
- Tablet: **Hover-triggered** - "WATCH" label appears on mouse hover over card image
- Tablet: ~150-200ms transition duration for hover state
- Tablet: Hover also triggers image slideshow within card (multiple portfolio images cycle)
- Tablet: Dark overlay (~30% opacity) appears on hover with "WATCH" label
- Tablet: Project cards use alternating layout (text left/image right, then reversed)
- Desktop: **Hover-triggered** - "WATCH" label appears in upper-left of image on hover
- Desktop: Image appears to show video preview/animation on hover (dramatic scene changes)
- Desktop: Alternating layout continues (image left/text right, then reversed)
- Desktop: Smooth ~150-200ms transition for hover state
- Desktop: Hover-off returns to static thumbnail image

## Accessibility Considerations
- Cards should be focusable
- Keyboard activation should show same state
- "WATCH" label provides clear affordance
- Consider adding aria-label for screen readers

## Implementation Notes
- Only appears on project cards that have associated video content
- Provides visual cue that tapping will open video
- Smooth transition creates polished feel
- May use CSS :hover/:active or JavaScript touch events

## Props Schema
```typescript
interface ProjectCardHoverProps {
  hasVideo: boolean             // Whether card has video content
  watchLabel?: string           // Label text (default: "WATCH")
  overlayColor?: string         // Overlay color (default: "rgba(0,0,0,0.3)")
  labelColor?: string           // Watch label color (default: "#FF00FF")
  transitionDuration?: number   // Animation duration in ms (default: 200)
}
```

## Dependencies
- Requires: None (pure CSS possible)
- Used by: Project card component
- Triggers: VideoModal behaviour on click/tap
