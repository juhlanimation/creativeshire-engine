import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Stack', meta), title: 'Layout/Stack' }
export const Default = { args: widgetStoryArgs('Stack', meta) }
