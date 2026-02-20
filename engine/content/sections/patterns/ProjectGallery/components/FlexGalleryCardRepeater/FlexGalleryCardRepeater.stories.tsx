import { widgetStoryConfig, widgetStoryArgs } from '../../../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import './index' // side-effect: registers ProjectGallery__FlexGalleryCardRepeater

export default { ...widgetStoryConfig('ProjectGallery__FlexGalleryCardRepeater', meta), title: 'Project/Project Gallery/Widgets/Flex Gallery Card Repeater' }
export const Default = { args: widgetStoryArgs('ProjectGallery__FlexGalleryCardRepeater', meta) }
