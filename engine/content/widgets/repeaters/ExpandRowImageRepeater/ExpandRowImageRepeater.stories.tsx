import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('ExpandRowImageRepeater', meta), title: 'Repeaters/Expand Row Image Repeater' }
export const Default = { args: widgetStoryArgs('ExpandRowImageRepeater', meta) }
