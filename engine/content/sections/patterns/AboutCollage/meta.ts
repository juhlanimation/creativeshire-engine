/**
 * PhotoCollage section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
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

  settings: {},
})
