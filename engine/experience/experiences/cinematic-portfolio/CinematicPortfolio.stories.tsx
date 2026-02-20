import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../../.storybook/helpers/preset-story'
import { noirPreset } from '../../../presets/noir'
import { noirSampleContent } from '../../../presets/noir/sample-content'

export default {
  ...presetStoryConfig('noir', 'Cinematic Portfolio', noirPreset),
}

export const Default = {
  render: (args: PresetStoryArgs) => (
    <PresetPageStory
      presetId="noir"
      preset={noirPreset}
      pageKey="home"
      sampleContent={noirSampleContent}
      experience={args.experience}
      intro={args.intro}
      introSettingsOverrides={extractIntroSettings(args)}
      experienceSettingsOverrides={extractExperienceSettings(args)}
      pinnedSections={args.pinnedSections as string[]}
    />
  ),
}
