/**
 * Behaviour resolution.
 * Resolves behaviour IDs to behaviour definitions from registry.
 */

import { behaviourRegistry } from './registry'
import type { Behaviour } from './types'

/**
 * Backward compatibility aliases.
 * Maps old behaviour IDs to new trigger-based IDs.
 *
 * OLD naming: by effect/widget (scroll-fade, contact-reveal, project-card-hover)
 * NEW naming: by trigger (scroll/fade, hover/reveal, hover/scale)
 */
const BEHAVIOUR_ALIASES: Record<string, string> = {
  // Scroll-based behaviours
  'scroll-fade': 'scroll/fade',
  'scroll-fade-out': 'scroll/fade-out',
  'scroll-indicator-fade': 'scroll/progress',
  'hero-text-color-transition': 'scroll/color-shift',
  'scroll-background-slideshow': 'scroll/image-cycle',

  // Hover-based behaviours
  'hover-reveal': 'hover/reveal',
  'contact-reveal': 'hover/reveal',
  'floating-contact-cta': 'hover/scale',
  'project-card-hover': 'hover/scale',
  'gallery-thumbnail-expand': 'hover/expand',

  // Visibility-based behaviours
  'fade-in': 'visibility/fade-in',

  // Animation-based behaviours
  'logo-marquee-animation': 'animation/marquee',
}

/**
 * Resolve a behaviour ID to its definition.
 * Returns null for 'none', undefined, or unregistered behaviours.
 *
 * Supports backward compatibility via BEHAVIOUR_ALIASES.
 * Old IDs are mapped to new trigger-based IDs.
 *
 * @param behaviourId - The behaviour ID to resolve
 * @returns The behaviour definition or null if not found
 */
export function resolveBehaviour(
  behaviourId: string | null | undefined
): Behaviour | null {
  if (!behaviourId || behaviourId === 'none') {
    return null
  }

  // Check for alias first (backward compatibility)
  const resolvedId = BEHAVIOUR_ALIASES[behaviourId] ?? behaviourId

  return behaviourRegistry[resolvedId] ?? null
}

/**
 * Resolve multiple behaviour IDs including their dependencies.
 * Returns behaviours in dependency order (dependencies first).
 *
 * @param behaviourIds - The behaviour IDs to resolve
 * @returns Ordered array of behaviours with dependencies resolved
 */
export function resolveBehavioursWithDependencies(
  behaviourIds: (string | null | undefined)[]
): Behaviour[] {
  const resolved: Behaviour[] = []
  const seen = new Set<string>()

  function resolve(id: string): void {
    if (seen.has(id)) return
    seen.add(id)

    const behaviour = resolveBehaviour(id)
    if (!behaviour) return

    // Resolve dependencies first
    if (behaviour.requires) {
      for (const depId of behaviour.requires) {
        resolve(depId)
      }
    }

    resolved.push(behaviour)
  }

  for (const id of behaviourIds) {
    if (id) resolve(id)
  }

  return resolved
}
