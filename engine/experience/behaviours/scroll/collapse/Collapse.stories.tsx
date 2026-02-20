import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { BehaviourPreview } from '../../../../../.storybook/helpers/BehaviourPreview'
import { ScrollSample } from '../../../../../.storybook/helpers/behaviour-samples'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Scroll/Collapse',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <BehaviourPreview behaviour={behaviour} args={args}>
      <ScrollSample />
    </BehaviourPreview>
  ),
}
