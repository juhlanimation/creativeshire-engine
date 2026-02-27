import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createTeamBioSection } from './index'

const previewProps = getPresetPreview('TeamBio')

export default { ...sectionStoryConfig(meta, createTeamBioSection, previewProps), title: 'About/Team Bio' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createTeamBioSection) }
