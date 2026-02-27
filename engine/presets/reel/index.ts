/**
 * Reel Preset — Dark Cinematic Portfolio
 * Two-page portfolio preset (Home + About) with glass nav, scroll-triggered reveals,
 * and column footer. Inspired by animation studio portfolios.
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { createGlassNavRegion } from '../../content/chrome/patterns/GlassNav'
import { createColumnFooterRegion } from '../../content/chrome/patterns/ColumnFooter'
import { homePageTemplate } from './pages/home'
import { aboutPageTemplate } from './pages/about'
import { reelContentContract } from './content-contract'
import { reelSampleContent } from './sample-content'

export const reelMeta: PresetMeta = {
  id: 'reel',
  name: 'Reel — Cinematic Portfolio',
  description: 'Dark cinematic 2-page portfolio with glass nav, scroll-triggered reveals, and project cards.',
}

export const reelPreset: SitePreset = {
  content: {
    id: 'reel-content',
    name: 'Reel',
    pages: {
      home: homePageTemplate,
      about: aboutPageTemplate,
    },
    chrome: {
      regions: {
        header: {
          ...createGlassNavRegion({
            logoSrc: '{{ content.chrome.logoSrc }}',
            logoAlt: '{{ content.chrome.logoAlt }}',
            navLinks: [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
            ],
          }),
          colorMode: 'dark',
        },
        footer: {
          ...createColumnFooterRegion({
            columns: '{{ content.chrome.columns }}',
            copyright: '{{ content.chrome.copyright }}',
          }),
          colorMode: 'dark',
          style: {
            backgroundColor: '#050706',
            color: '#f9f9f9',
          },
        },
      },
      overlays: {},
    },
    contentContract: reelContentContract,
    sampleContent: reelSampleContent,
  },
  experience: {
    id: 'reel-experience',
    name: 'Reel',
    description: 'Scroll-driven experience with glass nav and fade-in reveals.',
    category: 'scroll-driven',
    sectionBehaviours: {
      'hero': [{ behaviour: 'scroll/progress' }],
      'intro-statement': [{ behaviour: 'visibility/fade-in' }],
      'project-scroll': [
        { behaviour: 'scroll/fade-out', options: { start: 0.5 } },
      ],
      'cta-home': [{ behaviour: 'visibility/fade-in' }],
      'about-hero': [{ behaviour: 'visibility/fade-in' }],
      'team-bio': [{ behaviour: 'visibility/fade-in' }],
      'cta-about': [{ behaviour: 'visibility/fade-in' }],
    },
    chromeBehaviours: {
      header: [{ behaviour: 'scroll/glass', options: { threshold: 50, targetBlur: 12 } }],
      footer: [{ behaviour: 'visibility/fade-in' }],
    },
  },
  theme: {
    id: 'reel-theme',
    name: 'Reel Dark',
    theme: {
      colorTheme: 'contrast',
      typography: {
        heading: 'Bebas Neue, system-ui, sans-serif',
        paragraph: 'Inter, system-ui, sans-serif',
      },
      scrollbar: { type: 'thin' },
      smoothScroll: { enabled: true },
      sectionTransition: {
        fadeDuration: '0.15s',
        fadeEasing: 'ease-out',
      },
      container: {
        maxWidth: '1440px',
        outerBackground: '#050706',
        sectionGap: 'none',
      },
      motion: {
        durationFast: 200,
        durationNormal: 400,
        durationSlow: 800,
        easeDefault: 'cubic-bezier(0.22, 1, 0.36, 1)',
        easeExpressive: 'cubic-bezier(0.22, 1, 0.36, 1)',
        easeSmooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
}

// Auto-register on module load
registerPreset(reelMeta, reelPreset)

// Content contract export
export { reelContentContract } from './content-contract'

// Export sample content for dev preview
export { reelSampleContent } from './sample-content'
