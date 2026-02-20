import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createAboutBioSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createAboutBioSection, previewProps), title: 'About/About Bio' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createAboutBioSection) }
