import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createAboutCollageSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createAboutCollageSection, previewProps), title: 'About/About Collage' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createAboutCollageSection) }
