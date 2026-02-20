# Site Validator Spec

> Build-time validation for site configurations.

---

## Purpose

The site validator ensures site configurations are valid before deployment:

1. **Schema version compatibility** - Site works with current engine
2. **Required fields** - All mandatory fields present
3. **Migration status** - Warns about pending migrations

---

## Folder Structure

```
engine/validation/
├── CLAUDE.md             # Folder context for agents
├── index.ts              # Barrel exports
└── site-validator.ts     # Validation logic
```

---

## Key Interfaces

### ValidationResult

```typescript
interface ValidationResult {
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
```

---

## API

```typescript
// Get detailed validation result
validateSite(site: SiteSchema): ValidationResult

// Assert valid or throw (for build-time)
assertValidSite(site: SiteSchema): void
```

---

## Validation Checks

| Check | Severity | Condition | Message |
|-------|----------|-----------|---------|
| Missing schemaVersion | Warning | `!site.schemaVersion` | Add schemaVersion to config |
| Invalid version format | Error | `!/^\d+\.\d+\.\d+$/` | Use "X.Y.Z" format |
| Incompatible version | Error | Major version mismatch | Cannot run, needs fix |
| Requires migration | Error | Version < MIN_SUPPORTED | Run migration first |
| Missing id | Error | `!site.id` | Add required field |
| Missing experience | Error | `!site.experience` | Add required field |
| Missing chrome | Error | `!site.chrome` | Add required field |
| No pages | Error | `pages.length === 0` | Add at least one page |

---

## Usage

### Build-Time Integration

```typescript
// app/[[...slug]]/page.tsx
import { assertValidSite } from '@/engine/validation'
import { siteConfig } from '@/site/config'

// Runs during static generation
assertValidSite(siteConfig)

export default function Page() {
  // ... render
}
```

### Programmatic Validation

```typescript
import { validateSite } from '@/engine/validation'

const result = validateSite(siteConfig)

if (!result.valid) {
  console.error('Errors:', result.errors)
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings)
}

if (result.needsMigration) {
  console.warn('Pending migrations:', result.pendingMigrations)
}
```

---

## Error Messages

Error messages should be:

1. **Specific** - Identify exactly what's wrong
2. **Actionable** - Tell user how to fix
3. **Contextual** - Include site ID or field name

```typescript
// Good
`Site "noir" missing schemaVersion. Add schemaVersion: "2.0.0" to site config.`

// Bad
`Invalid config`
```

---

## Rules

### Must

1. Run at build time (not runtime)
2. Return all errors, not just first
3. Separate errors from warnings
4. Include migration status
5. Be fast (no I/O)

### Must Not

1. Throw on warnings
2. Modify site config
3. Make network requests
4. Access filesystem
5. Log directly (let caller handle)

---

## Behavior Matrix

| schemaVersion | Version Valid | Compatible | Migrated | Result |
|---------------|---------------|------------|----------|--------|
| Missing | N/A | Assumed | N/A | Warning |
| "invalid" | No | N/A | N/A | Error |
| "3.0.0" | Yes | No | N/A | Error |
| "1.0.0" | Yes | No | Needed | Error |
| "2.0.0" | Yes | Yes | Not needed | Valid |

---

## Testing

```typescript
describe('validateSite', () => {
  it('returns warning for missing schemaVersion', () => {
    const site = { id: 'test', experience: {}, chrome: {}, pages: [{}] }
    const result = validateSite(site)

    expect(result.valid).toBe(true)
    expect(result.warnings).toContain(expect.stringContaining('missing schemaVersion'))
  })

  it('returns error for invalid version format', () => {
    const site = { id: 'test', schemaVersion: 'invalid', ... }
    const result = validateSite(site)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(expect.stringContaining('Invalid schemaVersion'))
  })

  it('returns error for missing required fields', () => {
    const site = { schemaVersion: '2.0.0' }
    const result = validateSite(site)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(expect.stringContaining('missing required field: id'))
  })
})
```

---

## Related Documents

- [versioning.spec.md](../../core/versioning.spec.md) - Version rules
- [migrations.spec.md](../migrations/migrations.spec.md) - Migration system
- [schema.spec.md](../../layers/schema.spec.md) - Schema layer
