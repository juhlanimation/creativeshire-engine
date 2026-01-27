/**
 * Bojuhl preset home page template.
 * Assembles Hero, About, FeaturedProjects, OtherProjects sections.
 */

import type { PageSchema } from '../../../schema/page'
import {
  createHeroSection,
  createAboutSection,
  createFeaturedProjectsSection,
  createOtherProjectsSection,
} from '../../../content/sections/composites'

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
