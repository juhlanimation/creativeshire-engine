import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/TeamShowcase/content'
import { createTeamShowcaseSection } from '../../../../content/sections/patterns/TeamShowcase'
import type { TeamShowcaseProps } from '../../../../content/sections/patterns/TeamShowcase/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Visibility/Fade In',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createTeamShowcaseSection(content.sampleContent as TeamShowcaseProps)}
    />
  ),
}
