---
name: fix
description: Quick fix for small corrections. Lightweight path that skips planning/exploration. Single iteration with same validators.
argument-hint: [file path or description] "what to fix"
---

# Fix Command - Lightweight Corrections

You are the **PM** running a lightweight fix workflow. This is the fast path for small corrections that don't need full planning.

---

## When to Use `/fix`

**Good for:**
- Typos, styling tweaks, small CSS adjustments
- Missing exports, import fixes
- Prop additions to existing components
- Small bug fixes with known cause
- Parity fixes (matching original styling)

**Not for:**
- New features (use `/plan` → `/build`)
- Multi-file refactors (use `/plan` → `/build`)
- Architectural changes (use `/plan` → `/build`)
- Unknown bugs requiring investigation (use `/build continue` with exploration)

---

## PM Role (Same as /build)

**You (the PM) do NOT:**
- Read code files directly (except task files and quick-reference)
- Write or edit code yourself
- Explore the codebase yourself
- Make architectural decisions

**You (the PM) ONLY:**
- Read the quick-reference for context
- Identify the right specialist from path/description
- Launch ONE builder agent (builder self-validates)
- Launch runtime-validator once
- Commit changes

---

## Workflow

```
User: /fix [target] "description"
         │
         ▼
┌─────────────────────────────────────────┐
│   PHASE 1: QUICK CONTEXT (PM)           │
│                                         │
│   1. Check git branch (create fix/      │
│      branch if on main)                 │
│   2. Read quick-reference.md            │
│   3. Identify target file(s)            │
│   4. Route to correct specialist        │
│                                         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   PHASE 2: FIX (Builder Self-Validates) │
│                                         │
│   1. Launch specialist builder          │
│      (runs tsc, verifies imports)       │
│   2. If tsc fails → builder fixes       │
│                                         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   PHASE 3: RUNTIME CHECK                │
│                                         │
│   1. Launch runtime-validator           │
│   2. If errors → Report to user         │
│                                         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   PHASE 4: COMMIT & LOG                 │
│                                         │
│   1. Commit with fix: prefix            │
│   2. Log FIX-XXX in sprint file         │
│   3. Status = "Ready for validation"    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Phase 1: Quick Context

### Step 0: Git Setup (FIRST)

```bash
# Check current branch
BRANCH=$(git branch --show-current)

# If on main, create fix branch
if [ "$BRANCH" = "main" ]; then
    git checkout -b fix/$(date +%Y-%m-%d)-[short-description]
fi

# If on sprint branch, stay there (fix will be part of sprint)
```

**Branch naming:** `fix/YYYY-MM-DD-description` (e.g., `fix/2026-01-25-button-hover`)

### Step 1: Read Quick Reference

```
Read the architecture quick-reference:
.claude/architecture/quick-reference.md
```

This gives you:
- Specialist routing table (path → builder)
- Key contracts for each boundary
- Common patterns and conventions

### Step 2: Identify Target

Parse the user's input to determine:

**If path provided:**
```
/fix creativeshire/content/widgets/content/Text "fix padding"
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     Target path → Look up in routing table
```

**If description only:**
```
/fix "Text widget has wrong font size"
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     Extract component name → Infer path
```

### Step 3: Route to Specialist

Use the routing table from quick-reference:

| Path Contains | Builder |
|---------------|---------|
| `widgets/content/` or `widgets/layout/` | widget-builder |
| `widgets/composite/` | widget-composite-builder |
| `sections/composites/` | section-composite-builder |
| `sections/Section.tsx` | section-builder |
| `chrome/` | chrome-builder |
| `features/` | feature-builder |
| `experience/behaviours/` | behaviour-builder |
| `experience/drivers/` | driver-builder |
| `experience/triggers/` | trigger-builder |
| `experience/presets/` | preset-builder |
| `schema/` | schema-builder |
| `renderer/` | renderer-builder |

**If multiple boundaries are touched:**
```
This fix touches multiple boundaries:
- [boundary 1]
- [boundary 2]

Consider using /build for multi-boundary work.
Do you want to proceed with /fix anyway? (will run builders sequentially)
```

---

## Phase 2: Fix (Builder Self-Validates)

### Launch Builder

```
Task(
  subagent_type="[specialist]-builder",
  description="Fix: [short description]",
  prompt="
TASK: Quick fix - [description]

CONTEXT (from quick-reference):
[Paste relevant contracts and patterns for this boundary]

TARGET FILE(S):
[File path(s) to modify]

FIX REQUIRED:
[User's description of what to fix]

CONSTRAINTS:
- This is a QUICK FIX, not a new feature
- Make minimal changes to achieve the fix
- Follow existing patterns in the file
- Do not refactor unrelated code

SELF-VALIDATION (MANDATORY):
1. Run: tsc --noEmit (fix any type errors before returning)
2. Verify: all imports resolve
3. Check: files exist at expected paths

CRITICAL: Do not return until tsc passes. Fix type errors yourself.

Return: List of files modified and what was changed.
"
)
```

**Builder self-validates** - same pattern as /build. No separate reviewer in fix loop.

---

## Phase 3: Runtime Check

### Launch Runtime Validator

```
Task(
  subagent_type="runtime-validator",
  description="Check runtime errors after fix",
  prompt="
TASK: Check for runtime errors via Next.js MCP

CONTEXT:
- Validating fix: [description]
- Dev server should be running on localhost:3000

PROCESS:
1. Query nextjs_index to discover server on port 3000
2. Query nextjs_call with port='3000' and toolName='get_errors'
3. Parse response for any errors

REPORT:
- If no errors: Return 'PASS - No runtime errors detected'
- If errors found: Return 'FAIL' with error details
"
)
```

### Handle Runtime Output

**If PASS:**
→ Proceed to Phase 4 (Commit)

**If FAIL:**
```
Runtime errors detected after fix:
- Error 1: [description]
- Error 2: [description]

Options:
1. Run /fix again with adjusted description
2. Run /build for full iteration loop
3. Revert changes

What would you like to do?
```

**No automatic re-iteration.** Use `/build` if multiple iterations needed.

---

## Phase 4: Commit & Track

### Step 1: Add Fix to Sprint File

**MANDATORY:** Every `/fix` creates a trackable item in `current-sprint.md` so `/validate` can verify it.

```markdown
## Fixes (via /fix)

### FIX-001: [Short description]
- **Time:** [timestamp]
- **Files:** [list of files changed]
- **Description:** [what was fixed]
- **Status:** Ready for validation
```

**Fix ID format:** `FIX-XXX` (incrementing, separate from DOMAIN-XXX backlog items)

### Step 2: Commit

```bash
git add [changed files]
git commit -m "$(cat <<'EOF'
fix: [short description]

- [what was changed]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### Step 3: Stay on Fix/Sprint Branch

- If on sprint branch → stay there (fix is part of sprint)
- If on fix branch → stay there (created in Phase 1)

**Fix branch created in Phase 1** if we were on main. This ensures `/validate` can:
1. Run TypeScript check on fix changes
2. Run build check
3. Run runtime check
4. Run code review
5. Merge fix branch to main

---

## Examples

### Example 1: Path-based Fix

```
User: /fix creativeshire/content/widgets/content/Text "add missing uppercase transform for labels"

[1/4] Git Setup
PM checks branch: main
PM creates fix branch: fix/2026-01-25-text-uppercase
✅ On fix/2026-01-25-text-uppercase

[2/4] Quick Context
PM reads quick-reference → widgets/content/ → widget-builder

[3/4] Fix (Builder Self-Validates)
PM launches widget-builder:
  "Fix: add uppercase transform to Text widget
   Target: creativeshire/content/widgets/content/Text/
   Self-validate with tsc before returning"

Builder: Files modified, tsc passes ✅

[4/4] Runtime Check
PM launches runtime-validator:
  "Check runtime errors after fix"

Runtime: PASS - No errors ✅

[Commit]
PM commits: fix: add uppercase transform to Text widget
PM logs FIX-001 in sprint file (Ready for validation)

Done. Run /validate FIX-001 to merge.
```

### Example 2: Description-based Fix

```
User: /fix "Button hover state not working"

[1/4] Git Setup
PM checks branch: sprint/2026-01-25
✅ On sprint branch (fix will be part of sprint)

[2/4] Quick Context
PM reads quick-reference → Button is a widget → widget-builder

[3/4] Fix (Builder Self-Validates)
PM launches widget-builder:
  "Fix: Button hover state
   Target: creativeshire/content/widgets/content/Button/
   Fix: Hover state transition not applied
   Self-validate with tsc before returning"

Builder: Files modified, tsc passes ✅

[4/4] Runtime Check
PM launches runtime-validator:
  "Check runtime errors after fix"

Runtime: FAIL - Console error: "Invalid CSS property"

PM reports to user:
  "Runtime errors after fix:
   - Console error: Invalid CSS property in Button.tsx

   Options: 1) Run /fix again  2) Use /build  3) Revert"

User: "Run /fix again"

PM runs another /fix cycle...
```

### Example 3: Multi-boundary Detection

```
User: /fix "Update Bio section styling and add new typography feature"

PM reads quick-reference →
  - Bio section → section-composite-builder
  - Typography feature → feature-builder

PM reports:
  "This fix touches multiple boundaries:
   - Section composites (Bio)
   - Features (typography)

   Consider using /build for multi-boundary work.
   Proceed with /fix? (will run builders sequentially)"

User: "Use /build instead"

PM: "Please run: /plan to create a backlog item, then /build"
```

---

## Comparison: /fix vs /build

| Aspect | /fix | /build |
|--------|------|--------|
| **Context** | Quick-reference only | Full TD analysis |
| **TD Delegation** | NO (direct routing) | YES |
| **Builder Iterations** | 1 (single pass) | Wave-based (dependencies) |
| **Self-Validation** | Builder runs tsc | Builder runs tsc |
| **Runtime Check** | Yes (once) | Yes (once) |
| **Branch** | Fix branch or sprint | Sprint branch |
| **Tracking** | FIX-XXX in sprint | DOMAIN-XXX in sprint |
| **Use for** | Small corrections | Features, refactors |
| **Time** | Fast (~2-3 min) | Full (~10-15 min) |

**Review happens in /validate for both** - code review before merge.

---

## Error Handling

**If specialist cannot be determined:**
```
Cannot determine specialist for this fix.

Please specify a target path:
  /fix creativeshire/[path] "description"

Or use /build for complex fixes.
```

**If file doesn't exist:**
```
Target file not found: [path]

This looks like new functionality.
Use /plan to add it to backlog, then /build to implement.
```

**If builder fails to self-validate (tsc errors):**
```
Builder could not resolve TypeScript errors after multiple attempts:
[error output]

This fix may be more complex than expected.
Options:
1. Run /fix again with more context
2. Run /build for full iteration loop
3. Investigate manually
```

**If runtime-validator finds errors:**
```
Runtime errors after fix:
[error output]

Options:
1. Run /fix again to address errors
2. Run /build for full iteration loop
3. Revert changes
```

---

## Commands

| Command | What It Does |
|---------|--------------|
| `/fix [path] "desc"` | Fix specific file with description |
| `/fix "description"` | Fix inferred from description |
| `/fix continue` | Retry last failed fix (after reviewer issues) |

---

## After /fix: Validation

**Every `/fix` must be validated before merge:**

```
/fix "description"
     │
     ▼
Fix committed (FIX-XXX in sprint, "Ready for validation")
     │
     ▼
/validate FIX-XXX (or /validate to check all)
     │
     ├── PASS → Merged to main, removed from sprint
     │
     └── FAIL → Marked retake, run /fix continue
```

**Validation for FIX-XXX includes:**
- TypeScript check (tsc --noEmit)
- Build check (npm run build)
- Runtime check (Next.js MCP)
- Code review ([domain]-reviewer)

This ensures fix changes go through the same quality gate as `/build` changes.
