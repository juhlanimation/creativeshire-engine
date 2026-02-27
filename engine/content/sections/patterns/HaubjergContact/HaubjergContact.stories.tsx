import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createHaubjergContactSection } from './index'
import { content } from './content'
import type { ReactSectionProps } from '../ReactSection/meta'

// Side-effect import to register the scoped widget
import './index'

const config = sectionStoryConfig(meta, createHaubjergContactSection)
export default {
  ...config,
  title: 'Content/Haubjerg Contact',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = { args: sectionStoryArgs(meta, content.sampleContent as Partial<ReactSectionProps>, createHaubjergContactSection) }
