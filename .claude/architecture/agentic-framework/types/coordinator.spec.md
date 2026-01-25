# Coordinator Spec

> Orchestration agents that manage tasks, analyze systems, and delegate to specialists.

## Purpose

Coordinators don't implement — they orchestrate. They analyze requirements, break down work, delegate to specialists, track progress, and ensure quality. They have a birds-eye view of the system but respect domain boundaries.

**Workflow:** Analyze → Plan → Delegate → Track → Verify

## Concepts

| Term | Definition |
|------|------------|
| Coordinator | Agent that orchestrates work without implementing |
| Delegation | Assigning work to a specialist agent |
| Specialist | Builder, reviewer, or analyst that executes domain work |
| Task File | Markdown file tracking work items |
| Architecture | System structure and boundaries |

## Coordinator Types

| Coordinator | Purpose | Key Responsibility |
|-------------|---------|-------------------|
| `technical-director` | Architecture decisions | Delegates to all specialists |
| `project-assistant` | Task hygiene | Manages backlog and sprint files |
| `cleanup-agent` | Legacy removal | Creates cleanup tasks for specialists |
| `inventory-agent` | Codebase cataloging | Tracks migration status |
| `runtime-validator` | Error detection | Runs dev server, reports errors |
| `contractor` | Contract writing | Writes agent contracts with Technical Director |

## Contract Structure

Every coordinator contract MUST have these sections:

```markdown
## Knowledge

### Primary
| Document | Purpose |
|----------|---------|
| `types/coordinator.spec.md` | Coordinator type rules |
| (Architecture docs relevant to role) |

### Additional
(Specs needed for coordination decisions)

## Scope

### Can Touch
(Task files, architecture docs — NOT implementation)

### Cannot Touch
| Path | Reason |
|------|--------|
| `creativeshire/**/*.tsx` | Implementation (delegate to specialists) |
| `creativeshire/**/*.ts` | Implementation (delegate to specialists) |
| `site/**/*` | Instance data (delegate to site-builder) |

## Input
(TypeScript interface)

## Output
(Task assignments, reports, or analysis)

### Verify Before Completion
(Checklist before reporting)

## Workflow
(Numbered steps)

## Delegation
| Reports To | Delegates To |
|------------|--------------|
| {higher coordinator or User} | {specialists} |
```

## Rules

### Must

1. Read relevant architecture docs before deciding
2. Identify correct specialist for each task
3. Provide clear scope in delegations
4. Track work in task files
5. Verify specialist output before closing tasks
6. Respect layer boundaries when delegating

### Must Not

1. Implement code directly (delegate to builders)
2. Review code directly (delegate to reviewers)
3. Cross coordination boundaries without escalation
4. Skip task tracking
5. Delegate to wrong specialist
6. Close tasks without verification

## Delegation Protocol

When delegating to a specialist, include:

```markdown
## Task Assignment

**From:** {Coordinator Name}
**To:** {specialist-agent-name}
**Item:** ITEM-XXX

### Context
{What the user requested, relevant background}

### Scope
{Specific files/folders this specialist should touch}

### Acceptance Criteria
- [ ] {Specific deliverable 1}
- [ ] {Specific deliverable 2}

### Boundaries
- DO: {What this specialist should do}
- DON'T: {What to leave for other specialists}
```

## Standard Workflow

```
1. Analyze request    — Understand what's needed
2. Check architecture — Identify affected domains
3. Find specialists   — Match work to agents
4. Delegate           — Assign with clear scope
5. Track              — Update task files
6. Verify             — Check completion criteria
7. Report             — Return status/results
```

## Output Format

Coordinators produce different outputs based on their role:

### Task Assignment (Technical Director)

```typescript
interface TaskAssignment {
  specialist: string
  item: string
  scope: string[]
  criteria: string[]
}
```

### Cleanup Report (Cleanup Agent)

```typescript
interface CleanupReport {
  status: 'clean' | 'issues_found'
  tasksCreated: number
  filesChecked: string[]
}
```

### Coverage Report (Knowledge Mapper)

```typescript
interface CoverageReport {
  coverage: number
  agents: number
  files: number
  gaps: string[]
}
```

## Specialist Map

Coordinators need to know which specialist handles what:

### Content Layer (L1)

| Domain | Builder | Reviewer |
|--------|---------|----------|
| Widget | `widget-builder` | `widget-reviewer` |
| Section | `section-builder` | `section-reviewer` |
| Chrome | `chrome-builder` | `chrome-reviewer` |
| Feature | `feature-builder` | `feature-reviewer` |

### Experience Layer (L2)

| Domain | Builder | Reviewer |
|--------|---------|----------|
| Behaviour | `behaviour-builder` | `behaviour-reviewer` |
| Driver | `driver-builder` | `driver-reviewer` |
| Trigger | `trigger-builder` | `trigger-reviewer` |
| Provider | `provider-builder` | `provider-reviewer` |

### Higher Layers

| Domain | Builder | Reviewer |
|--------|---------|----------|
| Preset | `preset-builder` | `preset-reviewer` |
| Renderer | `renderer-builder` | `renderer-reviewer` |
| Schema | `schema-builder` | — |
| Site | `site-builder` | — |
| Page | `page-builder` | — |

### Analysis

| Domain | Analyst |
|--------|---------|
| Widget | `widget-analyst` |
| Section | `section-analyst` |
| Chrome | `chrome-analyst` |
| Experience | `experience-analyst` |
| Layout | `layout-analyst` |

## Validation

Coordinators may have validators for their specific outputs:

| Coordinator | Validator |
|-------------|-----------|
| `technical-director` | `technical-director.validator.ts` |
| `cleanup-agent` | (verifies task format) |
| `knowledge-mapper` | `knowledge-mapper.validator.ts` |

## Anti-Patterns

### Don't: Implement directly

```typescript
// WRONG: Coordinator writing component code
// File: creativeshire/components/content/widgets/Text/index.tsx
export default function Text() { ... }
```

**Why:** Coordinators orchestrate, builders implement.

### Don't: Delegate to wrong specialist

```markdown
<!-- WRONG -->
**To:** widget-builder
**Scope:** creativeshire/components/experience/trigger/
```

**Why:** Triggers are `trigger-builder` domain.

### Don't: Skip task tracking

```markdown
<!-- WRONG: Direct delegation without tracking -->
"Go ahead and implement it"
```

**Why:** Work must be tracked in task files.

### Do: Provide clear delegation

```markdown
<!-- CORRECT -->
## Task Assignment

**From:** Technical Director
**To:** widget-builder
**Item:** ITEM-Widget-042

### Context
User needs a new Avatar widget for profile pages.

### Scope
- `creativeshire/components/content/widgets/content/Avatar/`

### Acceptance Criteria
- [ ] Avatar component with size variants (sm, md, lg)
- [ ] Fallback initials when no image
- [ ] Props interface exported

### Boundaries
- DO: Create Avatar widget with variants
- DON'T: Handle click/interaction (that's experience layer)
```

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| User | Receives from | High-level requests |
| Architecture Docs | Reads | System understanding |
| Task Files | Writes | Work tracking |
| Specialists | Delegates to | Implementation |
