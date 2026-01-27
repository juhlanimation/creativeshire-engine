# Validate Workflow

> `/validate` | `/validate DOMAIN-XXX`

## Purpose

Review sprint work, fix issues, merge to main, archive completed items.

## Workflow

```
Sprint Branch
     │
     ▼
┌─────────────────────┐
│   REVIEW            │
│  - Launch reviewer  │
│  - Check compliance │
└─────────────────────┘
     │
     ├── Issues found → Fix loop (max 3)
     │
     └── Approved
              │
              ▼
┌─────────────────────┐
│   MERGE             │
│  - Merge to main    │
│  - Push             │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│   ARCHIVE           │
│  - Move to completed│
│  - Update indexes   │
└─────────────────────┘
```

## Entry Points

| Command | What It Does |
|---------|--------------|
| `/validate` | Validate all items in current sprint |
| `/validate DOMAIN-XXX` | Validate specific item only |

---

## Review Phase

### Launch Reviewer Agent

For each item in sprint:

```
Task(
  subagent_type="reviewer",
  description="Review WIDGET-003",
  prompt="
TASK: Review WIDGET-003 - Horizontal Gallery Widget

COMPONENT TYPE: Widget
SPEC: .claude/architecture/creativeshire/components/content/widget.spec.md

FILES TO REVIEW:
- widgets/horizontal-gallery/horizontal-gallery.widget.tsx
- widgets/horizontal-gallery/index.ts
- widgets/index.ts

CHECK:
1. Follows widget.spec.md patterns
2. Correct folder structure
3. Proper exports
4. No anti-patterns
5. No boundary violations

Return 'Approved' or list of issues.
"
)
```

### If Issues Found

Launch builder to fix, then re-review. **Max 3 iterations.**

```
Task(
  subagent_type="builder",
  description="Fix WIDGET-003 review issues",
  prompt="
ISSUES TO FIX:
1. [Issue description]
2. [Issue description]

FILES:
- [files to fix]

Fix these issues and validate with tsc --noEmit.
"
)
```

---

## Merge Phase

After all reviews pass:

```bash
# Ensure on sprint branch
git branch --show-current  # sprint/2026-01-21

# Merge to main
git checkout main
git pull origin main
git merge sprint/2026-01-21 --no-ff -m "Merge sprint/2026-01-21

Items completed:
- WIDGET-003: Horizontal Gallery Widget
- SECTION-001: Hero Section

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push
git push origin main
```

---

## Archive Phase

Move completed items from `backlog.md` to `completed/`:

```bash
# Create archive file if needed
mkdir -p .claude/tasks/completed

# Move item details to archive
# Update backlog.md to remove completed items
```

### Archive Format

`.claude/tasks/completed/2026-01.md`:

```markdown
# Completed - January 2026

## WIDGET-003 - Horizontal Gallery Widget
- **Completed:** 2026-01-21
- **Sprint:** sprint/2026-01-21
- **Commit:** abc123

## SECTION-001 - Hero Section
- **Completed:** 2026-01-21
- **Sprint:** sprint/2026-01-21
- **Commit:** def456
```

---

## Iteration Limits

**Max 3 review fix iterations per item.**

If limit reached:

```
WIDGET-003 review failed after 3 iterations.

Remaining issues:
- [Issue 1]
- [Issue 2]

Options:
1. Continue iterating (override)
2. Merge with known issues (document in PR)
3. Abort validation (stay on sprint branch)

What would you like to do?
```

---

## Parallel Review

For multiple items, launch reviewers in parallel:

```
Task(subagent_type="reviewer", description="Review WIDGET-001", run_in_background=true, ...)
Task(subagent_type="reviewer", description="Review WIDGET-002", run_in_background=true, ...)
Task(subagent_type="reviewer", description="Review SECTION-001", run_in_background=true, ...)
```

Wait for all, then process results.

---

## Output Format

### All Approved

```markdown
## Validation Complete

### Items Validated
- [x] WIDGET-003: Horizontal Gallery Widget - Approved
- [x] SECTION-001: Hero Section - Approved

### Merge
- Sprint: sprint/2026-01-21
- Merged to: main
- Commit: abc123

### Archived
- WIDGET-003 → completed/2026-01.md
- SECTION-001 → completed/2026-01.md

### Summary
2 items validated, merged, and archived.
```

### Issues Found

```markdown
## Validation In Progress

### WIDGET-003: Horizontal Gallery Widget
- **Status:** Issues found (iteration 1/3)
- **Issues:**
  1. Missing export from barrel file
  2. Boundary violation: imports from experience layer

### Next Steps
Launching builder to fix issues...
```

---

## Error Handling

| Error | Resolution |
|-------|------------|
| No sprint branch | "No active sprint. Run `/build` first." |
| Merge conflict | Report conflict, ask user to resolve |
| Push failed | Retry with backoff, report if persistent |
| Reviewer finds critical issue | Must fix before merge |
