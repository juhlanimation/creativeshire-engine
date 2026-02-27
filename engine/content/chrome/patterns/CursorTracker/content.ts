/**
 * CursorTracker chrome pattern content declaration.
 * Custom cursor label overlay.
 */

import type { SectionContentDeclaration } from '../../../../schema/content-field'

export const content: SectionContentDeclaration = {
  label: 'Cursor Tracker',
  description: 'Custom cursor label that follows the mouse over target elements',
  contentFields: [
    { path: 'label', type: 'text', label: 'Cursor Label', required: true, default: 'View' },
  ],
  sampleContent: {
    label: 'View',
  },
}
