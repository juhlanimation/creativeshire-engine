import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createHeroVideoSection } from './index'

const previewProps = getPresetPreview('HeroVideo')

export default { ...sectionStoryConfig(meta, createHeroVideoSection, previewProps), title: 'Hero/Hero Video' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createHeroVideoSection) }
