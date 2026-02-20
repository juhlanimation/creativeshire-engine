import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectTabsSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectTabsSection, previewProps), title: 'Project/Project Tabs' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectTabsSection) }
