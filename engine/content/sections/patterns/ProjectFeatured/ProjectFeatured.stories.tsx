import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectFeaturedSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectFeaturedSection, previewProps), title: 'Project/Project Featured' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectFeaturedSection) }
