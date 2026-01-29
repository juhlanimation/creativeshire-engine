'use client'

/**
 * WidgetRenderer - Renders widgets from schema.
 *
 * Responsibilities:
 * 1. Look up widget component from registry
 * 2. Pass style and className directly to widget
 * 3. Wrap with behaviour for animation
 * 4. Recursively render child widgets
 *
 * @see .claude/architecture/creativeshire/components/renderer/renderer.spec.md
 */

import type { ReactNode, CSSProperties } from 'react'
import type { WidgetSchema, BehaviourConfig } from '@/creativeshire/schema'
import { getWidget } from '@/creativeshire/content/widgets/registry'
import { BehaviourWrapper } from '@/creativeshire/experience/behaviours'
import { ErrorBoundary } from './ErrorBoundary'
import type { WidgetRendererProps } from './types'

/**
 * Extract behaviour ID from behaviour config.
 * Handles both string format and object format.
 */
function extractBehaviourId(behaviour?: BehaviourConfig): string | undefined {
  if (!behaviour) return undefined
  if (typeof behaviour === 'string') return behaviour
  return behaviour.id
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
  // Look up widget component from registry
  // Registry returns stable component references, not new components
  const Component = getWidget(widget.type)

  // Return error fallback for unknown widget types
  if (!Component) {
    return <UnknownWidgetFallback type={widget.type} />
  }

  // Extract behaviour configuration
  const behaviourId = extractBehaviourId(widget.behaviour)
  const behaviourOptions = extractBehaviourOptions(widget.behaviour)

  // Recursively render child widgets for layout containers
  const children = widget.widgets?.map((child, i) => (
    <WidgetRenderer key={child.id ?? i} widget={child} index={i} />
  ))

  // Prepare props - pass style and className directly from schema
  const componentProps = {
    ...widget.props,
    ...(widget.id && { id: widget.id }),
    ...(widget.style && { style: widget.style }),
    ...(widget.className && { className: widget.className }),
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
