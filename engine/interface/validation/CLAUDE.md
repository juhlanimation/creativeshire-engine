# Interface Validation

**Runtime constraint validation for schema operations.**

## What This Folder Contains

- `validators.ts` - Constraint validation functions
- `index.ts` - Barrel exports

## Key Patterns

1. **Validate before apply** - Check constraints before mutating state
2. **Return results** - Don't throw, return ValidationResult
3. **Specific messages** - Include path and limit in violations

## Constraints

| Constraint | Default | Description |
|------------|---------|-------------|
| maxSections | 20 | Maximum sections per page |
| maxWidgetNesting | 3 | Maximum widget nesting depth |
| maxWidgetsPerSection | 50 | Maximum widgets per section |

## Usage

```typescript
import { validateSectionLimit, validateNestingDepth } from './validators'

const result = validateSectionLimit(sections.length + 1, 20)
if (!result.valid) {
  events?.onConstraintViolation?.(result.error!)
  return result
}
```

## Before Modifying

- Consider performance (validators run on every operation)
- Keep messages actionable
- Add tests for new constraints

Spec: [engine-provider.spec.md](/.claude/skills/engine/specs/components/interface/engine-provider.spec.md)
