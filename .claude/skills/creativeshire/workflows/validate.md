# Validate Workflow

> `/validate` | `/validate DOMAIN-XXX`

Reviews sprint, merges to main, archives completed.

## Entry Points

| Command | Action |
|---------|--------|
| `/validate` | Validate all sprint items |
| `/validate DOMAIN-XXX` | Validate specific item |

## Workflow

```
1. Review     → Check against spec
2. Fix        → If issues, fix (max 3 iterations)
3. Merge      → Merge sprint to main
4. Archive    → Move to completed/
```

## Review Checklist

- [ ] Follows component spec patterns
- [ ] Correct folder structure
- [ ] Proper exports in barrel files
- [ ] No anti-patterns
- [ ] No boundary violations
- [ ] tsc --noEmit passes
- [ ] Runtime works (no console errors)

## If Issues Found

Fix each issue, then re-review. **Max 3 iterations.**

## Merge

```bash
git checkout main
git pull origin main
git merge sprint/2026-01-27 --no-ff -m "Merge sprint/2026-01-27

Items completed:
- WIDGET-XXX: Description

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

## Archive

Move from `backlog.md` to `.claude/tasks/completed/YYYY-MM.md`

## Output

```markdown
## Validated

- [x] WIDGET-XXX: Approved
- [x] SECTION-XXX: Approved

Merged to main, archived.
```
