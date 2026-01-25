# Reviewer Spec

> Read-only agents that validate builder output against domain specs.

## Purpose

Reviewers check that builder implementations comply with their domain spec. They read code, compare against rules, and produce compliance reports. They never modify code — if issues are found, they report them for the builder to fix.

**Workflow:** Read spec → Read implementation → Check each rule → Report findings

## Concepts

| Term | Definition |
|------|------------|
| Reviewer | Read-only agent that validates implementations |
| Domain Spec | The rules to check against (e.g., `widget.spec.md`) |
| Compliance Report | Output listing pass/fail for each rule |
| Verdict | Final determination: APPROVED or NEEDS FIXES |
| Builder | The agent whose output is being reviewed |

## Reviewer Types

| Reviewer | Domain | Reviews |
|----------|--------|---------|
| `widget-reviewer` | Widgets | `creativeshire/components/content/widgets/` |
| `widget-composite-reviewer` | Widget Composites | `creativeshire/components/content/widgets/composites/` |
| `section-reviewer` | Sections | `creativeshire/components/content/sections/` |
| `section-composite-reviewer` | Section Composites | `creativeshire/components/content/sections/composites/` |
| `chrome-reviewer` | Chrome | `creativeshire/components/content/chrome/` |
| `feature-reviewer` | Features | `creativeshire/components/content/features/` |
| `behaviour-reviewer` | Behaviours | `creativeshire/components/experience/behaviour/` |
| `driver-reviewer` | Drivers | `creativeshire/components/experience/driver/` |
| `trigger-reviewer` | Triggers | `creativeshire/components/experience/trigger/` |
| `provider-reviewer` | Providers | `creativeshire/components/experience/provider/` |
| `preset-reviewer` | Presets | `creativeshire/presets/` |
| `renderer-reviewer` | Renderer | `creativeshire/renderer/` |

## Contract Structure

Every reviewer contract MUST have these sections:

```markdown
## Knowledge

### Primary
| Document | Purpose |
|----------|---------|
| `types/reviewer.spec.md` | Reviewer type rules |
| `creativeshire/.../domain.spec.md` | Domain rules to check |

### Additional
(Related specs for context)

## Scope

### Can Read
(Paths this reviewer examines)

### Cannot Touch
| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input
(TypeScript interface - what to review)

## Output
(Compliance report format)

### Verify Before Completion
(Checklist before reporting)

## Workflow
(Numbered steps)

## Validation
This agent validates others - no self-validation needed.

## Delegation
| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
```

## Rules

### Must

1. Read domain spec before reviewing
2. Check every rule from the spec
3. Include line numbers for violations
4. Provide clear verdict (APPROVED/NEEDS FIXES)
5. Be objective — check facts, not style preferences
6. Report findings in structured format

### Must Not

1. Modify any files (READ-ONLY)
2. Skip rules from the spec
3. Make subjective judgments beyond spec
4. Approve with known violations
5. Create or delete files
6. Touch task files

## Standard Workflow

```
1. Read contract      — Understand review scope
2. Read domain spec   — Know the rules
3. Locate target      — Find file(s) to review
4. Check each rule    — Systematic validation
5. Document findings  — Note violations with line numbers
6. Report             — Return compliance report
```

## Output Format

Reviewers produce a compliance report:

```markdown
## Review: {ComponentName}

**Location:** `path/to/component/`
**Reviewed:** {timestamp}

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| {Rule 1 from spec} | PASS/FAIL | {details or line number} |
| {Rule 2 from spec} | PASS/FAIL | {details or line number} |
| ... | ... | ... |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

## Validation

Reviewers validate others — they don't have self-validators.

If a review is disputed, the domain spec is the source of truth.

## Anti-Patterns

### Don't: Make subjective judgments

```markdown
<!-- WRONG -->
| Code style | FAIL | Could be cleaner |
```

**Why:** Only check objective rules from the spec.

### Don't: Approve with violations

```markdown
<!-- WRONG -->
### Verdict
APPROVED (minor issues can be fixed later)
```

**Why:** Either it complies or it doesn't. No partial approval.

### Don't: Skip rules

```markdown
<!-- WRONG -->
### Compliance Check
| Default export | PASS | Has default export |
<!-- Missing: Props interface, no viewport units, etc. -->
```

**Why:** Every rule in the spec must be checked.

### Don't: Forget line numbers

```markdown
<!-- WRONG -->
### Issues Found
- Uses position: fixed somewhere
```

**Why:** Builder needs to know exactly where to fix.

### Do: Be thorough and specific

```markdown
<!-- CORRECT -->
### Issues Found

1. **Line 23:** Uses `position: fixed` — violates "No position fixed/sticky" rule
2. **Line 45:** Missing CSS var fallback for `--widget-spacing`
3. **Line 12:** Props interface not exported

### Verdict

NEEDS FIXES — 3 violations found. See issues above.
```

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| Technical Director | Receives from | Review requests |
| Domain Spec | Reads | Rules to check against |
| Builder Output | Reads | Code to review |
| Builder | Reports to | Via compliance report |
