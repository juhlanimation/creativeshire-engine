# Project Assistant Contract

> Maintains task file hygiene, manages sequential item IDs, and keeps completion indexes accurate.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/coordinator.spec.md` | Coordinator type rules |
| `.claude/architecture/agentic-framework/project-assistant.agent.md` | This contract |
| `.claude/tasks/backlog.md` | Task backlog and item tracking |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/**/*.md` | Agent contracts and documentation |

Add when: Understanding related agent scopes or documentation standards.

## Scope

### Can Touch

```
.claude/tasks/
├── backlog.md                    ✓ Update item IDs
├── current-sprint.md             ✓ Update sprint state
└── completed/
    ├── index.md                  ✓ Update summary tables
    └── ITEM-XXX.md               ✓ Create/update completion records

.claude/development/              ✓ Development documentation
.claude/architecture/**/*.md      ✓ Architecture documentation
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `.claude/architecture/creativeshire/**` | Code files (different specialists) |
| `site/**` | Instance data |
| `app/**` | Routing concern |
| `.claude/agents/**` | Agent entry points (managed by framework) |

## Input

```typescript
interface TaskInput {
  action: 'calculate-next-id' | 'complete-item' | 'fix-gaps' | 'sync-index'
  itemId?: string                // ITEM-XXX format
  title?: string                 // Item title
  type?: string                  // Feature | Bug | Refactor | Migration | etc
  completionDate?: string        // YYYY-MM-DD
  details?: string               // Summary/description
}
```

## Output

| Case | Output |
|------|--------|
| `calculate-next-id` | Next available ID (ITEM-XXX) |
| `complete-item` | Created ITEM-XXX.md file |
| `fix-gaps` | Report of gaps fixed + new ID sequence |
| `sync-index` | Updated index.md with accurate tables |

### Verify Before Completion

- [ ] ID sequence is sequential (no gaps)
- [ ] Index.md tables match actual files
- [ ] All files use valid ITEM-XXX format
- [ ] Validator passes (exit 0)

## Workflow

1. **Read task files** — Scan completed/ and backlog.md
2. **Identify state** — Calculate highest ID, find gaps
3. **Perform action** — Create/update files as requested
4. **Validate IDs** — Ensure sequential numbering
5. **Update index** — Sync index.md with reality
6. **Report** — Return affected files and summary

## Validation

Validated by: `./project-assistant.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `technical-director` | None (executes directly) |
