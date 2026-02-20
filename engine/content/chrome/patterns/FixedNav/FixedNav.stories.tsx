import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createFixedNavRegion } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createFixedNavRegion, previewProps), title: 'Headers/Fixed Navigation' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createFixedNavRegion) }
