# Migrations

**Schema migration system for transforming site configs between engine versions.**

## What This Folder Contains

- `types.ts` - Migration interface definitions
- `index.ts` - Migration runner and utilities
- `v{X.Y.Z}/` - Migration files for each version (created as needed)

## Key Patterns

1. **Migrations are pure functions** - No side effects, no external state
2. **Never mutate input** - Always return new config object
3. **Version-ordered** - Migrations run sequentially from old to new version
4. **Idempotent** - Running same migration twice produces same result

## How to Add a Migration

1. Create folder for target version: `v2.1.0/`
2. Create migration file with descriptive name: `add-theme-defaults.ts`
3. Export migration object implementing `Migration` interface
4. Register in `v2.1.0/index.ts` barrel export
5. Add to `index.ts` imports

```typescript
// v2.1.0/add-theme-defaults.ts
export const addThemeDefaults: Migration = {
  id: 'add-theme-defaults',
  targetVersion: '2.1.0',
  description: 'Add default sectionTransition to theme',
  breaking: false,
  migrate(site) {
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

## Before Modifying

- Check existing migrations for patterns
- Ensure migration is truly necessary (prefer backward-compatible changes)
- Add tests for the migration
- Update CHANGELOG

Spec: [migrations.spec.md](/.claude/skills/creativeshire/specs/components/migrations/migrations.spec.md)
