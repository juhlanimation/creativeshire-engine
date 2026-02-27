import React from 'react'
import { IntroShowcase } from '../../../.storybook/helpers/IntroShowcase'
import { PresetPageStory } from '../../../.storybook/helpers/preset-story'
import { meta, config } from './video-hero-gate'
import { loftPreset } from '../../presets/loft'
import { loftSampleContent } from '../../presets/loft/sample-content'
import { isExperienceRef } from '../../experience/compositions/types'

export default {
  title: 'Video Hero Gate',
  parameters: { layout: 'fullscreen' },
}

export const Documentation = {
  render: () => <IntroShowcase meta={meta} config={config} />,
}

const loftExperienceId = isExperienceRef(loftPreset.experience)
  ? loftPreset.experience.base
  : loftPreset.experience.id

export const OnPreset = {
  render: () => (
    <PresetPageStory
      presetId="loft"
      preset={loftPreset}
      pageKey="home"
      sampleContent={loftSampleContent}
      experience={loftExperienceId}
      intro="(preset default)"
    />
  ),
}
