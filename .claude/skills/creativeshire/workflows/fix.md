# Fix Workflow

> `/fix [path] "description"`

Quick fixes. Skips planning.

## When to Use

| Use `/fix` | Use `/plan` + `/build` |
|------------|------------------------|
| Typo | New feature |
| Missing export | Architecture change |
| Small bug, known cause | Unknown scope |

## Workflow

```
1. Branch   → Create fix branch
2. Fix      → Make the change
3. Validate → tsc --noEmit, runtime
4. Commit   → Commit and merge
```

## Pre-Flight

```bash
git checkout main
git pull origin main
git checkout -b fix/$(date +%Y-%m-%d)-description
npm run dev
```

## Fix Phase

1. Read the target file(s)
2. Identify the issue
3. Implement the fix
4. Run `npx tsc --noEmit`
5. Check localhost:3000

## Post-Flight

```bash
git add -A
git commit -m "fix(scope): description

Co-Authored-By: Claude <noreply@anthropic.com>"

git checkout main
git merge fix/$(date +%Y-%m-%d)-description
git push origin main
git branch -d fix/$(date +%Y-%m-%d)-description
```

## If Fix Grows

If scope is larger than expected:

```
This requires multiple files. Options:
1. Continue with fix
2. Abort, use /plan instead
```

## Output

```markdown
## Fixed

- **File:** path/to/file.tsx
- **Change:** Description
- **Merged to:** main
```
