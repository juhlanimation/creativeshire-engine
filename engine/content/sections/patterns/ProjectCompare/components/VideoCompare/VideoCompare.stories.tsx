import { widgetStoryConfig, widgetStoryArgs } from '../../../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import './index' // side-effect: registers ProjectCompare__VideoCompare

export default { ...widgetStoryConfig('ProjectCompare__VideoCompare', meta), title: 'Project/Project Compare/Widgets/Video Compare' }
export const Default = { args: widgetStoryArgs('ProjectCompare__VideoCompare', meta) }
