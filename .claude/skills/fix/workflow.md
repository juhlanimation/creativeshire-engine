# Fix Workflow

> `/fix [path] "description"`

Quick fixes. Skips planning.

## Pre-Flight

```bash
git checkout main
git pull origin main
git checkout -b fix/$(date +%Y-%m-%d)-description
```

## Workflow

### 1. Identify

Read the target file(s) and identify the issue.

### 2. Fix

Make the minimal change needed:
- Fix the typo
- Add the missing export
- Correct the import
- Fix the small bug

### 3. Validate

**Type check (automatic via hook):**
```bash
npx tsc --noEmit
```

**Runtime check:**
- Verify localhost:3000 loads
- No console errors

### 4. Commit and Merge

```bash
git add -A
git commit -m "fix(scope): description

Co-Authored-By: Claude <noreply@anthropic.com>"

git checkout main
git merge fix/$(date +%Y-%m-%d)-description
git push origin main
git branch -d fix/$(date +%Y-%m-%d)-description
```

## Output Format

```markdown
## Fixed

- **File:** path/to/file.tsx
- **Change:** Description of what was fixed
- **Merged to:** main (abc1234)
```

## If Fix Grows

If scope is larger than expected:

```markdown
This requires multiple files. Options:
1. Continue with fix (if still small)
2. Abort, use `/plan` instead

Recommended: Use `/plan` for better tracking
```

To abort:
```bash
git checkout main
git branch -D fix/$(date +%Y-%m-%d)-description
```

Then run `/plan` to properly scope the work.
