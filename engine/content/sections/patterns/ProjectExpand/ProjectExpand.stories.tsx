import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectExpandSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectExpandSection, previewProps), title: 'Project/Project Expand' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectExpandSection) }
