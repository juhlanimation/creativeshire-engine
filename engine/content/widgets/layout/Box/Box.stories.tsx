import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Box', meta), title: 'Layout/Box' }
export const Default = { args: widgetStoryArgs('Box', meta) }
