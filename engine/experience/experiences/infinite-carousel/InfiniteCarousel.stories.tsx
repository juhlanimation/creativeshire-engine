import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../../.storybook/helpers/preset-story'
import { prismPreset } from '../../../presets/prism'
import { prismSampleContent } from '../../../presets/prism/sample-content'

export default {
  ...presetStoryConfig('prism', 'Infinite Carousel', prismPreset),
}

export const Default = {
  render: (args: PresetStoryArgs) => (
    <PresetPageStory
      presetId="prism"
      preset={prismPreset}
      pageKey="home"
      sampleContent={prismSampleContent}
      experience={args.experience}
      intro={args.intro}
      introSettingsOverrides={extractIntroSettings(args)}
      experienceSettingsOverrides={extractExperienceSettings(args)}
      pinnedSections={args.pinnedSections as string[]}
    />
  ),
}
