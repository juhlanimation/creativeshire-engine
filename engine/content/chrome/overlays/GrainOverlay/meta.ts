/**
 * GrainOverlay overlay metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { GrainOverlayProps } from './types'

export const meta = defineMeta<GrainOverlayProps>({
  id: 'GrainOverlay',
  name: 'Film Grain',
  description: 'Canvas-based film grain overlay with mix-blend-overlay',
  category: 'overlay',
  icon: 'film',
  tags: ['chrome', 'overlay', 'grain', 'texture'],
  component: true,
  settings: {},
})
