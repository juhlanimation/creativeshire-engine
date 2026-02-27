import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createHeroStatementSection } from './index'

const previewProps = getPresetPreview('HeroStatement')

export default { ...sectionStoryConfig(meta, createHeroStatementSection, previewProps), title: 'Hero/Hero Statement' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createHeroStatementSection) }
