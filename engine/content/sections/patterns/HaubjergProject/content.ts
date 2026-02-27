import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ReactSectionProps } from '../ReactSection/meta'

export const content: SectionContentDeclaration<Partial<ReactSectionProps>> = {
  label: 'Haubjerg Project',
  description: 'Custom React component section. Content is managed by the component itself.',
  contentFields: [],
  sampleContent: {},
}
