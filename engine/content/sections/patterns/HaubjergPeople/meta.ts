import { defineSectionMeta } from '../../../../schema/meta'
import type { ReactSectionProps } from '../ReactSection/meta'

export const meta = defineSectionMeta<ReactSectionProps>({
  id: 'HaubjergPeople',
  name: 'Haubjerg People',
  description: 'Custom React component section',
  category: 'section',
  sectionCategory: 'content',
  unique: false,
  icon: 'section',
  tags: ['content', 'react'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {},
})
