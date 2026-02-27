import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectScrollSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectScrollSection, previewProps), title: 'Projects/Project Scroll' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectScrollSection) }
