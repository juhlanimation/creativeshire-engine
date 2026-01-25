# Preset Reviewer Contract

> Reviews preset configurations, modes, and experiences for compliance with preset.spec.md rules.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/creativeshire/components/preset/preset.spec.md` | Preset domain rules |
| `.claude/architecture/creativeshire/components/preset/preset.validator.ts` | Validation logic reference |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | Behaviour reference for defaults |
| `.claude/architecture/creativeshire/components/experience/trigger.spec.md` | Trigger reference for mode triggers |
| `.claude/skills/react-best-practices/bundles/server-components.md` | react-best-practices optimization |

## Scope

### Can Read

```
creativeshire/presets/
├── types.ts                  # SitePreset, Mode, Experience interfaces
├── {preset-name}/
│   ├── index.ts              ✓
│   ├── site.ts               ✓
│   ├── pages/                ✓
│   │   └── *.ts
│   └── chrome/               ✓
│       └── *.ts

creativeshire/experience/modes/
├── types.ts                  ✓
├── registry.ts               ✓
├── {mode-name}/
│   ├── index.ts              ✓
│   └── store.ts              ✓

creativeshire/experience/experiences/
├── types.ts                  ✓
├── registry.ts               ✓
└── {experience-name}.ts      ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | READ-ONLY agent - no modifications |

## Input

```typescript
interface TaskInput {
  target: string                              // Preset/mode/experience path or name
  scope?: 'preset' | 'mode' | 'experience' | 'all'  // Review type
}
```

## Output

Review report in markdown format:

```markdown
## Preset Review: {PresetName}

**Location:** `creativeshire/presets/{preset-name}/`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Named export | PASS/FAIL | {details} |
| Site defaults export | PASS/FAIL | {details} |
| Home page defined | PASS/FAIL | {details} |
| Valid mode reference | PASS/FAIL | {details} |
| No site imports | PASS/FAIL | {details} |
| Chrome regions defined | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

```markdown
## Mode Review: {ModeName}

**Location:** `creativeshire/experience/modes/{mode-name}/`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| ID is kebab-case | PASS/FAIL | {details} |
| Provides array defined | PASS/FAIL | {details} |
| createStore function | PASS/FAIL | {details} |
| Triggers array defined | PASS/FAIL | {details} |
| Section default defined | PASS/FAIL | {details} |
| No DOM manipulation | PASS/FAIL | {details} |
| No site imports | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

```markdown
## Experience Review: {ExperienceName}

**Location:** `creativeshire/experience/experiences/{experience-name}.ts`

### Compliance Check

| Rule | Status | Details |
|------|--------|---------|
| Named export | PASS/FAIL | {details} |
| ID is kebab-case | PASS/FAIL | {details} |
| Mode reference valid | PASS/FAIL | {details} |
| Default wrapper defined | PASS/FAIL | {details} |
| allowBehaviourOverride set | PASS/FAIL | {details} |
| No JSX present | PASS/FAIL | {details} |
| No site imports | PASS/FAIL | {details} |

### Issues Found

{List violations with line numbers, or "None"}

### Verdict

{APPROVED or NEEDS FIXES with summary}
```

### Verify Before Completion

- [ ] All target files reviewed
- [ ] Each rule from spec checked
- [ ] Clear verdict provided

## Workflow

1. **Read contract** - Understand review scope
2. **Read spec** - Know the rules for presets, modes, and experiences
3. **Determine target type** - Preset, mode, experience, or all
4. **Locate files** - Find target(s) to review
5. **Check each rule** - Systematic validation per type
6. **Document findings** - Note violations with line numbers
7. **Report** - Return review in output format

## Validation

This agent validates others - no self-validation needed.

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
