import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('EmailCopy', meta), title: 'Interactive/Email Copy' }
export const Default = { args: widgetStoryArgs('EmailCopy', meta) }
export const Reveal = { args: { ...widgetStoryArgs('EmailCopy', meta), variant: 'reveal', label: 'EMAIL', email: 'hello@example.com', hoverColor: 'accent' } }
