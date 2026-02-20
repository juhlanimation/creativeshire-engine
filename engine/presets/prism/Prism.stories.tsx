import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../.storybook/helpers/preset-story'
import { prismPreset } from './'
import { prismSampleContent } from './sample-content'

export default {
  ...presetStoryConfig('prism', 'Showcase Portfolio - Prism', prismPreset),
  title: 'Single Page/Showcase Portfolio - Prism',
}

export const Home = {
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
      sectionGap={args.sectionGap}
      sectionGapScale={args.sectionGapScale as number}
    />
  ),
}
