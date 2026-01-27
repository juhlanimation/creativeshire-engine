# Build Workflow

> `/build [item]` | `/build continue` | `/build all`

Implements backlog items with validation.

## Entry Points

| Command | Action |
|---------|--------|
| `/build DOMAIN-XXX` | Build specific item |
| `/build continue` | Resume current sprint |
| `/build next` | Build highest priority item |
| `/build all` | Build entire backlog |

## Workflow

```
1. Pre-flight  → Sprint branch, dev server
2. Build       → Read spec, implement, tsc --noEmit
3. Validate    → Check localhost:3000
4. Post-flight → Commit, update sprint
```

## Pre-Flight

```bash
# Create sprint branch if on main
git checkout -b sprint/$(date +%Y-%m-%d)

# Start dev server
npm run dev
```

## Build Phase

1. **Read backlog item** from `.claude/tasks/backlog.md`
2. **Read the spec** for component type (see SKILL.md mapping)
3. **Find existing** similar components for patterns
4. **Implement** following spec rules
5. **Validate** with `npx tsc --noEmit`
6. **Fix errors** before proceeding

## Runtime Check

After tsc passes:
1. Check localhost:3000 loads
2. No console errors
3. No hydration failures

If errors, fix and re-validate. **Max 3 attempts.**

## Post-Flight

```bash
git add -A
git commit -m "feat(DOMAIN-XXX): description

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Parallel Builds

For multiple items, group by dependencies:

```
Wave 1 (no deps):  WIDGET-001, WIDGET-002
Wave 2 (deps):     SECTION-001 (needs WIDGET-001)
```

Build each wave, commit, then next wave.

## Output

```markdown
## Build Complete

- **Item:** WIDGET-003
- **Status:** Ready for validation
- **Files:** widget.tsx, index.ts
- **Branch:** sprint/2026-01-27
```
