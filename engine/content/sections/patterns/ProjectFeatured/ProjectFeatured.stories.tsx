import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createProjectFeaturedSection } from './index'

const previewProps = getPresetPreview('ProjectFeatured')

export default { ...sectionStoryConfig(meta, createProjectFeaturedSection, previewProps), title: 'Project/Project Featured' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectFeaturedSection) }
