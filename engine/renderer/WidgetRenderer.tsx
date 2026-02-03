'use client'

/**
 * WidgetRenderer - Renders widgets from schema.
 *
 * Responsibilities:
 * 1. Look up widget component from registry
 * 2. Pass style and className directly to widget
 * 3. Wrap with behaviour for animation
 * 4. Recursively render child widgets
 * 5. Wire schema.on events to action registry
 *
 * @see .claude/architecture/engine/components/renderer/renderer.spec.md
 */

import { useMemo, type ReactNode } from 'react'
import type { WidgetSchema, BehaviourConfig } from '../schema'
import { getWidget } from '../content/widgets/registry'
import { BehaviourWrapper } from '../experience/behaviours'
import { useExperience, type Experience } from '../experience'
import { executeAction } from '../experience/actions'
import { ErrorBoundary } from './ErrorBoundary'
import type { WidgetRendererProps } from './types'

/**
 * Capitalize first letter of a string.
 * Used to convert event names to React handler format: click → onClick
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Resolves behaviour for a widget.
 * Priority: explicit schema → experience defaults by widget type.
 */
function resolveWidgetBehaviour(
  widget: WidgetSchema,
  experience: Experience
): string | null {
  // Explicit behaviour in schema takes priority
  if (widget.behaviour) {
    if (typeof widget.behaviour === 'string') return widget.behaviour
    return widget.behaviour.id ?? null
  }

  // Check experience defaults by widget type (e.g., 'HeroTitle', 'ProjectCard')
  return experience.behaviourDefaults[widget.type] ?? null
}

/**
 * Extract behaviour options from behaviour config.
 */
function extractBehaviourOptions(
  behaviour?: BehaviourConfig
): Record<string, unknown> | undefined {
  if (!behaviour || typeof behaviour === 'string') return undefined
  return behaviour.options
}

/**
 * Error fallback for unknown widget types.
 */
function UnknownWidgetFallback({ type }: { type: string }): ReactNode {
  return (
    <div
      data-error={`Unknown widget: ${type}`}
      style={{
        padding: '0.5rem 1rem',
        margin: '0.25rem 0',
        border: '1px dashed #f59e0b',
        borderRadius: '0.25rem',
        backgroundColor: '#fffbeb',
        color: '#92400e',
        fontSize: '0.875rem',
      }}
    >
      Unknown widget: {type}
    </div>
  )
}

/**
 * WidgetRenderer component.
 * Renders a widget from its schema definition.
 *
 * @param widget - Widget schema to render
 * @param index - Optional index when rendered in a list
 * @returns Rendered widget with style and behaviour applied
 *
 * @example
 * ```tsx
 * <WidgetRenderer widget={{ type: 'Text', props: { content: 'Hello' } }} />
 * ```
 */
export function WidgetRenderer({
  widget,
  index,
}: WidgetRendererProps): ReactNode {
  const { experience } = useExperience()

  // Look up widget component from registry
  // Registry returns stable component references, not new components
  const Component = getWidget(widget.type)

  // Return error fallback for unknown widget types
  if (!Component) {
    return <UnknownWidgetFallback type={widget.type} />
  }

  // Resolve behaviour from explicit schema or experience defaults
  const behaviourId = resolveWidgetBehaviour(widget, experience)
  const behaviourOptions = extractBehaviourOptions(widget.behaviour)

  // Wire schema.on events to action registry
  // Maps { click: 'action-id' } → { onClick: (payload) => executeAction('action-id', payload) }
  const eventHandlers = useMemo(() => {
    if (!widget.on) return {}
    return Object.fromEntries(
      Object.entries(widget.on).map(([event, actionId]) => [
        `on${capitalize(event)}`, // click → onClick
        (payload: unknown) => executeAction(actionId, payload),
      ])
    )
  }, [widget.on])

  // Recursively render child widgets for layout containers
  const children = widget.widgets?.map((child, i) => (
    <WidgetRenderer key={child.id ?? i} widget={child} index={i} />
  ))

  // Prepare props - pass style, className, widgets, and event handlers from schema
  const componentProps = {
    ...widget.props,
    ...eventHandlers,
    ...(widget.id && { id: widget.id }),
    ...(widget.style && { style: widget.style }),
    ...(widget.className && { className: widget.className }),
    ...(widget.widgets && { widgets: widget.widgets }),
    ...(index !== undefined && { 'data-widget-index': index }),
  }

  // Render the widget component
  const rendered = (
    <ErrorBoundary widgetType={widget.type}>
      {/* eslint-disable-next-line react-hooks/static-components -- Component from registry is stable */}
      <Component {...componentProps}>{children}</Component>
    </ErrorBoundary>
  )

  // Wrap with BehaviourWrapper for animation support
  return (
    <BehaviourWrapper behaviourId={behaviourId} options={behaviourOptions}>
      {rendered}
    </BehaviourWrapper>
  )
}

export default WidgetRenderer
