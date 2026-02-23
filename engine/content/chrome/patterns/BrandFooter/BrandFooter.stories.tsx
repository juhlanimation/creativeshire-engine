import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { getPresetPreview } from '../../../../../.storybook/helpers/active-preset'
import { meta } from './meta'
import { createBrandFooterRegion } from './index'

const previewProps = getPresetPreview('BrandFooter')

export default { ...chromePatternStoryConfig(meta, createBrandFooterRegion, previewProps), title: 'Footers/Brand Footer' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createBrandFooterRegion) }
