/**
 * Bojuhl preset home page template.
 * Assembles Hero, About, FeaturedProjects, OtherProjects sections.
 *
 * Defines bojuhl-specific visual styles for each section pattern.
 */

import type { PageSchema } from '../../../schema/page'
import type { HeroTextStyles } from '../../../content/sections/patterns/Hero/types'
import {
  createHeroSection,
  createAboutSection,
  createFeaturedProjectsSection,
  createOtherProjectsSection,
} from '../../../content/sections/patterns'

/**
 * Bojuhl-specific hero text styles.
 * Large display typography with blend mode for video overlay effect.
 */
export const bojuhlHeroStyles: HeroTextStyles = {
  intro: {
    fontFamily: 'var(--font-body, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: 'clamp(0.875rem, 0.125rem + 1vw, 1rem)', // 14px mobile → 16px @ ~1400px
    fontWeight: 500,
    letterSpacing: '0.05em',
    color: 'white',
    mixBlendMode: 'difference'
  },
  roleTitle: {
    fontFamily: 'var(--font-display, Inter, system-ui, sans-serif)',
    fontSize: 'clamp(2rem, 6vw, 6rem)',
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: 'white',
    mixBlendMode: 'difference'
  },
  scrollIndicator: {
    fontFamily: 'var(--font-body, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '1.4px',
    color: 'white',
    mixBlendMode: 'difference'
  }
}

/**
 * Home page template with placeholder content.
 * Sites extend this with real content data.
 */
export const homePageTemplate: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: 'Portfolio',
    description: 'Executive Producer & Editor portfolio',
  },
  sections: [
    createHeroSection({
      introText: "I'm",
      roles: ['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR'],
      videoSrc: '/videos/hero.mp4',
      scrollIndicatorText: '(SCROLL)',
      styles: bojuhlHeroStyles,
    }),
    createAboutSection({
      bioParagraphs: [
        'Bio paragraph placeholder.',
      ],
      signature: 'Name',
      photoSrc: '/images/about.jpg',
      photoAlt: 'Portrait',
      clientLogos: [],
    }),
    createFeaturedProjectsSection({
      projects: [],
    }),
    createOtherProjectsSection({
      heading: 'OTHER PROJECTS',
      yearRange: '2020 - 2024',
      projects: [],
    }),
  ],
}
