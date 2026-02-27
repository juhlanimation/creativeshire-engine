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

import { useMemo, useRef, useCallback, useEffect, type ReactNode } from 'react'
import type { WidgetSchema, ActionBinding } from '../schema'
import { getWidget } from '../content/widgets/registry'
import { getWidgetMeta } from '../content/widgets/meta-registry'
import { BehaviourWrapper } from '../experience/behaviours'
import { useExperience } from '../experience'
import type { BehaviourAssignment } from '../experience/compositions/types'
import { executeAction } from '../content/actions'
import { resolveDecorators } from '../content/decorators'
import { ErrorBoundary } from './ErrorBoundary'
import type { WidgetRendererProps } from './types'

/**
 * Execute an action binding, merging schema params with widget-provided payload.
 * Merge order: schema params (lowest) → widget enrichment (highest) → element/event (always).
 */
function executeBinding(binding: ActionBinding, payload: Record<string, unknown>): void {
  if (typeof binding === 'string') {
    executeAction(binding, payload)
  } else {
    // Merge: schema params → widget payload (widget overrides schema)
    const merged = binding.params
      ? { ...binding.params, ...payload }
      : payload
    executeAction(binding.action, merged)
  }
}

/**
 * Convert a BehaviourConfig to a BehaviourAssignment.
 */
function toBehaviourAssignment(config: import('../schema/experience').BehaviourConfig): BehaviourAssignment | null {
  if (typeof config === 'string') {
    return { behaviour: config }
  }
  if (config.id) {
    return { behaviour: config.id, options: config.options }
  }
  return null
}

/**
 * Collect explicit behaviours from widget schema (both singular and array forms).
 */
function collectExplicitBehaviours(widget: WidgetSchema): import('../schema/experience').BehaviourConfig[] {
  const result: import('../schema/experience').BehaviourConfig[] = []
  // Array form takes precedence
  if (widget.behaviours && widget.behaviours.length > 0) {
    result.push(...widget.behaviours)
  } else if (widget.behaviour) {
    // Singular fallback
    result.push(widget.behaviour)
  }
  return result
}

/**
 * Resolves behaviours for a widget as an array of assignments.
 * Merges decorator-contributed behaviours with explicit schema-level behaviours.
 */
function resolveWidgetBehaviours(
  widget: WidgetSchema,
  bareMode: boolean,
  resolvedBehaviours: import('../schema/experience').BehaviourConfig[],
): BehaviourAssignment[] {
  if (bareMode) return []
  const assignments: BehaviourAssignment[] = []
  for (const config of resolvedBehaviours) {
    const assignment = toBehaviourAssignment(config)
    if (assignment) assignments.push(assignment)
  }
  return assignments
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

  // Resolve decorators: merge decorator-contributed actions/behaviours with explicit schema values
  // Fall back to meta.defaultDecorators when widget.decorators is absent.
  // Explicit widget.decorators (even []) fully replaces defaults.
  const meta = getWidgetMeta(widget.type)
  const effectiveDecorators = widget.decorators ?? meta?.defaultDecorators
  const explicitBehaviours = collectExplicitBehaviours(widget)
  const resolved = resolveDecorators(effectiveDecorators, widget.on, explicitBehaviours)
  const resolvedOn = resolved.on

  // Resolve behaviours: explicit + decorator-contributed
  const behaviourAssignments = resolveWidgetBehaviours(widget, experience.bareMode ?? false, resolved.behaviours)

  // Ref to capture DOM element for action event listeners.
  // All widgets use forwardRef, so this ref receives the widget's root DOM element.
  const elementRef = useRef<HTMLElement>(null)

  // Ref callback to capture the rendered element
  const setElementRef = useCallback((node: HTMLElement | null) => {
    (elementRef as React.MutableRefObject<HTMLElement | null>).current = node
  }, [])

  // Stable ref for resolved event map to avoid effect re-runs on object identity changes
  const onMapRef = useRef(resolvedOn)
  onMapRef.current = resolvedOn

  // Track which events were handled by React prop handlers this cycle.
  // Used to deduplicate: if a widget consumes onClick and calls it with a rich payload,
  // the DOM listener fallback should not fire a second (generic) action.
  const handledEventsRef = useRef<Set<string>>(new Set())

  // Build React event handler props from widget.on.
  // These are passed as component props (e.g. onClick, onMouseEnter).
  // Widgets that accept these props (Video, ExpandRowImageRepeater) call them with
  // rich payloads — the payload flows through to executeAction.
  // Widgets that don't accept these props ignore them — the DOM listener fallback fires instead.
  const actionHandlerProps = useMemo(() => {
    if (!resolvedOn) return {}
    const props: Record<string, (payload?: unknown) => void> = {}

    for (const [event, bindingOrBindings] of Object.entries(resolvedOn)) {
      const reactProp = `on${event[0].toUpperCase()}${event.slice(1)}`

      props[reactProp] = (payload?: unknown) => {
        handledEventsRef.current.add(event)
        const bindings = Array.isArray(bindingOrBindings) ? bindingOrBindings : [bindingOrBindings]
        const enriched = {
          ...(payload && typeof payload === 'object' ? payload : {}),
          element: elementRef.current,
          event,
        }
        for (const binding of bindings) executeBinding(binding, enriched)
      }
    }

    return props
  }, [resolvedOn])

  // Wire schema.on events to action registry via native DOM listeners (fallback).
  // Attaches directly to the widget's root element via forwarded ref.
  // Uses microtask deferral to deduplicate with React prop handlers above:
  // - Native DOM listener fires first (capture/bubble reaches element before React's delegated handler)
  // - Deferred via Promise.resolve() to run AFTER React's synchronous prop handler
  // - If prop handler already fired (set flag), DOM listener skips
  // - Supports arrays: { click: ['a.open', 'b.track'] } → both fire
  useEffect(() => {
    const el = elementRef.current
    const onMap = onMapRef.current
    if (!el || !onMap) return

    const listeners: Array<[string, EventListener]> = []

    for (const [event, bindingOrBindings] of Object.entries(onMap)) {
      const handler = () => {
        // Defer to microtask — React's prop handler runs synchronously first
        Promise.resolve().then(() => {
          if (handledEventsRef.current.has(event)) {
            handledEventsRef.current.delete(event)
            return // Prop handler already fired with rich payload
          }
          const bindings = Array.isArray(bindingOrBindings) ? bindingOrBindings : [bindingOrBindings]
          for (const binding of bindings) executeBinding(binding, { element: el, event })
        })
      }
      el.addEventListener(event, handler)
      listeners.push([event, handler])
    }

    return () => {
      for (const [event, handler] of listeners) {
        el.removeEventListener(event, handler)
      }
    }
  }, [resolvedOn])

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

  // Attach ref when we have event handlers (for DOM listener attachment)
  const needsRef = !!resolvedOn

  // Prepare props - schema props + action handlers
  // Note: meta defaults are NOT merged here — they're for CMS UI only.
  // Merging them would inject inline styles (e.g. flex-direction: row)
  // that override CSS container queries and responsive rules.
  const componentProps = {
    ...widget.props,                     // Schema props
    ...actionHandlerProps,               // Action handler props (onClick, onMouseEnter, etc.)
    ...(needsRef && { ref: setElementRef }),
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
