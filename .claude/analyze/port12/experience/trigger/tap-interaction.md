# Tap Interaction Trigger

## Overview
Tap/click interactions on port12.dk, primarily for navigation and member profile links.

## Implementation

### Member Name Links
Each member name in the carousel is a clickable link that opens their personal website.

```html
<a href="https://www.runesvenningsen.com" target="_blank" rel="noopener">
  <h2 class="member-name">Rune Svenningsen</h2>
</a>
```

### Behavior
- **Tap on member name**: Opens member's personal website in new tab
- **Visual feedback**: None observed (could add tap highlight)
- **No modal/overlay**: Direct navigation to external site

### Member Links
| Member | Website |
|--------|---------|
| Rune Svenningsen | https://www.runesvenningsen.com |
| Maria Tranberg | https://www.mariatranberg.com |
| Nicolaj Larsson | (external link) |
| Tor Birk Trads | (external link) |
| Bo Juhl | https://www.bojuhl.com |
| Maria Kjaer | (external link) |

### Email Links
```html
<a href="mailto:info@port12.dk">info@port12.dk</a>
```
- Opens default mail client
- Found in footer and contact section

### Phone Links
```html
<a href="tel:+4531378089">Tlf. 31378089</a>
```
- Opens phone dialer on mobile
- Found in footer

### Anchor Links (Navigation)
```html
<a href="#om">Om</a>
<a href="#medlemmer">Medlemmer</a>
<a href="#medlemskab">Medlemskab</a>
```
- Smooth scroll to section (on desktop)
- Hidden on mobile (no hamburger menu)
- Available in footer for mobile users

## CSS for Tap States
```css
/* Tap highlight removal (if desired) */
a {
  -webkit-tap-highlight-color: transparent;
}

/* Custom tap feedback */
a:active {
  opacity: 0.7;
  transition: opacity 0.1s;
}
```

## Mobile Considerations
- Tap targets should be at least 44x44px
- Member names are large enough for easy tapping
- No hover states (irrelevant on touch)
- Immediate visual feedback recommended

## Accessibility
- Links should have descriptive text
- External links should indicate they open in new tab
- Phone and email links recognized by mobile browsers

## Related Behaviours
- [member-video-carousel.md](../behaviour/member-video-carousel.md)

## Responsive Notes
- **Mobile (375px):** Tap-only interaction, no hover states
- **Tablet (768px):** Supports both tap/click AND hover interactions. Member name links can show hover states (cursor change, opacity shift). Click behavior identical to mobile tap - opens external website in new tab.
- **Desktop (1440px):** Full hover interaction support. Member names have hover-triggered video switching (see member-video-carousel.md). Navigation links have hover states with cursor pointer. Footer links have underline hover states. Click opens external links in new tab. Email links open mail client. Phone links functional but less common on desktop.
