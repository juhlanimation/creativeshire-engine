# Runtime Validator Contract

> Detects runtime errors that static analysis cannot catch (console errors, hydration failures, invalid HTML).

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/coordinator.spec.md` | Coordinator type rules |
| `.claude/architecture/agentic-framework/runtime-validator.agent.md` | This contract |
| `.claude/architecture/creativeshire/index.spec.md` | Architecture overview |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widget rendering expectations |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Section layout rules |

Add when: analyzing specific runtime error patterns or integrating new component types.

## Scope

### Can Touch

```
.claude/tasks/
├── validation-reports.md   ✓ (append findings)

.claude/logs/
└── runtime-validator.log   ✓ (internal logging)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `.claude/architecture/creativeshire/*` | No implementation (validation only) |
| `site/*` | Instance data |
| `app/*` | Routing layer |
| `.claude/architecture/agentic-framework/*.validator.ts` | Validator code |

## Input

```typescript
interface ValidationInput {
  routes?: string[]           // Routes to check (default: ['/'])
  server?: { port: number }   // Server config (default: 3000)
  includeWarnings?: boolean   // Report warnings (default: false)
}
```

## Output

```markdown
## Runtime Validation Report

**Server:** localhost:{port}
**Status:** PASS | FAIL
**Errors Found:** {count}

### Errors (if FAIL)

[Error list with type, message, location, fix]

### Summary

[Status and remediation]
```

### Verify Before Completion

- [ ] Server running and routes loaded
- [ ] All error types categorized
- [ ] Fix suggestions provided
- [ ] Report logged to validation-reports.md

## Workflow

1. **Discover server** — Query port 3000 via MCP
2. **Get errors** — Call `get_errors` endpoint
3. **Classify errors** — Categorize by type/severity
4. **Report results** — PASS if 0 errors, FAIL if N > 0
5. **Suggest fixes** — Provide remediation for common patterns
6. **Log findings** — Document to validation-reports.md

## Error Classification

| Type | Severity | Example |
|------|----------|---------|
| Runtime Error | FAIL | Unrecognized HTML tag `<heading>` |
| Hydration Mismatch | FAIL | Server/client content differs |
| Invalid Nesting | FAIL | `<body>` inside `<div>` |
| Console Error | FAIL | Uncaught exception |
| Warning | WARN | Deprecation notice (doesn't fail) |

## Common Patterns

### Invalid HTML Tags
- **Cause:** Component renders invalid element (e.g., `<heading>` instead of `<h1>`)
- **Fix:** Use valid HTML tags (h1-h6, p, span, div, section, article, etc.)

### Invalid HTML Nesting
- **Cause:** Renders reserved element (`<body>`, `<html>`, `<head>`) inside component
- **Fix:** Use container elements (div, section) - reserved elements are document-level

### Hydration Mismatch
- **Cause:** Server/client render different content (`typeof window`, `Date.now()`, invalid nesting)
- **Fix:** Ensure server and client render identical markup

### Multiple Body Elements
- **Cause:** Component renders `<body>` tag (usually from invalid variant prop)
- **Fix:** Never render `<body>` inside components - it's document-level only

## Validation

Validated by: `./runtime-validator.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue to next validation step |
| `1` | Validator crashed | Report execution error |
| `2` | Validation failed | Fix errors, retry validation |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/validate` workflow | None (report only) |
