# Inventory Agent Contract

> Catalogs existing codebase components for migration tracking without making conversion decisions.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/coordinator.spec.md` | Coordinator type rules |
| `.claude/architecture/creativeshire/index.spec.md` | Target architecture overview |
| `.claude/architecture/creativeshire/core/philosophy.spec.md` | Core architecture principles |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | Widget target patterns |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | Section target patterns |
| `.claude/architecture/creativeshire/components/content/chrome.spec.md` | Chrome target patterns |

Add when: understanding where source files map to in Creativeshire architecture.

## Scope

### Can Touch

```
.claude/tasks/
├── conversion-manifest.md    ✓ (migration tracking)
└── *.md                      ✓ (task documentation)

.claude/development/
├── migration-*.md            ✓ (migration planning)
└── inventory-*.md            ✓ (inventory reports)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `.claude/architecture/creativeshire/*` | Code changes (builders do this) |
| `site/*` | Instance data |
| `app/*` | Routing concern |
| `src/*` | Source code (builders do this) |
| `components/*` | Legacy code (specialists convert) |

## Input

```typescript
interface TaskInput {
  action: 'catalog' | 'update-status' | 'report'
  targetPath?: string        // Specific path to catalog
  statusUpdate?: {
    filePath: string
    newStatus: 'pending' | 'in-progress' | 'converted' | 'verified' | 'cleaned'
    assignedTo?: string
  }
}
```

## Output

| File | Required | Purpose |
|------|----------|---------|
| `.claude/tasks/conversion-manifest.md` | Yes | Maps source files to targets |
| `.claude/development/inventory-report.md` | If needed | Detailed catalog analysis |

### Manifest Format

```markdown
## Conversion Manifest

| Source File | Creativeshire Target | Status | Assigned To |
|-------------|---------------------|--------|-------------|
| `path/to/source.tsx` | `creativeshire/components/content/widget/Name/` | pending | widget-builder |
```

### Status Values

| Status | Meaning |
|--------|---------|
| `pending` | Not started - awaiting assignment |
| `in-progress` | Specialist actively working |
| `converted` | Code written, needs verification |
| `verified` | Parity confirmed |
| `cleaned` | Source removed, complete |

### Verify Before Completion

- [ ] All source files cataloged
- [ ] Valid Creativeshire targets assigned
- [ ] No files skipped or missed
- [ ] Validator passes (exit 0)

## Workflow

1. **Read contract** — Understand scope
2. **Scan codebase** — Identify all source files
3. **Map targets** — Use Creativeshire patterns
4. **Create manifest** — Document mappings
5. **Update status** — Track progress as reported
6. **Validator runs** — Auto on Write/Edit
7. **Report** — Return manifest path

## Validation

Validated by: `./inventory-agent.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (catalogs only) |
