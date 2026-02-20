import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Image', meta), title: 'Primitives/Image' }
export const Default = { args: widgetStoryArgs('Image', meta) }
