import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createGlassNavRegion } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createGlassNavRegion, previewProps), title: 'Headers/Glass Navigation' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createGlassNavRegion) }
