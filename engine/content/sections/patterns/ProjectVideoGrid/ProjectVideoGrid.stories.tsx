import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectVideoGridSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectVideoGridSection, previewProps), title: 'Project/Project Video Grid' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectVideoGridSection) }
