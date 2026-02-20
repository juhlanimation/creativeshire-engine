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
export function createFloatingContactRegion(props: FloatingContactProps): PresetRegionConfig {
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
        },
        behaviour: { id: 'hover/reveal' },
      },
    ],
  }
}
