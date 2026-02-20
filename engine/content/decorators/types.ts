/**
 * Decorator types.
 * Decorators are named, composable recipes that combine L1 actions and L2 behaviours
 * into reusable keywords applied to widgets via schema.
 */

import type { WidgetEventMap } from '../../schema/widget'
import type { BehaviourConfig } from '../../schema/experience'
import type { SettingConfig } from '../../schema/settings'

/**
 * A decorator definition — named recipe of L1 actions + L2 behaviours.
 *
 * @example
 * ```typescript
 * const videoModal: DecoratorDefinition = {
 *   id: 'video-modal',
 *   name: 'Video Modal',
 *   description: 'Opens a video modal on click',
 *   requiredOverlays: ['VideoModal'],
 *   defaultOverlayKeys: { VideoModal: 'modal' },
 *   actions: (_params, keys) => ({
 *     click: `${keys.VideoModal}.open`,
 *   }),
 * }
 * ```
 */
export interface DecoratorDefinition<TParams = Record<string, unknown>> {
  /** Unique kebab-case identifier: 'video-modal', 'cursor-label' */
  id: string
  /** CMS display name: 'Video Modal' */
  name: string
  /** CMS tooltip description */
  description: string
  /** Search/filter tags for CMS picker */
  tags?: string[]

  /** Chrome overlay patterns this decorator requires (auto-injected). */
  requiredOverlays?: string[]

  /** Configurable params exposed in CMS UI per-widget. */
  settings?: Record<string, SettingConfig>

  /** Default overlay key map: { PatternId: 'defaultKey' }. */
  defaultOverlayKeys?: Record<string, string>

  /** Produce L1 event wiring. overlayKeys maps PatternId to instance key. */
  actions?: (params: TParams, overlayKeys: Record<string, string>) => WidgetEventMap | undefined

  /** Produce L2 behaviour configs to stack on the widget. */
  behaviours?: (params: TParams) => BehaviourConfig[] | undefined
}

/**
 * A decorator reference in widget schema.
 * Placed in `widget.decorators` array.
 *
 * @example
 * ```typescript
 * // Shorthand — just the ID
 * { id: 'video-modal' }
 *
 * // With params
 * { id: 'cursor-label', params: { label: 'WATCH' } }
 *
 * // With overlay key override
 * { id: 'video-modal', overlayKeys: { VideoModal: 'videoModal2' } }
 * ```
 */
export interface DecoratorRef {
  /** Decorator ID from registry */
  id: string
  /** Per-instance param overrides */
  params?: Record<string, unknown>
  /** Override overlay key mapping */
  overlayKeys?: Record<string, string>
}
