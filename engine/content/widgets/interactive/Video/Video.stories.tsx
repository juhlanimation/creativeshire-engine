import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Video', meta), title: 'Interactive/Video' }
export const Default = { args: widgetStoryArgs('Video', meta) }
export const HoverPlay = {
  args: {
    ...widgetStoryArgs('Video', meta),
    hoverPlay: true,
    autoplay: false,
  },
}
