/**
 * Driver types for the Experience layer.
 * Drivers handle DOM events and update the experience store.
 */

/**
 * Driver interface.
 * Implementations handle specific DOM events (scroll, resize, etc.)
 * and update the experience store accordingly.
 */
export interface Driver {
  /** Unique identifier for the driver */
  id: string
  /** Start listening for events */
  start: () => void
  /** Stop listening for events */
  stop: () => void
  /** Cleanup resources when provider unmounts */
  destroy: () => void
}
