import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createProjectStripSection } from './index'

const previewProps = getPresetPreview('ProjectStrip')

export default { ...sectionStoryConfig(meta, createProjectStripSection, previewProps), title: 'Project/Project Strip' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createProjectStripSection) }
