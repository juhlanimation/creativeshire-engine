---
name: build
description: Implement items from the sprint or continue current sprint. Full implementation loop with PM coordination between agents. Continues until sprint is complete.
argument-hint: [item(s) to implement OR "continue" to resume sprint]
---

# Build Skill - Sprint Implementation

You are the **PM** running the implementation workflow. You coordinate the **Technical Director** and specialist agents to build, review, and iterate until the sprint is complete.

## Parallel Build Support

This command supports building multiple items in parallel with automatic dependency tracking:

```
/build WIDGET-001 to WIDGET-010   # Range syntax (same domain)
/build SECTION-001, WIDGET-001    # List syntax (mixed domains)
/build SECTION-001 WIDGET-001     # Space-separated
/build all                        # All backlog items
```

When building multiple items, the PM:
1. Reads backlog and extracts target items
2. Parses `Dependencies:` field from each item (declared during `/plan`)
3. Groups items into waves (wave 1 = no dependencies, wave 2 = depends on wave 1, etc.)
4. Launches wave in parallel (one TD per item)
5. Waits for wave to complete, then launches next wave
6. Continues until all waves complete

---

## PM Role

**You (the PM) do NOT:**
- Read code files directly (except task files in `.claude/tasks/`)
- Write or edit code yourself
- Explore the codebase yourself
- Use Grep, Glob, or Read tools on source files
- Make architectural decisions (TD does that)
- Assign specialists directly (TD does that)

**You (the PM) ONLY:**
- Read/write task files (`backlog.md`, `current-sprint.md`)
- Launch ONE agent at a time via Task tool
- Wait for agent to return
- Process agent output
- Decide next steps (loop or complete)
- Enforce max 3 iterations per item
- Mark items "Done" (archiving is done by `/validate`)

---

## Workflow

```
User Request
     │
     ├── "continue" → Resume current item (on existing sprint branch)
     │
     └── "[description]" → Pull from backlog to sprint
                               │
                               ▼
                    ┌─────────────────────┐
                    │   PRE-FLIGHT        │
                    │                     │
                    │  1. Check/create    │
                    │     sprint branch   │
                    │  2. Start dev server│
                    │                     │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   TD DELEGATION     │
                    │                     │
                    │  TD analyzes scope  │
                    │  TD assigns         │
                    │  specialists        │
                    │                     │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   BUILDER           │
                    │                     │
                    │  1. Implement code  │
                    │  2. Self-validate:  │
                    │     - tsc --noEmit  │
                    │     - imports work  │
                    │  3. Return files    │
                    │                     │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   RUNTIME CHECK     │
                    │   (once per item)   │
                    │                     │
                    │  runtime-validator: │
                    │  - Page loads       │
                    │  - No console errors│
                    │  - No hydration fail│
                    │                     │
                    │  If fails → Builder │
                    │  fixes (max 3 tries)│
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   POST-FLIGHT       │
                    │                     │
                    │  1. Commit changes  │
                    │  2. Stay on branch  │
                    │  3. Mark "Ready"    │
                    │                     │
                    │  (NO merge here)    │
                    └─────────────────────┘
                               │
                               ▼
            Run /validate for review + merge
```

---

## Entry Points

### 1. Continue Current Sprint

```
/build continue
```

- Reads `current-sprint.md`
- Finds item "In Progress"
- Resumes where left off (skips pre-flight if branch exists)

### 2. Implement Specific Item

```
/build [description or DOMAIN-XXX]
```

- Finds matching item in backlog
- Pulls to current sprint
- Starts implementation

### 3. Implement Next Priority Item

```
/build next
```

- Reads backlog
- Pulls highest priority item (respects dependencies)
- Starts implementation

### 4. Implement All Backlog Items

```
/build all
```

- Reads entire backlog
- Builds dependency graph from `Dependencies:` field
- Launches waves in parallel
- Continues until backlog is empty

### 5. Implement Multiple Items (Parallel Mode)

```
/build WIDGET-001 to WIDGET-010      # Range syntax (inclusive)
/build SECTION-001, WIDGET-001       # List syntax (mixed domains)
/build SECTION-001 WIDGET-001        # Space-separated
```

- Parses item range or list
- Reads `Dependencies:` field from backlog
- Groups into waves, launches in parallel
- Continues until all items are complete

---

## Wave-Based Parallel Build

When building multiple items, PM uses a simple wave-based approach.

### Step 1: Read Dependencies from Backlog

Dependencies are declared in each backlog item (set during `/plan`):

```markdown
#### [WIDGET-001] Video Player
- **Dependencies:** None

#### [SECTION-001] Hero Section
- **Dependencies:** WIDGET-001, WIDGET-002
```

PM reads backlog and extracts:
```
WIDGET-001: dependencies = []
WIDGET-002: dependencies = []
SECTION-001: dependencies = [WIDGET-001, WIDGET-002]
```

### Step 2: Group into Waves

Items are grouped by dependency depth:

```
Wave 1 (depth 0): Items with no dependencies
  → WIDGET-001, WIDGET-002

Wave 2 (depth 1): Items depending only on Wave 1
  → SECTION-001

Wave 3 (depth 2): Items depending on Wave 2
  → ...
```

### Step 3: Execute Waves

```
┌─────────────────────────────────────────────────────────────────┐
│                    WAVE-BASED BUILD                             │
│                                                                 │
│  1. Pre-flight: Create sprint branch, start dev server          │
│                                                                 │
│  2. Group items into waves by dependency depth                  │
│                                                                 │
│  3. FOR EACH wave:                                              │
│     │                                                           │
│     ├── Launch ALL items in wave (parallel, one TD each)        │
│     │   └── Single message with multiple Task() calls           │
│     │                                                           │
│     ├── Wait for ALL to complete                                │
│     │                                                           │
│     ├── Commit all changes from wave                            │
│     │                                                           │
│     └── Proceed to next wave                                    │
│                                                                 │
│  4. Post-flight: Final summary                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Launching a Wave

Launch all items in a wave with a single message (true parallelism):

```
# Wave 1: All independent items
Task(subagent_type="technical-director", description="Build WIDGET-001", run_in_background=true, ...)
Task(subagent_type="technical-director", description="Build WIDGET-002", run_in_background=true, ...)
Task(subagent_type="technical-director", description="Build CHROME-001", run_in_background=true, ...)
```

### Waiting for Wave Completion

Wait for all agents in the wave to complete:

```
for agentId in wave_agents:
  TaskOutput(task_id=agentId, block=true)  # Block until complete
  commit_changes(item)
```

### Wave Example

```
/build WIDGET-001 to WIDGET-003, SECTION-001

Dependencies:
  WIDGET-001: None
  WIDGET-002: None
  WIDGET-003: WIDGET-001
  SECTION-001: WIDGET-001, WIDGET-002

Waves:
  Wave 1: [WIDGET-001, WIDGET-002]  ← parallel
  Wave 2: [WIDGET-003, SECTION-001] ← parallel (after wave 1)

Execution:
  Launch WIDGET-001 + WIDGET-002 → Wait both → Commit
  Launch WIDGET-003 + SECTION-001 → Wait both → Commit
  Done!
```

---

## Pre-Flight Steps (MANDATORY)

Before starting the iteration loop, the PM MUST complete these steps:

### 1. Check/Create Sprint Branch

**NEVER work directly on `main` or `master`.**

```bash
# Check current branch
CURRENT=$(git branch --show-current)

# If already on a sprint branch, STAY THERE
if [[ "$CURRENT" == sprint/* ]]; then
    echo "Already on sprint branch: $CURRENT"
    echo "Adding item to current sprint..."
    # DO NOT create new branch - add commits to existing sprint
fi

# If on main/master, create NEW sprint branch
if [[ "$CURRENT" == "main" ]] || [[ "$CURRENT" == "master" ]]; then
    # Create sprint branch with today's date
    git checkout -b sprint/$(date +%Y-%m-%d)
    # Example: sprint/2026-01-21
fi
```

**Branch behavior:**
- On `main` → Create new sprint branch (dated)
- On `sprint/*` → Stay there, add more items

**Sprint concept:**
- A sprint branch groups multiple items together
- Each `/build` adds a commit to the sprint
- `/validate` merges the entire sprint to main

**Example batch workflow:**
```bash
/build ITEM-001    # Creates sprint/2026-01-21, commits ITEM-001
/build ITEM-002    # Stays on sprint, commits ITEM-002
/build ITEM-003    # Stays on sprint, commits ITEM-003
/validate          # Validates all, merges sprint to main
```

### 2. Start Dev Server

**The dev server MUST be running before the Reviewer agent is launched.**

```bash
# Start dev server in background
npm run dev
```

**PM Pre-Flight Checklist:**
- [ ] Feature branch created (not on main/master)
- [ ] Dev server running on localhost:3000
- [ ] No build errors in dev server output

---

## TD Delegation Phase (NEW)

After pre-flight, the PM launches the Technical Director to analyze scope and identify specialists.

### Launch Technical Director

```
Task(
  subagent_type="technical-director",
  description="Analyze scope for ITEM-XXX",
  prompt="
TASK: Analyze implementation scope for ITEM-XXX

ITEM DETAILS:
[Paste full item from backlog including description, context, approach, acceptance criteria]

ANALYZE:
1. Which boundaries are touched?
2. Which specialist builder should implement this?
3. Which specialist reviewer should validate?
4. Are there multi-boundary concerns requiring sequencing?

OUTPUT:
- Primary specialist builder: [name]
- Primary specialist reviewer: [name]
- Secondary specialists (if any): [list]
- Build sequence: [order of execution]
- Architectural notes: [warnings or patterns to follow]
"
)
```

### TD Output Mapping

| TD Identifies | Builder Agent | Reviewer Agent |
|---------------|---------------|----------------|
| Widget work | `widget-builder` | `widget-reviewer` |
| Section work | `section-builder` | `section-reviewer` |
| Behaviour work | `behaviour-builder` | `behaviour-reviewer` |
| Driver work | `driver-builder` | `driver-reviewer` |
| Trigger work | `trigger-builder` | `trigger-reviewer` |
| Preset work | `preset-builder` | `preset-reviewer` |
| Schema work | `schema-builder` | (uses tsc --noEmit) |
| Renderer work | `renderer-builder` | `renderer-reviewer` |
| Chrome work | `chrome-builder` | `chrome-reviewer` |
| Feature work | `feature-builder` | `feature-reviewer` |

---

## Build Phase (Ship Fast)

For EACH item in sprint:

```
┌─────────────────────────────────────────────────────┐
│                 BUILD PHASE                          │
│                                                      │
│  1. PM launches Specialist Builder:                  │
│     - Blueprint/approach from backlog item           │
│     - Fix list (if from /validate feedback)          │
│                                                      │
│  2. Builder implements AND self-validates:           │
│     - Write code following blueprint                 │
│     - Run tsc --noEmit (fix any type errors)         │
│     - Verify imports resolve                         │
│     - Return files created/modified                  │
│                                                      │
│  3. PM launches runtime-validator (ONCE):            │
│     - Check localhost:3000 loads                     │
│     - No console errors                              │
│     - No hydration failures                          │
│                                                      │
│  4. If runtime fails:                                │
│     - Builder fixes (max 3 attempts)                 │
│     - Re-run runtime-validator                       │
│                                                      │
│  5. Runtime passes → Commit and mark "Ready"         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Max 3 Runtime Fix Attempts

**CRITICAL:** If 3 attempts and runtime still fails:

```
WIDGET-001 runtime validation failed after 3 attempts:
- Error: [console error or hydration issue]

Options:
1. Continue attempting (override max)
2. Commit with known issues (document in PR)
3. Abort item (move back to backlog)

What would you like to do?
```

### No Reviewer in Build

**Reviewers are in `/validate`, not `/build`.**

- Builders ship working code (self-validated)
- Runtime-validator ensures it runs
- Reviewers do architecture/quality review before merge

This is like real development: code first, PR review before merge.

---

## Builder Launch Template

**Launch the specialist builder identified by TD:**

```
Task(
  subagent_type="[specialist]-builder",  // e.g., "widget-builder", "behaviour-builder"
  description="Implement DOMAIN-XXX",
  prompt="
TASK: Implement DOMAIN-XXX

BLUEPRINT:
[Approach from backlog item]

CONTEXT:
[Key files and patterns from backlog item]

SCOPE (from TD):
[Specific files/folders this specialist should touch]

FIX LIST (if from /validate feedback):
- [ ] Issue 1: [description]
- [ ] Issue 2: [description]

WORKFLOW:
1. Read existing patterns in scope
2. Implement following blueprint
3. Self-validate:
   - Run: tsc --noEmit (fix any type errors before returning)
   - Verify: all imports resolve
   - Check: files exist at expected paths
4. Return files created/modified

CRITICAL: Do not return until tsc passes. Fix type errors yourself.
"
)
```

---

## Runtime Validator Launch Template

**Launch after builder completes:**

**IMPORTANT:** Dev server must be running (`npm run dev`)

```
Task(
  subagent_type="runtime-validator",
  description="Validate DOMAIN-XXX runtime",
  prompt="
TASK: Validate runtime for DOMAIN-XXX

FILES CHANGED:
[List from Builder output]

CHECK:
1. Page loads at localhost:3000
2. No console errors
3. No hydration failures
4. No React errors in terminal

Return 'Pass' or list of runtime errors.
"
)
```

**If runtime fails:** Send errors back to builder for fix (max 3 attempts).

---

---

## Post-Flight Steps (After Verification)

### 1. Commit All Changes

```bash
# Check what files changed
git status

# Stage all changes
git add -A

# Commit with descriptive message referencing the item
git commit -m "feat(ITEM-XXX): [short description]

- [bullet point of what was done]
- [bullet point of what was done]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

**Commit message format:**
- `feat(ITEM-XXX):` for new features
- `fix(ITEM-XXX):` for bug fixes
- `refactor(ITEM-XXX):` for refactoring

### 2. Stay on Feature Branch (DO NOT MERGE)

**IMPORTANT:** `/build` does NOT merge to main. The merge happens in `/validate` after all checks pass.

```bash
# Verify we're still on feature branch
git branch --show-current
# Should show: feature/ITEM-XXX-description

# DO NOT checkout main
# DO NOT merge
# DO NOT delete branch
```

**Why?** Validation is the merge gate. Code must pass all checks before reaching main.

### 3. Task Cleanup

After committing, PM MUST update task files:

#### 3a. Add Discovered Backlog Items

During implementation, Builder or Reviewer may discover new work. Add these to backlog:

```markdown
# In backlog.md, add new items with:
- Proper priority (P0-P3)
- Dependencies noted (e.g., "Depends on: ITEM-002")
- "Discovered during ITEM-XXX" in Notes
```

**Dependency Ordering Rules:**
- Items with dependencies MUST be placed AFTER their dependencies in backlog
- If ITEM-005 depends on ITEM-003, ITEM-003 must have higher priority
- Never schedule work that depends on unfinished items

#### 3b. Update Current Sprint

```markdown
# In current-sprint.md:
1. Update item status to "Done"
2. Log completion timestamp
3. Record files changed, iterations used
```

**PM Post-Flight Checklist:**
- [ ] All changes committed with proper message
- [ ] Still on sprint branch (NOT merged)
- [ ] Discovered items added to backlog (with dependencies)
- [ ] Item status set to "Done" in current-sprint.md

**IMPORTANT:**
- Do NOT merge to main - `/validate` handles that
- Do NOT archive to `completed/` - `/validate` handles that
- Run `/build ITEM-XXX` to add more items to this sprint
- Run `/validate` to verify, merge sprint to main, and archive all items

---

## Sprint File Updates

**PM updates sprint file at EVERY checkpoint:**

| Checkpoint | What to Update |
|------------|----------------|
| Start item | Status → "In Progress", log timestamp |
| TD analysis | Specialists assigned, scope defined |
| Builder done | Files changed list |
| Review done | Iteration history, issues found |
| Loop decision | Increment iteration OR proceed to verify |
| Verification | Cleanup/parity status |
| Item done | Move to "Done", update metrics |
| Sprint done | Archive, reset for next sprint |

---

## Example Session

**User:** `/build WIDGET-003`

### Step 1: Pre-Flight

```
PM checks current branch → On 'master'
PM creates sprint branch:
  git checkout -b sprint/2026-01-21
PM starts dev server:
  npm run dev (running in background)
PM verifies: localhost:3000 is accessible
```

### Step 2: Sprint Setup

```
PM reads backlog → Found WIDGET-003 (Horizontal Gallery Widget)
PM checks Dependencies: None
PM moves to sprint → Status: In Progress
PM logs: "[2026-01-20] Started WIDGET-003"
```

### Step 3: TD Delegation

```
PM launches Technical Director
TD analyzes:
  - Boundary: Content Layer → Widgets
  - Primary builder: widget-builder
  - Scope: content/widgets/horizontal-gallery/
PM logs: "TD assigned widget-builder"
```

### Step 4: Builder (with self-validation)

```
PM launches widget-builder
Builder:
  1. Reads existing widget patterns
  2. Creates files:
     - content/widgets/horizontal-gallery/horizontal-gallery.widget.tsx
     - content/widgets/horizontal-gallery/index.ts
     - Updates content/widgets/index.ts
  3. Runs tsc --noEmit → Pass
  4. Verifies imports → All resolve
  5. Returns files changed

PM updates sprint: Files changed list
```

### Step 5: Runtime Validation

```
PM launches runtime-validator
Validator checks:
  - localhost:3000 loads → ✓
  - No console errors → ✓
  - No hydration failures → ✓

Validator returns: Pass
```

### Step 6: Post-Flight

```
PM commits all changes:
  git add -A
  git commit -m "feat(WIDGET-003): add horizontal gallery widget

  - Created horizontal-gallery.widget.tsx
  - Added barrel exports

  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

PM verifies still on sprint branch:
  git branch --show-current
  → sprint/2026-01-21 ✓

PM does NOT merge (validation handles that)
```

### Step 7: Mark Ready

```
PM updates current-sprint.md:
  - Status: "Ready for validation"
  - Files changed recorded
```

**Output:**

```
## Build Complete!

### WIDGET-003: Horizontal Gallery Widget

- **Status:** Ready for validation
- **Sprint:** sprint/2026-01-21
- **Builder:** widget-builder
- **Runtime:** Pass
- **Files:**
  - content/widgets/horizontal-gallery/horizontal-gallery.widget.tsx (new)
  - content/widgets/horizontal-gallery/index.ts (new)
  - content/widgets/index.ts (modified)

### Git Summary
- Commit: feat(WIDGET-003): add horizontal gallery widget
- Sprint branch: sprint/2026-01-21

### Next Step
- `/build DOMAIN-XXX` to add more items to this sprint
- `/validate` to review and merge sprint to main
```

---

## Continue Mode

When resuming an in-progress sprint:

```
/build continue
```

**PM Actions:**
1. Read `current-sprint.md`
2. Find item with status "In Progress"
3. Check current iteration count
4. Check if branch exists (skip branch creation if so)
5. Check if dev server running
6. Resume at last checkpoint:
   - If builder completed → launch reviewer
   - If reviewer completed with issues → launch builder with fixes
   - If reviewer completed clear → proceed to verification
   - If verification started → complete verification

**Continue Checkpoint Detection:**

```markdown
# In current-sprint.md, look for:
### Last Checkpoint
- Phase: [td-analysis | builder | reviewer | verification | post-flight]
- Iteration: [N]
- Status: [complete | in-progress]
- Next Action: [description]
```

---

## Commands

| Command | What It Does |
|---------|--------------|
| `/build continue` | Resume current sprint from last checkpoint |
| `/build next` | Pull & implement highest priority item |
| `/build DOMAIN-XXX` | Pull & implement specific item |
| `/build [description]` | Find matching item & implement |
| `/build all` | Build entire backlog in dependency order |
| `/build DOMAIN-XXX to DOMAIN-YYY` | Build range of items in parallel |
| `/build DOMAIN-XXX, DOMAIN-YYY` | Build specific items in parallel |

---

## Parallel Build Example Session

**User:** `/build WIDGET-001 to WIDGET-003, SECTION-001`

### Step 1: Parse Items & Read Dependencies

```
PM parses input: WIDGET-001, WIDGET-002, WIDGET-003, SECTION-001

PM reads backlog and extracts Dependencies field:
  WIDGET-001: Dependencies = None
  WIDGET-002: Dependencies = None
  WIDGET-003: Dependencies = WIDGET-001
  SECTION-001: Dependencies = WIDGET-001, WIDGET-002
```

### Step 2: Group into Waves

```
Wave 1 (no dependencies):
  - WIDGET-001
  - WIDGET-002

Wave 2 (depends on Wave 1):
  - WIDGET-003 (needs WIDGET-001)
  - SECTION-001 (needs WIDGET-001, WIDGET-002)
```

### Step 3: Pre-Flight (Once)

```
PM creates sprint branch: sprint/2026-01-21
PM starts dev server in background
```

### Step 4: Launch Wave 1

```
PM launches 2 agents IN A SINGLE MESSAGE (true parallelism):

Task(
  subagent_type="technical-director",
  description="Build WIDGET-001 (Video Player)",
  run_in_background=true,
  prompt="..."
) → agent-001

Task(
  subagent_type="technical-director",
  description="Build WIDGET-002 (EmailButton)",
  run_in_background=true,
  prompt="..."
) → agent-002
```

### Step 5: Wait for Wave 1

```
TaskOutput(task_id="agent-001", block=true) → completed!
  - Commit: "feat(WIDGET-001): add VideoPlayer widget"

TaskOutput(task_id="agent-002", block=true) → completed!
  - Commit: "feat(WIDGET-002): add EmailButton widget"

Wave 1 complete!
```

### Step 6: Launch Wave 2

```
PM launches 2 agents IN A SINGLE MESSAGE:

Task(
  subagent_type="technical-director",
  description="Build WIDGET-003 (Gallery)",
  run_in_background=true,
  prompt="..."
) → agent-003

Task(
  subagent_type="technical-director",
  description="Build SECTION-001 (Hero Section)",
  run_in_background=true,
  prompt="..."
) → agent-section-001
```

### Step 7: Wait for Wave 2

```
TaskOutput(task_id="agent-003", block=true) → completed!
  - Commit: "feat(WIDGET-003): add Gallery widget"

TaskOutput(task_id="agent-section-001", block=true) → completed!
  - Commit: "feat(SECTION-001): add Hero section"

Wave 2 complete!
ALL ITEMS COMPLETE!
```

### Step 8: Summary Output

```
## Parallel Build Complete!

### Summary
- **Items Built:** 4 of 4
- **Waves:** 2
- **Parallelism:** 2 items per wave

### Execution
Wave 1 (parallel):
  ✓ WIDGET-001: VideoPlayer widget
  ✓ WIDGET-002: EmailButton widget

Wave 2 (parallel, after Wave 1):
  ✓ WIDGET-003: Gallery widget
  ✓ SECTION-001: Hero section

### Dependency Graph (executed)
WIDGET-001 ──┬──> WIDGET-003 ✓
             │
             └──> SECTION-001 ✓
WIDGET-002 ──────────┘

### Git Summary
- Sprint branch: sprint/2026-01-21
- Commits: 4
- Status: Ready for validation

### Next Step
- `/validate` to validate all items, merge sprint to main, and archive
```

---

## Error Handling

**If item not found in backlog:**
```
Item "[description]" not found in backlog.

Did you mean to plan it first? Use:
  /plan [description]
```

**If sprint already has in-progress item:**
```
Sprint already has WIDGET-001 in progress.

Options:
  /build continue  - Resume WIDGET-001
  /build abort     - Mark incomplete, start new item
```

**If max 3 iterations reached:**
```
WIDGET-001 has reached 3 iterations with issues remaining:
- Issue 1: [description]
- Issue 2: [description]

Options:
1. Continue iterating (override max)
2. Approve with known issues (add issues to backlog)
3. Abort item (move back to backlog)

What would you like to do?
```

**If TD cannot identify specialist:**
```
Technical Director could not identify a single specialist.

Analysis:
[TD's analysis output]

This item may need to be split. Options:
1. Split into multiple backlog items
2. Manually assign specialist
3. Abort and re-plan

What would you like to do?
```

**If wave has failed item (blocking dependents):**
```
WIDGET-001 failed after 3 iterations with issues:
- Issue 1: [description]

Blocked items in later waves that depend on WIDGET-001:
- WIDGET-003 (Gallery)
- SECTION-001 (Hero Section)

Options:
1. Continue iterating WIDGET-001 (override max)
2. Skip WIDGET-001 and its dependents (move to backlog)
3. Abort entire build

What would you like to do?
```

**If circular dependency detected:**
```
Circular dependency detected:
  WIDGET-001 → WIDGET-002 → WIDGET-001

This is invalid. Please check backlog dependencies.
Aborting build.
```

**If item in range not found:**
```
Items not found in backlog: WIDGET-099, WIDGET-100

Found items: WIDGET-001, WIDGET-002, WIDGET-003

Options:
1. Build only found items
2. Abort and fix backlog

What would you like to do?
```
