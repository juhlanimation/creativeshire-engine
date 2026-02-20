import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../../.storybook/helpers/preset-story'
import { loftPreset } from '../../../presets/loft'
import { loftSampleContent } from '../../../presets/loft/sample-content'

export default {
  ...presetStoryConfig('loft', 'Cover Scroll', loftPreset),
}

export const Default = {
  render: (args: PresetStoryArgs) => (
    <PresetPageStory
      presetId="loft"
      preset={loftPreset}
      pageKey="home"
      sampleContent={loftSampleContent}
      experience={args.experience}
      intro={args.intro}
      introSettingsOverrides={extractIntroSettings(args)}
      experienceSettingsOverrides={extractExperienceSettings(args)}
      pinnedSections={args.pinnedSections as string[]}
    />
  ),
}
