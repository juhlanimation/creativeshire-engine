/**
 * Text widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { TextProps } from './types'

export const meta = defineMeta<TextProps>({
  id: 'Text',
  name: 'Text',
  description: 'Displays text content with semantic HTML elements',
  category: 'primitive',
  icon: 'text',
  tags: ['content', 'typography', 'heading', 'paragraph'],
  component: true,

  settings: {
    content: {
      type: 'textarea',
      label: 'Content',
      default: '',
      description: 'Text content to display',
      validation: { required: true },
    },
    as: {
      type: 'select',
      label: 'Element',
      default: 'p',
      description: 'HTML element to render',
      choices: [
        { value: 'p', label: 'Paragraph' },
        { value: 'h1', label: 'Heading 1' },
        { value: 'h2', label: 'Heading 2' },
        { value: 'h3', label: 'Heading 3' },
        { value: 'h4', label: 'Heading 4' },
        { value: 'h5', label: 'Heading 5' },
        { value: 'h6', label: 'Heading 6' },
        { value: 'span', label: 'Span' },
      ],
    },
    variant: {
      type: 'text',
      label: 'Variant',
      default: '',
      description: 'Semantic variant for CSS styling (data-variant attribute)',
      advanced: true,
    },
    html: {
      type: 'toggle',
      label: 'Render as HTML',
      default: false,
      description: 'Render content as HTML (enables inline links, etc.)',
      advanced: true,
    },
  },
})
