import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Button', meta), title: 'Primitives/Button' }
export const Default = { args: widgetStoryArgs('Button', meta) }
