# Validation

**Build-time validation for site configurations.**

## What This Folder Contains

- `site-validator.ts` - Validates SiteSchema at build time
- `index.ts` - Barrel exports (if needed)

## Key Patterns

1. **Fail fast** - Validation runs at build time, not runtime
2. **Clear errors** - Messages should tell users how to fix issues
3. **Warnings vs errors** - Missing schemaVersion is warning, incompatible version is error

## How Validation Works

```typescript
// In app/[[...slug]]/page.tsx
import { assertValidSite } from '@/creativeshire/validation'

// Runs at build time during static generation
assertValidSite(siteConfig)  // Throws if invalid
```

## Validation Checks

| Check | Severity | Message |
|-------|----------|---------|
| Missing schemaVersion | Warning | Add schemaVersion to config |
| Invalid version format | Error | Use "X.Y.Z" format |
| Incompatible major version | Error | Cannot run, needs manual fix |
| Pending migrations | Warning | Run migration before build |
| Missing required fields | Error | Add required fields |

## Before Modifying

- Consider build-time vs runtime tradeoffs
- Keep error messages actionable
- Add tests for new validation rules

Spec: [site-validator.spec.md](/.claude/skills/creativeshire/specs/components/validation/site-validator.spec.md)
