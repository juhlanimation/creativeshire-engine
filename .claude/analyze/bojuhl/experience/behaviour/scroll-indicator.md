# ScrollIndicator

**Purpose:** Displays a "(SCROLL)" text prompt at the bottom of the hero section to encourage users to scroll down and discover content
**Type:** behaviour
**Applies to:** Hero section, bottom area

## Trigger (Observed Defaults -> Props)
- Event: load (appears on page load)
- Target: Hero section bottom
- Threshold: N/A (always visible in hero)

## Animation (Observed Defaults -> Props)

### Visibility
- Visible when hero section is in viewport
- May fade out or hide as user scrolls past hero

### Timing
- Duration: N/A (static element)
- Easing: N/A
- Delay: May appear after initial page load animation

## States
| State | Properties |
|-------|------------|
| Visible | "(SCROLL)" text shown at bottom of hero |
| Hidden | Text hidden after user scrolls past hero |

## Visual Details
- **Text**: "(SCROLL)" with parentheses
- **Color**: Matches hero text color (changes with background)
- **Position**: Bottom center of hero section
- **Font**: Sans-serif, smaller than title text
- **Case**: Uppercase

## GIF Reference
- Mobile: `../../assets/home-mobile.gif` @ ~0s (visible in initial hero state)
- Tablet: `../../assets/home-tablet.gif` @ ~0s (visible in initial hero state)
- Desktop: `../../assets/home-desktop.gif` @ ~0s (visible at bottom center of hero)

## Responsive Notes
- Mobile: Positioned above the fold but at bottom of hero, text size appropriate for mobile
- Tablet: Same position and behaviour, centered at bottom of hero section
- Tablet: Color adapts to background synchronised with HeroTextColorTransition
- Tablet: Hides on scroll same as mobile
- Desktop: Same bottom-center position, "(SCROLL)" text visible
- Desktop: Color transitions sync with hero text color changes
- Desktop: Hides when user scrolls past hero section
- Desktop: No additional animation observed (static prompt)

## Accessibility Considerations
- Provides clear navigation hint for users
- Should not be the only way to discover content
- Could be enhanced with subtle animation to draw attention

## Implementation Notes
- Simple text element with scroll-linked visibility
- Color changes synchronized with HeroTextColorTransition
- May use intersection observer to hide when scrolled past
- Parentheses add visual distinction

## Props Schema
```typescript
interface ScrollIndicatorProps {
  text?: string                 // Indicator text (default: "(SCROLL)")
  hideOnScroll?: boolean        // Whether to hide when scrolled (default: true)
  hideThreshold?: number        // Scroll distance before hiding (default: 100)
}
```

## Dependencies
- Requires: None
- Used by: Hero section
- Synchronized with: HeroTextColorTransition (for color matching)
