import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Container', meta), title: 'Layout/Container' }
export const Default = { args: widgetStoryArgs('Container', meta) }
