/**
 * Reel preset about page template.
 * Light hero → dark team profiles → CTA.
 */

import type { PageSchema } from '../../../schema'
import {
  createHeroStatementSection,
  createTeamBioSection,
  createCtaSplitSection,
} from '../../../content/sections/patterns'

const aboutHeroSection = createHeroStatementSection({
  id: 'about-hero',
  colorMode: 'light',
  headingColor: '#ff3b11',
})

const teamSection = createTeamBioSection({
  colorMode: 'dark',
})

const ctaSection = createCtaSplitSection({
  id: 'cta-about',
  label: 'Call to Action',
  layout: 'compact',
  colorMode: 'dark',
})

export const aboutPageTemplate: PageSchema = {
  id: 'about',
  slug: '/about',
  head: {
    title: '{{ content.head.title }}',
    description: '{{ content.head.description }}',
  },
  sections: [
    aboutHeroSection,
    teamSection,
    ctaSection,
  ],
}
