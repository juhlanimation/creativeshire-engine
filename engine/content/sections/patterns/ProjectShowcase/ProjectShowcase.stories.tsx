import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectShowcaseSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectShowcaseSection, previewProps), title: 'Project/Project Showcase' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectShowcaseSection) }
