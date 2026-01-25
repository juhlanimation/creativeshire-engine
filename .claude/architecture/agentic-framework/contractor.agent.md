# Contractor Contract

> Writes and maintains agent contracts by consulting with the Technical Director for architecture-informed knowledge assignments.

## Purpose

The Contractor writes agent contracts like an HR department onboarding new employees. Instead of guessing what an agent needs to know based on naming conventions, the Contractor **consults with the Technical Director** (the architect) who has full architecture knowledge.

**Workflow:** Consult Architect → Receive Knowledge Assignment → Write Contract → Validate

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/coordinator.spec.md` | Coordinator type rules |
| `.claude/architecture/agentic-framework/types/builder.spec.md` | Builder type rules |
| `.claude/architecture/agentic-framework/types/reviewer.spec.md` | Reviewer type rules |
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/agentic-framework/*.agent.md` | Existing contracts to reference/update |

**Note:** The Contractor does NOT need full architecture knowledge — that's the Technical Director's job.

## Scope

### Can Read

```
.claude/architecture/agentic-framework/
├── types/*.spec.md              ✓ (type specs)
├── *.agent.md                   ✓ (all contracts)
└── validators/                  ✓ (validation references)
```

### Can Write

```
.claude/architecture/agentic-framework/
├── *.agent.md                   ✓ (create/update contracts)
└── types/*.spec.md              ✓ (update type specs)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/**/*` | Architecture specs - Technical Director's domain |
| `*.validator.ts` | Validators are separate concern |
| `.claude/tasks/*` | Task management - Project Assistant's domain |

## Collaboration Protocol

### Consulting the Technical Director

When writing or updating a contract, request a **Knowledge Assignment** from the Technical Director:

```markdown
## Knowledge Assignment Request

**Agent:** {agent-name}
**Type:** builder | reviewer | analyst | coordinator
**Domain:** {domain if applicable}

Please provide:
1. Primary Knowledge (must-read before acting)
2. Layer Context (understanding their place)
3. Cross-cutting Knowledge (naming, patterns, anti-patterns)
4. What to Skip (avoid overload)
```

### Technical Director Response Format

The Technical Director will respond with:

```markdown
## Knowledge Assignment: {agent-name}

**Layer:** {L1 Content | L2 Experience | L3 Interface | etc.}

### Primary (Must Know)
| Document | Purpose |
|----------|---------|
| `types/{type}.spec.md` | Agent type rules |
| `{domain}.spec.md` | Domain rules |

### Layer Context
| Document | Purpose |
|----------|---------|
| `layers/{layer}.spec.md` | Understand their layer |

### Cross-Cutting
| Document | Purpose |
|----------|---------|
| `reference/naming.spec.md` | File/component naming |
| `patterns/anti-patterns.spec.md` | Common mistakes to avoid |

### Related Domains (Optional)
| Document | When |
|----------|------|
| `{related}.spec.md` | When {condition} |

### Skip (Don't Include)
- {layer} layer specs (not their scope)
- {domain} specs (different specialist)

### Skill Bundles
| Bundle | Why |
|--------|-----|
| `{skill}/bundles/{bundle}.md` | {optimization type} |
```

## Input

```typescript
interface ContractorInput {
  mode: 'create' | 'update' | 'audit'
  agent?: string           // Specific agent, or all if empty
  domain?: string          // For new agent creation
  type?: 'builder' | 'reviewer' | 'analyst' | 'coordinator'
}
```

## Output

```typescript
interface ContractorOutput {
  action: 'created' | 'updated' | 'audited'
  agent: string
  changes: {
    primaryKnowledge: string[]
    additionalKnowledge: string[]
    removed: string[]
  }
  consultedDirector: boolean
  validated: boolean
}
```

## Workflow

### Mode: Create (New Agent)

1. **Receive request** — Agent name, type, domain
2. **Consult Technical Director** — Request knowledge assignment
3. **Receive assignment** — Primary, context, cross-cutting, skip
4. **Write contract** — Following contract template
5. **Validate** — Run agent-factory verification
6. **Report** — Return created contract path

### Mode: Update (Existing Agent)

1. **Read current contract** — Understand existing knowledge
2. **Consult Technical Director** — Request updated assignment
3. **Compare** — Current vs recommended
4. **Update contract** — Apply changes to Knowledge section
5. **Validate** — Verify contract still valid
6. **Report** — Summary of changes

### Mode: Audit (All Agents)

1. **List all agents** — Scan *.agent.md files
2. **For each agent** — Request knowledge assignment
3. **Compare** — Current vs recommended
4. **Report discrepancies** — Without auto-fixing
5. **Generate report** — Gaps, outdated references, missing specs

## Contract Template

```markdown
# {Agent Name} Contract

> {One-line description}

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/{type}.spec.md` | {Type} type rules |
| `.claude/architecture/creativeshire/{path}` | {Domain} rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/{path}` | {Reason} |
| `.claude/skills/{skill}/bundles/{bundle}.md` | {skill} optimization |

Add when: {context for loading additional knowledge}

## Scope

### Can Touch

```
{paths this agent can write to}
```

### Cannot Touch

| Path | Reason |
|------|--------|
| {path} | {reason} |

## Input

```typescript
interface TaskInput {
  // Task-specific input
}
```

## Output

{What the agent produces}

### Verify Before Completion

- [ ] {Checklist item}

## Workflow

1. **Read contract** — Understand scope
2. **Read spec** — Know the rules
...

## Validation

Validated by: `./{validator-path}`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| {coordinator} | {specialists or None} |
```

## Knowledge Section Rules

### Primary Knowledge

Primary knowledge is **required reading** before the agent can act:

1. **Type spec** — Always first (builder.spec.md, reviewer.spec.md, etc.)
2. **Domain spec** — The agent's main area of expertise
3. **Validator reference** — If the agent has a validator

### Additional Knowledge

Additional knowledge provides **context** loaded when relevant:

1. **Layer context** — Understanding where they fit
2. **Cross-cutting** — Naming, patterns, anti-patterns
3. **Related domains** — When work overlaps
4. **Skill bundles** — Optimization patterns for tech stack

### "Add when" Clause

Always include a hint for when to load additional knowledge:

```markdown
Add when: {specific condition}
```

Examples:
- "Add when: creating composite components"
- "Add when: implementing scroll-based animations"
- "Add when: integrating with experience layer"

## Validation

After writing/updating contracts:

```bash
npx tsx .claude/scripts/agent-factory.ts --verify-all
```

All agents must pass verification.

## Anti-Patterns

### Don't: Guess based on naming

```markdown
<!-- WRONG -->
widget-builder → must need widget.spec.md (naming convention)
```

**Why:** Consult the Technical Director. Maybe they also need content layer context.

### Don't: Overload with knowledge

```markdown
<!-- WRONG -->
### Primary
| widget.spec.md | ... |
| section.spec.md | ... |
| chrome.spec.md | ... |
| behaviour.spec.md | ... |
| trigger.spec.md | ... |
```

**Why:** Too much primary knowledge. Ask the architect what to skip.

### Don't: Skip the consultation

```markdown
<!-- WRONG -->
"I know what a widget-builder needs, no need to ask"
```

**Why:** Architecture evolves. The Technical Director knows the current state.

### Do: Document the assignment source

```markdown
<!-- CORRECT -->
<!-- Knowledge assigned by Technical Director: 2024-01-25 -->
### Primary
...
```

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/agent` command, Technical Director | None (utility agent) |

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| Technical Director | Consults | Requests knowledge assignments |
| Agent Factory | Uses | Validates contracts |
| All Agents | Updates | Maintains their contracts |
