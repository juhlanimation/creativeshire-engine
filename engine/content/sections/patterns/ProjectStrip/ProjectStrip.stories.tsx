import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectStripSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectStripSection, previewProps), title: 'Project/Project Strip' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectStripSection) }
