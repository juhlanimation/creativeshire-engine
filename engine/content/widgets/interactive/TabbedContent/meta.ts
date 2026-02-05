/**
 * TabbedContent interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { TabbedContentProps } from './types'

export const meta = defineMeta<TabbedContentProps>({
  id: 'TabbedContent',
  name: 'Tabbed Content',
  description: 'Tab interface with switchable content panels',
  category: 'interactive',
  icon: 'tabs',
  tags: ['tabs', 'content', 'switcher', 'navigation'],
  component: true,

  settings: {
    tabs: {
      type: 'custom',
      label: 'Tabs',
      default: [],
      description: 'Array of tab items with id, label, and content',
      validation: { required: true },
      bindable: true,
    },
    defaultTab: {
      type: 'text',
      label: 'Default Tab',
      default: '',
      description: 'ID of the default active tab',
    },
    position: {
      type: 'select',
      label: 'Tab Position',
      default: 'top',
      choices: [
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' }
      ],
      description: 'Position of the tab bar',
    },
    align: {
      type: 'select',
      label: 'Tab Alignment',
      default: 'start',
      choices: [
        { value: 'start', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'Right' }
      ],
      description: 'Horizontal alignment of tabs',
    },
  },
})
