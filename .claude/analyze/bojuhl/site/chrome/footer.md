# Footer Chrome

**Purpose:** Site-wide footer with navigation, contact info, studio links, and copyright
**Type:** chrome (global)
**Visible:** mobile, tablet, desktop

## Layout (Observed Defaults)

### Mobile (375px)
- Width: 100vw
- Height: 548px
- Padding: 80px 0 48px (top/bottom)
- Content padding: 32px horizontal (inner wrapper)
- Stacked vertical layout

### Content Structure
1. Navigation links (HOME, ABOUT, PROJECTS)
2. GET IN TOUCH section (email, linkedin)
3. FIND MY STUDIO section (website, email, social links)
4. Copyright

## Visual Treatment (Observed Defaults)

### Colors
- Background: rgb(0, 0, 0) (black)
- Text: rgb(255, 255, 255) (white)
- Links: white (no underline by default)

### Typography

#### Navigation Links (HOME, ABOUT, PROJECTS)
- Font-family: Inter, system-ui, sans-serif
- Font-size: 14px
- Font-weight: 300 (Light)
- Color: white
- Text-transform: none (uppercase in content)
- Letter-spacing: normal
- Line spacing: 8px between items

#### Section Headings (GET IN TOUCH, FIND MY STUDIO)
- Font-family: Inter, system-ui, sans-serif
- Font-size: 14px
- Font-weight: 900 (Black)
- Color: white
- Letter-spacing: normal
- Margin-top: ~32px (section separation)

#### Contact Email/URL
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 14px
- Font-weight: 400
- Color: white
- Text-decoration: none

#### Social Links (linkedin, instagram)
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 14px
- Font-weight: 400
- Color: white
- Text-decoration: none
- Text-transform: lowercase

#### Copyright
- Font-family: "Plus Jakarta Sans", system-ui, sans-serif
- Font-size: 12px
- Font-weight: 400
- Color: white
- Text: "Copyright Bo Juhl / All rights reserved"

## Props / Data Schema

```typescript
interface FooterProps {
  // Navigation
  navLinks: Array<{
    label: string;                // "HOME", "ABOUT", "PROJECTS"
    href: string;                 // "#hero", "#about", "#projects"
  }>;

  // Contact section
  contactHeading: string;         // "GET IN TOUCH"
  contactEmail: string;           // "hello@bojuhl.com"
  contactLinkedin: string;        // LinkedIn URL

  // Studio section
  studioHeading: string;          // "FIND MY STUDIO"
  studioUrl: string;              // "https://crossroad.studio"
  studioEmail: string;            // "bo@crossroad.studio"
  studioSocials: Array<{
    platform: string;             // "linkedin", "instagram"
    url: string;
  }>;

  // Copyright
  copyrightText: string;          // "Copyright Bo Juhl / All rights reserved"
}
```

## Interaction States

- Default: All text visible on black background
- Hover: Links may show underline or color change (desktop)
- Focus: Visible focus ring on interactive elements
- Email click: Opens mailto: or copies to clipboard

## Content Values

### Navigation
- HOME -> #hero
- ABOUT -> #about
- PROJECTS -> #projects

### Contact
- Email: hello@bojuhl.com
- LinkedIn: https://www.linkedin.com/in/bo-juhl-nielsen-641a7b46/

### Studio (Crossroad)
- Website: https://crossroad.studio
- Email: bo@crossroad.studio
- LinkedIn: https://www.linkedin.com/company/crossroad-studio/
- Instagram: https://www.instagram.com/crossroadxstudio

## Accessibility

- Role: contentinfo (semantic footer)
- Navigation: nav element or role="navigation"
- Links: Clear, descriptive text
- Keyboard: All links focusable and activatable
- Screen readers: Proper heading hierarchy for sections

---

### Tablet (768px+)

#### Layout Changes
| Property | Mobile | Tablet |
|----------|--------|--------|
| Layout | Single column stacked | **Three-column flex** |
| Display | block | **flex (row)** |
| Column 1 | - | Navigation (HOME, ABOUT, PROJECTS) |
| Column 2 | - | GET IN TOUCH (email, linkedin) |
| Column 3 | - | FIND MY STUDIO (url, email, socials) |

#### Structure at Tablet
- Container: display: flex, flex-direction: row
- 3 columns distributed horizontally
- Padding: 80px 0 48px (same as mobile)
- Background: black (same)
- Copyright: Bottom left (same position)

#### Column Details
1. **Navigation Column**
   - Links: HOME, ABOUT, PROJECTS
   - Stacked vertically
   - Left-aligned

2. **Contact Column**
   - Heading: "GET IN TOUCH"
   - Email: hello@bojuhl.com
   - LinkedIn link

3. **Studio Column**
   - Heading: "FIND MY STUDIO"
   - URL: https://crossroad.studio
   - Email: bo@crossroad.studio
   - Social links: linkedin, instagram

#### Typography (unchanged from mobile)
- Navigation: 14px, 300 weight
- Headings: 14px, 900 weight
- Contact/links: 14px, 400 weight
- Copyright: 12px, 400 weight

---

### Desktop (1024px+)

- Width: 100vw
- Height: ~304px
- Padding: 80px 0 48px (same as tablet)
- Background: rgb(0, 0, 0) (black)

#### Layout at Desktop
| Property | Tablet | Desktop |
|----------|--------|---------|
| Display | flex row | flex row (same) |
| Columns | 3 | 3 (same) |
| Gap | 64px | 64px (same) |
| Content padding | Variable | `lg:px-24` or `lg:px-48` |

#### Three-Column Structure
1. **Navigation Column (Left)**
   - Links: HOME, ABOUT, PROJECTS
   - Stacked vertically
   - Font: 14px, 300 weight

2. **Contact Column (Center)**
   - Heading: "GET IN TOUCH" (14px, 900 weight)
   - Email: hello@bojuhl.com (clickable/copyable)
   - LinkedIn link

3. **Studio Column (Right)**
   - Heading: "FIND MY STUDIO" (14px, 900 weight)
   - URL: https://crossroad.studio
   - Email: bo@crossroad.studio
   - Social links: linkedin, instagram

#### Copyright
- Text: "Copyright © Bo Juhl / All rights reserved"
- Font: 12px, 400 weight
- Position: Bottom left of footer
- Color: White

#### Hover States (Desktop-specific)
- Links: May show underline on hover
- Email buttons: May highlight or show copy feedback
- Cursor: Pointer on all interactive elements

#### Changes from Tablet
- Same three-column layout
- Increased horizontal padding
- Same typography (no scaling)
- Hover states become active
- More whitespace between columns
