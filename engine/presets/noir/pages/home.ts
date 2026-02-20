/**
 * Noir preset home page template.
 * Uses factory functions for section layout, passing only content bindings + style overrides.
 *
 * Content values use binding expressions ({{ content.xxx }}) that
 * are resolved at runtime by the platform before rendering.
 */

import type { PageSchema } from '../../../schema'
import {
  createHeroVideoSection,
  createAboutBioSection,
  createProjectFeaturedSection,
  createProjectStripSection,
} from '../../../content/sections/patterns'

// =============================================================================
// Sections via factory functions
// =============================================================================

const heroSection = createHeroVideoSection({ colorMode: 'dark' })

const aboutSection = createAboutBioSection({ colorMode: 'dark' })

const featuredProjectsSection = createProjectFeaturedSection({
  colorMode: 'light',
})

const otherProjectsSection = createProjectStripSection({ colorMode: 'light' })

// =============================================================================
// Page Template
// =============================================================================

/**
 * Home page template with binding expressions.
 * Platform resolves bindings before rendering.
 */
export const homePageTemplate: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: '{{ content.head.title }}',
    description: '{{ content.head.description }}'
  },
  sections: [
    heroSection,
    aboutSection,
    featuredProjectsSection,
    otherProjectsSection
  ]
}
