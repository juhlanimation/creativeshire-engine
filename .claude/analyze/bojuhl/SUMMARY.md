# Analysis: bojuhl.com

**Source:** https://bojuhl.com
**Type:** Personal portfolio - Executive Producer & Editor
**Framework:** Next.js (Turbopack) + Vercel

## Site Overview

Bo Juhl's portfolio showcasing animation production work for major gaming and entertainment clients (Riot Games, Supercell, Netflix, Amazon, etc.). The site features a distinctive illustrated aesthetic with scroll-driven background transitions and video showcases.

## Identified Components

### Content Layer
| Component | Count | Notes |
|-----------|-------|-------|
| Widgets | 8 | Text blocks, images, video players, client logos, project cards |
| Sections | 5 | Hero, About, Projects (featured), Projects (gallery), Footer |
| Chrome | 2 | Floating nav (top-right), Scroll indicator |

### Experience Layer
| Component | Notes |
|-----------|-------|
| Behaviours | Scroll-driven background transition, Logo marquee, Video modal |
| Triggers | Scroll position, Click (video play), Hover (project cards) |
| Drivers | Background image swap based on scroll progress |

## Key Patterns

1. **Hero with scroll-driven backgrounds** - Multiple illustrated backgrounds that transition as user scrolls
2. **Alternating project cards** - Image-left/text-right alternates with text-left/image-right
3. **Horizontal logo marquee** - Infinite scroll of client logos
4. **Video modal system** - Projects have embedded video players with custom controls
5. **Minimal floating chrome** - "How can I help you?" contact CTA persists across scroll

## Suggested Build Order

### Phase 1: Foundation
1. Site schema and page structure
2. Typography system (Plus Jakarta Sans, Inter)
3. Color tokens (dark backgrounds, accent purples)

### Phase 2: Widgets
1. `HeroTitle` - Stacked role typography with color accents
2. `ClientLogo` - Logo image with grayscale/hover states
3. `ProjectCard` - Image + metadata (title, year, role, client, studio)
4. `VideoPlayer` - Custom video controls with modal overlay
5. `BioText` - Rich text with inline links

### Phase 3: Sections
1. `HeroSection` - Full-viewport with scroll-driven background
2. `AboutSection` - Split layout (text + portrait)
3. `LogoMarquee` - Infinite horizontal scroll
4. `ProjectsSection` - Featured projects with alternating layout
5. `ProjectGallery` - Horizontal thumbnail carousel
6. `FooterSection` - Multi-column links

### Phase 4: Chrome
1. `FloatingContact` - Fixed position CTA (top-right)
2. `ScrollIndicator` - "(SCROLL)" hint at bottom of hero

### Phase 5: Experience
1. `ScrollProgress` driver - Track scroll position
2. `BackgroundSwap` behaviour - Transition hero backgrounds
3. `MarqueeScroll` behaviour - Infinite logo animation
4. `VideoModal` behaviour - Open/close video overlay

## Technical Notes

- 27 video elements pre-loaded for project showcases
- Next.js Image optimization for all images
- IntersectionObserver available for scroll triggers
- No external animation libraries detected (likely CSS/React-based)
- Vercel Analytics integrated

## Next Steps

Run `/plan bojuhl/bojuhl.com` to create backlog items from this analysis.
