/**
 * HaubjergNav chrome pattern — factory function for header region.
 *
 * Uses a scoped React component (HaubjergNav__Component) for the navbar,
 * which handles its own mobile menu state, active link detection, and responsive layout.
 *
 * Structure:
 * - HaubjergNav__Component (scoped widget)
 *   - Brand: "Studio" (white/60) + "Dokumentar" (white)
 *   - Desktop nav: 4 links, active = white + border-b
 *   - Mobile hamburger + fullscreen menu
 */

import type { PresetRegionConfig } from '../../../../presets/types'
import type { HaubjergNavProps } from './types'
import { registerScopedWidget } from '../../../widgets/registry'
import HaubjergNavComponent from './component'

// Register the component as a scoped widget
registerScopedWidget('HaubjergNav__Component', HaubjergNavComponent)

/**
 * Creates a HaubjergNav header region configuration.
 *
 * @param props - Region configuration with brand text and nav links
 * @returns PresetRegionConfig for the header region
 */
export function createHaubjergNavRegion(props?: HaubjergNavProps): PresetRegionConfig {
  return {
    widgets: [
      {
        id: 'haubjerg-nav',
        type: 'HaubjergNav__Component',
        props: {
          brandParts: props?.brandParts ?? ['Studio', 'Dokumentar'],
          navLinks: props?.navLinks ?? [],
        },
      },
    ],
    layout: {
      ...props?.layout,
    },
    overlay: props?.overlay ?? true,
    ...(props?.style && { style: props.style }),
  }
}
