# Agentic Framework Restructure Plan

> Aligning with Anthropic's Agent Skills model while preserving what works.

## Philosophy Shift

| Old Model | New Model |
|-----------|-----------|
| 41 specialized agents with explicit contracts | 5 generic agents that read relevant specs |
| Knowledge pre-mapped with token budgets | Progressive disclosure - load as needed |
| Command maps prescribing exact flow | Skills with workflows Claude navigates |
| Validators on every write | Simplified validation (tsc + runtime) |
| Separate commands and agents | Commands are skills with subagent hints |

## Current → New Structure

```
CURRENT (169 files)                    NEW (~50 files)
========================               ========================

.claude/                               .claude/
├── architecture/                      ├── skills/
│   ├── agentic-framework/             │   ├── creativeshire/
│   │   ├── 41 *.agent.md  ────────────│   │   ├── SKILL.md (main entry)
│   │   ├── types/*.spec.md            │   │   ├── agents/
│   │   ├── command-maps/*  ───────────│   │   │   ├── builder.md
│   │   ├── knowledge-map/*            │   │   │   ├── reviewer.md
│   │   └── *.validator.ts             │   │   │   ├── coordinator.md
│   │                                  │   │   │   ├── analyst.md
│   ├── creativeshire/                 │   │   │   └── validator.md
│   │   ├── core/* ────────────────────│   │   ├── specs/  (symlink or move)
│   │   ├── layers/*                   │   │   │   ├── core/
│   │   ├── components/* ──────────────│   │   │   ├── layers/
│   │   ├── patterns/*                 │   │   │   ├── components/
│   │   ├── reference/*                │   │   │   ├── patterns/
│   │   └── diagrams/*                 │   │   │   └── reference/
│   │                                  │   │   └── workflows/
│   └── templates/*                    │   │       ├── plan.md
│                                      │   │       ├── build.md
├── commands/  ────────────────────────│   │       ├── validate.md
│   ├── plan.md                        │   │       └── fix.md
│   ├── build.md                       │   │
│   ├── validate.md                    │   ├── react-best-practices/ (keep)
│   └── fix.md                         │   └── tailwind-v4/ (keep)
│                                      │
├── skills/                            ├── hooks/
│   ├── react-best-practices/ (keep)   │   └── validators/
│   └── tailwind-v4/ (keep)            │       └── typescript.ts
│                                      │
├── hooks/                             └── settings.json (minimal)
│   └── validators/
│       ├── 15+ validators ────────────(consolidated to 1-2)
│       └── _shared/*
│
├── scripts/
│   ├── agent-factory.ts ──────────────(remove - not needed)
│   └── knowledge-mapper.ts ───────────(remove - not needed)
│
└── settings.json (472 lines) ─────────(~50 lines)
```

## The Main Skill: creativeshire

### SKILL.md (Progressive Disclosure Entry Point)

```markdown
---
name: creativeshire
description: Build websites using the Creativeshire engine architecture. Use when building widgets, sections, chrome, behaviours, drivers, triggers, presets, or any component of the engine.
---

# Creativeshire Engine

A layered architecture for building animated, interactive websites.

## When to Use This Skill

- Building new components (widgets, sections, chrome)
- Adding animations/interactions (behaviours, drivers, triggers)
- Configuring site presets
- Understanding the engine architecture

## Quick Reference

| Layer | Purpose | Spec |
|-------|---------|------|
| Schema | TypeScript types | `specs/layers/schema.spec.md` |
| Content | Widgets, sections, chrome | `specs/layers/content.spec.md` |
| Experience | Behaviours, drivers, triggers | `specs/layers/experience.spec.md` |
| Renderer | Schema → React | `specs/layers/renderer.spec.md` |
| Preset | Bundled configs | `specs/layers/preset.spec.md` |

## Workflows

For multi-step tasks, read the relevant workflow:

| Command | Workflow | When |
|---------|----------|------|
| `/plan` | `workflows/plan.md` | New feature, investigation |
| `/build` | `workflows/build.md` | Implement from backlog |
| `/validate` | `workflows/validate.md` | Review before merge |
| `/fix` | `workflows/fix.md` | Quick fix, known cause |

## Agents

For complex tasks, use specialized subagents:

| Agent | Use For | Spec |
|-------|---------|------|
| builder | Creating/modifying components | `agents/builder.md` |
| reviewer | Checking architecture compliance | `agents/reviewer.md` |
| coordinator | Planning and delegating | `agents/coordinator.md` |
| analyst | Exploring external references | `agents/analyst.md` |
| validator | Runtime checks | `agents/validator.md` |

## Component Specs

When building a specific component type, read its spec:

| Component | Spec |
|-----------|------|
| Widget | `specs/components/content/widget.spec.md` |
| Section | `specs/components/content/section.spec.md` |
| Chrome | `specs/components/content/chrome.spec.md` |
| Behaviour | `specs/components/experience/behaviour.spec.md` |
| Driver | `specs/components/experience/driver.spec.md` |
| Trigger | `specs/components/experience/trigger.spec.md` |

## Core Patterns

- `specs/patterns/common.spec.md` - Frame pattern, CSS variable bridge
- `specs/patterns/anti-patterns.spec.md` - What NOT to do
- `specs/core/philosophy.spec.md` - Content/experience separation
```

### Agents (5 Generic Instead of 41 Specialized)

#### agents/builder.md

```markdown
---
name: builder
description: Build components for the Creativeshire engine. Reads the relevant spec for the component type being built.
tools: [Glob, Grep, Read, Write, Edit]
---

# Builder Agent

Builds any Creativeshire component by reading the relevant spec.

## Workflow

1. **Identify component type** from task description
2. **Read the spec** for that component type:
   - Widget → `../specs/components/content/widget.spec.md`
   - Section → `../specs/components/content/section.spec.md`
   - Behaviour → `../specs/components/experience/behaviour.spec.md`
   - etc.
3. **Check existing** similar components (DRY)
4. **Implement** following spec rules
5. **Self-validate** with `tsc --noEmit`
6. **Return** files changed

## Boundaries

Each spec defines allowed paths. Respect them.

## Validation

After writes, run:
```bash
npx tsc --noEmit
```

Fix any type errors before returning.
```

#### agents/reviewer.md

```markdown
---
name: reviewer
description: Review components for architecture compliance. Read-only analysis.
tools: [Glob, Grep, Read]
---

# Reviewer Agent

Reviews any Creativeshire component against its spec.

## Workflow

1. **Identify component type** from task
2. **Read the spec** for that type
3. **Read the code** being reviewed
4. **Check compliance**:
   - Follows spec patterns
   - Stays within boundaries
   - No anti-patterns
5. **Return** approval or list of issues
```

#### agents/coordinator.md

```markdown
---
name: coordinator
description: Plan tasks and delegate to builder/reviewer agents.
tools: [Glob, Grep, Read, Write, Edit, Task]
---

# Coordinator Agent

Plans implementation and delegates to specialists.

## Workflow

1. **Analyze scope** - What layers/components are touched?
2. **Read relevant specs** - Understand boundaries
3. **Delegate to builder** for implementation
4. **Delegate to reviewer** for validation (in /validate)
5. **Track progress** in task files

## Task Files

- `.claude/tasks/backlog.md` - Items to build
- `.claude/tasks/current-sprint.md` - Active work
```

#### agents/analyst.md

```markdown
---
name: analyst
description: Analyze external references and create backlog items.
tools: [Glob, Grep, Read, WebFetch]
---

# Analyst Agent

Explores references (URLs, screenshots, existing code) and creates backlog items.

## Workflow

1. **Fetch/read reference** - URL, image, or code
2. **Identify patterns** - What components are needed?
3. **Map to layers** - Content? Experience? Both?
4. **Create backlog items** - With proper format and dependencies
```

#### agents/validator.md

```markdown
---
name: validator
description: Run runtime validation - page loads, no errors.
tools: [Bash]
---

# Validator Agent

Checks runtime behavior of the application.

## Workflow

1. **Verify dev server** running at localhost:3000
2. **Check page loads** without errors
3. **Check console** for errors/warnings
4. **Check hydration** - no mismatches
5. **Return** pass or list of runtime errors
```

### Workflows (Merged Commands + Command Maps)

#### workflows/plan.md

```markdown
# Plan Workflow

> `/plan [description]` or `/plan analyze <url>`

## When to Use

- New feature with unknown scope
- Need to investigate before building
- Analyzing external reference

## Steps

1. **Parse request** - What are we planning?
2. **Explore codebase** - What exists? What patterns?
3. **Analyze scope** - Which layers/components?
4. **Create backlog items** with:
   - Type, Priority, Dependencies
   - Description, Approach
   - Acceptance Criteria

## Output

Items added to `.claude/tasks/backlog.md`

## Subagents

- Use `analyst` for external reference analysis
- Use `coordinator` for scope analysis
```

#### workflows/build.md

```markdown
# Build Workflow

> `/build [item]` or `/build continue`

## When to Use

- Implementing a backlog item
- Continuing in-progress work

## Steps

1. **Pre-flight**
   - Create sprint branch if needed
   - Start dev server
2. **Analyze scope** - What component types?
3. **Build** - Delegate to `builder` agent
4. **Validate runtime** - Delegate to `validator` agent
5. **Commit** to sprint branch

## Parallel Builds

For multiple items (`/build all`):
1. Parse dependencies from backlog
2. Group into waves
3. Launch wave in parallel
4. Wait, commit, next wave

## Output

Code committed to sprint branch, ready for `/validate`

## Subagents

- `builder` - Implements code
- `validator` - Checks runtime
```

## settings.json (Simplified)

```json
{
  "agentTypes": {
    "builder": {
      "path": ".claude/skills/creativeshire/agents/builder.md",
      "description": "Build Creativeshire components",
      "tools": ["Glob", "Grep", "Read", "Write", "Edit"],
      "hooks": {
        "PostToolUse": [{
          "matcher": "Write|Edit",
          "hooks": [{ "type": "command", "command": "npx tsc --noEmit" }]
        }]
      }
    },
    "reviewer": {
      "path": ".claude/skills/creativeshire/agents/reviewer.md",
      "description": "Review components for compliance (read-only)",
      "tools": ["Glob", "Grep", "Read"]
    },
    "coordinator": {
      "path": ".claude/skills/creativeshire/agents/coordinator.md",
      "description": "Plan and delegate tasks",
      "tools": ["Glob", "Grep", "Read", "Write", "Edit", "Task"]
    },
    "analyst": {
      "path": ".claude/skills/creativeshire/agents/analyst.md",
      "description": "Analyze references and create backlog",
      "tools": ["Glob", "Grep", "Read", "WebFetch"]
    },
    "validator": {
      "path": ".claude/skills/creativeshire/agents/validator.md",
      "description": "Runtime validation",
      "tools": ["Bash"]
    }
  }
}
```

## What We Keep

1. **Specs** - All the architecture documentation (just reorganized)
2. **Skills** - react-best-practices, tailwind-v4 (already aligned)
3. **Workflow structure** - /plan → /build → /validate → /fix
4. **Basic validation** - tsc --noEmit, runtime checks

## What We Remove

| Removed | Reason |
|---------|--------|
| 41 specialized agents | 5 generic agents read relevant specs |
| Knowledge coverage tracking | Progressive disclosure handles this |
| Command maps | Merged into workflow docs |
| Composite validators | Single tsc + runtime check |
| agent-factory.ts | Not needed without agent explosion |
| knowledge-mapper.ts | Not needed with progressive disclosure |
| Per-domain validators | Builder reads spec, follows rules |

## Migration Steps

### Phase 1: Create New Structure

```bash
# Create skill directory
mkdir -p .claude/skills/creativeshire/{agents,workflows,specs}

# Move specs (preserve structure)
mv .claude/architecture/creativeshire/* .claude/skills/creativeshire/specs/

# Create new SKILL.md, agents, workflows
# (see templates above)
```

### Phase 2: Simplify settings.json

Replace 472-line settings with ~50-line version (5 agents, 1 validator hook).

### Phase 3: Update CLAUDE.md

Point to new skill structure.

### Phase 4: Test Workflows

Run through /plan, /build, /validate, /fix to verify.

### Phase 5: Cleanup

```bash
# Remove old structure
rm -rf .claude/architecture/agentic-framework/
rm -rf .claude/commands/
rm -rf .claude/scripts/agent-factory.ts
rm -rf .claude/scripts/knowledge-mapper.ts
rm .claude/hooks/validators/*.ts  # except typescript.ts
```

## Comparison: Before/After

### Before: Widget Build

```
1. PM reads backlog
2. PM launches TD (reads 22 files via glob)
3. TD analyzes, returns "widget-builder"
4. PM launches widget-builder
5. widget-builder reads contract (12 knowledge files)
6. widget-builder writes code
7. PostToolUse hook runs content-layer.validator.ts
8. Validator loads _shared/patterns.ts, _shared/boundaries.ts
9. Validator checks regex patterns
10. If pass, builder continues
11. PM launches runtime-validator
12. ... (15+ steps total)
```

### After: Widget Build

```
1. Read /build workflow
2. Identify: building a widget
3. Launch builder agent
4. Builder reads widget.spec.md
5. Builder writes code
6. tsc --noEmit runs (PostToolUse)
7. Launch validator agent
8. Validator checks localhost:3000
9. Commit
```

**Steps: 15+ → 9**
**Files read: 30+ → 3-4**
**Cognitive load: High → Low**

## Open Questions

1. **Keep detailed specs or simplify?**
   - Current: 52 spec files with deep detail
   - Option: Consolidate to ~10 essential specs
   - Recommendation: Keep detailed specs, Claude navigates as needed

2. **Hook validation: tsc only or keep some boundary checks?**
   - Current: 15+ validators with regex patterns
   - Option: Just tsc + runtime
   - Recommendation: tsc + runtime is sufficient; specs guide behavior

3. **Task files structure?**
   - Current: backlog.md, current-sprint.md
   - Keep: Yes, these are useful for workflow continuity

---

## Next Steps

1. [ ] Review this plan
2. [ ] Create new skill structure
3. [ ] Migrate specs
4. [ ] Create simplified agents
5. [ ] Create workflow docs
6. [ ] Update settings.json
7. [ ] Test all workflows
8. [ ] Remove old structure
9. [ ] Update CLAUDE.md
