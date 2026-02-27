import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/ProjectShowcase/content'
import { createProjectShowcaseSection } from '../../../../content/sections/patterns/ProjectShowcase'
import type { ProjectShowcaseProps } from '../../../../content/sections/patterns/ProjectShowcase/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Hover/Reveal',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createProjectShowcaseSection(content.sampleContent as ProjectShowcaseProps)}
    />
  ),
}
