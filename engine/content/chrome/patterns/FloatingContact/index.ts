/**
 * FloatingContact chrome pattern — factory function for a floating header region.
 * Creates a widget-based region with an EmailCopy widget and hover/reveal behaviour.
 * Positioned via region layout (justify/align/padding).
 */

import type { PresetRegionConfig } from '../../../../presets/types'
import type { FloatingContactProps } from './types'

/**
 * Creates a FloatingContact region configuration.
 *
 * @param props - Contact prompt text, email, and blend mode
 * @returns PresetRegionConfig with layout-based positioning
 */
/** Map widget hoverColor key → CSS variable value for the behaviour */
const HOVER_COLOR_CSS: Record<string, string> = {
  accent: 'var(--accent)',
  interaction: 'var(--interaction, #9933FF)',
  primary: 'var(--text-primary)',
}

export function createFloatingContactRegion(props: FloatingContactProps): PresetRegionConfig {
  const hoverColor = props.hoverColor ?? 'accent'

  return {
    overlay: true,
    layout: {
      justify: 'end',
      align: 'start',
      padding: '1.5rem 2rem',
    },
    widgets: [
      {
        id: 'floating-contact',
        type: 'EmailCopy',
        props: {
          label: props.label,
          email: props.email,
          blendMode: props.blendMode ?? 'difference',
          hoverColor,
        },
        behaviour: {
          id: 'hover/reveal',
          options: { hoverColor: HOVER_COLOR_CSS[hoverColor] },
        },
      },
    ],
  }
}
