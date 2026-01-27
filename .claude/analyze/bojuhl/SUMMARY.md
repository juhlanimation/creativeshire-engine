# Analysis: bojuhl

**Source:** https://bojuhl.com
**Framework:** Next.js (Turbopack) + Vercel

## Components

### widget/
| Name | Description |
|------|-------------|
| hero-title | Stacked role typography with gradients |
| client-logo | Brand logo for marquee |
| project-card | Featured project with alternating layout |
| gallery-thumbnail | Compact project preview |
| video-player | Modal video with custom controls |

### section/
| Name | Description |
|------|-------------|
| hero | Full-viewport with scroll-driven backgrounds |
| about | Split layout (bio + portrait) |
| logo-marquee | Infinite horizontal logo scroll |
| featured-projects | Alternating project cards |
| project-gallery | Horizontal thumbnail carousel |
| footer | Multi-column navigation + contact |

### chrome/
| Name | Description |
|------|-------------|
| floating-contact | Fixed top-right CTA |
| scroll-indicator | "(SCROLL)" hint in hero |

### behaviour/
| Name | Description |
|------|-------------|
| scroll-background | Hero background transition on scroll |
| marquee | Infinite horizontal scroll animation |
| video-modal | Click-triggered video overlay |

## Build Order

1. widget/ → 2. section/ → 3. chrome/ → 4. behaviour/

## Next

`/plan bojuhl` to create backlog items.
