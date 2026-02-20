import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createHeroTitleSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createHeroTitleSection, previewProps), title: 'Hero/Hero Title' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createHeroTitleSection) }
