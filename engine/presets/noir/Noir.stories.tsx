import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../.storybook/helpers/preset-story'
import { noirPreset } from './'
import { noirSampleContent } from './sample-content'

export default {
  ...presetStoryConfig('noir', 'Cinematic Portfolio - Noir', noirPreset),
  title: 'Single Page/Cinematic Portfolio - Noir',
}

export const Home = {
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
      sectionGap={args.sectionGap}
      sectionGapScale={args.sectionGapScale as number}
    />
  ),
}
