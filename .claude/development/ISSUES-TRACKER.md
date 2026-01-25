# Issues Tracker

> Generated: 2026-01-24
> Source: Agent verification + Knowledge coverage analysis

---

## Summary

| Category | Count | Priority |
|----------|-------|----------|
| Agent Path Mismatches | 7 | High |
| Missing Agent Artifacts | 1 | High |
| Missing Referenced Files | 2 | Medium |
| Missing Reviewers | 2 | Medium |
| Orphaned Analysts (no matching spec) | 5 | Low |
| High Token Coordinators | 2 | Info |

---

## High Priority

### 1. Agent Contract Path Mismatches

**Problem:** 7 agent contracts reference nested paths (`domain/domain.spec.md`) but the actual file structure uses flat paths (`domain.spec.md`).

| # | Agent | Contract Path (Wrong) | Actual Path (Correct) |
|---|-------|----------------------|----------------------|
| 1 | `chrome-builder` | `.../content/chrome/chrome.spec.md` | `.../content/chrome.spec.md` |
| 2 | `feature-builder` | `.../content/feature/feature.spec.md` | `.../content/feature.spec.md` |
| 3 | `behaviour-builder` | `.../experience/behaviour/behaviour.spec.md` | `.../experience/behaviour.spec.md` |
| 4 | `driver-builder` | `.../experience/driver/driver.spec.md` | `.../experience/driver.spec.md` |
| 5 | `trigger-builder` | `.../experience/trigger/trigger.spec.md` | `.../experience/trigger.spec.md` |
| 6 | `provider-builder` | `.../experience/provider/provider.spec.md` | `.../experience/provider.spec.md` |
| 7 | `renderer-reviewer` | `.../renderer/renderer.spec.md` | `.../components/renderer/renderer.spec.md` |

**Fix:** Update each agent contract's Knowledge section to use correct flat paths.

**Files to edit:**
- `.claude/architecture/agentic-framework/chrome-builder.agent.md`
- `.claude/architecture/agentic-framework/feature-builder.agent.md`
- `.claude/architecture/agentic-framework/behaviour-builder.agent.md`
- `.claude/architecture/agentic-framework/driver-builder.agent.md`
- `.claude/architecture/agentic-framework/trigger-builder.agent.md`
- `.claude/architecture/agentic-framework/provider-builder.agent.md`
- `.claude/architecture/agentic-framework/renderer-reviewer.agent.md`

---

### 2. Missing Agent: parity-agent

**Problem:** `parity-agent` is referenced in the system but has no artifacts.

**Missing files:**
- `.claude/agents/parity-agent.md` (entry point)
- `.claude/architecture/agentic-framework/parity-agent.agent.md` (contract)
- `.claude/architecture/agentic-framework/parity-agent.validator.ts` (validator)

**Fix:** Either create the agent using `/agent create parity-agent` OR remove all references to it.

**Decision needed:** What is parity-agent supposed to do? If unknown, remove the reference.

---

## Medium Priority

### 3. Missing Referenced Files (inventory-agent)

**Problem:** `inventory-agent` contract references files that don't exist.

| Missing File | Referenced In |
|--------------|---------------|
| `.claude/architecture/CREATIVESHIRE.md` | inventory-agent primary knowledge |
| `.claude/development/migration-patterns.md` | inventory-agent primary knowledge |

**Fix options:**
1. Create these files with appropriate content
2. Update inventory-agent contract to reference existing files

---

### 4. Missing Reviewers for Specs

**Problem:** Some specs have builders but no corresponding reviewers.

| Spec | Has Builder | Has Reviewer | Gap |
|------|-------------|--------------|-----|
| `schema.spec.md` | schema-builder | **NONE** | No validation of schema changes |
| `site.spec.md` | site-builder, page-builder | **NONE** | No site config validation |

**Fix:** Create `schema-reviewer` and `site-reviewer` agents using `/agent create`.

---

## Low Priority

### 5. Analyst Agents Without Matching Specs

**Problem:** 5 analyst agents exist but their knowledge domains don't have dedicated specs.

| Agent | Domain | Notes |
|-------|--------|-------|
| `section-analyst` | section | Uses section.spec.md (OK) |
| `widget-analyst` | widget | Uses widget.spec.md (OK) |
| `experience-analyst` | experience | Uses behaviour.spec.md (partial) |
| `chrome-analyst` | chrome | Uses chrome.spec.md (OK) |
| `layout-analyst` | layout | Uses widget.spec.md (indirect) |

**Assessment:** These are coordinator-type agents that analyze across domains. They may not need dedicated specs, but their knowledge coverage should be reviewed.

**Fix:** Review each analyst's knowledge section to ensure it covers what they need to analyze.

---

## Info (No Action Required)

### 6. High Token Coordinators

**Observation:** Two coordinators load very large context via glob patterns.

| Agent | Glob Tokens | Notes |
|-------|-------------|-------|
| `runtime-validator` | 119,387 | Covers all of creativeshire/ |
| `project-assistant` | 80,268 | Covers all architecture docs |

**Assessment:** This is by design - these are broad-scope coordinators. However, consider if they need all this context or if more targeted knowledge would be more efficient.

---

## Action Plan

### Phase 1: Fix Critical Issues (High Priority)

1. [ ] Fix 7 agent contract path mismatches
2. [ ] Resolve parity-agent (create or remove)

### Phase 2: Fill Gaps (Medium Priority)

3. [ ] Create missing files for inventory-agent OR update its contract
4. [ ] Create schema-reviewer agent
5. [ ] Create site-reviewer agent

### Phase 3: Review & Optimize (Low Priority)

6. [ ] Review analyst agents' knowledge coverage
7. [ ] Consider optimizing high-token coordinators

---

*Tracker maintained by project-assistant*
