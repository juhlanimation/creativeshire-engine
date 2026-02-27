import { defineSectionMeta } from '../../../../schema/meta'

export interface ReactSectionProps {
  id?: string
  label?: string
  component: string // Widget registry key (e.g., 'Custom__HeroSection')
  props?: Record<string, unknown>
  constrained?: boolean
  colorMode?: 'dark' | 'light'
  sectionTheme?: string
  sectionHeight?: 'auto' | 'viewport' | 'viewport-fixed'
  style?: React.CSSProperties
  className?: string
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
}

export const meta = defineSectionMeta<ReactSectionProps>({
  id: 'ReactSection',
  name: 'React Section',
  description:
    'Renders a custom React component as a section. Use for imported components from Figma Make, Framer, or custom code.',
  category: 'section',
  sectionCategory: 'content',
  unique: false,
  icon: 'section',
  tags: ['custom', 'react', 'import'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {
    sectionHeight: {
      type: 'select',
      label: 'Section Height',
      choices: [
        { value: 'auto', label: 'Auto' },
        { value: 'viewport', label: 'Full Viewport' },
        { value: 'viewport-fixed', label: 'Fixed Viewport' },
      ],
      default: 'auto',
    },
  },
})
