import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createHeroTitleSection } from './index'

const previewProps = getPresetPreview('HeroTitle')

export default { ...sectionStoryConfig(meta, createHeroTitleSection, previewProps), title: 'Hero/Hero Title' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createHeroTitleSection) }
