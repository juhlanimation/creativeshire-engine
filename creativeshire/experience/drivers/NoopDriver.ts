/**
 * NoopDriver - a no-operation driver implementation.
 * Satisfies the Driver interface but performs no actions.
 * Used as default/fallback when no specific driver is needed.
 */

import type { Driver } from './types'

/**
 * NoopDriver class.
 * Implements Driver interface with empty methods.
 */
export class NoopDriver implements Driver {
  id = 'noop'

  start(): void {
    // No operation
  }

  stop(): void {
    // No operation
  }

  destroy(): void {
    // No operation
  }
}
