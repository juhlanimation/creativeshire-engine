import { widgetStoryConfig, widgetStoryArgs } from '../../../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import './index' // side-effect: registers TeamShowcase__StackVideoShowcase

export default { ...widgetStoryConfig('TeamShowcase__StackVideoShowcase', meta), title: 'Team/Team Showcase/Widgets/Stack Video Showcase' }
export const Default = { args: widgetStoryArgs('TeamShowcase__StackVideoShowcase', meta) }
