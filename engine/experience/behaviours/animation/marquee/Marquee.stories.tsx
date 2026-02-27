import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/AboutBio/content'
import { createAboutBioSection } from '../../../../content/sections/patterns/AboutBio'
import type { AboutBioProps } from '../../../../content/sections/patterns/AboutBio/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Animation/Marquee',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createAboutBioSection(content.sampleContent as AboutBioProps)}
    />
  ),
}
