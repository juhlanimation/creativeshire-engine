import type { SectionContentDeclaration } from '../../../../schema/content-field'
import type { ReactSectionProps } from './meta'

export const content: SectionContentDeclaration<Partial<ReactSectionProps>> = {
  label: 'React Section',
  description: 'Custom React component section. Content is managed by the component itself.',
  contentFields: [],
  sampleContent: {},
}
