import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../.storybook/helpers/preset-story'
import { loftPreset } from './'
import { loftSampleContent } from './sample-content'

export default {
  ...presetStoryConfig('loft', 'Business Landing - Loft', loftPreset),
  title: 'Single Page/Business Landing - Loft',
}

export const Home = {
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
      sectionGap={args.sectionGap}
      sectionGapScale={args.sectionGapScale as number}
    />
  ),
}
