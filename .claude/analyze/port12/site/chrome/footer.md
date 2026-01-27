# Footer Chrome

## Overview
Dark footer section containing logo, copyright notice, navigation links, and contact information. Provides comprehensive site navigation and contact details.

## Mobile Layout (375px)

### Dimensions
- **Width**: 100%
- **Padding**: 48px 24px
- **Background**: Dark charcoal (#2A2A2A approximately)

### Structure
```
[Footer Container]
  [Logo "PORT12"]
  [Copyright Text]
  [Navigation Links]
    [OM PORT12]
    [MEDLEMMER]
    [MEDLEMSKAB]
  [Contact Information]
    [Email Link]
    [Phone Link]
    [Address]
```

## Visual Treatment

### Container
- **Background**: Dark charcoal/black (#2A2A2A or #1A1A1A)
- **Text color**: White/light gray

### Logo
- **Text**: "PORT12"
- **Font-family**: Bold condensed sans-serif (matches site)
- **Font-size**: ~28px
- **Color**: White
- **Text-align**: Center
- **Margin-bottom**: 8px

### Copyright
- **Text**: "Copyright (C) All rights reserved."
- **Font-size**: ~12px
- **Color**: Light gray (#AAAAAA)
- **Text-align**: Center
- **Margin-bottom**: 32px

### Navigation Links
- **Layout**: Vertical stack, centered
- **Gap**: 8px between links

#### Link Styling
- **Font-size**: ~14px
- **Color**: White
- **Text-transform**: UPPERCASE
- **Letter-spacing**: Wide (0.1em)
- **Text-decoration**: None
- **Text-align**: Center

### Contact Information
- **Margin-top**: 32px
- **Text-align**: Center

#### Email
- **Text**: "Mail: info@port12.dk"
- **Font-size**: ~14px
- **Color**: White
- **Type**: mailto: link

#### Phone
- **Text**: "Tlf. 31378089"
- **Font-size**: ~14px
- **Color**: White
- **Type**: tel: link

#### Address
- **Text**: "Kloftehoj 3 / 8680 Ry"
- **Font-size**: ~14px
- **Color**: Light gray (#CCCCCC)
- **Type**: Static text (or Google Maps link)

## Props Schema
```typescript
interface FooterProps {
  logo: string;
  copyright: string;
  navigation: {
    label: string;
    href: string;
  }[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}
```

## Interaction States

### Links
- **Default**: White text
- **Hover**: Underline or slight color shift
- **Active**: Opacity reduction

### Phone/Email
- Opens appropriate app (phone dialer, email client)

## Accessibility
- Footer uses semantic `<footer>` element
- Links have descriptive text
- Phone number formatted for tel: protocol
- High contrast (white on dark)
- Address readable by screen readers

## Responsive Notes
- Layout remains centered and stacked on all sizes
- May expand to multi-column on desktop
- Logo and text sizes may increase slightly

## Data

### Navigation Links
| Label | URL |
|-------|-----|
| OM PORT12 | #om |
| MEDLEMMER | #medlemmer |
| MEDLEMSKAB | #medlemskab |

### Contact Details
- **Email**: info@port12.dk
- **Phone**: +45 31378089
- **Address**: Kloftehoj 3, 8680 Ry, Denmark

## Related Components
- `widget/logo-text.md` - Footer logo styling
- `widget/contact-link.md` - Email/phone link styling
- `chrome/navigation.md` - Navigation link definitions

---

## Tablet (768px)

### Changes from Mobile
- **Layout**: Same vertically stacked, centered layout
- **Padding**: 56px 32px (increased from 48px 24px)
- **Logo size**: ~32px (slight increase from ~28px)

### Visual Differences
- More horizontal breathing room
- Same dark background (#2A2A2A)
- Navigation links remain stacked vertically
- Contact info same layout
- No multi-column layout at tablet yet

### Typography at Tablet
- Logo: ~32px (increased)
- Copyright: ~12px (unchanged)
- Navigation links: ~14px (unchanged)
- Contact info: ~14px (unchanged)

### Structure
Same as mobile - all elements centered and stacked:
1. PORT12 logo
2. Copyright
3. Navigation links (OM PORT12, MEDLEMMER, MEDLEMSKAB)
4. Contact (Mail, Phone, Address)

---

## Desktop (1440px)

### Changes from Tablet
- **Layout**: Same vertically stacked, centered layout maintained
- **Padding**: 72px 48px (increased from 56px 32px)
- **Logo size**: ~36px (increased from ~32px)
- **Max-width**: Content may be constrained within ~600px centered

### Dimensions
- **Width**: 100%
- **Padding**: 72px 48px
- **Background**: Dark charcoal (#2A2A2A)
- **Content max-width**: ~600px (centered)

### Visual Differences
- More generous vertical padding
- Logo slightly larger for desktop proportions
- Same single-column centered layout (design choice)
- Navigation links remain stacked vertically
- Contact information maintains same hierarchy

### Typography at Desktop
- Logo: ~36px (bold condensed sans-serif, white)
- Copyright: ~12px (light gray)
- Navigation links: ~14-15px (white, uppercase, wide letter-spacing)
- Contact info: ~14-15px (white for links, light gray for address)

### Structure at Desktop
```
[Footer Container - dark bg, centered content]
  [Logo "PORT12" ~36px]
  [Copyright text ~12px]
  [Navigation Links - stacked]
    [OM PORT12]
    [MEDLEMMER]
    [MEDLEMSKAB]
  [Contact Info - stacked]
    [Mail: info@port12.dk]
    [Tlf. 31378089]
    [Kloftehoj 3 / 8680 Ry]
```

### Design Note
Footer maintains single-column centered layout at all breakpoints. This is intentional for:
- Visual consistency
- Easy scanability
- Mobile-first design carried through
- Clean, minimal aesthetic
