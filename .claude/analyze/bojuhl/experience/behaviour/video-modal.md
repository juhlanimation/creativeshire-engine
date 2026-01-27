# VideoModal

**Purpose:** Opens a fullscreen video player modal when a project card is tapped, allowing users to view project videos/reels
**Type:** behaviour
**Applies to:** Project cards in Projects section

## Trigger (Observed Defaults -> Props)
- Event: tap (click on mobile)
- Target: Project card image area
- Threshold: N/A

## Animation (Observed Defaults -> Props)

### Modal Open
- From: Hidden (display: none or opacity: 0)
- To: Fullscreen overlay with video player

### Modal Close
- From: Visible fullscreen
- To: Hidden, returns to scroll position

### Timing
- Duration: ~200-300ms (estimated)
- Easing: ease-out (assumed)
- Delay: 0ms

### CSS Variables Set
- `--modal-visible`: 1 | 0
- Body overflow likely set to hidden when modal open

## States
| State | Properties |
|-------|------------|
| Closed | Modal hidden, page scrollable |
| Open | Fullscreen black overlay, video centered, X button visible |
| Playing | Video auto-plays on open |

## Modal UI Elements
- **Close button (X)**: Top-left corner, circular dark button with white X
- **Video player**: Centered, maintains aspect ratio
- **Progress bar**: Bottom of video, shows current time / total duration
- **Volume control**: Slider control below video
- **Background**: Full black overlay

## Video Player Controls
- Progress indicator: "0:15" / "1:04" format
- Volume slider: Horizontal slider with speaker icon
- Auto-play: Video starts playing automatically when modal opens

## GIF Reference
- Mobile: `../../assets/home-mobile.gif` @ ~8-12s (modal open/close sequence)
- Tablet: `../../assets/home-tablet.gif` @ ~15-20s (modal open/close if captured)
- Desktop: `../../assets/home-desktop.gif` @ ~4-5s (video modal open/close)

## Responsive Notes
- Mobile: Fullscreen modal covers entire viewport, touch-friendly close button
- Tablet: Same fullscreen modal behaviour
- Tablet: Close button (X) positioned top-left, adequate click target
- Tablet: Video maintains aspect ratio, controls remain consistent
- Tablet: Can be triggered by hover + click (hover reveals "WATCH", click opens modal)
- Desktop: Fullscreen black overlay modal
- Desktop: Close button (X) in circular dark button, top-left corner
- Desktop: Video player centered with progress bar (0:00 / 1:04 format)
- Desktop: Volume control slider below video
- Desktop: Fade-out transition when closing modal (~200-300ms)
- Desktop: Auto-plays video on open
- Desktop: Triggered by clicking "WATCH" label or project card image

## Accessibility Considerations
- Close button should have aria-label
- Focus trap within modal when open
- ESC key should close modal (not tested on mobile)
- Video should have captions available

## Props Schema
```typescript
interface VideoModalProps {
  videoUrl: string              // Video source URL (likely Vimeo or similar)
  posterImage?: string          // Thumbnail before play
  autoPlay?: boolean            // Default: true
  showControls?: boolean        // Default: true
  onClose?: () => void          // Callback when modal closes
}

interface ProjectCardProps {
  image: string                 // Card thumbnail image
  client: string                // Client name
  studio: string                // Studio name
  title: string                 // Project title
  description: string           // Project description
  year: string                  // Year of project
  role: string                  // Role (e.g., "Executive Producer")
  videoUrl?: string             // If present, enables video modal
}
```

## Dependencies
- Requires: Video player library or native HTML5 video
- Used by: Project cards with video content
- May use: Vimeo/YouTube embed or self-hosted video
