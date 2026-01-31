# Migrations Spec

> Schema migration system for transforming site configs between engine versions.

---

## Purpose

The migration system transforms site configurations from older schema versions to newer ones. It enables:

1. **Automated upgrades** - Sites auto-migrate at build time
2. **Backward compatibility** - Old configs continue working
3. **Safe rollout** - Migrations are tested before deployment

---

## Folder Structure

```
creativeshire/migrations/
├── CLAUDE.md             # Folder context for agents
├── index.ts              # Migration runner & registry
├── types.ts              # Migration interfaces
└── v{X.Y.Z}/             # Migrations TO that version
    ├── index.ts          # Barrel export for version
    └── {name}.ts         # Individual migration files
```

---

## Key Interfaces

### Migration

```typescript
interface Migration {
  /** Unique migration ID (kebab-case) */
  id: string

  /** Target version after this migration runs */
  targetVersion: string

  /** Human-readable description */
  description: string

  /** Whether this is a breaking change */
  breaking: boolean

  /** Transform site config (must not mutate input) */
  migrate: (site: SiteSchema) => SiteSchema

  /** Optional pre-migration validation */
  validate?: (site: SiteSchema) => string[]
}
```

### MigrationResult

```typescript
interface MigrationResult {
  fromVersion: string      // Original version
  toVersion: string        // Final version
  applied: string[]        // Migration IDs applied
  warnings: string[]       // Warnings generated
  site: SiteSchema         // Migrated config
}
```

---

## Migration Runner API

```typescript
// Check if site needs migration
needsMigration(site: SiteSchema): boolean

// Preview what would be applied
previewMigration(site: SiteSchema): MigrationPreview

// Run all pending migrations
migrateSite(site: SiteSchema): MigrationResult

// Get migrations for a specific version
getMigrationsForSite(version: string): Migration[]
```

---

## Migration Format

### Example Migration

```typescript
// migrations/v2.1.0/add-theme-defaults.ts
import type { Migration } from '../types'
import type { SiteSchema } from '../../schema'

export const addThemeDefaults: Migration = {
  id: 'add-theme-defaults',
  targetVersion: '2.1.0',
  description: 'Add default sectionTransition to theme config',
  breaking: false,

  migrate(site: SiteSchema): SiteSchema {
    return {
      ...site,
      theme: {
        ...site.theme,
        sectionTransition: site.theme?.sectionTransition ?? {
          fadeDuration: '0.15s',
          fadeEasing: 'ease-out',
        },
      },
    }
  },
}
```

### Version Barrel Export

```typescript
// migrations/v2.1.0/index.ts
import { addThemeDefaults } from './add-theme-defaults'

export const migrations = [addThemeDefaults]
```

---

## Rules

### Must

1. **Pure functions** - No side effects, no external state
2. **Immutable** - Never mutate input, return new object
3. **One version** - Each migration targets exactly one version
4. **Ordered** - Migrations run in version order
5. **Idempotent** - Running twice produces same result
6. **Unique IDs** - No duplicate migration IDs

### Must Not

1. Skip versions in the chain
2. Mutate the input config
3. Depend on runtime state
4. Make network requests
5. Access filesystem
6. Reference external services

---

## Registering Migrations

```typescript
// migrations/index.ts
import { migrations as v2_1_0 } from './v2.1.0'
import { migrations as v2_2_0 } from './v2.2.0'

const ALL_MIGRATIONS = [
  ...v2_1_0,
  ...v2_2_0,
].sort((a, b) => compareVersions(
  parseVersion(a.targetVersion)!,
  parseVersion(b.targetVersion)!
))
```

---

## Validation

Migrations can include optional validation:

```typescript
export const modeObject: Migration = {
  id: 'mode-object',
  targetVersion: '3.0.0',
  description: 'Convert experience.mode to object',
  breaking: true,

  validate(site: SiteSchema): string[] {
    if (typeof site.experience.mode !== 'string') {
      return ['experience.mode is already an object']
    }
    return []
  },

  migrate(site: SiteSchema): SiteSchema {
    const oldMode = site.experience.mode as unknown as string
    return {
      ...site,
      experience: {
        ...site.experience,
        mode: {
          id: oldMode,
          options: {},
        },
      },
    }
  },
}
```

---

## Error Handling

```typescript
try {
  const result = migrateSite(site)
  // Use result.site
} catch (error) {
  // Migration validation failed
  // Error message contains details
}
```

---

## Testing Migrations

```typescript
describe('add-theme-defaults migration', () => {
  it('adds sectionTransition when missing', () => {
    const oldSite = { id: 'test', schemaVersion: '2.0.0', theme: {} }
    const newSite = addThemeDefaults.migrate(oldSite)

    expect(newSite.theme.sectionTransition).toBeDefined()
    expect(newSite.theme.sectionTransition.fadeDuration).toBe('0.15s')
  })

  it('preserves existing sectionTransition', () => {
    const oldSite = {
      id: 'test',
      schemaVersion: '2.0.0',
      theme: { sectionTransition: { fadeDuration: '0.5s' } },
    }
    const newSite = addThemeDefaults.migrate(oldSite)

    expect(newSite.theme.sectionTransition.fadeDuration).toBe('0.5s')
  })

  it('does not mutate input', () => {
    const oldSite = { id: 'test', schemaVersion: '2.0.0', theme: {} }
    const original = JSON.stringify(oldSite)
    addThemeDefaults.migrate(oldSite)

    expect(JSON.stringify(oldSite)).toBe(original)
  })
})
```

---

## Related Documents

- [versioning.spec.md](../../core/versioning.spec.md) - Version rules
- [site-validator.spec.md](../validation/site-validator.spec.md) - Build-time validation
- [schema.spec.md](../../layers/schema.spec.md) - Schema layer
