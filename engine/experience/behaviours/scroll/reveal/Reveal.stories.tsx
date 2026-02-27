import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/AboutCollage/content'
import { createAboutCollageSection } from '../../../../content/sections/patterns/AboutCollage'
import type { AboutCollageProps } from '../../../../content/sections/patterns/AboutCollage/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Scroll/Reveal',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createAboutCollageSection(content.sampleContent as AboutCollageProps)}
    />
  ),
}
