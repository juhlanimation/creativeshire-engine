/**
 * Decorator exports.
 * Named, composable recipes that combine L1 actions and L2 behaviours.
 */

// Types
export type { DecoratorDefinition, DecoratorRef } from './types'

// Registry
export { registerDecorator, getDecorator, getAllDecorators } from './registry'

// Resolution
export { resolveDecorators } from './resolve'
export type { ResolvedDecorators } from './resolve'

// Merge utilities
export { mergeEventMaps } from './merge'

// Built-in presets (side-effect imports for auto-registration)
import './presets'
