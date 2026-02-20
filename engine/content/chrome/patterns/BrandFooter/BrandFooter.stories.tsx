import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createBrandFooterRegion } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createBrandFooterRegion, previewProps), title: 'Footers/Brand Footer' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createBrandFooterRegion) }
