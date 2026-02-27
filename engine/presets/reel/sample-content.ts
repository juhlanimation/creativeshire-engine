/**
 * Sample content for Reel preset preview.
 * Used in development mode when previewing the preset without platform data.
 */

import { buildSampleContent } from '../content-utils'
import { content as heroImageContent } from '../../content/sections/patterns/HeroImage/content'
import { content as introStatementContent } from '../../content/sections/patterns/IntroStatement/content'
import { content as projectScrollContent } from '../../content/sections/patterns/ProjectScroll/content'
import { content as ctaSplitContent } from '../../content/sections/patterns/CtaSplit/content'
import { content as heroStatementContent } from '../../content/sections/patterns/HeroStatement/content'
import { content as teamBioContent } from '../../content/sections/patterns/TeamBio/content'
import { content as columnFooterContent } from '../../content/chrome/patterns/ColumnFooter/content'
import { content as glassNavContent } from '../../content/chrome/patterns/GlassNav/content'

export const reelSampleContent = buildSampleContent({
  head: {
    label: 'Head',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title' },
      { path: 'description', type: 'textarea', label: 'Meta Description' },
    ],
    sampleContent: {
      title: 'CCCCCCC | Animation Studio',
      description: 'Award-winning animation studio specializing in character animation, motion design, and visual storytelling.',
    },
  },
  hero: heroImageContent,
  intro: introStatementContent,
  projects: projectScrollContent,
  cta: ctaSplitContent,
  about: heroStatementContent,
  team: teamBioContent,
  chrome: {
    ...columnFooterContent,
    sampleContent: {
      ...columnFooterContent.sampleContent,
      ...glassNavContent.sampleContent,
    },
  },
})
