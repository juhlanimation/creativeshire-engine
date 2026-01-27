# Contact Section

## Overview
Simple contact call-to-action section with illustrated envelope icon, inviting text, and email link. Positioned at the end of the pricing section, before the footer.

## Mobile Layout (375px)

### Dimensions
- **Width**: 100%
- **Padding**: 48px 24px
- **Background**: Same as pricing section (light gray)

### Structure
```
[Contact Container]
  [Illustration - envelope with speech bubble]
  [Heading "KONTAKT OS"]
  [Text Lines]
    [Line 1 - "Hiv fat hvis du har sporgsmaal."]
    [Line 2 - "Eller kom og mod os."]
    [Line 3 - "Vi bider ikke. Tvaertimod."]
  [Email Link - info@port12.dk]
```

## Visual Treatment

### Illustration
- **Style**: Hand-drawn sketch, matching pricing illustrations
- **Content**: Envelope with speech bubble containing "..."
- **Size**: ~80px height
- **Position**: Centered above heading
- **Color**: Grayscale

### Heading
- **Text**: "KONTAKT OS" (Contact Us)
- **Font-family**: Bold sans-serif
- **Font-size**: ~28px
- **Color**: Black (#1A1A1A)
- **Text-transform**: UPPERCASE
- **Text-align**: Center
- **Margin-top**: 24px

### Body Text
- **Font-family**: Serif or elegant sans-serif
- **Font-size**: ~16px
- **Color**: Dark gray (#444)
- **Line-height**: 1.8
- **Text-align**: Center

#### Content (Danish)
- "Hiv fat hvis du har sporgsmaal." (Reach out if you have questions.)
- "Eller kom og mod os." (Or come meet us.)
- "Vi bider ikke. Tvaertimod." (We don't bite. Quite the opposite.)

### Email Link
- **Text**: info@port12.dk
- **Font-size**: ~16px
- **Color**: Black or dark gray
- **Text-decoration**: Underline or none
- **Margin-top**: 24px

## Props Schema
```typescript
interface ContactProps {
  illustration: {
    src: string;
    alt: string;
  };
  heading: string;
  bodyLines: string[];
  email: string;
  phone?: string;
}
```

## Interaction States

### Email Link
- **Default**: Dark text
- **Hover**: Underline or color change
- **Active**: Slight opacity reduction

## Accessibility
- Email link has proper mailto: href
- Heading uses semantic h2 or h3
- Illustration has descriptive alt text
- Sufficient color contrast

## Responsive Notes
- Layout remains centered on all screen sizes
- Text may slightly increase on larger screens
- Illustration scales proportionally

## Related Components
- `widget/illustrated-header.md` - Envelope illustration
- `widget/contact-link.md` - Styled email/phone links

---

## Tablet (768px)

### Changes from Mobile
- **Layout**: Same centered layout maintained
- **Spacing**: Slightly increased padding
- **Typography**: Same sizes, improved readability

### Dimensions
- **Width**: 100%
- **Padding**: 56px 32px (increased from 48px 24px)
- **Background**: Same as pricing section

### Visual Differences
- Illustration slightly larger (~100px height)
- Heading "KONTAKT OS" same size (~28-32px)
- Body text has more comfortable line length
- Email link styling unchanged
- All content remains centered

---

## Desktop (1440px)

### Changes from Tablet
- **Layout**: Same centered layout maintained
- **Spacing**: Increased vertical padding
- **Illustration**: Larger (~120px height)
- **Max-width**: Content constrained for optimal reading

### Dimensions
- **Width**: 100%
- **Padding**: 72px 48px (increased from 56px 32px)
- **Background**: Same as pricing section (light gray #EDEBE8)
- **Content max-width**: ~600px centered

### Visual Differences
- Envelope illustration with speech bubble ("...") centered
- "KONTAKT OS" heading prominent (~32-36px)
- Body text comfortable line length
- Email link "info@port12.dk" clearly styled
- Generous vertical spacing between elements

### Typography at Desktop
- Heading: ~32-36px (bold sans-serif, uppercase)
- Body text: ~16-17px (serif or elegant sans)
- Line-height: 1.8
- Email link: ~16px

### Content (Danish)
- "Hiv fat hvis du har sporgsmaal." (Reach out if you have questions.)
- "Eller kom og mod os." (Or come meet us.)
- "Vi bider ikke. Tvaertimod." (We don't bite. Quite the opposite.)

### Structure at Desktop
```
[Contact Container - centered]
  [Illustration ~120px - envelope with speech bubble]
  [Heading "KONTAKT OS"]
  [Body Text - 3 lines centered]
  [Email Link "info@port12.dk"]
```
