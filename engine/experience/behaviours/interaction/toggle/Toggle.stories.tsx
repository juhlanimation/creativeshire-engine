import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/ProjectTabs/content'
import { createProjectTabsSection } from '../../../../content/sections/patterns/ProjectTabs'
import type { ProjectTabsProps } from '../../../../content/sections/patterns/ProjectTabs/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Interaction/Toggle',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createProjectTabsSection(content.sampleContent as ProjectTabsProps)}
    />
  ),
}
