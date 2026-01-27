# Fix Workflow

> `/fix [path] "description"`

Quick fixes. Skips planning.

## Pre-Flight

```bash
git checkout main
git pull origin main

# Store branch name (use consistent name throughout)
BRANCH="fix/$(date +%Y-%m-%d)-description"
git checkout -b $BRANCH
```

**Note:** Replace `description` with a short kebab-case summary (e.g., `fix-typo-header`).

## Workflow

### 0. Pre-Fix Validation

**Verify target file exists:**
```bash
ls [path]
```

If not found:
```markdown
File `[path]` not found. Please verify the path.
```
Stop here.

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
# Get current branch name
BRANCH=$(git branch --show-current)

git add -A
git commit -m "fix(scope): description

Co-Authored-By: Claude <noreply@anthropic.com>"

git checkout main
git merge $BRANCH --no-ff -m "Merge $BRANCH"
git push origin main
git branch -d $BRANCH
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
BRANCH=$(git branch --show-current)
git checkout main
git branch -D $BRANCH
```

Then run `/plan` to properly scope the work.
