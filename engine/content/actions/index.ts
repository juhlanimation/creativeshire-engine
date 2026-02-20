'use client'

/**
 * Action Registry - Minimal pub/sub for widget events → chrome actions.
 *
 * Pattern:
 * - Chrome registers actions on mount: registerAction('modal.open', handler)
 * - Schema declares intent: { on: { click: 'modal.open' } }
 * - WidgetRenderer wires: onClick → executeAction('modal.open', payload)
 * - Widget stays pure: just calls onClick?.(payload)
 *
 * Action ID convention: `{overlayKey}.{verb}` (e.g., 'modal.open', 'cursorLabel.show').
 * Standard verbs: open/close, show/hide, toggle.
 *
 * This enables:
 * - Widgets without chrome imports (standalone)
 * - Schema-driven event → action mapping
 * - Tree-shaking (no Modal = no action registered = no bundle)
 * - Graceful degradation (action not registered = noop)
 */

/**
 * Base action payload — every action dispatch includes these fields.
 * Specific actions extend this with additional properties.
 */
export interface BaseActionPayload {
  /** DOM element that triggered the action */
  element?: HTMLElement | null
  /** DOM event name that triggered this action */
  event?: string
}

/**
 * Action payload type.
 * BaseActionPayload + arbitrary additional fields for extensibility.
 */
export type ActionPayload = BaseActionPayload & Record<string, unknown>

/**
 * Action handler function type.
 * Generic allows specific payload types for known actions.
 */
type ActionHandler<T = ActionPayload> = (payload: T) => void

const actionRegistry = new Map<string, ActionHandler>()

/**
 * Register an action handler.
 * Called by chrome/overlays when they mount.
 *
 * @param id - Action identifier (e.g., 'modal.open')
 * @param handler - Function to execute when action is triggered
 */
export function registerAction(id: string, handler: ActionHandler): void {
  actionRegistry.set(id, handler)
}

/**
 * Unregister an action handler.
 * Called by chrome/overlays when they unmount.
 *
 * @param id - Action identifier to remove
 */
export function unregisterAction(id: string): void {
  actionRegistry.delete(id)
}

/**
 * Execute a registered action.
 * Called by WidgetRenderer when schema.on triggers.
 *
 * @param id - Action identifier
 * @param payload - Data from widget (e.g., { videoUrl, rect })
 */
export function executeAction(id: string, payload: unknown): void {
  const handler = actionRegistry.get(id)

  if (!handler) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Action "${id}" not registered. Is the required Chrome loaded?`
      )
    }
    return
  }

  handler(payload as ActionPayload)
}

/**
 * Check if an action is registered.
 * Useful for conditional rendering or feature detection.
 *
 * @param id - Action identifier
 * @returns true if action is registered
 */
export function hasAction(id: string): boolean {
  return actionRegistry.has(id)
}

/**
 * Get all registered action IDs.
 * Useful for debugging and introspection.
 *
 * @returns Array of registered action IDs
 */
export function getActionIds(): string[] {
  return Array.from(actionRegistry.keys())
}
