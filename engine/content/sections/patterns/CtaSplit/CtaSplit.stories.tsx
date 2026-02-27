import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createCtaSplitSection } from './index'

const previewProps = getPresetPreview('CtaSplit')

export default { ...sectionStoryConfig(meta, createCtaSplitSection, previewProps), title: 'Contact/CTA Split' }
export const Default = { args: sectionStoryArgs(meta, previewProps, createCtaSplitSection) }
