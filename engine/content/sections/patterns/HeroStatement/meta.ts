import { defineSectionMeta } from '../../../../schema/meta'
import { colorSetting } from '../../../../schema/settings-helpers'
import type { HeroStatementProps } from './types'

export const meta = defineSectionMeta<HeroStatementProps>({
  id: 'HeroStatement',
  name: 'Hero Statement',
  description: 'Statement hero with large heading, image collage, body columns, and email CTA.',
  category: 'section',
  sectionCategory: 'hero',
  unique: true,
  icon: 'hero',
  tags: ['hero', 'statement', 'about', 'collage'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {
    bodyColumns: {
      type: 'select',
      label: 'Body Columns',
      default: '2',
      choices: [
        { value: '1', label: 'Single Column' },
        { value: '2', label: 'Two Columns' },
      ],
    },
    headingColor: colorSetting('Heading Color', 'var(--color-accent)'),
    blendMode: {
      type: 'select',
      label: 'Image Blend Mode',
      default: 'screen',
      choices: [
        { value: 'screen', label: 'Screen' },
        { value: 'multiply', label: 'Multiply' },
        { value: 'normal', label: 'Normal' },
      ],
      group: 'Style',
    },
  },
})
