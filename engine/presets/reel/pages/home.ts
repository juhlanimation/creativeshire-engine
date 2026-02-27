/**
 * Reel preset home page template.
 * Dark cinematic portfolio: Hero → Intro → Projects → CTA.
 */

import type { PageSchema } from '../../../schema'
import {
  createHeroImageSection,
  createIntroStatementSection,
  createProjectScrollSection,
  createCtaSplitSection,
} from '../../../content/sections/patterns'

const heroSection = createHeroImageSection({
  colorMode: 'dark',
})

const introSection = createIntroStatementSection({
  colorMode: 'dark',
})

const projectsSection = createProjectScrollSection({
  colorMode: 'dark',
})

const ctaSection = createCtaSplitSection({
  id: 'cta-home',
  label: 'Call to Action',
  layout: 'featured',
  colorMode: 'light',
  style: {
    backgroundColor: '#ffd70c',
    color: '#050706',
  },
})

export const homePageTemplate: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: '{{ content.head.title }}',
    description: '{{ content.head.description }}',
  },
  sections: [
    heroSection,
    introSection,
    projectsSection,
    ctaSection,
  ],
}
