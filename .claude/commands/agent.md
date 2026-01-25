---
name: agent
description: Create and verify agents with knowledge-first validation. Ensures agents have domain expertise before they can exist.
argument-hint: <create|verify|list> [name|--all]
---

# Agent Command - Create & Verify Agents

You manage the agent registry. Your job is to create new agents with proper knowledge gates and verify existing agents are correctly configured.

---

## Core Principles

```
┌─────────────────────────────────────────────────────────────────┐
│  ARCHITECTURE (WHAT)  │  AGENTS (HOW)    │  REQUESTS (DO)       │
│  ───────────────────  │  ─────────────   │  ────────────────    │
│  Specs in             │  Agent wiring    │  Backlog items       │
│  creativeshire/       │  in .claude/     │  Implementation      │
│                       │                  │                      │
│  Created by:          │  Created by:     │  Created by:         │
│  Architects (manual)  │  /agent skill    │  /plan, /build       │
└─────────────────────────────────────────────────────────────────┘
```

**KEY RULES:**
1. Specs are sacrosanct - /agent NEVER touches creativeshire/
2. Agents require specs - Cannot create agent if knowledge domain doesn't exist
3. We inform, we don't auto-create - Report what's missing, let architect decide

---

## Commands

| Command | What It Does |
|---------|--------------|
| `/agent create {name}` | Create agent with TD-validated knowledge coverage → PASS/FAIL |
| `/agent verify {name}` | Verify agent config + knowledge coverage → PASS/FAIL |
| `/agent verify --all` | Verify all agents with knowledge coverage → PASS/FAIL summary |
| `/agent fix {name}` | Fix a single agent's knowledge via TD consultation |
| `/agent fix --all` | Fix all agents with incorrect knowledge |
| `/agent list` | List all registered agents |
| `/agent skills` | Show skill-to-agent mappings |

**IMPORTANT:** All create and verify operations include **knowledge coverage validation** that returns PASS or FAIL. An agent cannot be created or considered valid without proper knowledge coverage.

---

## Agent Types

There are **4 distinct agent types**, each with different capabilities:

| Type | Suffix | Tools | Hooks | Writes To | Purpose |
|------|--------|-------|-------|-----------|---------|
| **Builder** | `-builder` | Read, Write, Edit, Glob, Grep | ✓ PostToolUse | `creativeshire/` | Creates/modifies engine code |
| **Reviewer** | `-reviewer` | Read, Glob, Grep | ✗ None | Nothing (read-only) | Validates code quality |
| **Analyst** | `-analyst` | Read, Glob, Grep | ✗ None | `.claude/analysis/` | Analyzes references, creates backlog |
| **Coordinator** | (other) | Read, Write, Edit, Glob, Grep, Task | ✓ PostToolUse | `.claude/tasks/` | Orchestrates other agents |

### Type Inference from Name

```
foo-builder   → type = builder
foo-reviewer  → type = reviewer
foo-analyst   → type = analyst
foo-*         → type = coordinator (default)
```

---

## Verify Mode

Verification has **two phases** that BOTH must pass:

### Phase 1: Structural Validation (Deterministic)

Run the deterministic validator:

```bash
# Single agent
npx tsx .claude/scripts/agent-factory.ts --verify {name}

# All agents
npx tsx .claude/scripts/agent-factory.ts --verify-all

# List
npx tsx .claude/scripts/agent-factory.ts --list

# Show skill mappings
npx tsx .claude/scripts/agent-factory.ts --skills
```

### Phase 2: Knowledge Coverage Validation (Stochastic)

**MANDATORY** - Spawn the `technical-director` agent to validate knowledge coverage.

**Key principle:** Coverage is evaluated based on the agent's **TYPE and RESPONSIBILITIES**, not a universal checklist.

| Agent Type | Required Knowledge | Optional |
|------------|-------------------|----------|
| **Builder** | Domain spec, Type spec, Layer context | Cross-cutting, Skill bundles |
| **Reviewer** | Domain spec, Type spec | Cross-cutting |
| **Analyst** | Analyst spec, Domain spec | Related domains |
| **Coordinator** | Type spec, Agent capabilities | Domain specs (only if domain-specific) |

**Example:** `cleanup-agent` is a coordinator that verifies code removal across domains - it does NOT need a domain spec. Its knowledge needs differ from `widget-builder`.

**Evaluation:**

1. **Request Knowledge Assessment** from TD for the agent
2. **TD evaluates:** "Given this agent's TYPE and RESPONSIBILITIES, does it have adequate knowledge?"
3. **Verdict:**
   - Missing knowledge REQUIRED for responsibilities → **FAIL**
   - Missing OPTIONAL knowledge → **WARNING** (still passes)
   - Has appropriate knowledge for its role → **PASS**

### Final Verdict

```
┌─────────────────────────────────────────────────────┐
│ VERIFICATION: {agent-name}                          │
│                                                     │
│ Phase 1 (Structural):  ✓ PASS / ✗ FAIL             │
│ Phase 2 (Knowledge):   ✓ PASS / ✗ FAIL             │
│                                                     │
│ FINAL: ✓ PASS / ✗ FAIL                             │
│                                                     │
│ Knowledge Coverage:                                 │
│   Primary:      X/Y present                         │
│   Layer:        ✓/✗                                 │
│   Cross-cutting: X/Y present                        │
│   Skill bundles: X/Y present                        │
└─────────────────────────────────────────────────────┘
```

An agent is only valid if BOTH phases pass.

### Issue Categories

| Issue Type | Description | Fix |
|------------|-------------|-----|
| **Missing Entry Point** | `.claude/agents/{name}.md` doesn't exist | Use `/agent create` |
| **Missing Contract** | `.claude/architecture/agentic-framework/{name}.agent.md` doesn't exist | Use `/agent create` |
| **Missing Validator** | Validator file doesn't exist (builders/coordinators only) | Use `/agent create` |
| **Missing Primary Knowledge** | Contract references files that don't exist | Fix path or create spec |
| **Incorrect Knowledge** | TD recommends different knowledge than contract has | Use `/agent fix {name}` |
| **Missing Skill Bundle** | Agent should have skill bundles but doesn't | Use `/agent fix {name}` |
| **Not in Settings** | Agent not registered in settings.json | Add to settings.json |

---

## Fix Mode

For `/agent fix {name}` or `/agent fix --all`, update agent contracts using the **Contractor + Technical Director workflow**.

### What Fix Does

1. **Consults Technical Director** for the correct Knowledge Assignment
2. **Compares** TD's recommendation with current contract
3. **Updates contract** to match TD's recommendation:
   - Adds missing Primary knowledge
   - Adds missing Layer Context
   - Adds missing Cross-Cutting knowledge
   - Adds missing Skill Bundles
   - Removes knowledge that TD says to skip
4. **Re-validates** the agent after fix

### What Fix Does NOT Do

1. **Create missing specs** - That's architecture work
2. **Fix broken primary knowledge paths** - Those need manual review
3. **Create missing validators** - Use `/agent create` for new agents
4. **Modify creativeshire/** - Never touches specs
5. **Override TD's recommendations** - TD is the architecture authority

---

## Create Mode

For `/agent create {name}`, follow this workflow:

### Phase 1: Gather Requirements

| Field | Description | How to Get |
|-------|-------------|------------|
| **Name** | Kebab-case agent name | From command argument |
| **Type** | builder, reviewer, analyst, coordinator | Infer from suffix |
| **Domain** | Knowledge domain | Extract from name (e.g., `widget` from `widget-builder`) |
| **Description** | One-line purpose | Infer or ask user |

**Type Inference:**
```
{domain}-builder   → type = builder
{domain}-reviewer  → type = reviewer
{domain}-analyst   → type = analyst
{anything-else}    → type = coordinator
```

**Domain Extraction:**
```
widget-builder     → domain = widget
section-analyst    → domain = section
data-analyst       → domain = data
technical-director → domain = technical (ask user to clarify)
```

---

### Phase 2: Knowledge Gate (BLOCKING)

Different agent types require different knowledge:

#### For Builders & Reviewers

Check that the **domain spec** exists in creativeshire:

```
Search paths (in order):
1. .claude/architecture/creativeshire/components/content/{domain}.spec.md
2. .claude/architecture/creativeshire/components/experience/{domain}.spec.md
3. .claude/architecture/creativeshire/components/schema/{domain}.spec.md
4. .claude/architecture/creativeshire/components/renderer/{domain}.spec.md
5. .claude/architecture/creativeshire/components/preset/{domain}.spec.md
6. .claude/architecture/creativeshire/components/site/{domain}.spec.md
```

**If found:** Record the path and layer, continue to Phase 3.

**If NOT found:** STOP and report:

```
❌ Cannot create {name}

Missing knowledge domain:
  Required: {domain}.spec.md
  Searched: creativeshire/components/*/

This is an architecture concern. The spec must be created
by an architect before this agent can exist.

/agent DOES NOT create specs.
```

#### For Analysts

Check that **TWO specs** exist:

1. **Analyst meta spec:** `.claude/architecture/agentic-framework/types/analyst.spec.md`
2. **Domain spec:** (same search as builders, OR a custom mapping)

**Domain mapping for analysts:**

| Analyst | Primary Domain Spec |
|---------|---------------------|
| `widget-analyst` | `widget.spec.md` |
| `section-analyst` | `section.spec.md` |
| `chrome-analyst` | `chrome.spec.md` |
| `experience-analyst` | `behaviour.spec.md` |
| `layout-analyst` | `widget.spec.md` (layout widgets) |
| `data-analyst` | `site.spec.md` (site instance data) |
| `preset-analyst` | `preset.spec.md` |
| `style-analyst` | `feature.spec.md` + `reference/styling.spec.md` |

**If analyst.spec.md missing:** STOP - meta knowledge required.

**If domain spec missing:** STOP - domain knowledge required.

#### For Coordinators

Check that the agent has a **clear purpose** and **delegation targets**:

1. Ask user: "What does this coordinator orchestrate?"
2. Verify referenced agents exist
3. No strict spec requirement (coordinators are meta-agents)

---

### Phase 3: Consult Technical Director

Before generating the contract, consult the Technical Director for the **Knowledge Assignment**.

**Request format:**

```markdown
## Knowledge Assignment Request

**Agent:** {name}
**Type:** {builder|reviewer|analyst|coordinator}
**Domain:** {domain}
**Layer:** {content|experience|preset|schema|renderer|site}

Please provide the complete knowledge assignment.
```

**Technical Director will respond with:**

```markdown
## Knowledge Assignment: {name}

### Primary (Must Know)
| Document | Purpose |
|----------|---------|
| `types/{type}.spec.md` | Agent type rules |
| `components/{layer}/{domain}.spec.md` | Domain rules |

### Layer Context
| Document | Purpose |
|----------|---------|
| `layers/{layer}.spec.md` | Understand their layer |

### Cross-Cutting
| Document | Purpose |
|----------|---------|
| `reference/naming.spec.md` | File/component naming |
| `patterns/anti-patterns.spec.md` | Common mistakes |

### Skip (Don't Include)
- {specs to exclude}

### Skill Bundles
| Bundle | Why |
|--------|-----|
| `{skill}/bundles/{bundle}.md` | {reason} |
```

Use this assignment to populate the Knowledge section in the contract.

---

### Phase 4: Generate Artifacts

Generate different artifacts based on agent type, using the **Knowledge Assignment from Phase 3**.

#### 4.1 Contract Template by Type

**Location:** `.claude/architecture/agentic-framework/{name}.agent.md`

##### Builder Contract

```markdown
# {Name} Contract

> {Description}

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst domain rules |
| `.claude/architecture/creativeshire/components/{layer}/{domain}.spec.md` | {Domain} domain rules |

### Additional

| Document | Why |
|----------|-----|
| {skill bundles - auto-injected} | {skill} optimization |

Add when: {context for additional knowledge}

## Scope

### Can Touch

```
creativeshire/components/{layer}/{domain}/
├── *.tsx                    ✓
├── *.ts                     ✓
└── index.ts                 ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/{other-layers}/*` | Different layer |
| `site/*` | Instance data |
| `.claude/tasks/*` | PM responsibility |

## Input

```typescript
interface {Name}Input {
  itemId: string        // ITEM-XXX from backlog
  blueprint: string     // Approach from backlog
  context: string[]     // Key files
  iteration: number     // 1, 2, or 3
  fixList?: string[]    // Issues from previous iteration
}
```

## Output

```typescript
interface {Name}Output {
  filesCreated: string[]
  filesModified: string[]
  notes?: string
}
```

### Verify Before Completion

- [ ] Files in correct location
- [ ] Follows domain spec rules
- [ ] Exports properly configured
- [ ] No layer violations

## Workflow

1. **Read contract** — Understand scope
2. **Read domain spec** — Understand rules
3. **Implement** — Create/modify files
4. **Validate** — Check against spec
5. **Report** — Return file list

## Validation

Validated by: `.claude/architecture/agentic-framework/{name}.validator.ts`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| Technical Director | None |
```

##### Reviewer Contract

```markdown
# {Name} Contract

> {Description} (read-only)

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/creativeshire/components/{layer}/{domain}.spec.md` | {Domain} domain rules |

### Additional

| Document | Why |
|----------|-----|
| {skill bundles - auto-injected} | {skill} optimization |

## Scope

### Can Read

```
creativeshire/components/{layer}/{domain}/     ✓
creativeshire/components/{layer}/*.spec.md     ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| Any file | Reviewers are read-only |

## Input

```typescript
interface {Name}Input {
  filesChanged: string[]    // From builder output
  acceptanceCriteria: string[]
}
```

## Output

```typescript
interface {Name}Output {
  passed: boolean
  issues: Array<{
    file: string
    line?: number
    severity: 'error' | 'warning'
    message: string
    confidence: number  // 0-100, only report >= 80
  }>
}
```

### Verify Before Completion

- [ ] All areas reviewed (architecture, quality, patterns)
- [ ] Only >= 80% confidence issues reported
- [ ] Clear actionable feedback

## Workflow

1. **Read contract** — Understand scope
2. **Read domain spec** — Understand rules
3. **Review files** — Check against spec
4. **Report** — Return issues or "All clear"

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| PM (via /build) | None |
```

##### Analyst Contract

```markdown
# {Name} Contract

> {Description}

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst domain rules |
| `.claude/architecture/creativeshire/components/{layer}/{domain}.spec.md` | {Domain} domain rules |

### Additional

| Document | Why |
|----------|-----|
| {related specs for context} | Understanding patterns |

## Scope

### Can Read

```
External references (websites, source code)
├── Website URLs (via browser automation)
├── Local source paths
└── Git repositories

Internal knowledge:
├── creativeshire/components/{layer}/{domain}*     ✓
├── agentic-framework/types/analyst.spec.md        ✓
└── .claude/analysis/{domain}.md                   ✓ (read for context)
```

### Can Write

```
.claude/analysis/{domain}.md                       ✓ (analysis output)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/*` | Architecture files |
| `.claude/analysis/*.md` (other domains) | Other analysts' domain |
| Any `.tsx`, `.ts`, `.css` files | Analysts don't write code |

## Input

```typescript
interface {Name}Input {
  reference: {
    type: 'website' | 'source' | 'git'
    url?: string
    path?: string
  }
  analysisPath: string  // Path to .claude/analysis/
}
```

## Output

```typescript
interface {Name}Output {
  domain: '{Domain}'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-{Domain}-XXX
    title: string
    reference: string
    description: string
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-{Domain}-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder specified (e.g., {domain}-builder)
- [ ] Output written to `.claude/analysis/{domain}.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read domain spec** — Understand what to look for
4. **Analyze reference** — Using browser or file system
5. **Identify patterns** — {Domain}-specific patterns
6. **Create items** — Write to analysis file
7. **Report** — Return structured output

## Identification Patterns

Look for these {domain} patterns:

| Pattern | Indicators | Common Names |
|---------|------------|--------------|
| {pattern1} | {indicators} | {names} |
| {pattern2} | {indicators} | {names} |

## Validation

Validated by: `.claude/architecture/agentic-framework/validators/analyst.validator.ts {Domain}`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (creates analysis items) |
```

##### Coordinator Contract

```markdown
# {Name} Contract

> {Description}

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/creativeshire/index.spec.md` | Architecture overview |
| `.claude/architecture/creativeshire/core/philosophy.spec.md` | Core principles |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/agentic-framework/*.agent.md` | Know agent capabilities |

## Scope

### Can Touch

```
.claude/tasks/
├── backlog.md          ✓
├── current-sprint.md   ✓
└── archived-tasks.md   ✓
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/*` | Delegate to specialists |
| `site/*` | Instance data |

## Input

```typescript
interface {Name}Input {
  task: string
  context?: string
}
```

## Output

```typescript
interface {Name}Output {
  delegatedTo: string[]
  tasksCreated?: string[]
  notes?: string
}
```

## Workflow

1. **Read contract** — Understand coordination scope
2. **Analyze task** — Identify what needs to be done
3. **Delegate** — Assign to appropriate specialists
4. **Track** — Update task files

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| User/PM | Specialist agents |
```

---

#### 4.2 Validator (Builders & Coordinators Only)

**Location:** `.claude/architecture/agentic-framework/{name}.validator.ts`

```typescript
#!/usr/bin/env npx tsx
/**
 * {Name} Validator
 *
 * Validates {name} outputs against domain rules.
 *
 * Exit codes:
 *   0 = Pass
 *   1 = Validator crashed
 *   2 = Validation failed
 */

// TODO: Implement validation logic based on {domain}.spec.md

console.log(`[{name}-validator] ✓ Pass (stub validator)`);
process.exit(0);
```

**Reviewers and Analysts do NOT get validators** - they don't write code.

---

#### 4.3 Entry Point

**Location:** `.claude/agents/{name}.md`

##### Builder Entry Point

```markdown
# {Title}

Read your contract: `.claude/architecture/agentic-framework/{name}.agent.md`
```

##### Reviewer Entry Point

```markdown
# {Title}

Read your contract: `.claude/architecture/agentic-framework/{name}.agent.md`
```

##### Analyst Entry Point

```markdown
# {Title}

Read your contract: `.claude/architecture/agentic-framework/{name}.agent.md`
```

##### Coordinator Entry Point

```markdown
# {Title}

Read your contract: `.claude/architecture/agentic-framework/{name}.agent.md`
```

---

#### 4.4 Settings.json Update

Add to `.claude/settings.json` → `agentTypes`:

##### Builder Settings

```json
"{name}": {
  "path": ".claude/agents/{name}.md",
  "description": "{description}",
  "tools": ["Glob", "Grep", "Read", "Write", "Edit"],
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "npx tsx .claude/hooks/validators/{layer}-layer.ts"
      }]
    }]
  }
}
```

##### Reviewer Settings

```json
"{name}": {
  "path": ".claude/agents/{name}.md",
  "description": "{description} (read-only)",
  "tools": ["Glob", "Grep", "Read"]
}
```

##### Analyst Settings

```json
"{name}": {
  "path": ".claude/agents/{name}.md",
  "description": "{description}",
  "tools": ["Glob", "Grep", "Read"]
}
```

##### Coordinator Settings

```json
"{name}": {
  "path": ".claude/agents/{name}.md",
  "description": "{description}",
  "tools": ["Glob", "Grep", "Read", "Write", "Edit", "Task"],
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "npx tsx .claude/architecture/agentic-framework/{name}.validator.ts"
      }]
    }]
  }
}
```

---

### Phase 5: Validate (Structural)

Run the deterministic validator:

```bash
npx tsx .claude/scripts/agent-factory.ts --verify {name}
```

If this fails, fix structural issues before proceeding.

---

### Phase 6: Knowledge Coverage Validation (MANDATORY)

Spawn the `technical-director` agent to validate that the newly created agent has adequate knowledge coverage:

**Request to TD:**
```markdown
## Knowledge Coverage Check

**Agent:** {name}
**Type:** {type}
**Domain:** {domain}

Please verify this agent has adequate knowledge to fulfill its responsibilities.

Current knowledge in contract:
- Primary: [list from contract]
- Additional: [list from contract]

Questions:
1. Can this agent fulfill its responsibilities with this knowledge?
2. Is anything critical missing?
3. Is there unnecessary knowledge that should be removed?
```

**TD evaluates and returns:**
```markdown
## Knowledge Coverage: {name}

**Verdict:** ✓ PASS / ✗ FAIL

**Coverage Assessment:**
| Category | Status | Notes |
|----------|--------|-------|
| Primary Knowledge | ✓/✗ | Has domain spec, type spec |
| Layer Context | ✓/✗ | Understands their layer |
| Cross-cutting | ✓/⚠️ | Naming, patterns |
| Skill Bundles | ✓/⚠️ | React, Tailwind if applicable |

**Missing (if FAIL):**
- {what's missing}

**Recommendation:**
- {any adjustments needed}
```

### Final Create Output

```
┌─────────────────────────────────────────────────────┐
│ AGENT CREATED: {name}                               │
│                                                     │
│ Artifacts:                                          │
│   ✓ Contract: agentic-framework/{name}.agent.md    │
│   ✓ Validator: {name}.validator.ts (if applicable) │
│   ✓ Entry: agents/{name}.md                        │
│   ✓ Settings: Updated                               │
│                                                     │
│ Validation:                                         │
│   Phase 5 (Structural):  ✓ PASS                    │
│   Phase 6 (Knowledge):   ✓ PASS / ✗ FAIL           │
│                                                     │
│ FINAL: ✓ PASS / ✗ FAIL                             │
└─────────────────────────────────────────────────────┘
```

**If Phase 6 FAILS:** The agent is created but marked as incomplete. Use `/agent fix {name}` to resolve knowledge gaps.

---

## Analyst Domain Mapping

When creating an analyst, map the domain to the correct spec:

| Analyst Name | Domain | Primary Spec | Analysis Output |
|--------------|--------|--------------|-----------------|
| `widget-analyst` | widget | `content/widget.spec.md` | `.claude/analysis/widgets.md` |
| `section-analyst` | section | `content/section.spec.md` | `.claude/analysis/sections.md` |
| `chrome-analyst` | chrome | `content/chrome.spec.md` | `.claude/analysis/chrome.md` |
| `feature-analyst` | feature | `content/feature.spec.md` | `.claude/analysis/features.md` |
| `experience-analyst` | experience | `experience/behaviour.spec.md` | `.claude/analysis/experience.md` |
| `layout-analyst` | layout | `content/widget.spec.md` | `.claude/analysis/layout.md` |
| `data-analyst` | data | `site/site.spec.md` | `.claude/analysis/data.md` |
| `preset-analyst` | preset | `preset/preset.spec.md` | `.claude/analysis/preset.md` |
| `style-analyst` | style | `content/feature.spec.md` | `.claude/analysis/styles.md` |

---

## Example Sessions

### Create Builder

```
User: /agent create parallax-behaviour-builder

Phase 1: Gathering requirements
  Name: parallax-behaviour-builder
  Type: builder (inferred from -builder suffix)
  Domain: behaviour
  Description: Builds parallax behaviour compute functions

Phase 2: Knowledge Gate
  Checking: creativeshire/components/experience/behaviour.spec.md
  ✓ Spec exists (layer: experience)

Phase 3: Consult Technical Director
  Requesting Knowledge Assignment...

  TD Response:
    Primary: types/builder.spec.md, experience/behaviour.spec.md
    Layer Context: layers/experience.spec.md
    Cross-Cutting: reference/naming.spec.md, patterns/anti-patterns.spec.md
    Skill Bundles: react-best-practices/client-runtime.md

Phase 4: Generating artifacts
  ✓ Contract: agentic-framework/parallax-behaviour-builder.agent.md
  ✓ Validator: parallax-behaviour-builder.validator.ts
  ✓ Entry point: agents/parallax-behaviour-builder.md
  ✓ Settings.json updated

Phase 5: Structural Validation
  ✓ All files exist and paths valid

Phase 6: Knowledge Coverage Validation
  Spawning technical-director to validate coverage...

  TD Assessment:
    Primary Knowledge:    ✓ (2/2 present)
    Layer Context:        ✓ (experience layer understood)
    Cross-cutting:        ✓ (naming, anti-patterns)
    Skill Bundles:        ✓ (client-runtime for behaviours)

┌─────────────────────────────────────────────────────┐
│ AGENT CREATED: parallax-behaviour-builder           │
│                                                     │
│ Phase 5 (Structural):  ✓ PASS                      │
│ Phase 6 (Knowledge):   ✓ PASS                      │
│                                                     │
│ FINAL: ✓ PASS                                      │
└─────────────────────────────────────────────────────┘
```

### Create Analyst

```
User: /agent create data-analyst

Phase 1: Gathering requirements
  Name: data-analyst
  Type: analyst (inferred from -analyst suffix)
  Domain: data
  Description: Identifies content data patterns from external references

Phase 2: Knowledge Gate
  ✓ types/analyst.spec.md exists
  ✓ site/site.spec.md exists (data → site mapping)

Phase 3: Consult Technical Director
  TD Response:
    Primary: types/analyst.spec.md, site/site.spec.md
    Layer Context: layers/site-instance.spec.md
    Cross-Cutting: reference/naming.spec.md
    Skip: experience layer specs
    Skill Bundles: None (analysts don't write code)

Phase 4: Generating artifacts
  ✓ Contract created
  ✓ Entry point created
  ✓ Settings.json updated
  (No validator - analysts are read-only)

Phase 5: Structural Validation
  ✓ All files exist

Phase 6: Knowledge Coverage Validation
  TD Assessment:
    Primary Knowledge:    ✓ (2/2 present)
    Layer Context:        ✓ (site-instance layer)
    Cross-cutting:        ✓ (naming conventions)
    Skill Bundles:        N/A (not applicable)

┌─────────────────────────────────────────────────────┐
│ AGENT CREATED: data-analyst                         │
│                                                     │
│ Phase 5 (Structural):  ✓ PASS                      │
│ Phase 6 (Knowledge):   ✓ PASS                      │
│                                                     │
│ FINAL: ✓ PASS                                      │
└─────────────────────────────────────────────────────┘
```

### Create Agent - Knowledge Coverage FAIL

```
User: /agent create widget-builder

[Phases 1-5 complete...]

Phase 6: Knowledge Coverage Validation
  Spawning technical-director to validate coverage...

  TD Assessment:
    Primary Knowledge:    ✓ (2/2 present)
    Layer Context:        ✗ MISSING layers/content.spec.md
    Cross-cutting:        ⚠️ Missing patterns/anti-patterns.spec.md
    Skill Bundles:        ✗ MISSING react-best-practices bundles

┌─────────────────────────────────────────────────────┐
│ AGENT CREATED: widget-builder                       │
│                                                     │
│ Phase 5 (Structural):  ✓ PASS                      │
│ Phase 6 (Knowledge):   ✗ FAIL                      │
│                                                     │
│ Missing for responsibilities:                       │
│   - Layer context (can't understand content layer) │
│   - React patterns (builds React components)        │
│                                                     │
│ FINAL: ✗ FAIL                                      │
│                                                     │
│ Fix with: /agent fix widget-builder                │
└─────────────────────────────────────────────────────┘
```

### Verify Single Agent

```
User: /agent verify widget-builder

Phase 1: Structural Validation
  Running: npx tsx .claude/scripts/agent-factory.ts --verify widget-builder
  ✓ Entry point exists
  ✓ Contract exists
  ✓ Validator exists
  ✓ In settings.json
  ✓ All knowledge paths resolve

Phase 2: Knowledge Coverage Validation
  Spawning technical-director...

  TD Assessment:
    Can agent fulfill responsibilities? YES
    Primary Knowledge:    ✓ (4/4)
    Layer Context:        ✓
    Cross-cutting:        ✓ (8/8)
    Skill Bundles:        ✓ (React, Tailwind)

┌─────────────────────────────────────────────────────┐
│ VERIFICATION: widget-builder                        │
│                                                     │
│ Phase 1 (Structural):  ✓ PASS                      │
│ Phase 2 (Knowledge):   ✓ PASS                      │
│                                                     │
│ FINAL: ✓ PASS                                      │
└─────────────────────────────────────────────────────┘
```

### Verify All Agents

```
User: /agent verify --all

Phase 1: Structural Validation (all agents)
  Running: npx tsx .claude/scripts/agent-factory.ts --verify-all
  41/41 structurally valid

Phase 2: Knowledge Coverage Validation
  Spawning technical-director for batch assessment...

  [TD reviews each agent's knowledge coverage]

┌─────────────────────────────────────────────────────┐
│ VERIFICATION SUMMARY                                │
│                                                     │
│ Total Agents: 41                                    │
│                                                     │
│ Phase 1 (Structural):                              │
│   ✓ PASS: 41                                       │
│   ✗ FAIL: 0                                        │
│                                                     │
│ Phase 2 (Knowledge Coverage):                      │
│   ✓ PASS: 40                                       │
│   ✗ FAIL: 1                                        │
│                                                     │
│ Failed Knowledge Coverage:                          │
│   - new-builder (missing React skill bundles)      │
│     → Builds React components but lacks patterns   │
│                                                     │
│ Notes:                                              │
│   - cleanup-agent: PASS (coordinator, no domain)   │
│   - data-analyst: PASS (has analyst + site specs)  │
│                                                     │
│ OVERALL: ⚠️ 1 agent needs attention                │
│                                                     │
│ Fix with: /agent fix --all                         │
└─────────────────────────────────────────────────────┘
```

---

## What /agent NEVER Does

1. **Creates specs** - That's architecture work, needs an architect
2. **Modifies creativeshire/** - Sacrosanct, architecture-only
3. **Bypasses knowledge gate** - No agent without spec
4. **Auto-fixes broken paths** - Reports issues, user decides
5. **Gives validators to read-only agents** - Reviewers/Analysts don't need them
