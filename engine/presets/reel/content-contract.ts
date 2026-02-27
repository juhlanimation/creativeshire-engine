/**
 * Reel Preset Content Contract
 * Aggregates section content declarations into a unified CMS contract.
 */

import { buildContentContract } from '../content-utils'
import { content as heroImageContent } from '../../content/sections/patterns/HeroImage/content'
import { content as introStatementContent } from '../../content/sections/patterns/IntroStatement/content'
import { content as projectScrollContent } from '../../content/sections/patterns/ProjectScroll/content'
import { content as ctaSplitContent } from '../../content/sections/patterns/CtaSplit/content'
import { content as heroStatementContent } from '../../content/sections/patterns/HeroStatement/content'
import { content as teamBioContent } from '../../content/sections/patterns/TeamBio/content'
import { content as columnFooterContent } from '../../content/chrome/patterns/ColumnFooter/content'
import { content as glassNavContent } from '../../content/chrome/patterns/GlassNav/content'

export const reelContentContract = buildContentContract({
  // Site-level
  head: {
    label: 'Head',
    description: 'Page title and meta description',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title', required: true, default: 'CCCCCCC | Animation Studio' },
      { path: 'description', type: 'textarea', label: 'Meta Description', required: true, default: 'Award-winning animation studio specializing in character animation, motion design, and visual storytelling.' },
    ],
    sampleContent: { title: 'CCCCCCC | Animation Studio', description: 'Award-winning animation studio.' },
  },

  // Section-level
  hero: { ...heroImageContent, label: 'Hero', description: 'Full-bleed hero image' },
  intro: { ...introStatementContent, label: 'Intro', description: 'Statement heading with body and logo marquee' },
  projects: { ...projectScrollContent, label: 'Projects', description: 'Scrollable project cards with sidebar' },
  cta: { ...ctaSplitContent, label: 'Call to Action', description: 'CTA with heading, body, and email link' },
  about: { ...heroStatementContent, label: 'About Hero', description: 'Statement hero with images and body columns' },
  team: { ...teamBioContent, label: 'Team', description: 'Team member profiles' },

  // Chrome-level (merged footer + nav content fields)
  chrome: {
    ...columnFooterContent,
    label: 'Chrome',
    description: 'Header nav and footer columns',
    contentFields: [
      ...columnFooterContent.contentFields,
      ...glassNavContent.contentFields,
    ],
    sampleContent: {
      ...columnFooterContent.sampleContent,
      ...glassNavContent.sampleContent,
    },
  },
})
