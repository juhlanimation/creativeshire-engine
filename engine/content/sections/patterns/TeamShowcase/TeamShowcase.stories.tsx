import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createTeamShowcaseSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createTeamShowcaseSection, previewProps), title: 'Team/Team Showcase' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createTeamShowcaseSection) }
