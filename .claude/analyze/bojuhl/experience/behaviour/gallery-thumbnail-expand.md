# GalleryThumbnailExpand

**Purpose:** Expands a gallery thumbnail to reveal full project details when hovered
**Type:** behaviour
**Visible:** tablet, desktop (hover-dependent)

## Trigger (Observed Defaults -> Props)
- Event: hover (mouseenter)
- Target: Gallery thumbnail in "Other Selected Projects" section
- Threshold: N/A

## Animation (Observed Defaults -> Props)

### Keyframes
- From: Small thumbnail in horizontal row
- To: Expanded view with project details visible

### Timing
- Duration: ~200-300ms (estimated)
- Easing: ease-out
- Delay: 0ms

### CSS Variables Set
- `--thumbnail-scale`: 1 -> expanded
- `--details-opacity`: 0 -> 1

## States
| State | Properties |
|-------|------------|
| Default | Small thumbnail, part of horizontal gallery row |
| Hover | Expanded view, shows: image, "WATCH" label, project title, client, studio, year, role |
| Hover-off | Returns to thumbnail state |

## Visual Details
- **Gallery Layout**: Horizontal row of ~6-7 thumbnails
- **Expanded State**:
  - Image enlarges to show more detail
  - "WATCH" label appears (magenta/pink)
  - Project details appear below: Title, Client, Studio, Year, Role
  - Background darkens slightly
- **Section Header**: "OTHER SELECTED PROJECTS 2018-2024"

## GIF Reference
- Mobile: N/A (hover not available, may use tap interaction)
- Tablet: `../../assets/home-tablet.gif` @ ~20-25s (gallery hover expansion)
- Desktop: `../../assets/home-desktop.gif` @ ~5-7s (gallery thumbnail expand on hover)

## Responsive Notes
- Mobile: Gallery may not have expand behaviour (tap to open modal directly)
- Tablet: Hover triggers expand animation revealing project details
- Tablet: Other thumbnails remain visible but compressed during hover
- Tablet: Smooth transition in/out of expanded state
- Desktop: **Hover-triggered** - thumbnail expands to featured center position
- Desktop: Layout: Multiple vertical strips, hovered item expands to fill center
- Desktop: Non-hovered items collapse to narrow vertical thumbnail strips on both sides
- Desktop: Expanded view shows: large image, "WATCH" label, title, client, studio, year, role
- Desktop: ~200-300ms smooth transition duration
- Desktop: Hover-off returns to previous state (last hovered item may remain expanded)
- Desktop: "OTHER SELECTED PROJECTS 2018-2024" section header above gallery
- Desktop: ~7-8 projects visible as thumbnail strips simultaneously

## Accessibility Considerations
- Should support keyboard focus for expand
- Expanded details should be announced to screen readers
- Focus should be trapped in expanded state if modal-like

## Implementation Notes
- Uses CSS transform for smooth scaling
- May use `grid` or `flexbox` with animated `flex-grow`
- Details fade in with opacity transition
- Consider using `pointer-events` to manage clickable areas

## Props Schema
```typescript
interface GalleryThumbnailProps {
  image: string              // Thumbnail image URL
  title: string              // Project title
  client: string             // Client name
  studio: string             // Studio name
  year: string               // Year of project
  role: string               // Role (e.g., "Executive Producer")
  videoUrl?: string          // Video URL for modal
  expandDuration?: number    // Animation duration in ms (default: 250)
}

interface GalleryProps {
  title: string              // Section title (e.g., "OTHER SELECTED PROJECTS")
  subtitle?: string          // Subtitle (e.g., "2018-2024")
  projects: GalleryThumbnailProps[]
}
```

## Dependencies
- Requires: Hover events (desktop/tablet only)
- Used by: "Other Selected Projects" section
- Triggers: VideoModal on click when expanded
