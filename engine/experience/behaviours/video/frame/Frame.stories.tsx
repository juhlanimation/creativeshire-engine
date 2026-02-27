import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/HeroVideo/content'
import { createHeroVideoSection } from '../../../../content/sections/patterns/HeroVideo'
import type { HeroVideoProps } from '../../../../content/sections/patterns/HeroVideo/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Video/Frame',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createHeroVideoSection(content.sampleContent as HeroVideoProps)}
    />
  ),
}
