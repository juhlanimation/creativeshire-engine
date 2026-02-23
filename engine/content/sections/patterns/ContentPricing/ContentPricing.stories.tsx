import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createContentPricingSection } from './index'
import { medlemskabPreviewProps } from './preview'

export default { ...sectionStoryConfig(meta, createContentPricingSection), title: 'Content/Content Pricing' }
export const Default = { args: sectionStoryArgs(meta, undefined, createContentPricingSection) }
export const Medlemskab = { args: sectionStoryArgs(meta, medlemskabPreviewProps, createContentPricingSection) }
