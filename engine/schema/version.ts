/**
 * Engine versioning types and utilities.
 * Defines version structure, comparison rules, and compatibility checks.
 */

// =============================================================================
// Types
// =============================================================================

/**
 * Semantic version components.
 */
export interface EngineVersion {
  /** Major version - breaking schema changes */
  major: number
  /** Minor version - new features, backward compatible */
  minor: number
  /** Patch version - bug fixes only */
  patch: number
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Current engine version.
 * Updated on each release. Should match package.json version.
 */
export const ENGINE_VERSION: EngineVersion = {
  major: 2,
  minor: 0,
  patch: 0,
}

/**
 * Minimum schema version the engine supports.
 * Sites below this version MUST migrate before rendering.
 */
export const MIN_SUPPORTED_VERSION: EngineVersion = {
  major: 2,
  minor: 0,
  patch: 0,
}

// =============================================================================
// Utilities
// =============================================================================

/**
 * Convert version object to string format.
 * @example versionToString({ major: 2, minor: 1, patch: 0 }) // "2.1.0"
 */
export function versionToString(v: EngineVersion): string {
  return `${v.major}.${v.minor}.${v.patch}`
}

/**
 * Parse version string to EngineVersion object.
 * @returns EngineVersion or null if invalid format
 * @example parseVersion("2.1.0") // { major: 2, minor: 1, patch: 0 }
 */
export function parseVersion(str: string): EngineVersion | null {
  const match = str.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) return null
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  }
}

/**
 * Compare two versions.
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareVersions(a: EngineVersion, b: EngineVersion): -1 | 0 | 1 {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1
  return 0
}

/**
 * Check if a site schema version is compatible with current engine.
 *
 * Compatibility rules:
 * - Same major version = compatible
 * - Site minor <= engine minor = compatible (engine has newer features)
 * - Site minor > engine minor = incompatible (site uses newer features)
 */
export function isCompatible(siteVersion: EngineVersion): boolean {
  // Major versions must match
  if (siteVersion.major !== ENGINE_VERSION.major) return false
  // Site can't use features newer than engine
  if (siteVersion.minor > ENGINE_VERSION.minor) return false
  return true
}

/**
 * Check if a site schema version is compatible (string version).
 * @returns true if compatible, false if incompatible or invalid version
 */
export function isCompatibleVersion(siteVersionStr: string): boolean {
  const version = parseVersion(siteVersionStr)
  if (!version) return false
  return isCompatible(version)
}

/**
 * Check if a site requires migration.
 * Sites below MIN_SUPPORTED_VERSION need migration.
 */
export function requiresMigration(siteVersion: EngineVersion): boolean {
  return compareVersions(siteVersion, MIN_SUPPORTED_VERSION) < 0
}

/**
 * Check if a site requires migration (string version).
 */
export function requiresMigrationVersion(siteVersionStr: string): boolean {
  const version = parseVersion(siteVersionStr)
  if (!version) return false
  return requiresMigration(version)
}

/**
 * Get current engine version as string.
 */
export function getEngineVersionString(): string {
  return versionToString(ENGINE_VERSION)
}
