---
name: validate
description: Validate sprint items and move to completed or mark for retake. Runs verification checks before archiving.
argument-hint: [item ID OR blank for all "Done" items]
---

# Validate Skill - Sprint Verification Gate

You are the **PM** running the validation workflow. You verify that sprint items meet all quality gates before archiving to completed, or mark them for retake if issues are found.

---

## PM Role (MANDATORY - Same as /build)

**You (the PM) do NOT:**
- Read code files directly (except task files in `.claude/tasks/`)
- Write or edit code yourself
- Explore the codebase yourself
- Use Grep, Glob, or Read tools on source files
- Make architectural decisions
- Run verification checks yourself (agents do that)
- Analyze code for cleanup issues (cleanup-agent does that)
- Review code yourself (reviewers do that)
- Check task hygiene yourself (project-assistant does that)

**You (the PM) ONLY:**
- Read/write task files (`backlog.md`, `current-sprint.md`, `completed/`)
- Launch ONE agent at a time via Task tool
- Wait for agent to return
- Run build/TypeScript checks via Bash (tsc, npm run build)
- Process agent output
- Archive items to completed folder OR mark as retake

**CRITICAL:** For verification checks, you MUST use the Task tool to launch agents. Do NOT run Grep/Glob/Read to check cleanup or parity yourself. The agents have specialized knowledge and validators.

---

## Agents To Launch (via Task tool)

| Agent | When | Purpose |
|-------|------|---------|
| `runtime-validator` | Always (after build passes) | Check for runtime errors via Next.js MCP |
| `[domain]-reviewer` | Always (after runtime passes) | Code review before merge |
| `cleanup-agent` | Refactor/Migration items | Verify no legacy code remains |
| `project-assistant` | After archive (all items) | Verify task ID sequence and index accuracy |

**Reviewers moved here from /build** - code review happens before merge, not during implementation.

**Template Pattern:**
```
Task(
  subagent_type="[agent-name]",
  description="[brief description]",
  prompt="[detailed instructions]"
)
```

---

## Workflow

```
/validate [DOMAIN-XXX or FIX-XXX or blank]
         │
         │  (runs on sprint/fix branch)
         ▼
┌─────────────────────────┐
│   IDENTIFY ITEMS        │
│                         │
│  Find items with status:│
│  - "Ready for validation│
│  - "Done (pending       │
│     validation)" [FIX]  │
│                         │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│   VERIFICATION CHECKS   │
│                         │
│  1. TypeScript check    │
│  2. Build check         │
│  3. Runtime check (MCP) │
│  4. Code Review         │
│     ([domain]-reviewer) │
│  5. cleanup-agent       │
│     (if refactor)       │
│                         │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│   DECISION GATE         │
│                         │
│  All pass?              │
│  ├── YES → MERGE        │
│  │   - Merge to main    │
│  │   - Delete branch    │
│  │   - Archive item     │
│  │   - Reset sprint     │
│  │   - Task hygiene     │
│  │                      │
│  └── NO → RETAKE        │
│      - Stay on branch   │
│      - Status = Retake  │
│      - Add issues       │
│      - Stay in sprint   │
│                         │
└─────────────────────────┘
```

---

## Entry Points

### 1. Validate All Done Items (Default)

```
/validate
```

- Finds all items in `current-sprint.md` with status "Done" or "In Review"
- Validates each item sequentially
- Reports results for each

### 2. Validate Specific Item

```
/validate DOMAIN-XXX
```

- Validates only the specified item
- Item must be in current sprint with status "Ready for validation"

### 3. Validate Fix Items

```
/validate FIX-XXX
```

- Validates a fix created via `/fix` command
- Fix items appear in `current-sprint.md` under "Fixes (via /fix)" section
- Same checks as regular items (TypeScript, Build, Runtime)
- On PASS: Merge fix branch to main, remove from sprint
- On FAIL: Mark as retake, stay on fix branch

**Fix Validation Differences:**
| Aspect | DOMAIN-XXX | FIX-XXX |
|--------|------------|---------|
| Code review | Always | Always |
| Cleanup check | If refactor | Never (fixes are small) |
| Archive to | `completed/DOMAIN-XXX.md` | Just remove from sprint (no archive file) |

### 4. Generalized Validation (No Active Sprint)

```
/validate
```

When sprint status is **IDLE** (no active items):

- Runs full codebase health check
- Does NOT archive or merge (nothing to archive)
- Reports overall health status

**Generalized Validation Checks:**

| Check | What It Does |
|-------|--------------|
| TypeScript | `tsc --noEmit` on full codebase |
| Build | `npm run build` |
| Runtime | Query Next.js MCP for errors on all routes |

**Use Cases:**
- Periodic health check of the codebase
- Verify no regressions after external changes
- Pre-flight check before starting new work
- Catch runtime errors that slipped through

**Workflow:**

```
/validate (with IDLE sprint)
         │
         ▼
┌─────────────────────────┐
│   GENERALIZED CHECK     │
│                         │
│  1. TypeScript check    │
│  2. Build check         │
│  3. Runtime check (MCP) │
│                         │
│  (No parity/cleanup -   │
│   no items to verify)   │
│                         │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│   HEALTH REPORT         │
│                         │
│  - All pass → Healthy   │
│  - Any fail → Issues    │
│                         │
│  (No merge/archive)     │
│                         │
└─────────────────────────┘
```

**Output Format:**

```
## Codebase Health Check

| Check | Status |
|-------|--------|
| TypeScript | ✅ PASS |
| Build | ✅ PASS |
| Runtime | ❌ FAIL (3 errors) |

### Runtime Errors Found

1. **Invalid HTML tag** in Bio section
   - `<heading>` is not a valid HTML element
   - File: creativeshire/content/sections/composites/Bio/index.ts

2. **Hydration mismatch** in Text widget
   - Server/client content differs
   - File: creativeshire/content/widgets/content/Text/index.tsx

### Recommended Actions

- Fix runtime errors before starting new sprint work
- Run `/build` to address specific issues
```

---

## Sprint Item Statuses

| Status | Description |
|--------|-------------|
| To Do | Not started |
| In Progress | Builder actively working |
| Ready for validation | Builder complete (self-validated), awaiting /validate |
| **Retake** | Validation failed, needs fixes |

**Retake Status Format:**

```markdown
| Retake | 1 | DOMAIN-XXX |

### DOMAIN-XXX - RETAKE REQUIRED
**Retake Reason:** [Date] Validation failed
**Issues:**
- [ ] Issue 1: [description]
- [ ] Issue 2: [description]
**Next Action:** Builder must fix issues and re-submit via /build continue
```

---

## Verification Checks

**Checks by item type:**
| Item Type | tsc | build | runtime | reviewer | cleanup-agent | project-assistant |
|-----------|-----|-------|---------|----------|---------------|-------------------|
| Feature | ✓ | ✓ | ✓ | ✓ | N/A | ✓ (after archive) |
| Bug Fix | ✓ | ✓ | ✓ | ✓ | N/A | ✓ (after archive) |
| Refactor | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (after archive) |
| Migration | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (after archive) |
| **FIX-XXX** | ✓ | ✓ | ✓ | ✓ | N/A | N/A (no archive) |

**Reviewer is the code review gate** - like PR review before merge.

### 1. TypeScript Check (Always) - PM runs directly

```bash
npx tsc --noEmit
```

**Pass:** Exit code 0, no type errors
**Fail:** Any TypeScript errors

### 2. Build Check (Always) - PM runs directly

```bash
npm run build
```

**Pass:** Build completes without errors
**Fail:** Build errors

---

### 3. Runtime Check (Always) - PM launches runtime-validator agent

**IMPORTANT:** This check runs AFTER TypeScript and Build pass. It queries the Next.js MCP for runtime errors that static analysis cannot catch.

**Prerequisites:**
- Dev server must be running (`npm run dev`)
- Routes should have been loaded at least once (browser visit or `nextjs_call`)

**PM MUST launch via Task tool - do NOT check runtime errors yourself:**

```
Task(
  subagent_type="runtime-validator",
  description="Check runtime errors for DOMAIN-XXX",
  prompt="
TASK: Check for runtime errors via Next.js MCP

CONTEXT:
- Validating: DOMAIN-XXX
- Dev server should be running on localhost:3000

PROCESS:
1. Query nextjs_index to discover server on port 3000
2. Query nextjs_call with port='3000' and toolName='get_errors'
3. Parse response for any errors

REPORT:
- If no errors: Return 'PASS - No runtime errors detected'
- If errors found: Return 'FAIL' with full error list including:
  - Error type (console, hydration, build)
  - Error message
  - File/line location if available
  - Suggested fix
"
)
```

**Wait for agent to return.** Process the result before proceeding.

**Pass:** No runtime errors detected
**Fail:** Any console errors, hydration failures, or invalid HTML

**Common Runtime Errors Caught:**
| Error | Cause | Example |
|-------|-------|---------|
| Invalid HTML tag | Bad variant prop | `<heading>` instead of `<h1>` |
| Invalid HTML nesting | Reserved element in component | `<body>` inside `<div>` |
| Hydration mismatch | Server/client content differs | Dynamic values without suppression |
| Multiple body | Component renders `<body>` | Text widget with `variant="body"` |

---

### 4. Code Review (Always)

**This is the PR review step** - reviewers moved here from /build.

**PM determines reviewer from item's domain** (same mapping as /build):

| Domain Prefix | Reviewer |
|---------------|----------|
| WIDGET-XXX | widget-reviewer |
| SECTION-XXX | section-reviewer |
| CHROME-XXX | chrome-reviewer |
| EXPERIENCE-XXX | behaviour-reviewer |
| etc. | [domain]-reviewer |

**PM MUST launch via Task tool:**

```
Task(
  subagent_type="[domain]-reviewer",
  description="Review DOMAIN-XXX before merge",
  prompt="
TASK: Code review for DOMAIN-XXX

FILES CHANGED:
[List from sprint log]

ACCEPTANCE CRITERIA:
[From backlog item]

REVIEW FOR:
1. Contract compliance (within boundary rules)
2. Code quality (bugs, TypeScript, logic)
3. Architecture patterns followed
4. No unnecessary complexity

Report issues with >= 80% confidence only.
Return 'PASS' or list of issues.
"
)
```

**Wait for agent to return.** If issues found, mark as Retake.

---

### 6. Cleanup Agent Launch Template (Refactor/Migration ONLY)

**Skip for Feature and Bug Fix items.**

Only run if item type is "Refactor" or "Migration". **Run only after reviewer passes.**

**PM MUST launch via Task tool - do NOT check cleanup yourself:**

```
Task(
  subagent_type="cleanup-agent",
  description="Verify cleanup for DOMAIN-XXX",
  prompt="
TASK: Verify no legacy code remains after DOMAIN-XXX

FILES CHANGED:
[List from sprint log]

VERIFY:
- [ ] No imports reference deleted files
- [ ] No 'Legacy' or 'Old' prefixed files exist
- [ ] No commented-out old code
- [ ] Type exports updated
- [ ] Index files updated

Return 'PASS' or list of issues found.
"
)
```

**Wait for agent to return.** Process the result before proceeding.

---

## Decision Logic

```
All checks passed (for ALL "Done" items)?
├── YES (all PASS)
│   └── MERGE & ARCHIVE
│       1. Merge sprint branch to main
│       2. Delete sprint branch
│       3. Create completed/DOMAIN-XXX.md for EACH item
│       4. Update completed/index.md (add all to Recent, All Items)
│       5. Update current-sprint.md: Remove all items
│       6. Update backlog.md: Remove all items
│       7. Reset sprint for next cycle
│       8. Launch project-assistant for task hygiene verification
│
└── NO (any FAIL)
    └── RETAKE
        1. Update current-sprint.md:
           - Failed items: Status → "Retake"
           - Add issues list
           - Add retake timestamp
        2. Stay on sprint branch
        3. DO NOT merge
        4. DO NOT archive ANY items (even passing ones)
        5. DO NOT remove from backlog
        6. Notify user of required fixes
```

---

## Merge Steps (On PASS Only)

**CRITICAL:** Only merge after ALL checks pass. This is the quality gate.

### 1. Merge Sprint Branch to Main

```bash
# Get current branch name (should be sprint/YYYY-MM-DD)
BRANCH=$(git branch --show-current)

# Verify we're on a sprint branch
if [[ "$BRANCH" != sprint/* ]]; then
    echo "ERROR: Not on a sprint branch. Current: $BRANCH"
    exit 1
fi

# Switch to main
git checkout main

# Pull latest main
git pull origin main

# Merge the sprint branch (all items in one merge)
git merge $BRANCH --no-ff -m "Merge $BRANCH

Items completed:
- ITEM-XXX: Description
- ITEM-YYY: Description

Validated and approved via /validate"

# Push to remote (if configured)
git push origin main
```

### 2. Delete Sprint Branch

```bash
# Delete local sprint branch
git branch -d $BRANCH

# Delete remote sprint branch (if pushed)
git push origin --delete $BRANCH 2>/dev/null || true
```

### 3. Reset Sprint File

Reset `current-sprint.md` to clean state:

```markdown
# Current Sprint

> **Owner:** PM (Creativeshire Orchestrator)
> **Sprint Number:** -
> **Sprint Goal:** -
> **Started:** -
> **Status:** IDLE

---

## Sprint Status

| Status | Count | Items |
|--------|-------|-------|
| To Do | 0 | - |
| In Progress | 0 | - |
| In Review | 0 | - |
| Done | 0 | - |

---

## Active Item

_No active item. Run `/build ITEM-XXX` to start a sprint._

---

## Sprint Log

```
```
```

### 4. Proceed to Archive

After merge and sprint reset, create archive entries for ALL completed items in the sprint.

### 5. Project Assistant Launch Template (Task Hygiene)

After archiving, **PM MUST launch project-assistant via Task tool** to verify task consistency.

**PM MUST launch via Task tool - do NOT check task hygiene yourself:**

```
Task(
  subagent_type="project-assistant",
  description="Verify task hygiene after archive",
  prompt="
TASK: Verify task hygiene after archiving DOMAIN-XXX

VERIFY:
1. ID Sequence: Item IDs are sequential with no gaps
2. Index Accuracy: completed/index.md matches actual files
3. Completion Format: New DOMAIN-XXX.md has required fields
4. Backlog Sync: Next backlog item ID follows highest completed ID

Return 'PASS' or list of hygiene issues.
"
)
```

**Wait for agent to return.** Process the result before completing.

This ensures:
- No ID gaps between completed and backlog items
- Index totals and tables are accurate
- Completion records follow the standard format

---

## Retake Handling

When validation fails, the item stays in sprint with "Retake" status:

### Sprint File Update

```markdown
## Sprint Status

| Status | Count | Items |
|--------|-------|-------|
| To Do | 0 | - |
| In Progress | 0 | - |
| In Review | 0 | - |
| Done | 0 | - |
| Retake | 1 | ITEM-XXX |

---

## Active Item

### DOMAIN-XXX - RETAKE REQUIRED

**Status:** Retake
**Retake Count:** 1
**Last Validated:** [YYYY-MM-DD HH:MM]

**Validation Results:**
- TypeScript: PASS / FAIL
- Build: PASS / FAIL
- Runtime: PASS / FAIL
- Reviewer: PASS / FAIL
- Cleanup: PASS / FAIL / N/A

**Issues Requiring Fix:**
- [ ] [Issue 1 description]
- [ ] [Issue 2 description]
- [ ] [Issue 3 description]

**Next Action:** Run `/build continue` to fix issues

---

## Sprint Log

```
[YYYY-MM-DD HH:MM] Validation started for DOMAIN-XXX
[YYYY-MM-DD HH:MM] TypeScript: PASS
[YYYY-MM-DD HH:MM] Build: FAIL - Error in X
[YYYY-MM-DD HH:MM] Marked as RETAKE - awaiting fixes
```
```

---

## Retake → Build Flow

When an item is marked "Retake", the next `/build continue` will:

1. Detect "Retake" status in sprint
2. Parse issues list from sprint file
3. Launch builder with fix list
4. Run reviewer after builder completes
5. Item returns to "Done" status
6. User runs `/validate` again

```
/validate DOMAIN-XXX → FAIL → Retake
         │
         ▼
/build continue
         │
         ▼
Builder fixes issues (self-validates)
         │
         ▼
Status → "Ready for validation"
         │
         ▼
/validate DOMAIN-XXX → PASS → Archive
```

---

## Archive Format (On Pass)

When validation passes, create `completed/DOMAIN-XXX.md`:

```markdown
# DOMAIN-XXX: [Title]

- **Type:** [Feature/Bug/Refactor/etc.]
- **Priority:** [P0-P3]
- **Completed:** YYYY-MM-DD
- **Iterations:** [N]

---

## Summary

[Brief description of what was done]

---

## Files Created

- `path/to/file.tsx` - Description

## Files Modified

- `path/to/file.tsx` - What changed

---

## Key Features

- Feature 1
- Feature 2

---

## Retrospective

- **What went well:** [description]
- **What could improve:** [description]
```

Then update `completed/index.md`:
1. Increment "Total Items" in Summary
2. Add row to "Recent (Last 10)" table (remove oldest if > 10)
3. Add row to "All Items" table
4. Update "By Type" section if needed

---

## Example Session

### Scenario: Validate After Build

**User:** `/validate`

```
PM reads current-sprint.md
Found 1 item with status "Ready for validation": WIDGET-042

Starting validation for WIDGET-042...

[1/5] TypeScript Check
PM runs: npx tsc --noEmit
Result: PASS (0 errors)

[2/5] Build Check
PM runs: npm run build
Result: PASS (build successful)

[3/5] Runtime Check
PM launches via Task tool:
  Task(subagent_type="runtime-validator", description="Check runtime errors for WIDGET-042", ...)
Agent returns: PASS - No runtime errors detected

[4/5] Code Review
PM launches via Task tool:
  Task(subagent_type="widget-reviewer", description="Review WIDGET-042 before merge", ...)
Agent returns: PASS - Code follows patterns, no issues found

[5/5] Cleanup Agent
Item type: Feature (new) - SKIPPED (only for Refactor/Migration)

---

## Validation Summary

| Check | Result |
|-------|--------|
| TypeScript | ✅ PASS |
| Build | ✅ PASS |
| Runtime | ✅ PASS |
| Review | ✅ PASS |
| Cleanup | ⏭️ N/A |

**Decision: MERGE & ARCHIVE**

Merging sprint branch...
✅ Switched to main
✅ Merged sprint/2026-01-21
✅ Pushed to origin/main
✅ Deleted sprint branch

Archiving WIDGET-042...
✅ Created completed/WIDGET-042.md
✅ Updated completed/index.md
✅ Removed from backlog.md
✅ Sprint reset

Running task hygiene check...
PM launches via Task tool:
  Task(subagent_type="project-assistant", description="Verify task hygiene after archive", ...)
Agent returns: PASS
✅ ID sequence verified (no gaps)
✅ Index totals accurate
✅ Completion record format valid

WIDGET-042 has been validated, merged, and archived!
```

---

### Scenario: Validation Fails

**User:** `/validate`

```
PM reads current-sprint.md
Found 1 item with status "Ready for validation": SECTION-043

Starting validation for SECTION-043...

[1/5] TypeScript Check
PM runs: npx tsc --noEmit
Result: FAIL
  - error TS2345: Argument of type 'string' is not assignable...
  - error TS7006: Parameter 'x' implicitly has an 'any' type

[2/5] Build Check
SKIPPED (TypeScript failed)

[3/5] Runtime Check
SKIPPED (TypeScript failed)

[4/5] Code Review
SKIPPED (TypeScript failed)

[5/5] Cleanup Agent
SKIPPED (TypeScript failed)

---

## Validation Summary

| Check | Result |
|-------|--------|
| TypeScript | ❌ FAIL (2 errors) |
| Build | ⏭️ SKIPPED |
| Runtime | ⏭️ SKIPPED |
| Review | ⏭️ SKIPPED |
| Cleanup | ⏭️ SKIPPED |

**Decision: RETAKE**

Marking SECTION-043 for retake...
✅ Status updated to "Retake"
✅ Issues added to sprint file

---

## SECTION-043 - RETAKE REQUIRED

**Issues to Fix:**
- [ ] TypeScript error: Argument of type 'string' is not assignable to parameter of type 'number' (line 42)
- [ ] TypeScript error: Parameter 'x' implicitly has an 'any' type (line 56)

**Next Steps:**
Run `/build continue` to fix these issues, then `/validate` again.
```

---

## Error Handling

**If no items to validate:**
```
No items found with status "Ready for validation".

Current sprint status:
- To Do: 0
- In Progress: 1 (DOMAIN-XXX)
- Retake: 0

The item must complete the builder loop before validation.
Run `/build continue` to complete the current item.
```

**If specified item not found:**
```
DOMAIN-XXX not found in current sprint.

Current sprint items:
- WIDGET-042 (Ready for validation)
- SECTION-043 (In Progress)

Did you mean WIDGET-042?
```

**If item is in "Retake" status:**
```
DOMAIN-XXX is already marked for retake.

Current issues:
- [ ] Issue 1
- [ ] Issue 2

Run `/build continue` to fix these issues before re-validating.
```

---

## Commands Summary

| Command | What It Does |
|---------|--------------|
| `/validate` | Validate all "Ready for validation" items |
| `/validate DOMAIN-XXX` | Validate specific sprint item |
| `/validate FIX-XXX` | Validate specific fix item |
| `/build continue` | Fix retake items |
| `/fix continue` | Retry failed fix |

---

## Integration with /build

The `/build` command should detect "Retake" status:

```markdown
# In /build continue flow:

1. Read current-sprint.md
2. Check for items with status:
   - "In Progress" → Resume builder (self-validates)
   - "Retake" → Launch builder with retake issues as fix list
3. Builder self-validates (tsc, imports)
4. Set status to "Ready for validation"
5. User runs /validate
```

**Retake Detection in /build:**

```
If status == "Retake":
    Parse issues from sprint file
    Launch builder with fix list:
    "
    FIX LIST (from validation failure):
    - [ ] Issue 1
    - [ ] Issue 2

    Fix these issues and return.
    "
    Builder self-validates → status = "Ready for validation"
```

---

## Summary

| Validation Result | Action |
|-------------------|--------|
| All checks PASS | Merge sprint to main, delete sprint branch, archive all items to `completed/`, update index, remove from backlog |
| Any check FAIL | Mark as "Retake", stay on sprint branch, add issues, stay in sprint |

The `/validate` command is the **merge gate**. Code only reaches main after passing all verification checks. This ensures:
- Broken code never reaches main
- Sprint branches isolate work-in-progress
- Multiple items can be batched and validated together
- Clear quality checkpoint before completion
