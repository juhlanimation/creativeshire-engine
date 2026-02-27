/**
 * HaubjergPeople — React component section.
 * Wraps a custom React component as an engine section via ReactSection.
 */

import type { SectionSchema } from '../../../../schema'
import { registerScopedWidget } from '../../../widgets/registry'
import { createReactSection, type ReactSectionProps } from '../ReactSection'
import { HaubjergPeopleComponent } from './component'

// Register the React component as a scoped widget
registerScopedWidget('HaubjergPeople__Component', HaubjergPeopleComponent)

// Export a typed factory
export function createHaubjergPeopleSection(props?: Partial<ReactSectionProps>): SectionSchema {
  return {
    ...createReactSection({
      id: props?.id ?? 'haubjerg-people',
      label: props?.label ?? 'Haubjerg People',
      component: 'HaubjergPeople__Component',
      props: props?.props,
      constrained: props?.constrained,
      colorMode: props?.colorMode,
      sectionHeight: props?.sectionHeight,
      style: props?.style,
      className: props?.className,
      paddingTop: props?.paddingTop,
      paddingBottom: props?.paddingBottom,
      paddingLeft: props?.paddingLeft,
      paddingRight: props?.paddingRight,
    }),
    patternId: 'HaubjergPeople',
  }
}
