import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createContactFooterRegion } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createContactFooterRegion, previewProps), title: 'Footers/Contact Footer' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createContactFooterRegion) }
