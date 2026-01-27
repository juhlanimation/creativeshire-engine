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
git checkout -b sprint/$(date +%Y-%m-%d)

# If already on sprint/*, stay there
# Start dev server
npm run dev
```

**Branch behavior:**
- On `main` → Create new sprint branch
- On `sprint/*` → Stay there, add more commits

## Workflow

### 1. Read Backlog Item

From `.claude/tasks/backlog.md`:
- Understand requirements
- Note dependencies
- Check acceptance criteria

### 2. Read Relevant Spec

Based on component type, read from creativeshire skill:

| Building... | Read |
|-------------|------|
| Widget | `../creativeshire/specs/components/content/widget.spec.md` |
| Section | `../creativeshire/specs/components/content/section.spec.md` |
| Chrome | `../creativeshire/specs/components/content/chrome.spec.md` |
| Behaviour | `../creativeshire/specs/components/experience/behaviour.spec.md` |
| Driver | `../creativeshire/specs/components/experience/driver.spec.md` |
| Trigger | `../creativeshire/specs/components/experience/trigger.spec.md` |
| Preset | `../creativeshire/specs/components/preset/preset.spec.md` |

Also read:
- `../creativeshire/specs/patterns/common.spec.md` for patterns
- `../creativeshire/specs/patterns/anti-patterns.spec.md` for what to avoid

### 3. Find Existing Examples

Search for similar components:
```
creativeshire/components/content/widgets/
creativeshire/components/content/sections/
creativeshire/components/experience/behaviours/
```

Follow existing patterns for consistency.

### 4. Implement

Follow the spec rules:
- Use correct file structure
- Follow naming conventions
- Apply required patterns
- Export from index files

### 5. Validate

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

### 6. Commit

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

1. Read sprint state
2. Find in-progress item
3. Check current iteration
4. Resume at last checkpoint

## Output Format

```markdown
## Build Complete

- **Item:** WIDGET-003
- **Status:** Ready for validation
- **Files:**
  - `creativeshire/components/content/widgets/MyWidget/MyWidget.tsx`
  - `creativeshire/components/content/widgets/MyWidget/index.ts`
- **Branch:** sprint/2026-01-27

Next: `/validate WIDGET-003` or `/build WIDGET-004`
```

## Commit Message Format

| Type | Use For |
|------|---------|
| `feat(DOMAIN-XXX):` | New features |
| `fix(DOMAIN-XXX):` | Bug fixes |
| `refactor(DOMAIN-XXX):` | Refactoring |
