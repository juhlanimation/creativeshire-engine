import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createContentPricingSection } from './index'
import { content } from './content'
import { medlemskabPreviewProps } from './preview'
import type { ContentPricingProps } from './types'

export default { ...sectionStoryConfig(meta, createContentPricingSection), title: 'Content/Content Pricing' }
export const Default = { args: sectionStoryArgs(meta, content.sampleContent as Partial<ContentPricingProps>, createContentPricingSection) }
export const Medlemskab = { args: sectionStoryArgs(meta, medlemskabPreviewProps, createContentPricingSection) }
