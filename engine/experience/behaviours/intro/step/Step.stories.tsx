import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/HeroTitle/content'
import { createHeroTitleSection } from '../../../../content/sections/patterns/HeroTitle'
import type { HeroTitleProps } from '../../../../content/sections/patterns/HeroTitle/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Intro/Step',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createHeroTitleSection(content.sampleContent as HeroTitleProps)}
    />
  ),
}
