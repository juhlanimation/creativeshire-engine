import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createHeroImageSection } from './index'

const previewProps = getPresetPreview('HeroImage')

export default { ...sectionStoryConfig(meta, createHeroImageSection, previewProps), title: 'Hero/Hero Image' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createHeroImageSection) }
