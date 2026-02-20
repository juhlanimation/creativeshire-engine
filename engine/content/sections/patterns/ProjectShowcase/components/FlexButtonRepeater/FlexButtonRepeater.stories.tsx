import { widgetStoryConfig, widgetStoryArgs } from '../../../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import './index' // side-effect: registers ProjectShowcase__FlexButtonRepeater

export default { ...widgetStoryConfig('ProjectShowcase__FlexButtonRepeater', meta), title: 'Project/Project Showcase/Widgets/Flex Button Repeater' }
export const Default = { args: widgetStoryArgs('ProjectShowcase__FlexButtonRepeater', meta) }
