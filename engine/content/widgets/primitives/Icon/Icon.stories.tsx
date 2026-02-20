import { widgetStoryConfig, widgetStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'

export default { ...widgetStoryConfig('Icon', meta), title: 'Primitives/Icon' }

const base = widgetStoryArgs('Icon', meta)

// Common SVG icons (stroke-based, inherits currentColor)
const SVGS = {
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l6 6L20 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8V4z"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>',
}

/** Default — arrow icon. */
export const Default = { args: base }

/** Check icon. */
export const Check = {
  args: { ...base, name: SVGS.check },
}

/** Close icon. */
export const Close = {
  args: { ...base, name: SVGS.close },
}

/** Mail icon. */
export const Mail = {
  args: { ...base, name: SVGS.mail },
}

/** Play icon (filled). */
export const Play = {
  args: { ...base, name: SVGS.play },
}

/** External link icon. */
export const ExternalLink = {
  args: { ...base, name: SVGS.externalLink },
}

/** Small size (16px). */
export const Small = {
  args: { ...base, size: 16 },
}

/** Large size (48px). */
export const Large = {
  args: { ...base, size: 48 },
}
