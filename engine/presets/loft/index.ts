/**
 * Loft Preset — Business Landing
 * Danish coworking space — single-page with video hero.
 *
 * Usage:
 * ```typescript
 * import { loftPreset } from './'
 *
 * export const siteConfig: SiteSchema = {
 *   id: 'my-site',
 *   ...loftPreset,
 * }
 * ```
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { createScrollRevealBrandWidget } from '../../content/chrome/patterns/ScrollRevealBrand'
import { createBrandFooterRegion } from '../../content/chrome/patterns/BrandFooter'
import { homePageTemplate } from './pages/home'
import { loftContentContract } from './content-contract'

export const loftMeta: PresetMeta = {
  id: 'loft',
  name: 'Business Landing - Loft',
  description: 'Danish coworking space — single-page with video hero and team showcase.',
}

export const loftPreset: SitePreset = {
  theme: {
    colorTheme: 'muted',
    smoothScroll: {
      enabled: true,
      provider: 'lenis',
      lenis: {
        duration: 0.8,
        touchMultiplier: 1.5,
      },
    },
    typography: {
      title: '"BBH Sans Hegarty", system-ui, sans-serif',
      paragraph: 'var(--font-plus-jakarta), system-ui, sans-serif',
    },
    container: {},
  },
  experience: {
    id: 'cover-scroll',
    sectionBehaviours: {
      hero: [{
        behaviour: 'scroll/cover-progress',
        options: {
          propagateToRoot: '--hero-cover-progress',
          propagateContentEdge: '--hero-content-edge',
          targetSelector: '#hero-title',
        },
        pinned: true,
      }],
    },
    intro: {
      pattern: 'video-gate',
      settings: {
        targetTime: 3.2,
        revealDuration: 50,
        contentVisible: true,
      },
    },
  },
  chrome: {
    regions: {
      header: {
        overlay: true,
        style: { mixBlendMode: 'difference' },
        layout: {
          justify: 'between',
          align: 'start',
          padding: 'var(--spacing-md, 1.25rem) var(--spacing-lg, 2rem)',
        },
        widgets: [
          createScrollRevealBrandWidget({ brandName: '{{ content.header.brandName }}' }),
          {
            id: 'minimal-nav',
            type: 'Flex',
            props: {},
            className: 'minimal-nav minimal-nav--hover-underline',
            widgets: [
              {
                id: 'nav-links',
                type: 'Flex',
                props: {},
                className: 'minimal-nav__links',
                widgets: [{
                  id: 'nav-link',
                  type: 'Link',
                  __repeat: '{{ content.nav.links }}',
                  __key: 'label',
                  props: {
                    href: '{{ item.href }}',
                    children: '{{ item.label }}',
                    variant: 'hover-underline',
                  },
                  className: 'minimal-nav__link',
                }],
              },
              {
                id: 'nav-divider',
                type: 'Box',
                props: {},
                className: 'minimal-nav__divider',
                widgets: [],
              },
              {
                id: 'nav-email',
                type: 'Link',
                props: {
                  href: 'mailto:{{ content.footer.email }}',
                  children: '{{ content.footer.email }}',
                  variant: 'default',
                },
                className: 'minimal-nav__email',
              },
            ],
          },
        ],
      },
      footer: {
        ...createBrandFooterRegion({
          brandName: '{{ content.footer.brandName }}',
          navLinks: '{{ content.footer.navLinks }}',
          email: '{{ content.footer.email }}',
          phone: '{{ content.footer.phone }}',
          phoneDisplay: '{{ content.footer.phoneDisplay }}',
          address: '{{ content.footer.address }}',
          copyright: '{{ content.footer.copyright }}',
        }),
        colorMode: 'dark',
        style: {
          backgroundColor: 'var(--site-outer-bg)',
        },
      },
    },
  },
  pages: {
    home: homePageTemplate,
  },
}

// Auto-register on module load
registerPreset(loftMeta, loftPreset, {
  contentContract: loftContentContract,
})

// Content contract export
export { loftContentContract } from './content-contract'

// Export sample content for dev preview
export { loftSampleContent } from './sample-content'
