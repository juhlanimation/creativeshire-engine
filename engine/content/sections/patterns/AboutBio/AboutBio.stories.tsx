import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createAboutBioSection } from './index'

const previewProps = getPresetPreview('AboutBio')

export default { ...sectionStoryConfig(meta, createAboutBioSection, previewProps), title: 'About/About Bio' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createAboutBioSection) }
