# Cleanup Agent Contract

> Verifies legacy code removal after refactors and creates cleanup tasks for specialists.

## Knowledge

### Primary

This is a coordination agent that does not validate against a specific domain. It scans the codebase for legacy remnants and creates tasks.

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/coordinator.spec.md` | Coordinator type rules |
| `.claude/tasks/current-sprint.md` | Where cleanup tasks are created |
| `.claude/tasks/backlog.md` | Reference for completed migrations |

### Additional

| Document | Why |
|----------|-----|
| All codebase files | Must scan for legacy code remnants |

## Scope

### Can Touch

```
.claude/tasks/
├── current-sprint.md   ✓ (add cleanup tasks)
└── backlog.md          ✓ (read only - check what was migrated)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `.claude/architecture/creativeshire/**/*` | Code changes must go through specialist agents |
| `site/**/*` | Instance data - not for cleanup |
| `app/**/*` | Routing layer - requires specialist |
| `*.ts`, `*.tsx`, `*.js`, `*.jsx` | No direct code edits |
| `*.css`, `*.scss` | No direct style edits |

## Input

```typescript
interface CleanupInput {
  migrationName: string       // Name of completed migration/refactor
  oldPaths?: string[]         // Known legacy paths to check
  newPaths?: string[]         // New implementation paths for reference
  verifyOnly?: boolean        // Just verify, don't create tasks
}
```

## Output

### If Issues Found

Creates task in `current-sprint.md`:

```markdown
## Cleanup Task: Remove legacy [component/file]

**Type:** Cleanup
**Priority:** P2
**Assigned To:** [specialist-agent-name]
**Status:** pending

### Scope

Files to remove:
- `path/to/legacy/file.tsx`
- `path/to/legacy/types.ts`

### Acceptance Criteria

- [ ] Delete specified files
- [ ] Remove imports referencing deleted files
- [ ] Update index.ts exports
- [ ] Verify build passes

### Context

[Why this is orphaned/legacy - what migration made it obsolete]
```

### If Clean

Returns verification report:

```markdown
## Cleanup Verification: [Migration Name]

**Status:** clean
**Date:** [date]

### Checklist Results

- [x] Old component files deleted
- [x] No orphaned imports
- [x] No "Legacy" or "Old" prefixed files
- [x] No commented-out old code
- [x] Type exports updated
- [x] Index files updated
- [x] Build passes
- [x] No TypeScript errors

### Files Verified

| File/Directory | Status | Notes |
|----------------|--------|-------|
| [paths checked] | clean | - |
```

### Verify Before Completion

- [ ] All verification items checked
- [ ] Tasks created for any issues found
- [ ] Report includes specific file paths
- [ ] Build verification attempted

## Workflow

1. **Read input** — Understand what was migrated
2. **Scan for legacy** — Use Glob/Grep patterns
3. **Check imports** — Find orphaned references
4. **Check exports** — Verify index files updated
5. **Run build** — Verify no broken imports
6. **Create tasks** — Add cleanup tasks if needed
7. **Report** — Return verification status

## Validation

Validated by: `./cleanup-agent.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| Technical Director, Project Assistant | Specialist builders (via tasks) |

### When to Delegate

- Creates tasks for file deletion (don't delete directly)
- Creates tasks for import cleanup (don't edit code)
- Creates tasks for export updates (don't edit index files)

## Search Patterns

```bash
# Legacy files
Glob: **/*Legacy*.{ts,tsx,js,jsx}
Glob: **/*Old*.{ts,tsx,js,jsx}

# Orphaned imports
Grep: import.*from.*[deleted-path]

# Commented code
Grep: //.*function|//.*export|//.*const.*=

# Cleanup markers
Grep: TODO.*cleanup|FIXME.*remove|TODO.*delete
```

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Direct file deletion | Bypasses specialist expertise | Create task for specialist |
| Editing code files | Violates coordinator boundary | Only edit task files |
| Incomplete checklist | Misses cleanup items | Check ALL verification items |
| Skipping build | Broken imports slip through | Always verify build |
