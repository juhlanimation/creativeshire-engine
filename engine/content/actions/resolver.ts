/**
 * Resolves required overlay patterns based on action IDs.
 * Builds a reverse index from pattern providesActions → patternId.
 *
 * Supports two action ID formats:
 * - Literal: 'modal.open' → exact match
 * - Templated: '{key}.show' → matches any '{overlayKey}.show' pattern
 */

import { chromePatternRegistry } from '../chrome/pattern-registry'

/**
 * Check if a providesActions entry matches a given action ID.
 * Handles both literal and `{key}` template patterns.
 */
function actionMatches(providedAction: string, actionId: string): boolean {
  // Literal match
  if (providedAction === actionId) return true

  // Template match: '{key}.verb' matches 'anyOverlayKey.verb'
  if (providedAction.includes('{key}')) {
    // Extract the verb part from the template
    const templateVerb = providedAction.replace('{key}', '')
    // Check if the action ID ends with the same verb
    if (templateVerb && actionId.endsWith(templateVerb)) {
      // Verify the prefix is a non-empty overlay key
      const prefix = actionId.slice(0, -templateVerb.length)
      return prefix.length > 0
    }
  }

  return false
}

/**
 * Given a set of required action IDs and existing overlay keys,
 * returns overlay patterns that need to be added.
 */
export function resolveRequiredOverlays(
  requiredActions: Set<string>,
  existingOverlayKeys: string[],
): Array<{ key: string; patternId: string }> {
  if (requiredActions.size === 0) return []

  // Find missing overlays
  const existingSet = new Set(existingOverlayKeys)
  const toAdd: Array<{ key: string; patternId: string }> = []
  const addedPatternIds = new Set<string>()

  for (const action of requiredActions) {
    // For each action, find a pattern that provides it
    for (const [patternId, entry] of Object.entries(chromePatternRegistry)) {
      if (addedPatternIds.has(patternId)) continue
      if (!entry.meta.providesActions) continue

      const matches = entry.meta.providesActions.some(pa => actionMatches(pa, action))
      if (!matches) continue

      // For templated actions like 'cursorLabel.show', derive key from the action ID
      const dotIdx = action.indexOf('.')
      const key = dotIdx > 0 ? action.slice(0, dotIdx) : patternId.charAt(0).toLowerCase() + patternId.slice(1)

      if (existingSet.has(key)) continue

      toAdd.push({ key, patternId })
      addedPatternIds.add(patternId)
      existingSet.add(key) // prevent duplicates
      break
    }
  }

  return toAdd
}

/**
 * Check whether a specific action ID is resolved by an existing overlay.
 * Returns resolution status and candidate pattern IDs that could provide it.
 */
export function getActionResolution(
  actionId: string,
  existingOverlayKeys: string[],
): {
  resolved: boolean
  overlayKey?: string
  patternId?: string
  candidates: string[]
} {
  // Find all patterns that provide this action
  const candidates: string[] = []
  for (const [patternId, entry] of Object.entries(chromePatternRegistry)) {
    if (entry.meta.providesActions?.some(pa => actionMatches(pa, actionId))) {
      candidates.push(patternId)
    }
  }

  // For templated actions, check if the overlay key from the action ID exists
  const dotIdx = actionId.indexOf('.')
  if (dotIdx > 0) {
    const overlayKey = actionId.slice(0, dotIdx)
    const existingSet = new Set(existingOverlayKeys)
    if (existingSet.has(overlayKey)) {
      // Find which pattern this overlay came from
      const patternId = candidates[0]
      return { resolved: true, overlayKey, patternId, candidates }
    }
  }

  // Check if any existing overlay key matches a candidate pattern (legacy literal matching)
  const existingSet = new Set(existingOverlayKeys)
  for (const patternId of candidates) {
    const key = patternId.charAt(0).toLowerCase() + patternId.slice(1)
    if (existingSet.has(key)) {
      return { resolved: true, overlayKey: key, patternId, candidates }
    }
  }

  return { resolved: false, candidates }
}
