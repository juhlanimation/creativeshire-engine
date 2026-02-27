import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/ProjectStrip/content'
import { createProjectStripSection } from '../../../../content/sections/patterns/ProjectStrip'
import type { ProjectStripProps } from '../../../../content/sections/patterns/ProjectStrip/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Scroll/Progress',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createProjectStripSection(content.sampleContent as ProjectStripProps)}
    />
  ),
}
