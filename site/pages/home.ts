/**
 * Home page schema.
 * Bo Juhl portfolio landing page.
 */

import type { PageSchema } from '../../engine/schema'
import {
  createHeroSection,
  createAboutSection,
  createFeaturedProjectsSection,
  createOtherProjectsSection,
} from '../../engine/content/sections/patterns'

// Import preset styles
import { bojuhlHeroStyles } from '../../engine/presets/bojuhl/pages'

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
    createHeroSection({
      introText: "I'm Bo Juhl",
      roles: ['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR'],
      videoSrc: '/videos/frontpage/frontpage.webm',
      scrollIndicatorText: '(SCROLL)',
      styles: bojuhlHeroStyles,
    }),
    createAboutSection({
      bioParagraphs,
      signature,
      photoSrc: profilePhoto.src,
      photoAlt: profilePhoto.alt,
      clientLogos,
    }),
    createFeaturedProjectsSection({
      projects: featuredProjects,
    }),
    createOtherProjectsSection({
      heading: 'OTHER SELECTED PROJECTS',
      yearRange: otherProjectsYearRange,
      projects: otherProjects,
    }),
  ],
}
