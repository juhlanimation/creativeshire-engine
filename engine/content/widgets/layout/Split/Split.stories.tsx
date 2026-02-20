import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Split', meta), title: 'Layout/Split' }
export const Default = { args: widgetStoryArgs('Split', meta) }
