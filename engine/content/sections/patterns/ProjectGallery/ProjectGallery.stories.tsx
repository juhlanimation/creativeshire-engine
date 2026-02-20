import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectGallerySection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectGallerySection, previewProps), title: 'Project/Project Gallery' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectGallerySection) }
