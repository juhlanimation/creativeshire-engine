import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createCursorTrackerOverlay } from './index'
import { previewProps } from './preview'

export default { ...chromePatternStoryConfig(meta, createCursorTrackerOverlay, previewProps), title: 'Overlays/Cursor Tracker' }
export const Default = { args: chromePatternStoryArgs(meta, previewProps, createCursorTrackerOverlay) }
