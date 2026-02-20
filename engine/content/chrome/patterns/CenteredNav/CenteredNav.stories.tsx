import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createCenteredNavRegion } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createCenteredNavRegion, previewProps), title: 'Headers/Centered Navigation' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createCenteredNavRegion) }
