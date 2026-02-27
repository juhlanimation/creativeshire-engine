import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('ArrowLink', meta), title: 'Interactive/Arrow Link' }
export const Default = { args: { ...widgetStoryArgs('ArrowLink', meta), email: 'hello@example.com', label: 'Get in touch' } }
export const Swap = { args: { ...widgetStoryArgs('ArrowLink', meta), variant: 'swap', email: 'hello@example.com', label: 'Get in touch' } }
export const Slide = { args: { ...widgetStoryArgs('ArrowLink', meta), variant: 'slide', email: 'hello@example.com', label: 'hello@example.com' } }
export const ArrowDown = { args: { ...widgetStoryArgs('ArrowLink', meta), variant: 'slide', email: 'hello@example.com', label: 'hello@example.com', arrowDirection: 'down' } }
