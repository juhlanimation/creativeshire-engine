# Build Workflow

> `/build [item]` | `/build continue` | `/build next` | `/build all`

Implements backlog items with validation.

## Entry Points

| Command | Action |
|---------|--------|
| `/build DOMAIN-XXX` | Build specific item |
| `/build continue` | Resume current sprint |
| `/build next` | Build highest priority item |
| `/build all` | Build entire backlog |
| `/build WIDGET-001 to WIDGET-005` | Range (parallel) |
| `/build WIDGET-001, SECTION-001` | List (parallel) |

## Pre-Flight

```bash
# If on main, create sprint branch
git checkout -b sprint/{summary}

# If already on sprint/*, stay there
# Start dev server
npm run dev
```

**Branch naming:**
- Use kebab-case summary of what's being built
- Examples: `sprint/hero-widgets`, `sprint/gallery-section`, `sprint/parallax-behaviours`
- For single items: `sprint/widget-003-video-player`
- For ranges: `sprint/widget-001-to-005`

**Branch behavior:**
- On `main` → Create new sprint branch
- On `sprint/*` → Stay there, add more commits

## Workflow

### 0. Pre-Build Validation

**Verify item exists in backlog:**
```bash
grep "DOMAIN-XXX" .claude/tasks/backlog.md
```

If not found:
```markdown
Item `DOMAIN-XXX` not found in backlog.

Run `/plan` first to add it.
```
Stop here.

**Verify dependencies are completed:**
```bash
# For each dependency, check if in completed/
grep "DEP-XXX" .claude/tasks/completed/index.md
```

If dependency not completed:
```markdown
Dependency `DEP-XXX` not yet completed.

Build dependencies first: `/build DEP-XXX`
```
Stop here.

**Verify dev server is running:**
```
nextjs_index → Should return server on port 3000
```

If not running:
```bash
npm run dev
```

### 1. Update Sprint File

Update `.claude/tasks/current-sprint.md`:
- Set branch name
- Set state to `building`
- Add item to table with status `in_progress`, iteration `1`

### 2. Read Backlog Item

From `.claude/tasks/backlog.md`:
- Understand requirements
- Note dependencies
- Check acceptance criteria

### 3. Read Relevant Spec

Based on component type, read from creativeshire skill:

| Building... | Read |
|-------------|------|
| Widget | `../engine/specs/components/content/widget.spec.md` |
| Section | `../engine/specs/components/content/section.spec.md` |
| Chrome | `../engine/specs/components/content/chrome.spec.md` |
| Behaviour | `../engine/specs/components/experience/behaviour.spec.md` |
| Driver | `../engine/specs/components/experience/driver.spec.md` |
| Trigger | `../engine/specs/components/experience/trigger.spec.md` |
| Preset | `../engine/specs/components/preset/preset.spec.md` |

Also read:
- `../engine/specs/patterns/common.spec.md` for patterns
- `../engine/specs/patterns/anti-patterns.spec.md` for what to avoid

### 4. Find Existing Examples

Search for similar components:
```
engine/content/widgets/
engine/content/sections/
engine/experience/behaviours/
```

Follow existing patterns for consistency.

### 5. Implement

Follow the spec rules:
- Use correct file structure
- Follow naming conventions
- Apply required patterns
- Export from index files

### 6. Validate

**Type check (automatic via hook):**
```bash
npx tsc --noEmit
```

**Runtime check:**
1. Verify localhost:3000 loads
2. No console errors
3. No hydration failures

Use Next.js MCP tools:
```
nextjs_index → Discover dev server
nextjs_call(port="3000", toolName="get_errors") → Check errors
```

**Max 3 attempts.** If still failing after 3 attempts, ask user.

### 7. Commit & Update Sprint

Update `.claude/tasks/current-sprint.md`:
- Mark item as `completed` in table
- Clear active item section (or set next item)

```bash
git add -A
git commit -m "feat(DOMAIN-XXX): description

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Parallel Builds (Wave-Based)

When building multiple items:

### Step 1: Parse Dependencies

```
/build WIDGET-001 to WIDGET-003, SECTION-001

Dependencies from backlog:
  WIDGET-001: None
  WIDGET-002: None
  WIDGET-003: WIDGET-001
  SECTION-001: WIDGET-001, WIDGET-002
```

### Step 2: Group into Waves

```
Wave 1 (no deps): WIDGET-001, WIDGET-002
Wave 2 (deps):    WIDGET-003, SECTION-001
```

### Step 3: Execute Waves

```
FOR EACH wave:
  Build ALL items in wave (can be parallel)
  Wait for ALL to complete
  Commit all changes
  Proceed to next wave
```

### Error: Circular Dependency

```
Circular dependency detected:
  WIDGET-001 → WIDGET-002 → WIDGET-001

Check backlog dependencies and fix.
```

### Error: Wave Item Failed

```
WIDGET-001 failed after 3 attempts.

Blocked dependents:
- WIDGET-003
- SECTION-001

Options:
1. Continue iterating WIDGET-001
2. Skip WIDGET-001 and dependents
3. Abort build
```

## Continue Mode

When resuming (`/build continue`):

1. **Check current branch:**
   ```bash
   git branch --show-current
   # Should be sprint/*
   ```

2. **Read sprint file:** `.claude/tasks/current-sprint.md`
   - Find item marked `in_progress`
   - Check iteration count
   - Read last error/blocker

3. **Resume implementation:**
   - If iteration < 3: Continue fixing
   - If iteration = 3: Ask user for guidance

## Output Format

```markdown
## Build Complete

- **Item:** WIDGET-003
- **Status:** Ready for validation
- **Files:**
  - `engine/content/widgets/MyWidget/MyWidget.tsx`
  - `engine/content/widgets/MyWidget/index.ts`
- **Branch:** sprint/widget-003-video-player

Next: `/validate WIDGET-003` or `/build WIDGET-004`
```

## Commit Message Format

| Type | Use For |
|------|---------|
| `feat(DOMAIN-XXX):` | New features |
| `fix(DOMAIN-XXX):` | Bug fixes |
| `refactor(DOMAIN-XXX):` | Refactoring |
