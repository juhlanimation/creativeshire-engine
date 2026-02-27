import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../.storybook/helpers/preset-story'
import { reelPreset } from './'
import { reelSampleContent } from './sample-content'

export default {
  ...presetStoryConfig('reel', 'Cinematic Portfolio - Reel', reelPreset),
  title: 'Multi Page/Cinematic Portfolio - Reel',
}

export const Home = {
  render: (args: PresetStoryArgs) => (
    <PresetPageStory
      presetId="reel"
      preset={reelPreset}
      pageKey="home"
      sampleContent={reelSampleContent}
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

export const About = {
  render: (args: PresetStoryArgs) => (
    <PresetPageStory
      presetId="reel"
      preset={reelPreset}
      pageKey="about"
      sampleContent={reelSampleContent}
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
