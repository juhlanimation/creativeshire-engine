/**
 * GalleryThumbnail interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { GalleryThumbnailProps } from './types'

export const meta = defineMeta<GalleryThumbnailProps>({
  id: 'GalleryThumbnail',
  name: 'Gallery Thumbnail',
  description: 'Expandable thumbnail with video, metadata labels, and modal integration',
  category: 'interactive',
  icon: 'thumbnail',
  tags: ['gallery', 'thumbnail', 'video', 'interactive'],
  component: true,

  settings: {
    expandedWidth: {
      type: 'text',
      label: 'Expanded Width',
      default: '32rem',
      description: 'Width when thumbnail is expanded',
      bindable: true,
    },
    transitionDuration: {
      type: 'number',
      label: 'Transition Duration',
      default: 400,
      description: 'Animation duration in milliseconds',
      min: 0,
      max: 2000,
      step: 50,
      advanced: true,
      bindable: true,
    },
  },
})
