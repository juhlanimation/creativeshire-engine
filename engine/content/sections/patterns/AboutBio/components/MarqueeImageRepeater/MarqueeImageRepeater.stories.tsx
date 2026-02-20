import { widgetStoryConfig, widgetStoryArgs } from '../../../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import './index' // side-effect: registers AboutBio__MarqueeImageRepeater

export default { ...widgetStoryConfig('AboutBio__MarqueeImageRepeater', meta), title: 'About/About Bio/Widgets/Marquee Image Repeater' }
export const Default = { args: widgetStoryArgs('AboutBio__MarqueeImageRepeater', meta) }
