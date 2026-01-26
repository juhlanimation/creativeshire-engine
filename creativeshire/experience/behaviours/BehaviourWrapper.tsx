'use client'

/**
 * BehaviourWrapper - applies behaviour CSS variables to children.
 * Foundation implementation - renders children without behaviour computation.
 * Future versions will compute and apply CSS variables from state.
 */

import type { ReactNode } from 'react'

/**
 * Props for BehaviourWrapper component.
 */
export interface BehaviourWrapperProps {
  /** Behaviour ID to apply (null or 'none' for no behaviour) */
  behaviourId?: string | null
  /** Behaviour options to pass to compute function */
  options?: Record<string, unknown>
  /** Child elements to wrap */
  children: ReactNode
}

/**
 * BehaviourWrapper component.
 * Wraps children and applies behaviour-computed CSS variables.
 *
 * Foundation implementation: passthrough only.
 * Full implementation will:
 * 1. Resolve behaviour from registry
 * 2. Subscribe to experience store
 * 3. Compute CSS variables on state change
 * 4. Apply variables via style prop
 *
 * @param behaviourId - ID of behaviour to apply
 * @param options - Options to pass to behaviour compute
 * @param children - Elements to wrap
 */
export function BehaviourWrapper({
  behaviourId: _behaviourId,
  options: _options,
  children,
}: BehaviourWrapperProps): ReactNode {
  // Foundation: passthrough - no behaviour computation
  // Future: resolve behaviour, subscribe to store, compute and apply CSS variables
  return <>{children}</>
}

export default BehaviourWrapper
