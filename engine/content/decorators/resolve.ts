/**
 * Decorator resolution.
 * Resolves DecoratorRef[] into merged event maps and behaviour configs.
 */

import type { DecoratorRef } from './types'
import type { WidgetEventMap } from '../../schema/widget'
import type { BehaviourConfig } from '../../schema/experience'
import { getDecorator } from './registry'
import { mergeEventMaps } from './merge'

/**
 * Resolved decorator output — merged L1 actions and L2 behaviours.
 */
export interface ResolvedDecorators {
  /** Merged event map from all decorators + explicit on */
  on: WidgetEventMap | undefined
  /** Concatenated behaviour configs from all decorators + explicit behaviours */
  behaviours: BehaviourConfig[]
}

/**
 * Resolve an array of decorator refs into merged actions and behaviours.
 *
 * Resolution order:
 * 1. Decorator actions/behaviours are resolved in array order
 * 2. Explicit `on` takes priority (appended last → overrides on conflict)
 * 3. Explicit `behaviours` are appended after decorator behaviours
 *
 * @param refs - Decorator references from widget schema
 * @param explicitOn - Explicit event map from widget.on
 * @param explicitBehaviours - Explicit behaviours from widget.behaviours or widget.behaviour
 * @returns Merged actions and behaviours
 */
export function resolveDecorators(
  refs: DecoratorRef[] | undefined,
  explicitOn: WidgetEventMap | undefined,
  explicitBehaviours: BehaviourConfig[],
): ResolvedDecorators {
  if (!refs || refs.length === 0) {
    return {
      on: explicitOn,
      behaviours: explicitBehaviours,
    }
  }

  let mergedOn: WidgetEventMap | undefined
  const allBehaviours: BehaviourConfig[] = []

  for (const ref of refs) {
    const definition = getDecorator(ref.id)
    if (!definition) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Decorator "${ref.id}" not found in registry.`)
      }
      continue
    }

    // Resolve overlay keys: ref overrides → definition defaults → empty
    const overlayKeys: Record<string, string> = {
      ...definition.defaultOverlayKeys,
      ...ref.overlayKeys,
    }

    // Resolve params: ref overrides → setting defaults
    const params = { ...extractSettingDefaults(definition.settings), ...ref.params }

    // Merge actions
    if (definition.actions) {
      const decoratorOn = definition.actions(params, overlayKeys)
      if (decoratorOn) {
        mergedOn = mergeEventMaps(mergedOn, decoratorOn)
      }
    }

    // Collect behaviours
    if (definition.behaviours) {
      const decoratorBehaviours = definition.behaviours(params)
      if (decoratorBehaviours) {
        allBehaviours.push(...decoratorBehaviours)
      }
    }
  }

  // Explicit on takes priority (appended last)
  mergedOn = mergeEventMaps(mergedOn, explicitOn)

  // Explicit behaviours appended after decorator behaviours
  allBehaviours.push(...explicitBehaviours)

  return {
    on: mergedOn,
    behaviours: allBehaviours,
  }
}

/**
 * Extract default values from a decorator's settings config.
 */
function extractSettingDefaults(
  settings: Record<string, import('../../schema/settings').SettingConfig> | undefined,
): Record<string, unknown> {
  if (!settings) return {}
  const defaults: Record<string, unknown> = {}
  for (const [key, config] of Object.entries(settings)) {
    if (config.default !== undefined) {
      defaults[key] = config.default
    }
  }
  return defaults
}
