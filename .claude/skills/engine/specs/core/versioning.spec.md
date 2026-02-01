# Versioning Spec

> Schema versioning, migration system, and compatibility rules for the Creativeshire Engine.

---

## Purpose

The versioning system ensures sites created with older engine versions continue to work when the engine updates. It provides:

1. **Compatibility detection** - Know if a site works with current engine
2. **Migration paths** - Transform old site configs to new format
3. **Build-time validation** - Catch issues before deployment

---

## Folder Structure

```
engine/
├── schema/
│   └── version.ts            # Version constants & utilities
├── migrations/
│   ├── CLAUDE.md             # Folder context
│   ├── index.ts              # Migration runner
│   ├── types.ts              # Migration interface
│   └── v{X.Y.Z}/             # Migrations TO that version
└── validation/
    ├── CLAUDE.md             # Folder context
    ├── index.ts              # Barrel export
    └── site-validator.ts     # Build-time validation
```

---

## Concepts

| Term | Definition |
|------|------------|
| `schemaVersion` | Site config version in semver format (e.g., "2.0.0") |
| Breaking change | Requires major version bump, migration required |
| Non-breaking change | Minor/patch bump, backward compatible |
| Migration | Transform function from version A to B |

---

## Version Rules

### Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking schema changes (field removed, type changed)
MINOR: New optional fields, new features
PATCH: Bug fixes, documentation updates
```

### Compatibility Matrix

| Site Version | Engine Version | Status |
|--------------|----------------|--------|
| 2.0.0 | 2.0.0 | Compatible |
| 2.0.0 | 2.1.0 | Compatible (engine newer) |
| 2.1.0 | 2.0.0 | Incompatible (site newer) |
| 1.x.x | 2.x.x | Requires migration |
| 3.x.x | 2.x.x | Incompatible |

---

## Key Interfaces

### EngineVersion

```typescript
interface EngineVersion {
  major: number  // Breaking changes
  minor: number  // New features
  patch: number  // Bug fixes
}
```

### SiteSchema (version field)

```typescript
interface SiteSchema {
  id: string
  schemaVersion?: string  // "2.0.0" format
  // ... other fields
}
```

### Migration

```typescript
interface Migration {
  id: string              // Unique ID (kebab-case)
  targetVersion: string   // Version after migration
  description: string     // Human-readable description
  breaking: boolean       // Is this a breaking change?
  migrate: (site: SiteSchema) => SiteSchema
  validate?: (site: SiteSchema) => string[]
}
```

---

## Breaking vs Non-Breaking Changes

### Non-Breaking (Minor/Patch)

- Add optional property to schema
- Add new widget type
- Add new behaviour
- Fix bug in existing behaviour
- Add new mode

```typescript
// v2.0.0
interface ThemeSchema {
  scrollbar?: ScrollbarConfig
}

// v2.1.0 - Add optional field (non-breaking)
interface ThemeSchema {
  scrollbar?: ScrollbarConfig
  sectionTransition?: SectionTransitionConfig  // NEW - optional
}
```

### Breaking (Major)

- Remove property from schema
- Change property type
- Rename property
- Change required/optional status
- Remove widget/behaviour/mode

```typescript
// v2.x - string mode
interface ExperienceConfig {
  mode: string
}

// v3.0 - object mode (BREAKING)
interface ExperienceConfig {
  mode: {
    id: string
    options: Record<string, unknown>
  }
}
```

---

## Migration Rules

### Must

1. Migrations are pure functions (no side effects)
2. Migrations never mutate input config
3. Each migration targets exactly one version
4. Migrations run in version order
5. Breaking migrations must set `breaking: true`
6. All migrations must be idempotent

### Must Not

1. Skip versions in migration chain
2. Mutate the input site config
3. Depend on external state
4. Make network requests
5. Access filesystem

---

## Validation Rules

### Build-Time Checks

| Check | Severity | Fix |
|-------|----------|-----|
| Missing schemaVersion | Warning | Add version to config |
| Invalid version format | Error | Use "X.Y.Z" format |
| Incompatible major version | Error | Cannot run, needs manual fix |
| Pending migrations | Warning | Run migration command |
| Missing required fields | Error | Add required fields |

---

## When to Bump Version

| Change | Version Bump | Migration? |
|--------|--------------|------------|
| New optional schema property | Minor | No |
| New widget type | Minor | No |
| New behaviour | Minor | No |
| Bug fix | Patch | No |
| Remove schema property | Major | Yes |
| Change property type | Major | Yes |
| Rename property | Major | Yes |
| Remove widget/behaviour | Major | Yes |

---

## Handling Missing schemaVersion

Sites without `schemaVersion` are treated as:

1. **At build time**: Warning issued, assume current engine version
2. **At runtime**: Assume compatible, no migration needed
3. **Recommendation**: Add schemaVersion to all new sites

```typescript
// site/config.ts - Recommended
export const siteConfig: SiteSchema = {
  id: 'my-site',
  schemaVersion: '2.0.0',
  // ...
}
```

---

## Anti-Patterns

### Don't: Modify site config at runtime

```typescript
// WRONG - mutates during render
site.schemaVersion = ENGINE_VERSION
```

### Don't: Skip version numbers

```typescript
// WRONG - jumps from 2.0.0 to 2.5.0
migrations/v2.5.0/
```

### Do: Sequential version bumps

```typescript
// RIGHT - incremental versions
migrations/v2.1.0/
migrations/v2.2.0/
migrations/v2.3.0/
```

---

## Definition of Done

A version change is complete when:

- [ ] Version constants updated in `schema/version.ts`
- [ ] Migration(s) created if breaking change
- [ ] Migration tests passing
- [ ] Build-time validation updated if needed
- [ ] Architecture tests passing
- [ ] CHANGELOG updated

---

## Related Documents

- [migrations.spec.md](../components/migrations/migrations.spec.md) - Migration system details
- [site-validator.spec.md](../components/validation/site-validator.spec.md) - Validation rules
- [schema.spec.md](../layers/schema.spec.md) - Schema layer overview
