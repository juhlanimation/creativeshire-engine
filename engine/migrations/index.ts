/**
 * Migration runner.
 * Applies migrations sequentially from site version to engine version.
 */

import type { Migration, MigrationResult, MigrationPreview } from './types'
import type { SiteSchema } from '../schema'
import {
  ENGINE_VERSION,
  parseVersion,
  compareVersions,
  versionToString,
  type EngineVersion,
} from '../schema/version'

// =============================================================================
// Migration Registry
// =============================================================================

/**
 * All migrations ordered by target version.
 * Import migration arrays from version folders as they're created.
 *
 * Example when migrations exist:
 * import { migrations as v2_1_0 } from './v2.1.0'
 * const ALL_MIGRATIONS = [...v2_1_0].sort(...)
 */
const MIGRATIONS_UNSORTED: Migration[] = [
  // No migrations yet - add as engine evolves
]

const ALL_MIGRATIONS: Migration[] = MIGRATIONS_UNSORTED.sort((a, b) => {
  const vA = parseVersion(a.targetVersion)
  const vB = parseVersion(b.targetVersion)
  if (!vA || !vB) return 0
  return compareVersions(vA, vB)
})

// =============================================================================
// Public API
// =============================================================================

/**
 * Get migrations needed for a site based on its schema version.
 */
export function getMigrationsForSite(siteVersion: string): Migration[] {
  const current = parseVersion(siteVersion)
  if (!current) {
    throw new Error(`Invalid site version: ${siteVersion}`)
  }

  return ALL_MIGRATIONS.filter((m) => {
    const target = parseVersion(m.targetVersion)
    if (!target) return false
    return compareVersions(current, target) < 0
  })
}

/**
 * Check if a site needs migration.
 */
export function needsMigration(site: SiteSchema): boolean {
  const version = site.schemaVersion || versionToString(ENGINE_VERSION)
  const migrations = getMigrationsForSite(version)
  return migrations.length > 0
}

/**
 * Preview what migrations would be applied to a site.
 */
export function previewMigration(site: SiteSchema): MigrationPreview {
  const version = site.schemaVersion || versionToString(ENGINE_VERSION)
  const migrations = getMigrationsForSite(version)

  return {
    needsMigration: migrations.length > 0,
    migrations: migrations.map((m) => ({
      id: m.id,
      description: m.description,
      breaking: m.breaking,
    })),
  }
}

/**
 * Run all pending migrations on a site.
 * Returns migrated site config and metadata about applied migrations.
 *
 * @throws Error if migration validation fails
 */
export function migrateSite(site: SiteSchema): MigrationResult {
  const fromVersion = site.schemaVersion || versionToString(ENGINE_VERSION)
  const migrations = getMigrationsForSite(fromVersion)

  let current = { ...site }
  const applied: string[] = []
  const warnings: string[] = []

  for (const migration of migrations) {
    // Validate before migrating
    if (migration.validate) {
      const errors = migration.validate(current)
      if (errors.length > 0) {
        throw new Error(
          `Migration ${migration.id} validation failed:\n${errors.join('\n')}`
        )
      }
    }

    // Apply migration
    current = migration.migrate(current)
    current.schemaVersion = migration.targetVersion
    applied.push(migration.id)

    if (migration.breaking) {
      warnings.push(
        `Breaking change in ${migration.id}: ${migration.description}`
      )
    }
  }

  return {
    fromVersion,
    toVersion: current.schemaVersion || versionToString(ENGINE_VERSION),
    applied,
    warnings,
    site: current,
  }
}

/**
 * Get all registered migrations (for testing/debugging).
 */
export function getAllMigrations(): Migration[] {
  return [...ALL_MIGRATIONS]
}

// Re-export types
export type { Migration, MigrationResult, MigrationPreview } from './types'
