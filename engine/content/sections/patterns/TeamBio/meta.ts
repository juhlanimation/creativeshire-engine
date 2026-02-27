import { defineSectionMeta } from '../../../../schema/meta'
import type { TeamBioProps } from './types'

export const meta = defineSectionMeta<TeamBioProps>({
  id: 'TeamBio',
  name: 'Team Bio',
  description: 'Team member profiles with portrait, accent-colored name, bio, and social links.',
  category: 'section',
  sectionCategory: 'about',
  unique: false,
  icon: 'about',
  tags: ['team', 'bio', 'profiles', 'about'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {
    columns: {
      type: 'select',
      label: 'Columns',
      default: '2',
      choices: [
        { value: '1', label: 'Single Column' },
        { value: '2', label: 'Two Columns' },
      ],
    },
    nameScale: {
      type: 'select',
      label: 'Name Size',
      default: 'xl',
      choices: [
        { value: 'large', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
      group: 'Style',
    },
  },
})
