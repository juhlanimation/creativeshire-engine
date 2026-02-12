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
import type { WidgetSchema } from '../schema'
import { getWidget } from '../content/widgets/registry'
import { BehaviourWrapper } from '../experience/behaviours'
import { useExperience, type Experience } from '../experience'
import type { BehaviourAssignment } from '../experience/experiences/types'
import { executeAction } from '../experience/actions'
import { ErrorBoundary } from './ErrorBoundary'
import { capitalize } from './utils'
import type { WidgetRendererProps } from './types'

/**
 * Resolves behaviours for a widget as an array of assignments.
 * Priority: bareMode → explicit schema → experience defaults by widget type.
 */
function resolveWidgetBehaviours(
  widget: WidgetSchema,
  experience: Experience,
): BehaviourAssignment[] {
  if (experience.bareMode) return []
  if (widget.behaviour) {
    if (typeof widget.behaviour === 'string') {
      return [{ behaviour: widget.behaviour }]
    }
    if (widget.behaviour.id) {
      return [{ behaviour: widget.behaviour.id, options: widget.behaviour.options }]
    }
    return []
  }
  return experience.widgetBehaviours?.[widget.type] ?? []
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

  // Resolve behaviours from explicit schema or experience defaults
  const behaviourAssignments = resolveWidgetBehaviours(widget, experience)

  // Wire schema.on events to action registry
  // Maps { click: 'action-id' } → { onClick: (payload) => executeAction('action-id', payload) }
  // NOTE: This hook must be called before any early returns (React rules of hooks)
  const eventHandlers = useMemo(() => {
    if (!widget.on) return {}
    return Object.fromEntries(
      Object.entries(widget.on).map(([event, actionId]) => [
        `on${capitalize(event)}`, // click → onClick
        (payload: unknown) => executeAction(actionId, payload),
      ])
    )
  }, [widget.on])

  // Return error fallback for unknown widget types
  // NOTE: This check is placed AFTER hooks to satisfy React rules of hooks
  if (!Component) {
    return <UnknownWidgetFallback type={widget.type} />
  }

  // Recursively render child widgets for layout containers
  const hasChildWidgets = widget.widgets && widget.widgets.length > 0
  const children = hasChildWidgets
    ? widget.widgets!.map((child, i) => (
        <WidgetRenderer key={child.id ?? i} widget={child} index={i} />
      ))
    : undefined

  // Prepare props - pass style, className, widgets, data attributes, and event handlers from schema
  const componentProps = {
    ...widget.props,
    ...eventHandlers,
    ...(widget.id && { id: widget.id }),
    ...(widget.style && { style: widget.style }),
    ...(widget.className && { className: widget.className }),
    ...(widget.widgets && { widgets: widget.widgets }),
    ...(index !== undefined && { 'data-widget-index': index }),
    // Pass data attributes for layout control
    ...(widget['data-index'] !== undefined && { 'data-index': widget['data-index'] }),
    ...(widget['data-reversed'] !== undefined && { 'data-reversed': widget['data-reversed'] }),
  }

  // Render the widget component
  // IMPORTANT: Only pass JSX children when there are actual child widgets.
  // Passing {undefined} as JSX children overrides props.children (e.g., Link's text)
  // because JSX compiles to { ...props, children: undefined }.
  const rendered = (
    <ErrorBoundary widgetType={widget.type}>
      {/* eslint-disable react-hooks/static-components -- getWidget returns stable refs from registry Map */}
      {children
        ? <Component {...componentProps}>{children}</Component>
        : <Component {...componentProps} />
      }
      {/* eslint-enable react-hooks/static-components */}
    </ErrorBoundary>
  )

  // Wrap with nested BehaviourWrappers for multi-behaviour support
  if (behaviourAssignments.length === 0) {
    return rendered
  }

  return behaviourAssignments.reduceRight<ReactNode>(
    (children, assignment) => (
      <BehaviourWrapper
        behaviourId={assignment.behaviour}
        options={assignment.options}
      >
        {children}
      </BehaviourWrapper>
    ),
    rendered,
  )
}

export default WidgetRenderer
