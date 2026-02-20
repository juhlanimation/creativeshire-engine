/**
 * PhotoCollage section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting } from '../../../../schema/settings-helpers'
import type { AboutCollageProps } from './types'

export const meta = defineSectionMeta<AboutCollageProps>({
  id: 'AboutCollage',
  name: 'About Collage',
  description: 'Text block with scattered photo images in a collage layout',
  category: 'section',
  sectionCategory: 'about',
  unique: false,
  icon: 'about',
  tags: ['about', 'photos', 'collage', 'gallery'],
  component: false,
  ownedFields: ['layout', 'className'],

  settings: {
    text: {
      type: 'text',
      label: 'Text',
      default: '',
      description: 'Main text content',
      validation: { required: true, maxLength: 2000 },
      group: 'Content',
    },
    images: {
      type: 'custom',
      label: 'Images',
      default: [],
      description: 'Array of collage images',
      group: 'Media',
    },

    // Typography
    textScale: textScaleSetting('Text Scale', 'body'),
  },
})
