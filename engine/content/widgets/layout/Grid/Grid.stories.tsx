import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Grid', meta), title: 'Layout/Grid' }
export const Default = { args: widgetStoryArgs('Grid', meta) }
