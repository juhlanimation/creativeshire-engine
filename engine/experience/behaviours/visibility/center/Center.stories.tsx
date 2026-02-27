import React from 'react'
import { behaviourStoryConfig, behaviourStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { SectionBehaviourPreview } from '../../../../../.storybook/helpers/SectionBehaviourPreview'
import { content } from '../../../../content/sections/patterns/ContentPricing/content'
import { createContentPricingSection } from '../../../../content/sections/patterns/ContentPricing'
import type { ContentPricingProps } from '../../../../content/sections/patterns/ContentPricing/types'
import behaviour from './index'

export default {
  ...behaviourStoryConfig(behaviour),
  title: 'Visibility/Center',
}

export const Default = {
  args: behaviourStoryArgs(behaviour),
  render: (args: Record<string, unknown>) => (
    <SectionBehaviourPreview
      behaviour={behaviour}
      args={args}
      section={createContentPricingSection(content.sampleContent as ContentPricingProps)}
    />
  ),
}
