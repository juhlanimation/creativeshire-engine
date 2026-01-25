'use client'

/**
 * SectionRenderer - renders sections from schema.
 * Maps widgets to WidgetRenderer and wraps with behaviour.
 */

import Section from '../content/sections'
import { WidgetRenderer } from './WidgetRenderer'
import { BehaviourWrapper } from '../experience/behaviours'
import type { SectionSchema } from '../schema'

interface SectionRendererProps {
  section: SectionSchema
  index: number
}

/**
 * Renders a section with its widgets.
 */
export function SectionRenderer({ section, index }: SectionRendererProps) {
  const behaviourId = typeof section.behaviour === 'string'
    ? section.behaviour
    : section.behaviour?.id

  const widgets = section.widgets.map((widget, i) => (
    <WidgetRenderer key={widget.id ?? `widget-${i}`} widget={widget} index={i} />
  ))

  const content = (
    <Section
      id={section.id}
      layout={section.layout}
      features={section.features}
      widgets={section.widgets}
    >
      {widgets}
    </Section>
  )

  return (
    <BehaviourWrapper behaviourId={behaviourId}>
      {content}
    </BehaviourWrapper>
  )
}

export default SectionRenderer
