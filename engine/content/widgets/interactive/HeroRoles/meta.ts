/**
 * HeroRoles widget metadata.
 */

import { defineMeta } from '../../../../schema/meta'
import type { HeroRolesProps } from './types'

export const meta = defineMeta<HeroRolesProps>({
  id: 'HeroRoles',
  name: 'Hero Roles',
  description: 'Renders role titles for hero sections. Supports binding expressions.',
  category: 'interactive',
  icon: 'text',
  tags: ['hero', 'roles', 'titles'],
  component: true,

  settings: {
    roles: {
      type: 'custom',
      label: 'Roles',
      default: [],
      description: 'Array of role strings or binding expression',
      bindable: true,
    },
  },
})
