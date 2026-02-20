import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Flex', meta), title: 'Layout/Flex' }
export const Default = { args: widgetStoryArgs('Flex', meta) }
