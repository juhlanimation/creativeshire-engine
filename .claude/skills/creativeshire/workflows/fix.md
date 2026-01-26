# Fix Workflow

> `/fix [path] "what to fix"`

## Purpose

Quick fixes for known issues. Skips planning phase.

## When to Use

- Bug with known cause and location
- Small, targeted change
- No architecture decisions needed
- Single file or small set of files

## When NOT to Use

- Unknown scope or cause → use `/plan` first
- Multiple components affected → use `/plan` then `/build`
- Architecture decisions needed → use `/plan`

## Workflow

```
User Request
     │
     ▼
┌─────────────────────┐
│   PRE-FLIGHT        │
│  - Create fix branch│
│  - Start dev server │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│   BUILDER           │
│  - Implement fix    │
│  - Self-validate    │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│   VALIDATOR         │
│  - Runtime check    │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│   POST-FLIGHT       │
│  - Commit           │
│  - Merge to main    │
└─────────────────────┘
```

## Entry Points

| Command | What It Does |
|---------|--------------|
| `/fix path/to/file.tsx "description"` | Fix specific file |
| `/fix "description"` | Fix with auto-detected location |

---

## Pre-Flight

### Create Fix Branch

```bash
git checkout main
git pull origin main
git checkout -b fix/$(date +%Y-%m-%d)-short-description
```

### Start Dev Server

```bash
npm run dev
```

---

## Build Phase

### Launch Builder Agent

```
Task(
  subagent_type="builder",
  description="Fix: [description]",
  prompt="
TASK: Fix [description]

TARGET FILE(S):
- [path/to/file.tsx]

PROBLEM:
[User's description of the issue]

WORKFLOW:
1. Read the target file(s)
2. Identify the issue
3. Implement the fix
4. Run: tsc --noEmit
5. Return files modified
"
)
```

---

## Validation Phase

### Launch Validator Agent

```
Task(
  subagent_type="validator",
  description="Validate fix",
  prompt="
FILES CHANGED:
[List from builder]

CHECK:
1. localhost:3000 loads
2. No console errors
3. No hydration failures

Return 'Pass' or list of errors.
"
)
```

---

## Post-Flight

### Commit and Merge

```bash
# Commit fix
git add -A
git commit -m "fix: [description]

- [What was fixed]

Co-Authored-By: Claude <noreply@anthropic.com>"

# Merge to main (fast-forward if possible)
git checkout main
git merge fix/$(date +%Y-%m-%d)-short-description

# Push
git push origin main

# Clean up
git branch -d fix/$(date +%Y-%m-%d)-short-description
```

---

## Output Format

```markdown
## Fix Complete

### Issue
[Description of what was fixed]

### Files Modified
- `path/to/file.tsx` - [What changed]

### Validation
- tsc --noEmit: Pass
- Runtime: Pass

### Git
- Branch: fix/2026-01-21-description
- Merged to: main
- Commit: abc123
```

---

## Example Session

**User:** `/fix widgets/video-player.tsx "autoplay not working on mobile"`

```
Pre-Flight:
  ✓ Created branch: fix/2026-01-21-autoplay-mobile
  ✓ Dev server running

Build:
  → Launched builder
  → Builder found: muted attribute missing for mobile autoplay
  → Fixed: Added muted={true} to video element
  → tsc --noEmit: Pass

Validation:
  → Runtime check: Pass

Post-Flight:
  ✓ Committed: fix: add muted attribute for mobile autoplay
  ✓ Merged to main
  ✓ Cleaned up branch

## Fix Complete

Video autoplay now works on mobile (requires muted attribute).
```

---

## Error Handling

| Error | Resolution |
|-------|------------|
| File not found | Ask user to verify path |
| Fix causes new errors | Revert, suggest `/plan` instead |
| Scope too large | "This needs planning. Use `/plan` first." |
| Runtime validation fails | Max 3 fix attempts, then ask user |
