/**
 * Migration type definitions.
 * Migrations transform site configs from one version to another.
 */

import type { SiteSchema } from '../schema'

/**
 * Single migration step.
 * Transforms a site config to a newer schema version.
 */
export interface Migration {
  /** Unique migration ID (kebab-case) */
  id: string

  /** Target version after this migration runs (e.g., "2.1.0") */
  targetVersion: string

  /** Human-readable description of what this migration does */
  description: string

  /** Whether this is a breaking change requiring manual review */
  breaking: boolean

  /**
   * Transform site config.
   * Must return a new config object (never mutate input).
   */
  migrate: (site: SiteSchema) => SiteSchema

  /**
   * Optional validation before migrating.
   * Returns array of error messages, empty if valid.
   */
  validate?: (site: SiteSchema) => string[]
}

/**
 * Result of running migrations on a site.
 */
export interface MigrationResult {
  /** Original schema version */
  fromVersion: string

  /** Final schema version after migrations */
  toVersion: string

  /** IDs of migrations that were applied */
  applied: string[]

  /** Warnings generated during migration */
  warnings: string[]

  /** Migrated site config */
  site: SiteSchema
}

/**
 * Preview of what migrations would be applied.
 */
export interface MigrationPreview {
  /** Whether any migrations are needed */
  needsMigration: boolean

  /** Migrations that would be applied */
  migrations: Array<{
    id: string
    description: string
    breaking: boolean
  }>
}
