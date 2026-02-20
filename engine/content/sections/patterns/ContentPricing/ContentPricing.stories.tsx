import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createContentPricingSection } from './index'
import { previewProps, medlemskabPreviewProps } from './preview'

export default { ...sectionStoryConfig(meta, createContentPricingSection, previewProps), title: 'Content/Content Pricing' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createContentPricingSection) }
export const Medlemskab = { args: sectionStoryArgs(meta, medlemskabPreviewProps, createContentPricingSection) }
