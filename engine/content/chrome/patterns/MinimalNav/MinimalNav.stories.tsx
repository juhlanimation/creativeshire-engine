import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createMinimalNavRegion } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createMinimalNavRegion, previewProps), title: 'Headers/Minimal Navigation' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createMinimalNavRegion) }
export const Underline = {
  args: chromePatternStoryArgs(meta, { ...previewProps, linkHoverStyle: 'underline' }, createMinimalNavRegion),
}
