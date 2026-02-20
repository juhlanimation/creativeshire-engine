import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Text', meta), title: 'Primitives/Text' }

/** Default body text. */
export const Default = { args: widgetStoryArgs('Text', meta) }

/** Display — hero / brand statement text. */
export const Display = {
  args: { ...widgetStoryArgs('Text', meta), content: 'Brand Statement', as: 'display' },
}

/** H1 — page heading. */
export const H1 = {
  args: { ...widgetStoryArgs('Text', meta), content: 'Page Heading', as: 'h1' },
}

/** H2 — section heading. */
export const H2 = {
  args: { ...widgetStoryArgs('Text', meta), content: 'Section Heading', as: 'h2' },
}

/** H3 — sub-heading. */
export const H3 = {
  args: { ...widgetStoryArgs('Text', meta), content: 'Sub-heading', as: 'h3' },
}

/** Body — paragraph text. */
export const Body = {
  args: { ...widgetStoryArgs('Text', meta), content: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.', as: 'p' },
}

/** Small — caption and metadata text. */
export const Small = {
  args: { ...widgetStoryArgs('Text', meta), content: 'Caption and metadata text — secondary information lives here.', as: 'small' },
}

/** Uppercase — text with text-transform applied. */
export const Uppercase = {
  args: { ...widgetStoryArgs('Text', meta), content: 'Uppercase heading text', as: 'h2', textTransform: 'uppercase' },
}

/** Centered — center-aligned paragraph text. */
export const Centered = {
  args: { ...widgetStoryArgs('Text', meta), content: 'This paragraph is center-aligned using the textAlign setting.', as: 'body', textAlign: 'center' },
}

/** BlendDifference — display text with difference blend mode. */
export const BlendDifference = {
  args: { ...widgetStoryArgs('Text', meta), content: 'Difference Blend', as: 'display', blendMode: 'difference' },
}

/** BoldWeight — heading with explicit bold weight override. */
export const BoldWeight = {
  args: { ...widgetStoryArgs('Text', meta), content: 'Bold Weight Override', as: 'h2', fontWeight: '700' },
}
