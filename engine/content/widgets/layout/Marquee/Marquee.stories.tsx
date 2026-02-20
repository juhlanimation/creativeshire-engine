import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Marquee', meta), title: 'Layout/Marquee' }
export const Default = { args: widgetStoryArgs('Marquee', meta) }
