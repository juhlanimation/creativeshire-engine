# Builder Spec

> Domain specialists that implement components within their specific scope.

## Purpose

Builders create and modify code within a specific domain. Each builder owns a bounded scope of the codebase and implements components according to their domain spec. They don't cross into other domains — that's what delegation is for.

**Workflow:** Read spec → Check existing → Create/modify → Validate → Report

## Concepts

| Term | Definition |
|------|------------|
| Builder | Write-capable agent that implements within a domain |
| Domain Spec | The rules governing the domain (e.g., `widget.spec.md`) |
| Scope | Files/folders the builder can touch |
| Validator | Code that checks builder output against spec rules |
| Technical Director | Coordinator that delegates to builders |

## Builder Types

| Builder | Domain | Scope |
|---------|--------|-------|
| `widget-builder` | Widgets | `creativeshire/components/content/widgets/` |
| `widget-composite-builder` | Widget Composites | `creativeshire/components/content/widgets/composites/` |
| `section-builder` | Sections | `creativeshire/components/content/sections/` |
| `section-composite-builder` | Section Composites | `creativeshire/components/content/sections/composites/` |
| `chrome-builder` | Chrome | `creativeshire/components/content/chrome/` |
| `feature-builder` | Features | `creativeshire/components/content/features/` |
| `behaviour-builder` | Behaviours | `creativeshire/components/experience/behaviour/` |
| `driver-builder` | Drivers | `creativeshire/components/experience/driver/` |
| `trigger-builder` | Triggers | `creativeshire/components/experience/trigger/` |
| `provider-builder` | Providers | `creativeshire/components/experience/provider/` |
| `preset-builder` | Presets | `creativeshire/presets/` |
| `renderer-builder` | Renderer | `creativeshire/renderer/` |
| `schema-builder` | Schema | `creativeshire/schema/` |
| `page-builder` | Pages | `site/pages/` |
| `site-builder` | Site Config | `site/` |

## Contract Structure

Every builder contract MUST have these sections:

```markdown
## Knowledge

### Primary
| Document | Purpose |
|----------|---------|
| `types/builder.spec.md` | Builder type rules |
| `creativeshire/.../domain.spec.md` | Domain rules |

### Additional
(Domain-specific references)

## Scope

### Can Touch
(Specific paths this builder owns)

### Cannot Touch
(Explicit boundaries)

## Input
(TypeScript interface)

## Output
(What files are created/modified)

### Verify Before Completion
(Checklist before reporting done)

## Workflow
(Numbered steps)

## Validation
(Validator reference and exit codes)

## Delegation
| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
```

## Rules

### Must

1. Read domain spec before implementing
2. Check existing implementations (DRY)
3. Stay within declared scope
4. Follow naming conventions from spec
5. Run validator after changes
6. Fix validation failures before reporting done
7. Export from barrel files (index.ts)

### Must Not

1. Touch files outside declared scope
2. Import from higher layers (L2 cannot import L3)
3. Skip validation
4. Create duplicate implementations
5. Leave broken imports/exports
6. Modify task files (that's coordinator work)

## Validation

All builders are validated by a domain-specific validator:

```
.claude/architecture/creativeshire/components/{domain}/{domain}.validator.ts
```

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Standard Workflow

```
1. Read contract      — Understand scope
2. Read domain spec   — Know the rules
3. Check existing     — Find similar implementations (DRY)
4. Create/modify      — Stay within scope
5. Validator runs     — Auto on Write/Edit
6. Fix if needed      — Address failures
7. Report             — Return created/modified paths
```

## Output Format

Builders report what they created/modified:

```typescript
interface BuilderOutput {
  created: string[]     // New files
  modified: string[]    // Changed files
  exports: string[]     // Updated barrel exports
  validated: boolean    // Validator passed
}
```

## Anti-Patterns

### Don't: Cross domain boundaries

```typescript
// WRONG: Widget builder importing from sections
import { Section } from '../sections/Section'
```

**Why:** Each domain has its own builder. Delegate if needed.

### Don't: Skip existing code check

```typescript
// WRONG: Creating Text widget when one exists
// creativeshire/components/content/widgets/content/Text/index.tsx already exists!
```

**Why:** DRY principle. Modify existing or create new with different purpose.

### Don't: Forget barrel exports

```typescript
// WRONG: Component created but not exported
// creativeshire/components/content/widgets/index.ts missing export
```

**Why:** Unreachable code is dead code.

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| Technical Director | Receives from | Task delegation |
| Domain Spec | Reads | Implementation rules |
| Validator | Validated by | Output verification |
| Reviewer | Reviewed by | Compliance check |
