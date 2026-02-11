/**
 * Generic dev-mode URL parameter override hook.
 *
 * Two modes:
 * - One-shot (no eventName): reads URL param once after hydration
 * - Reactive (with eventName): reads initial + listens for CustomEvent updates
 *
 * Returns null in production. Hooks always run to satisfy Rules of Hooks,
 * but the getter/event are no-ops in prod.
 */

import { useState, useEffect } from 'react'

export function useDevOverride(
  getter: () => string | null,
  eventName?: string,
): string | null {
  const [override, setOverride] = useState<string | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const initial = getter()
    if (initial) setOverride(initial)

    if (!eventName) return

    const handler = (e: CustomEvent<string | null>) => setOverride(e.detail)
    window.addEventListener(eventName, handler as EventListener)
    return () => window.removeEventListener(eventName, handler as EventListener)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return override
}
