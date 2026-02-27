import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/ProjectExpand/content'
import { createProjectExpandSection } from '../../../../content/sections/patterns/ProjectExpand'
import type { ProjectExpandProps } from '../../../../content/sections/patterns/ProjectExpand/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Hover/Expand',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createProjectExpandSection(content.sampleContent as ProjectExpandProps)}
    />
  ),
}
