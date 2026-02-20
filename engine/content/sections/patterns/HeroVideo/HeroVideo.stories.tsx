import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createHeroVideoSection } from './index'
import { previewProps } from './preview'

export default { ...sectionStoryConfig(meta, createHeroVideoSection, previewProps), title: 'Hero/Hero Video' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createHeroVideoSection) }
