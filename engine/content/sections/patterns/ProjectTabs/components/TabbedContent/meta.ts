/**
 * TabbedContent interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../../../schema/meta'
import type { TabbedContentProps } from './types'

export const meta = defineMeta<TabbedContentProps>({
  id: 'ProjectTabs__TabbedContent',
  name: 'Tabbed Content',
  description: 'Tab interface with switchable content panels',
  category: 'interactive',
  icon: 'tabs',
  tags: ['tabs', 'content', 'switcher', 'navigation'],
  component: true,

  // Content settings (tabs, defaultTab) are section-owned.
  // This widget is purely structural — the section factory injects content via props.
  settings: {
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
