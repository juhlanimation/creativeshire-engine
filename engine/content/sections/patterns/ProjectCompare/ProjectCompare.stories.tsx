import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createProjectCompareSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createProjectCompareSection, previewProps), title: 'Project/Project Compare' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectCompareSection) }
