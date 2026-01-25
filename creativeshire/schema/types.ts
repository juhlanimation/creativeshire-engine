/**
 * Base types for the schema layer.
 * All schema data must be JSON-serializable to cross the RSC boundary safely.
 */

/**
 * Recursive type representing any JSON-serializable value.
 * Used to ensure props can safely cross server/client boundaries.
 */
export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue }
