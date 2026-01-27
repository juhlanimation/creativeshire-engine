# Navigation Chrome

## Overview
Hidden navigation that provides anchor links to page sections. On mobile, navigation links are not visible in the main UI but are accessible. Contains links to Om (About), Medlemmer (Members), Medlemskab (Membership), and email contact.

## Mobile Layout (375px)

### Visibility
- **Mobile**: Navigation links are hidden/collapsed
- **Desktop**: May appear in header or as overlay

### Structure (DOM)
```
[Navigation Container]
  [Link "Om" href="#om"]
  [Link "Medlemmer" href="#medlemmer"]
  [Link "Medlemskab" href="#medlemskab"]
  [Link "info@port12.dk" href="mailto:info@port12.dk"]
```

## Navigation Links

| Label | Target | Type |
|-------|--------|------|
| Om | #om | Anchor (About section) |
| Medlemmer | #medlemmer | Anchor (Team section) |
| Medlemskab | #medlemskab | Anchor (Pricing section) |
| info@port12.dk | mailto: | External (email) |

## Visual Treatment (when visible)

### Link Styling
- **Font-family**: Sans-serif
- **Font-size**: ~14px
- **Color**: Dark gray or black
- **Text-decoration**: None
- **Hover**: Underline or color shift

### Layout (Desktop)
- **Position**: Fixed header or overlay menu
- **Alignment**: Horizontal row
- **Gap**: ~24px between links

## Props Schema
```typescript
interface NavLink {
  label: string;
  href: string;
  type: 'anchor' | 'external' | 'mailto';
}

interface NavigationProps {
  links: NavLink[];
  mobileMenuTrigger?: boolean;  // Show hamburger on mobile
}
```

## Interaction States

### Anchor Links
- Smooth scroll to target section
- URL updates with hash

### Email Link
- Opens default email client
- mailto:info@port12.dk

## Accessibility
- Semantic nav element
- Links have descriptive text
- Keyboard navigable
- Focus states visible

## Responsive Notes
- Hidden on mobile (375px)
- Appears in header on larger screens
- May use hamburger menu pattern for mobile access

## Related Components
- `chrome/sticky-header.md` - Header containing navigation
- `chrome/footer.md` - Footer repeats navigation links

---

## Tablet (768px)

### Changes from Mobile
- **Visibility**: Navigation exists in DOM but remains hidden/styled invisible
- **Layout**: Links present but not rendered visually

### Observations
- At 768px, navigation links (Om, Medlemmer, Medlemskab, email) exist in accessibility tree
- Links are positioned in main element but styled to be invisible
- No hamburger menu trigger visible
- Navigation likely becomes visible at larger breakpoints (~900px+ or desktop)

### DOM Structure at Tablet
```
[Navigation - present but visually hidden]
  [Link "Om" href="#om"]
  [Link "Medlemmer" href="#medlemmer"]
  [Link "Medlemskab" href="#medlemskab"]
  [Link "info@port12.dk" href="mailto:..."]
```

### Visual Differences
- No change from mobile - navigation remains hidden
- Footer continues to provide primary navigation access

---

## Desktop (1440px)

### Changes from Tablet
- **Visibility**: Navigation links exist in DOM but remain visually hidden
- **Layout**: Links present in accessibility tree but not rendered
- **Primary navigation**: Footer provides main navigation access

### Observations at Desktop
At 1440px, navigation links (Om, Medlemmer, Medlemskab, email) exist in the DOM but are styled to be invisible. The site relies on:
1. Scroll-based discovery (single-page flow)
2. Footer navigation for explicit section jumping
3. Sticky header logo for returning to top

### Navigation Links (in DOM)
| Label | Target | Type |
|-------|--------|------|
| Om | #om | Anchor (About section) |
| Medlemmer | #medlemmer | Anchor (Team section) |
| Medlemskab | #medlemskab | Anchor (Pricing section) |
| info@port12.dk | mailto: | External (email) |

### Design Decision
Site intentionally keeps navigation hidden even at desktop, favoring:
- Clean, minimal aesthetic
- Scroll-based exploration
- Footer as navigation hub
- Single-page immersive experience

### Potential Enhancement
Navigation could be shown in sticky header at desktop:
- Links positioned right-aligned
- Horizontal layout with ~24px gap
- Same font styling as footer links
- Smooth scroll to anchor targets
