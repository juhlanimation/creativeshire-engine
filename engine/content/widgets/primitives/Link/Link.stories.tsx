import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Link', meta), title: 'Primitives/Link' }

const base = widgetStoryArgs('Link', meta)

/** Default — no visible underline. */
export const Default = {
  args: { ...base, variant: 'default' },
}

/** Underline — always visible underline. */
export const Underline = {
  args: { ...base, variant: 'underline' },
}

/** Hover Underline — underline fades in on hover. */
export const HoverUnderline = {
  args: { ...base, variant: 'hover-underline' },
}
