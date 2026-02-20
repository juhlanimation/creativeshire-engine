/**
 * Home page schema.
 * Bo Juhl portfolio landing page.
 */

import type { PageSchema } from '../../engine/schema'
import {
  createHeroVideoSection,
  createAboutBioSection,
  createProjectFeaturedSection,
  createProjectStripSection,
} from '../../engine/content/sections/patterns'

// Import content data
import { featuredProjects, otherProjects } from '../data/projects'
import { bioParagraphs, signature, profilePhoto } from '../data/about'
import { clientLogos } from '../data/logos'

// Calculate year range dynamically from project data (no spaces around dash per reference)
const otherProjectYears = otherProjects.map(p => parseInt(p.year))
const otherProjectsYearRange = `${Math.min(...otherProjectYears)}-${Math.max(...otherProjectYears)}`

/**
 * Home page configuration.
 * Uses section patterns with real Bo Juhl content.
 */
export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: 'Bo Juhl | Executive Producer & Editor',
    description: 'Executive Producer leading animated films and campaigns for Riot Games, Netflix, Supercell, Amazon, and LEGO.',
  },
  sections: [
    createHeroVideoSection({
      introText: "I'm Bo Juhl",
      roles: ['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR'],
      videoSrc: '/videos/frontpage/frontpage.webm',
      scrollIndicatorText: '(SCROLL)',
    }),
    {
      ...createAboutBioSection({
        bioParagraphs,
        signature,
        photoSrc: profilePhoto.src,
        photoAlt: profilePhoto.alt,
        clientLogos,
      }),
      constrained: true,
    },
    createProjectFeaturedSection({
      projects: featuredProjects,
      colorMode: 'light',
    }),
    createProjectStripSection({
      colorMode: 'light',
      heading: 'OTHER PROJECTS',
      yearRange: otherProjectsYearRange,
      projects: otherProjects,
      galleryOn: { click: 'modal.open' },
    }),
  ],
}
