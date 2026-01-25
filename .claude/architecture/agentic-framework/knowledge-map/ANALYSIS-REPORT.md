# Knowledge Coverage Analysis Report

> Generated: 2026-01-25T17:10:00.392Z
> Analysis of 41 agents covering 64 files

---

## Executive Summary

### Coverage Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| **Total Coverage** | 92% | 59/64 files known by any agent |
| **Explicit Coverage** | 61% | 39/64 files with specific references |
| **Glob-Only Files** | 20 | Files only covered via folder/wildcard patterns |
| **Specialist Completeness** | 100% | Builders/reviewers with their required specs |

**Action Required**: Uncovered files need agent assignment

---

## Agent Inventory

| Agent | Type | Knowledge | Output Scope |
|-------|------|-----------|--------------|
| behaviour-builder | builder | 7 docs | creativeshire/components/experience/behaviour |
| chrome-builder | builder | 11 docs | creativeshire/components/content/chrome |
| driver-builder | builder | 8 docs | creativeshire/components/experience/driver |
| feature-builder | builder | 9 docs | creativeshire/components/content/feature |
| page-builder | builder | 5 docs | site/pages, site/config.ts |
| preset-builder | builder | 5 docs | creativeshire/presets, creativeshire/experience/modes, creativeshire/experience/experiences |
| provider-builder | builder | 6 docs | creativeshire/components/experience/provider |
| renderer-builder | builder | 7 docs | creativeshire/renderer |
| schema-builder | builder | 5 docs | creativeshire/schema |
| section-builder | builder | 12 docs | creativeshire/components/content/sections |
| section-composite-builder | builder | 9 docs | creativeshire/components/content/sections/composites |
| site-builder | builder | 5 docs | site |
| trigger-builder | builder | 9 docs | creativeshire/components/experience/trigger |
| widget-builder | builder | 11 docs | creativeshire/components/content/widgets |
| widget-composite-builder | builder | 8 docs | creativeshire/components/content/widgets/composites |
| chrome-analyst | coordinator | 7 docs | (read-only) |
| cleanup-agent | coordinator | 2 docs | .claude/tasks |
| data-analyst | coordinator | 3 docs | (read-only) |
| experience-analyst | coordinator | 8 docs | (read-only) |
| inventory-agent | coordinator | 5 docs | .claude/tasks, .claude/development |
| knowledge-mapper | coordinator | 5 docs | (read-only) |
| layout-analyst | coordinator | 6 docs | (read-only) |
| preset-analyst | coordinator | 4 docs | (read-only) |
| project-assistant | coordinator | 3 docs | .claude/tasks, .claude/development, .claude/architecture/**/*.md |
| runtime-validator | coordinator | 4 docs | .claude/tasks, .claude/logs |
| section-analyst | coordinator | 7 docs | (read-only) |
| style-analyst | coordinator | 4 docs | (read-only) |
| technical-director | coordinator | 14 docs | .claude/tasks, .claude/architecture |
| widget-analyst | coordinator | 7 docs | (read-only) |
| behaviour-reviewer | reviewer | 5 docs | (read-only) |
| chrome-reviewer | reviewer | 8 docs | (read-only) |
| driver-reviewer | reviewer | 6 docs | (read-only) |
| feature-reviewer | reviewer | 9 docs | (read-only) |
| preset-reviewer | reviewer | 5 docs | (read-only) |
| provider-reviewer | reviewer | 6 docs | (read-only) |
| renderer-reviewer | reviewer | 5 docs | (read-only) |
| section-composite-reviewer | reviewer | 9 docs | (read-only) |
| section-reviewer | reviewer | 10 docs | (read-only) |
| trigger-reviewer | reviewer | 8 docs | (read-only) |
| widget-composite-reviewer | reviewer | 8 docs | (read-only) |
| widget-reviewer | reviewer | 8 docs | (read-only) |

---

## Specialist Completeness

This section shows whether builder/reviewer agents have their required spec files explicitly listed in their Primary Knowledge section.

| Type | With Spec | Total | Completeness |
|------|-----------|-------|--------------|
| Builders | 15 | 15 | 100% |
| Reviewers | 12 | 12 | 100% |
| **Overall** | 27 | 27 | **100%** |

*All specialists have their required specs listed.*

---

## Coverage by Layer

| Layer | Files | Covered | Coverage | Primary Agents |
|-------|-------|---------|----------|----------------|
| L0 Schema | 2 | 2 | 100% | knowledge-mapper, project-assistant, schema-builder, technical-director |
| L1 Content | 12 | 12 | 100% | chrome-analyst, chrome-builder, chrome-reviewer, feature-builder, feature-reviewer, inventory-agent, knowledge-mapper, layout-analyst, project-assistant, runtime-validator, schema-builder, section-analyst, section-builder, section-composite-builder, section-composite-reviewer, section-reviewer, style-analyst, technical-director, widget-analyst, widget-builder, widget-composite-builder, widget-composite-reviewer, widget-reviewer |
| L2 Experience | 9 | 9 | 100% | behaviour-builder, behaviour-reviewer, chrome-analyst, chrome-builder, driver-builder, driver-reviewer, experience-analyst, knowledge-mapper, preset-analyst, preset-reviewer, project-assistant, provider-builder, provider-reviewer, renderer-reviewer, schema-builder, section-builder, technical-director, trigger-builder, trigger-reviewer |
| L3 Interface | 1 | 1 | 100% | knowledge-mapper, project-assistant, technical-director |
| L4 Preset | 2 | 2 | 100% | knowledge-mapper, preset-analyst, preset-builder, preset-reviewer, project-assistant, technical-director |
| L5 Site | 2 | 2 | 100% | data-analyst, knowledge-mapper, page-builder, project-assistant, site-builder, technical-director |
| Renderer | 2 | 2 | 100% | knowledge-mapper, project-assistant, renderer-builder, renderer-reviewer, technical-director |
| Layers | 6 | 6 | 100% | data-analyst, knowledge-mapper, preset-analyst, project-assistant, renderer-reviewer, technical-director |
| Core | 5 | 5 | 100% | inventory-agent, knowledge-mapper, project-assistant, technical-director |
| Reference | 7 | 7 | 100% | chrome-analyst, experience-analyst, layout-analyst, project-assistant, section-analyst, style-analyst, widget-analyst |
| Testing | 4 | 4 | 100% | project-assistant |
| Patterns | 5 | 5 | 100% | behaviour-builder, chrome-analyst, chrome-builder, driver-builder, experience-analyst, layout-analyst, project-assistant, section-analyst, section-builder, trigger-builder, widget-analyst, widget-builder |
| Diagrams | 1 | 1 | 100% | project-assistant |
| Other | 6 | 1 | 17% | inventory-agent, knowledge-mapper, project-assistant, runtime-validator, technical-director |

---

## Builder/Reviewer Pairing

| Spec | Builder | Reviewer | Status |
|------|---------|----------|--------|
| `.../content/chrome.spec.md` | chrome-builder | chrome-reviewer | Complete |
| `.../content/feature.spec.md` | feature-builder | feature-reviewer | Complete |
| `.../content/section-composite.spec.md` | section-composite-builder | section-composite-reviewer | Complete |
| `.../content/section.spec.md` | feature-builder | feature-reviewer | Complete |
| `.../content/widget-composite.spec.md` | widget-composite-builder | section-composite-reviewer | Complete |
| `.../content/widget.spec.md` | chrome-builder | chrome-reviewer | Complete |
| `.../experience/behaviour.spec.md` | behaviour-builder | behaviour-reviewer | Complete |
| `.../experience/driver.spec.md` | behaviour-builder | behaviour-reviewer | Complete |
| `.../experience/mode.spec.md` | provider-builder | - | Incomplete |
| `.../experience/provider.spec.md` | provider-builder | driver-reviewer | Complete |
| `.../experience/trigger.spec.md` | behaviour-builder | behaviour-reviewer | Complete |
| `.../preset/preset.spec.md` | preset-builder | preset-reviewer | Complete |
| `.../renderer/renderer.spec.md` | renderer-builder | renderer-reviewer | Complete |
| `.../schema/schema.spec.md` | schema-builder | - | Incomplete |
| `.../site/site.spec.md` | page-builder | - | Incomplete |
| ... | ... | ... | *30 more specs* |

**Summary**: 12/45 specs have complete pairing

---

## Output Scope Analysis

### Write Conflicts (Multiple Writers)

*No write conflicts detected.*

### Orphaned Folders (No Writers)

- `.claude` - 64 files with no builder coverage
- `.claude/architecture` - 64 files with no builder coverage
- `.claude/architecture/creativeshire` - 64 files with no builder coverage
- `.claude/architecture/creativeshire/.obsidian` - 5 files with no builder coverage
- `.claude/architecture/creativeshire/components` - 29 files with no builder coverage
- `.claude/architecture/creativeshire/components/content` - 12 files with no builder coverage
- `.claude/architecture/creativeshire/components/experience` - 9 files with no builder coverage
- `.claude/architecture/creativeshire/components/preset` - 2 files with no builder coverage
- `.claude/architecture/creativeshire/components/renderer` - 2 files with no builder coverage
- `.claude/architecture/creativeshire/components/schema` - 2 files with no builder coverage
- *...and 7 more*

---

## Gap Analysis

### Uncovered Files

- `.claude/architecture/creativeshire/.obsidian/app.json`
- `.claude/architecture/creativeshire/.obsidian/appearance.json`
- `.claude/architecture/creativeshire/.obsidian/core-plugins.json`
- `.claude/architecture/creativeshire/.obsidian/graph.json`
- `.claude/architecture/creativeshire/.obsidian/workspace.json`

### Specs Missing Builders

- `.../core/contracts.spec.md`
- `.../core/extension.spec.md`
- `.../core/glossary.spec.md`
- `.../core/philosophy.spec.md`
- `.../core/platform.spec.md`
- `.../diagrams/index.spec.md`
- `.../creativeshire/index.spec.md`
- `.../layers/content.spec.md`
- `.../layers/experience.spec.md`
- `.../layers/interface.spec.md`
- *...and 19 more*

### Specs Missing Reviewers

- `.../experience/mode.spec.md`
- `.../schema/schema.spec.md`
- `.../site/site.spec.md`
- `.../core/contracts.spec.md`
- `.../core/extension.spec.md`
- `.../core/glossary.spec.md`
- `.../core/philosophy.spec.md`
- `.../core/platform.spec.md`
- `.../diagrams/index.spec.md`
- `.../creativeshire/index.spec.md`
- *...and 22 more*

### Files Only Known by Coordinators

- `.../core/contracts.spec.md`
- `.../core/extension.spec.md`
- `.../core/glossary.spec.md`
- `.../core/philosophy.spec.md`
- `.../core/platform.spec.md`
- `.../diagrams/index.spec.md`
- `.../creativeshire/index.spec.md`
- `.../layers/content.spec.md`
- `.../layers/experience.spec.md`
- `.../layers/interface.spec.md`
- *...and 18 more*

---

## Recommendations

### Critical Priority

1. **Uncovered files need agent assignment**
   - 5 files have no agent coverage
   - Action: Add these files to appropriate agent knowledge sections

### High Priority

1. **Specs missing reviewer coverage**
   - 32 spec files have no reviewer agent
   - Action: Assign reviewer agents to validate spec implementations
1. **Specs missing builder coverage**
   - 29 spec files have no builder agent
   - Action: Assign builder agents to implement specs

### Medium Priority

1. **Orphaned folders detected**
   - 17 folders have no builder output scope
   - Action: Assign builders or mark as read-only reference

### Low Priority

1. **Files known only by coordinators**
   - 28 files lack specialist coverage
   - Action: Consider adding builder/reviewer knowledge for better specialization
1. **Coverage optimization opportunity**
   - 1 layers have coverage below 80%
   - Action: Expand agent knowledge to improve layer coverage

---

*Report generated by Knowledge Coverage System*