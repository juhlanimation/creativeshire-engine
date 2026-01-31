/**
 * Site validation at build time.
 * Ensures sites are compatible with current engine version.
 */

import type { SiteSchema } from '../schema'
import {
  ENGINE_VERSION,
  parseVersion,
  isCompatible,
  requiresMigration,
  versionToString,
} from '../schema/version'
import { previewMigration } from '../migrations'

// =============================================================================
// Types
// =============================================================================

export interface ValidationResult {
  /** Whether the site is valid for rendering */
  valid: boolean
  /** Errors that prevent rendering */
  errors: string[]
  /** Warnings that should be addressed */
  warnings: string[]
  /** Whether migrations are pending */
  needsMigration: boolean
  /** IDs of pending migrations */
  pendingMigrations: string[]
}

// =============================================================================
// Validation
// =============================================================================

/**
 * Validate site config at build time.
 * Returns detailed validation result with errors and warnings.
 */
export function validateSite(site: SiteSchema): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // -------------------------------------------------------------------------
  // Check schemaVersion
  // -------------------------------------------------------------------------

  if (!site.schemaVersion) {
    warnings.push(
      `Site "${site.id}" missing schemaVersion. ` +
        `Add schemaVersion: "${versionToString(ENGINE_VERSION)}" to site config.`
    )
  } else {
    const version = parseVersion(site.schemaVersion)

    if (!version) {
      errors.push(
        `Invalid schemaVersion "${site.schemaVersion}". ` +
          `Expected format: "major.minor.patch" (e.g., "2.0.0")`
      )
    } else if (!isCompatible(version)) {
      errors.push(
        `Site version ${site.schemaVersion} incompatible with ` +
          `engine version ${versionToString(ENGINE_VERSION)}. ` +
          `Major versions must match.`
      )
    } else if (requiresMigration(version)) {
      errors.push(
        `Site version ${site.schemaVersion} requires migration. ` +
          `Run migrations before building.`
      )
    }
  }

  // -------------------------------------------------------------------------
  // Check required fields
  // -------------------------------------------------------------------------

  if (!site.id) {
    errors.push('Site missing required field: id')
  }

  if (!site.experience) {
    errors.push('Site missing required field: experience')
  }

  if (!site.chrome) {
    errors.push('Site missing required field: chrome')
  }

  if (!site.pages || site.pages.length === 0) {
    errors.push('Site must have at least one page')
  }

  // -------------------------------------------------------------------------
  // Check migration status
  // -------------------------------------------------------------------------

  const migrationPreview = previewMigration(site)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    needsMigration: migrationPreview.needsMigration,
    pendingMigrations: migrationPreview.migrations.map((m) => m.id),
  }
}

/**
 * Assert site is valid for rendering.
 * Throws if invalid, logs warnings if any.
 *
 * Use in app/[[...slug]]/page.tsx for build-time validation.
 */
export function assertValidSite(site: SiteSchema): void {
  const result = validateSite(site)

  // Log warnings
  if (result.warnings.length > 0) {
    console.warn('[Creativeshire] Validation warnings:')
    result.warnings.forEach((w) => console.warn(`  - ${w}`))
  }

  // Throw on errors
  if (!result.valid) {
    throw new Error(
      `[Creativeshire] Site validation failed:\n` +
        result.errors.map((e) => `  - ${e}`).join('\n')
    )
  }

  // Log migration status
  if (result.needsMigration) {
    console.warn(
      `[Creativeshire] Site "${site.id}" has pending migrations:`,
      result.pendingMigrations
    )
  }
}
