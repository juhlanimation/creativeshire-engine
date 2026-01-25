'use client'

/**
 * WidgetRenderer - Renders widgets from schema.
 *
 * Responsibilities:
 * 1. Look up widget component from registry
 * 2. Apply feature styles (spacing, typography, etc.)
 * 3. Wrap with behaviour for animation
 * 4. Recursively render child widgets
 *
 * @see .claude/architecture/creativeshire/components/renderer/renderer.spec.md
 */

import type { ReactNode, CSSProperties } from 'react'
import type { WidgetSchema, BehaviourConfig } from '@/creativeshire/schema'
import { getWidget } from '@/creativeshire/content/widgets/registry'
import { featuresToStyle } from '@/creativeshire/content/features'
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
 * Merge feature styles with any existing props.style.
 */
function mergeStyles(
  featureStyles: CSSProperties,
  propsStyle?: CSSProperties
): CSSProperties | undefined {
  const hasFeatureStyles = Object.keys(featureStyles).length > 0
  const hasPropsStyle = propsStyle && Object.keys(propsStyle).length > 0

  if (!hasFeatureStyles && !hasPropsStyle) return undefined
  if (!hasFeatureStyles) return propsStyle
  if (!hasPropsStyle) return featureStyles

  return { ...featureStyles, ...propsStyle }
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
 * @returns Rendered widget with features and behaviour applied
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
  const Component = getWidget(widget.type)

  // Return error fallback for unknown widget types
  if (!Component) {
    return <UnknownWidgetFallback type={widget.type} />
  }

  // Convert features to CSS styles
  const featureStyles = featuresToStyle(widget.features)

  // Extract behaviour configuration
  const behaviourId = extractBehaviourId(widget.behaviour)
  const behaviourOptions = extractBehaviourOptions(widget.behaviour)

  // Merge feature styles with any props.style
  const style = mergeStyles(
    featureStyles,
    widget.props?.style as CSSProperties | undefined
  )

  // Recursively render child widgets for layout containers
  const children = widget.widgets?.map((child, i) => (
    <WidgetRenderer key={child.id ?? i} widget={child} index={i} />
  ))

  // Prepare props, omitting style if undefined
  const componentProps = {
    ...widget.props,
    ...(style && { style }),
    ...(index !== undefined && { 'data-widget-index': index }),
  }

  // Render the widget component
  const rendered = (
    <ErrorBoundary widgetType={widget.type}>
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
