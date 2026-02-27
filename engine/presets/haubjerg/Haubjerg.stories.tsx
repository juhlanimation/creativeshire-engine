import { presetStoryConfig, PresetPageStory, extractIntroSettings, extractExperienceSettings } from '../../../.storybook/helpers/preset-story'
import type { PresetStoryArgs } from '../../../.storybook/helpers/preset-story'
import { haubjergPreset } from './'
import { haubjergSampleContent } from './sample-content'

export default {
  ...presetStoryConfig('haubjerg', 'Studio Dokumentar — Haubjerg', haubjergPreset),
  title: 'Multi Page/Studio Dokumentar — Haubjerg',
}

const renderPage = (pageKey: string) => (args: PresetStoryArgs) => (
  <PresetPageStory
    presetId="haubjerg"
    preset={haubjergPreset}
    pageKey={pageKey}
    sampleContent={haubjergSampleContent}
    experience={args.experience}
    intro={args.intro}
    introSettingsOverrides={extractIntroSettings(args)}
    experienceSettingsOverrides={extractExperienceSettings(args)}
    pinnedSections={args.pinnedSections as string[]}
    sectionGap={args.sectionGap}
    sectionGapScale={args.sectionGapScale as number}
  />
)

export const Home = { render: renderPage('home') }
export const Ambassadoer = { render: renderPage('ambassadoer') }
export const Workshops = { render: renderPage('workshops') }
export const Kontakt = { render: renderPage('kontakt') }
export const Projekt1 = { render: renderPage('projekt-1') }
export const Projekt2 = { render: renderPage('projekt-2') }
export const Projekt3 = { render: renderPage('projekt-3') }
export const Projekt4 = { render: renderPage('projekt-4') }
export const Projekt5 = { render: renderPage('projekt-5') }
export const Projekt6 = { render: renderPage('projekt-6') }
