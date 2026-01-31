'use client'

/**
 * Action Registry - Minimal pub/sub for widget events → chrome actions.
 *
 * Pattern:
 * - Chrome registers actions on mount: registerAction('open-video-modal', handler)
 * - Schema declares intent: { on: { click: 'open-video-modal' } }
 * - WidgetRenderer wires: onClick → executeAction('open-video-modal', payload)
 * - Widget stays pure: just calls onClick?.(payload)
 *
 * This enables:
 * - Widgets without chrome imports (standalone)
 * - Schema-driven event → action mapping
 * - Tree-shaking (no Modal = no action registered = no bundle)
 * - Graceful degradation (action not registered = noop)
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Action payloads vary by action type
type ActionHandler = (payload: any) => void

const actionRegistry = new Map<string, ActionHandler>()

/**
 * Register an action handler.
 * Called by chrome/overlays when they mount.
 *
 * @param id - Action identifier (e.g., 'open-video-modal')
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

  handler(payload)
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
