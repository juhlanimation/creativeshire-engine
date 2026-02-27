/**
 * ReactSection — renders a registered React component as an engine section.
 *
 * Usage:
 *   1. Register your React component: registerScopedWidget('Custom__MyComponent', MyComponent)
 *   2. Use in preset: createReactSection({ id: 'hero', component: 'Custom__MyComponent' })
 *
 * The component renders within engine chrome, transitions, and section-level behaviours.
 * CMS editability can be added progressively by extracting component props into binding expressions.
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { meta, type ReactSectionProps } from './meta'

export type { ReactSectionProps }

export function createReactSection(rawProps: ReactSectionProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps)

  if (!p.component) {
    throw new Error(
      'ReactSection requires a "component" prop (widget registry key, e.g. "Custom__HeroSection")',
    )
  }

  const widgets: WidgetSchema[] = [
    {
      id: `${p.id ?? 'react-section'}-root`,
      type: p.component as string,
      props: (p.props ?? {}) as Record<string, unknown>,
    },
  ]

  return {
    id: p.id ?? 'react-section',
    patternId: 'ReactSection',
    label: p.label ?? 'React Section',
    constrained: p.constrained ?? false,
    colorMode: p.colorMode,
    sectionTheme: p.sectionTheme,
    layout: { type: 'stack', direction: 'column', align: 'stretch' },
    style: p.style,
    className: p.className,
    paddingTop: p.paddingTop ?? 0,
    paddingBottom: p.paddingBottom ?? 0,
    paddingLeft: p.paddingLeft ?? 0,
    paddingRight: p.paddingRight ?? 0,
    sectionHeight: (p.sectionHeight as 'auto' | 'viewport' | 'viewport-fixed') ?? 'auto',
    widgets,
  }
}
