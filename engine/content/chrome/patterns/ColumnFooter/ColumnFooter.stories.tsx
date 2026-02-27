import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createColumnFooterRegion } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createColumnFooterRegion, previewProps), title: 'Footers/Column Footer' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createColumnFooterRegion) }
