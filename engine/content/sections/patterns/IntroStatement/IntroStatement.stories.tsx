import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createIntroStatementSection } from './index'

const previewProps = getPresetPreview('IntroStatement')

export default { ...sectionStoryConfig(meta, createIntroStatementSection, previewProps), title: 'Content/Intro Statement' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createIntroStatementSection) }
