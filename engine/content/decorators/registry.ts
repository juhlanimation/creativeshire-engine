/**
 * Decorator registry.
 * Standard Map registry for named decorator definitions.
 */

import type { DecoratorDefinition } from './types'

const decoratorRegistry = new Map<string, DecoratorDefinition>()

/**
 * Register a decorator definition.
 * Called at module load time by decorator preset files.
 */
export function registerDecorator(definition: DecoratorDefinition): void {
  if (process.env.NODE_ENV === 'development' && decoratorRegistry.has(definition.id)) {
    console.warn(`Decorator "${definition.id}" already registered. Overwriting.`)
  }
  decoratorRegistry.set(definition.id, definition)
}

/**
 * Get a decorator definition by ID.
 */
export function getDecorator(id: string): DecoratorDefinition | undefined {
  return decoratorRegistry.get(id)
}

/**
 * Get all registered decorator definitions.
 */
export function getAllDecorators(): DecoratorDefinition[] {
  return Array.from(decoratorRegistry.values())
}
