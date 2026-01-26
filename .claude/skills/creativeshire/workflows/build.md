# Build Workflow

> `/build [item]` | `/build continue` | `/build all`

## Purpose

Implement backlog items. Supports parallel builds with dependency tracking.

## Workflow

```
User Request
     │
     ├── "continue" → Resume current sprint
     │
     └── "[item]" → Pull from backlog
                         │
                         ▼
              ┌─────────────────────┐
              │   PRE-FLIGHT        │
              │  - Sprint branch    │
              │  - Dev server       │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   BUILDER           │
              │  - Implement code   │
              │  - Self-validate    │
              │    (tsc --noEmit)   │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   VALIDATOR         │
              │  - Runtime check    │
              │  - Page loads       │
              │  - No errors        │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   POST-FLIGHT       │
              │  - Commit changes   │
              │  - Update sprint    │
              └─────────────────────┘
```

## Entry Points

| Command | What It Does |
|---------|--------------|
| `/build DOMAIN-XXX` | Build specific item |
| `/build continue` | Resume current sprint |
| `/build next` | Build highest priority item |
| `/build all` | Build entire backlog (parallel) |
| `/build WIDGET-001 to WIDGET-010` | Build range (parallel) |
| `/build SECTION-001, WIDGET-001` | Build list (parallel) |

---

## Pre-Flight (Mandatory)

### 1. Create/Check Sprint Branch

**Never work directly on main.**

```bash
# Check current branch
CURRENT=$(git branch --show-current)

# If on main, create sprint branch
if [[ "$CURRENT" == "main" ]]; then
    git checkout -b sprint/$(date +%Y-%m-%d)
fi

# If already on sprint, stay there
```

### 2. Start Dev Server

```bash
npm run dev
```

Verify: `localhost:3000` is accessible.

---

## Build Phase

### Launch Builder Agent

```
Task(
  subagent_type="builder",
  description="Build WIDGET-003",
  prompt="
TASK: Implement WIDGET-003 - Horizontal Gallery Widget

BLUEPRINT:
[Approach from backlog item]

CONTEXT:
[Key files and patterns from backlog]

COMPONENT TYPE: Widget
SPEC HINT: Read specs/components/content/widget.spec.md

WORKFLOW:
1. Read the widget spec
2. Check existing widgets for patterns
3. Implement following spec rules
4. Run: tsc --noEmit (fix errors before returning)
5. Return files created/modified
"
)
```

### Builder Self-Validates

Builder runs `tsc --noEmit` and fixes any type errors before returning.

---

## Runtime Validation

### Launch Validator Agent

```
Task(
  subagent_type="validator",
  description="Validate WIDGET-003 runtime",
  prompt="
FILES CHANGED:
[List from builder output]

CHECK:
1. localhost:3000 loads
2. No console errors
3. No hydration failures
4. No React errors in terminal

Return 'Pass' or list of errors.
"
)
```

### If Validation Fails

Send errors back to builder for fix. **Max 3 attempts.**

```
Task(
  subagent_type="builder",
  description="Fix WIDGET-003 runtime errors",
  prompt="
ERRORS TO FIX:
[Errors from validator]

FILES:
[Files that need fixing]

Fix these errors and re-validate with tsc --noEmit.
"
)
```

---

## Post-Flight

### 1. Commit Changes

```bash
git add -A
git commit -m "feat(WIDGET-003): add horizontal gallery widget

- Created horizontal-gallery.widget.tsx
- Added barrel exports

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 2. Update Sprint File

Mark item as "Ready for validation" in `current-sprint.md`.

### 3. Stay on Sprint Branch

**DO NOT merge.** That's `/validate`'s job.

---

## Parallel Builds

For multiple items, use wave-based parallelism.

### Step 1: Parse Dependencies

Read `Dependencies:` field from each backlog item:

```
WIDGET-001: None
WIDGET-002: None
SECTION-001: WIDGET-001, WIDGET-002
```

### Step 2: Group into Waves

```
Wave 1 (depth 0): WIDGET-001, WIDGET-002
Wave 2 (depth 1): SECTION-001
```

### Step 3: Launch Wave in Parallel

**Single message with multiple Task calls:**

```
Task(subagent_type="builder", description="Build WIDGET-001", run_in_background=true, ...)
Task(subagent_type="builder", description="Build WIDGET-002", run_in_background=true, ...)
```

### Step 4: Wait for Wave

```
Wait for all agents in wave to complete
Commit all changes from wave
Proceed to next wave
```

### Example

```
/build WIDGET-001 to WIDGET-003, SECTION-001

Dependencies:
  WIDGET-001: None
  WIDGET-002: None
  WIDGET-003: WIDGET-001
  SECTION-001: WIDGET-001, WIDGET-002

Waves:
  Wave 1: [WIDGET-001, WIDGET-002] → parallel
  Wave 2: [WIDGET-003, SECTION-001] → parallel (after wave 1)

Execution:
  Launch WIDGET-001 + WIDGET-002 → Wait → Commit
  Launch WIDGET-003 + SECTION-001 → Wait → Commit
  Done!
```

---

## Iteration Limits

**Max 3 runtime fix attempts per item.**

If limit reached:

```
WIDGET-001 failed after 3 attempts:
- Error: [description]

Options:
1. Continue iterating (override)
2. Commit with known issues
3. Abort item (move to backlog)

What would you like to do?
```

---

## Output Format

```markdown
## Build Complete

### WIDGET-003: Horizontal Gallery Widget

- **Status:** Ready for validation
- **Sprint:** sprint/2026-01-21
- **Runtime:** Pass

### Files
- `widgets/horizontal-gallery/horizontal-gallery.widget.tsx` (new)
- `widgets/horizontal-gallery/index.ts` (new)
- `widgets/index.ts` (modified)

### Git
- Commit: feat(WIDGET-003): add horizontal gallery widget
- Branch: sprint/2026-01-21

### Next Step
- `/build DOMAIN-XXX` to add more items
- `/validate` to review and merge
```

---

## Error Handling

| Error | Resolution |
|-------|------------|
| Item not in backlog | "Use `/plan` to add it first" |
| Sprint has in-progress item | Offer continue or abort |
| Max iterations reached | Ask user for decision |
| Circular dependency | Abort, ask to fix backlog |
| Builder can't find spec | Check component type mapping |
