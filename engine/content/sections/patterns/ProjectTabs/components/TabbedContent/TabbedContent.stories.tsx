import { widgetStoryConfig, widgetStoryArgs } from '../../../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import './index' // side-effect: registers ProjectTabs__TabbedContent

export default { ...widgetStoryConfig('ProjectTabs__TabbedContent', meta), title: 'Project/Project Tabs/Widgets/Tabbed Content' }
export const Default = { args: widgetStoryArgs('ProjectTabs__TabbedContent', meta) }
