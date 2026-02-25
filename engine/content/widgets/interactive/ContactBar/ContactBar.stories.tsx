import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('ContactBar', meta), title: 'Interactive/Contact Bar' }

export const Default = { args: widgetStoryArgs('ContactBar', meta) }

export const Dark = {
  args: {
    ...widgetStoryArgs('ContactBar', meta),
    textColor: 'dark',
  },
}

export const LargeIcons = {
  args: {
    ...widgetStoryArgs('ContactBar', meta),
    iconSize: 32,
    gap: 24,
  },
}
