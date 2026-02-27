import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createHaubjergNavRegion } from './index'
import { content } from './content'
import type { HaubjergNavProps } from './types'

const previewProps = content.sampleContent as Partial<HaubjergNavProps>
const config = chromePatternStoryConfig(meta, createHaubjergNavRegion, previewProps)
export default {
  ...config,
  title: 'Headers/Haubjerg Nav',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = { args: chromePatternStoryArgs(meta, previewProps, createHaubjergNavRegion) }
