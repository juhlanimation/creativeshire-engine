import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createFloatingContactRegion } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createFloatingContactRegion, previewProps), title: 'Headers/Floating Contact' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createFloatingContactRegion) }
