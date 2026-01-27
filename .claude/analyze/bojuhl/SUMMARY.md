# Analysis: bojuhl

**Source:** https://www.bojuhl.com
**Pages Analyzed:** Single-page site (home with #hero, #about, #projects sections)
**Date:** 2026-01-27

## Pages

| Page | GIFs |
|------|------|
| home | home-mobile.gif, home-tablet.gif*, home-desktop.gif* |

*Note: Tablet and desktop GIFs exported to browser Downloads folder - move to assets/

## Components Found

### Site Chrome (site/chrome/)
| Component | Purpose |
|-----------|---------|
| footer.md | Global footer with navigation, contact, and studio info |
| floating-contact.md | Floating "How can I help you?" CTA (fixed on tablet/desktop) |

### Content (content/)

| Type | Components |
|------|------------|
| section/ | hero, about, featured-projects, other-projects |
| widget/ | hero-title, project-card, scroll-indicator, video-thumbnail, logo-marquee |

### Experience (experience/)

| Type | Components |
|------|------------|
| behaviour/ | scroll-background-slideshow, hero-text-color-transition, project-card-hover, scroll-indicator, video-modal, logo-marquee, floating-contact-cta, gallery-thumbnail-expand |

## Responsive Summary

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| hero | visible | visible | visible |
| about | visible | visible | visible |
| featured-projects | visible | visible | visible |
| other-projects | **hidden** | visible | visible |
| logo-marquee | **hidden** | visible | visible |
| floating-contact | inline | fixed | fixed |
| footer | 1-col | 3-col | 3-col |

## Key Design Patterns

### Typography
- **Headings:** Inter (weight 900), uppercase
- **Body:** Plus Jakarta Sans (weight 400-500)
- **Mobile hero titles:** 32px → **Tablet:** 47px → **Desktop:** 60-72px (fluid)

### Colors
- **Background:** Black (#000) / White (#fff)
- **Accent:** Purple (rgb(153,51,255))
- **Text effect:** `mix-blend-mode: difference` for dynamic color

### Layout Patterns
- **Hero:** Full viewport video background with scroll-triggered slideshow
- **About:** Single column (mobile) → Two column (tablet+)
- **Featured Projects:** Stacked (mobile) → Alternating two-column (tablet+)
- **Other Projects:** Hidden (mobile) → Horizontal gallery (tablet+)

### Animation Patterns
- **Scroll-triggered:** Background slideshow, color transitions
- **Hover-triggered:** Project card expansion, gallery thumbnail expand
- **Continuous:** Logo marquee animation
- **Modal:** Video player fullscreen overlay

## Build Order Recommendation

1. **site/chrome/** - Global footer, floating contact
2. **content/widget/** - hero-title, scroll-indicator, project-card, video-thumbnail, logo-marquee
3. **content/section/** - hero, about, featured-projects, other-projects
4. **experience/behaviour/** - scroll-background-slideshow, hero-text-color-transition, video-modal, project-card-hover, logo-marquee, gallery-thumbnail-expand

## Technical Notes

- Uses Tailwind CSS with responsive prefixes (`md:`, `lg:`)
- Video backgrounds with object-fit: cover
- mix-blend-mode for text color effects
- Intersection Observer likely for scroll-triggered animations
- No framework-specific patterns detected (appears to be vanilla or lightweight)

## Next Steps

Run `/plan bojuhl` to create backlog items from this analysis.
