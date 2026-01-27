# FloatingContactCTA

**Purpose:** Provides a persistent, always-visible call-to-action for contacting the site owner
**Type:** behaviour (chrome behaviour)
**Visible:** tablet, desktop (not observed prominently on mobile)

## Trigger (Observed Defaults -> Props)
- Event: load (appears on page load, persists through scroll)
- Target: Fixed position element in viewport
- Threshold: N/A (always visible)

## Animation (Observed Defaults -> Props)

### Visibility
- Always visible regardless of scroll position
- Fixed position in upper-right corner of viewport

### Timing
- Duration: N/A (static element)
- Easing: N/A
- Delay: May fade in on initial load

## States
| State | Properties |
|-------|------------|
| Default | Text visible: "How can I help you?" |
| Hover | Expands to show "hello@bojuhl.com" with copy icon (desktop) |
| Active | Email copied to clipboard when copy icon clicked |

## Visual Details
- **Text**: "How can I help you?"
- **Position**: Fixed, upper-right corner of viewport
- **Color**: Dark text on light/transparent background (adapts to page section)
- **Font**: Sans-serif, normal weight
- **Size**: Small to medium, readable but not dominant

## GIF Reference
- Mobile: N/A (not observed or positioned differently)
- Tablet: `../../assets/home-tablet.gif` @ throughout (visible in upper right)
- Desktop: `../../assets/home-desktop.gif` @ throughout (visible in upper right)

## Responsive Notes
- Mobile: Not observed in upper-right position (may be in footer or different location)
- Tablet: Fixed position upper-right, persists through all scroll positions
- Tablet: Text remains readable against varying background sections
- Desktop: Fixed position upper-right corner, always visible
- Desktop: **Default state**: "How can I help you?" text
- Desktop: **Hover state**: Expands to show "hello@bojuhl.com" with copy icon
- Desktop: Smooth transition between states on hover/hover-off
- Desktop: Purple link color for email in expanded state
- Desktop: Copy icon allows one-click email copy to clipboard
- Desktop: Persists through all scroll positions and page sections

## Accessibility Considerations
- Should be focusable and keyboard accessible
- Clear purpose indicated by text
- May need ARIA label if it's a link/button

## Implementation Notes
- Uses `position: fixed` for persistent visibility
- May use CSS `mix-blend-mode` or text shadow for contrast on varied backgrounds
- Likely links to contact section (footer) or opens contact modal

## Props Schema
```typescript
interface FloatingContactCTAProps {
  text?: string              // CTA text (default: "How can I help you?")
  href?: string              // Link destination (e.g., "#contact" or mailto:)
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showOnMobile?: boolean     // Whether to show on mobile (default: false)
}
```

## Dependencies
- Requires: None
- Used by: Chrome layer / Site-wide component
