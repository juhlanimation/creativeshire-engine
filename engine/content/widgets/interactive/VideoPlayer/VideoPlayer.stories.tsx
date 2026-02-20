import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import VideoPlayerComponent from './index'

export default { ...widgetStoryConfig('VideoPlayer', meta), title: 'Interactive/Video Player' }

export const Default = {
  args: { ...widgetStoryArgs('VideoPlayer', meta), autoPlay: false },
  render: (args: Record<string, unknown>) => (
    <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '16 / 9' }}>
      <VideoPlayerComponent {...args} />
    </div>
  ),
}
