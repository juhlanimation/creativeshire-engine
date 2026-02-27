import { defineChromeMeta } from '../../../../schema/meta'
import type { ColumnFooterProps } from './types'

export const meta = defineChromeMeta<ColumnFooterProps>({
  id: 'ColumnFooter',
  name: 'Column Footer',
  description: 'Multi-column footer with animated divider line and staggered column reveal.',
  category: 'chrome-pattern',
  chromeSlot: 'footer',
  icon: 'footer',
  tags: ['chrome', 'footer', 'columns', 'divider'],
  component: false,
  settings: {
    showDivider: {
      type: 'toggle',
      label: 'Show Divider Line',
      default: true,
    },
    columnCount: {
      type: 'number',
      label: 'Column Count',
      default: 3,
      min: 2,
      max: 5,
      step: 1,
    },
    lastColumnAlign: {
      type: 'select',
      label: 'Last Column Alignment',
      default: 'end',
      choices: [
        { value: 'auto', label: 'Auto' },
        { value: 'end', label: 'Push to End' },
      ],
      group: 'Style',
    },
  },
})
