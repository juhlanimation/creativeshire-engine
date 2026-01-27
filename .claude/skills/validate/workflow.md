# Validate Workflow

> `/validate [item]` | `/validate all` | `/validate` (health check)

Quality gate before merging to main.

## Entry Points

| Command | Action |
|---------|--------|
| `/validate DOMAIN-XXX` | Validate specific item |
| `/validate all` | Validate all ready items |
| `/validate` | Health check (if no active sprint) |

## Validation Pipeline

### 1. TypeScript Check

```bash
npx tsc --noEmit
```

Must pass with zero errors.

### 2. Build Check

```bash
npm run build
```

Must complete without errors.

### 3. Runtime Check

Use Next.js MCP tools:
```
nextjs_index → Discover dev server
nextjs_call(port="3000", toolName="get_errors") → Check errors
```

Check for:
- No compilation errors
- No runtime errors
- No hydration failures
- No invalid HTML

**Common Runtime Errors:**
| Error | Cause |
|-------|-------|
| Invalid HTML tag | Bad variant prop |
| Hydration mismatch | Server/client content differs |
| Multiple body | Component renders `<body>` |

### 4. Spec Compliance Review

For each built component, verify against its spec:

| Component | Check Against |
|-----------|---------------|
| Widget | `../creativeshire/specs/components/content/widget.spec.md` |
| Section | `../creativeshire/specs/components/content/section.spec.md` |
| Behaviour | `../creativeshire/specs/components/experience/behaviour.spec.md` |

**Review Checklist:**
- [ ] Correct file structure
- [ ] Proper exports
- [ ] Naming conventions followed
- [ ] Required patterns applied
- [ ] No anti-patterns

### 5. Visual Check (Optional)

Use browser automation:
```
mcp__claude-in-chrome__navigate → localhost:3000
mcp__claude-in-chrome__computer → screenshot
```

Verify component renders correctly.

## Decision Logic

```
All checks passed?
├── YES → MERGE & ARCHIVE
│   1. Merge sprint to main
│   2. Delete sprint branch
│   3. Archive to completed/
│   4. Remove from backlog
│
└── NO → RETAKE
    1. Mark as "Retake"
    2. List issues
    3. Stay on sprint branch
    4. Run /build continue to fix
```

## Merge Steps (On Pass)

```bash
# Get sprint branch name
BRANCH=$(git branch --show-current)

# Switch to main and merge
git checkout main
git pull origin main
git merge $BRANCH --no-ff -m "Merge $BRANCH

Items completed:
- DOMAIN-XXX: Description

Validated via /validate"

# Push and cleanup
git push origin main
git branch -d $BRANCH
```

## Archive Format

Create `completed/DOMAIN-XXX.md`:

```markdown
# DOMAIN-XXX: [Title]

- **Type:** Feature
- **Priority:** P1
- **Completed:** 2026-01-27
- **Iterations:** 2

## Summary

Brief description of what was done.

## Files Created

- `path/to/file.tsx` - Description

## Files Modified

- `path/to/file.tsx` - What changed

## Retrospective

- **What went well:** [description]
- **What could improve:** [description]
```

Update `completed/index.md` with new entry.

## Retake Handling

When validation fails:

```markdown
## DOMAIN-XXX - RETAKE REQUIRED

**Issues:**
- [ ] TypeScript error: line 42
- [ ] Missing export in index.ts

**Next:** Run `/build continue` to fix
```

After fixing, run `/validate` again.

## Generalized Health Check

When no active sprint (`/validate` with idle state):

```bash
# Full codebase checks
npx tsc --noEmit
npm run build
# Check all routes via Next.js MCP
```

Output:
```markdown
## Codebase Health Check

| Check | Status |
|-------|--------|
| TypeScript | PASS |
| Build | PASS |
| Runtime | FAIL (2 errors) |

### Issues Found
1. Hydration error in Text widget
2. Invalid HTML in Bio section

### Recommended
Fix before starting new work.
```

## Output Format (Pass)

```markdown
## Validation: WIDGET-003

### Results
| Check | Status |
|-------|--------|
| TypeScript | PASS |
| Build | PASS |
| Runtime | PASS |
| Spec Compliance | PASS |

### Result
**PASSED** - Merged to main

Commit: abc1234
Archived: completed/WIDGET-003.md
```

## Output Format (Fail)

```markdown
## Validation: WIDGET-003

### Results
| Check | Status |
|-------|--------|
| TypeScript | FAIL |
| Build | SKIPPED |
| Runtime | SKIPPED |

### Issues
- TypeScript: 2 errors found

### Result
**RETAKE** - Fix issues and re-validate

Next: `/build continue`
```
