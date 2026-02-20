import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../.storybook/helpers/preset-story'
import { testMultipagePreset } from './'

export default {
  ...presetStoryConfig('test-multipage', 'Test Multipage', testMultipagePreset),
  title: 'Multi Page/Test Multipage',
}

export const Home = {
  render: (args: PresetStoryArgs) => (
    <PresetPageStory
      presetId="test-multipage"
      preset={testMultipagePreset}
      pageKey="home"
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
      presetId="test-multipage"
      preset={testMultipagePreset}
      pageKey="about"
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
