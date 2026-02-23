import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createContactFooterRegion } from './index'

const previewProps = getPresetPreview('ContactFooter')

export default { ...chromePatternStoryConfig(meta, createContactFooterRegion, previewProps), title: 'Footers/Contact Footer' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createContactFooterRegion) }
