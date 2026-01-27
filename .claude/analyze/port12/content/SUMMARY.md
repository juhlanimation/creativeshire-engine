# Port12 Content Analysis Summary

## Site Overview
- **URL**: https://www.port12.dk
- **Type**: Single-page marketing site for coworking space
- **Location**: Ry, Denmark
- **Language**: Danish
- **Breakpoint Analyzed**: Mobile (375x812)

## Page Structure

```
[Hero Section - 100vh]
  - Masked "PORT12" logo with slideshow background
  - Tagline "DROM - DEL - SKAB"
  - Scroll indicator "(SCROLL)"
  - Scroll progress bar (right edge)

[About Section]
  - Bracketed text block with introduction
  - Staggered photo gallery (4+ images)

[Team Section - 100vh]
  - "Vi er" heading
  - 6 member names with hover/scroll reveal
  - Dynamic portrait backgrounds

[Pricing Section]
  - FLEX tier (1,300 DKK/month)
  - ALL-IN tier (2,000 DKK/month)
  - Hand-drawn illustrations
  - Feature lists with status icons

[Contact Section]
  - Envelope illustration
  - "KONTAKT OS" heading
  - Email link

[Footer]
  - Dark background
  - Logo, copyright, navigation
  - Contact details (email, phone, address)
```

## Sections (5 files)

| Section | File | Key Features |
|---------|------|--------------|
| Hero | `section/hero.md` | Masked logo, slideshow, scroll indicator |
| About | `section/about.md` | Bracketed text, staggered gallery |
| Team | `section/team.md` | Name reveal, dynamic backgrounds |
| Pricing | `section/pricing.md` | Two tiers, illustrated headers, feature lists |
| Contact | `section/contact.md` | Illustrated CTA, email link |

## Widgets (9 files)

| Widget | File | Usage |
|--------|------|-------|
| Scroll Indicator | `widget/scroll-indicator.md` | Hero bottom |
| Scroll Progress Bar | `widget/scroll-progress-bar.md` | Fixed right |
| Logo Text | `widget/logo-text.md` | Hero, header, footer |
| Pricing Card | `widget/pricing-card.md` | Pricing section |
| Feature List Item | `widget/feature-list-item.md` | Inside pricing cards |
| Team Member Name | `widget/team-member-name.md` | Team section |
| Text Block Bracketed | `widget/text-block-bracketed.md` | About section |
| Illustrated Header | `widget/illustrated-header.md` | Pricing, contact |

## Layout Widgets (1 file)

| Layout | File | Usage |
|--------|------|-------|
| Staggered Gallery | `layout-widget/staggered-gallery.md` | About section photos |

## Chrome (3 files)

| Chrome | File | Description |
|--------|------|-------------|
| Sticky Header | `site/chrome/sticky-header.md` | PORT12 logo, appears on scroll |
| Navigation | `site/chrome/navigation.md` | Anchor links (hidden on mobile) |
| Footer | `site/chrome/footer.md` | Dark footer with nav and contact |

## Key Design Patterns

### Visual Identity
- **Logo treatment**: Masked text revealing slideshow images
- **Typography**: Bold condensed sans-serif for headings
- **Illustrations**: Hand-drawn sketch style for warmth
- **Color palette**: Warm neutrals, dark accents

### Interactions (Behaviours - documented separately)
- Hero slideshow auto-rotation
- Scroll-triggered sticky header
- Team member reveal on scroll/hover
- Scroll progress indicator

### Layout Patterns
- Full-viewport hero and team sections
- Staggered asymmetric image gallery
- Centered, stacked pricing cards
- Vertical rhythm with generous spacing

## Content Data

### Team Members
1. Rune Svenningsen
2. Maria Tranberg
3. Nicolaj Larsson
4. Tor Birk Trads
5. Bo Juhl
6. Maria Kjaer

### Pricing Tiers
| Tier | Price | Key Differentiator |
|------|-------|-------------------|
| FLEX | 1,300 DKK/mo | Flexible access, no fixed spot |
| ALL-IN | 2,000 DKK/mo | Fixed spot, full amenities |

### Contact
- **Email**: info@port12.dk
- **Phone**: +45 31378089
- **Address**: Kloftehoj 3, 8680 Ry

## Responsive Considerations
- Mobile-first design
- Navigation hidden on mobile (accessible in footer)
- Team section may change from scroll to hover on desktop
- Pricing cards stack vertically on mobile

## Next Steps (Behaviour Analysis)
The following behaviours need separate documentation:
1. Hero slideshow auto-rotation
2. Scroll-triggered header reveal
3. Team member reveal interaction
4. Scroll progress calculation
5. Image reveal animations
