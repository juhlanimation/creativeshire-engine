import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createVideoModalOverlay } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createVideoModalOverlay, previewProps), title: 'Overlays/Video Modal' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createVideoModalOverlay) }
