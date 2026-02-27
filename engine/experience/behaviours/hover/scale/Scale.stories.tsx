import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/ProjectGallery/content'
import { createProjectGallerySection } from '../../../../content/sections/patterns/ProjectGallery'
import type { ProjectGalleryProps } from '../../../../content/sections/patterns/ProjectGallery/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Hover/Scale',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createProjectGallerySection(content.sampleContent as ProjectGalleryProps)}
    />
  ),
}
