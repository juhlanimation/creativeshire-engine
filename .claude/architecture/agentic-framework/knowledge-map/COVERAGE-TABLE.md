# Knowledge Coverage Report

Generated: 2026-01-25T19:24:27.618Z

## Summary

| Metric | Value |
|--------|-------|
| Total Agents | 41 |
| Total Files | 59 |
| Covered Files | 59 |
| Uncovered Files | 0 |
| **Total Coverage** | 100% |
| Explicitly Covered | 39 |
| **Explicit Coverage** | 66% |
| Glob-Only Files | 20 |
| **Specialist Completeness** | 100% |

## Multi-Agent Files

These files are known by multiple agents:

| File | Agents |
|------|--------|
| `.claude/architecture/creativeshire/components/content/chrome.spec.md` | chrome-analyst, chrome-builder, chrome-reviewer, inventory-agent, project-assistant, technical-director |
| `.claude/architecture/creativeshire/components/content/chrome.validator.ts` | chrome-builder, chrome-reviewer |
| `.claude/architecture/creativeshire/components/content/feature.spec.md` | feature-builder, feature-reviewer, project-assistant, section-reviewer, style-analyst, technical-director, widget-builder, widget-reviewer |
| `.claude/architecture/creativeshire/components/content/feature.validator.ts` | feature-builder, feature-reviewer |
| `.claude/architecture/creativeshire/components/content/section-composite.spec.md` | project-assistant, section-analyst, section-composite-builder, section-composite-reviewer, technical-director |
| `.claude/architecture/creativeshire/components/content/section-composite.validator.ts` | section-composite-builder, section-composite-reviewer |
| `.claude/architecture/creativeshire/components/content/section.spec.md` | feature-builder, feature-reviewer, inventory-agent, layout-analyst, project-assistant, runtime-validator, schema-builder, section-analyst, section-builder, section-composite-builder, section-composite-reviewer, section-reviewer, technical-director, widget-builder |
| `.claude/architecture/creativeshire/components/content/section.validator.ts` | section-builder, section-reviewer |
| `.claude/architecture/creativeshire/components/content/widget-composite.spec.md` | project-assistant, section-composite-reviewer, technical-director, widget-analyst, widget-composite-builder, widget-composite-reviewer |
| `.claude/architecture/creativeshire/components/content/widget-composite.validator.ts` | widget-composite-builder, widget-composite-reviewer |
| `.claude/architecture/creativeshire/components/content/widget.spec.md` | chrome-builder, chrome-reviewer, feature-builder, feature-reviewer, inventory-agent, layout-analyst, project-assistant, runtime-validator, schema-builder, section-builder, section-composite-builder, section-reviewer, technical-director, widget-analyst, widget-builder, widget-composite-builder, widget-composite-reviewer, widget-reviewer |
| `.claude/architecture/creativeshire/components/content/widget.validator.ts` | widget-builder, widget-reviewer |
| `.claude/architecture/creativeshire/components/experience/behaviour.spec.md` | behaviour-builder, behaviour-reviewer, chrome-analyst, chrome-builder, driver-builder, driver-reviewer, experience-analyst, preset-reviewer, project-assistant, provider-reviewer, renderer-reviewer, schema-builder, section-builder, technical-director, trigger-builder |
| `.claude/architecture/creativeshire/components/experience/behaviour.validator.ts` | behaviour-builder, behaviour-reviewer |
| `.claude/architecture/creativeshire/components/experience/driver.spec.md` | behaviour-builder, behaviour-reviewer, driver-builder, driver-reviewer, experience-analyst, project-assistant, provider-builder, provider-reviewer, technical-director, trigger-reviewer |
| `.claude/architecture/creativeshire/components/experience/driver.validator.ts` | driver-builder, driver-reviewer |
| `.claude/architecture/creativeshire/components/experience/mode.spec.md` | preset-analyst, project-assistant, provider-builder, technical-director |
| `.claude/architecture/creativeshire/components/experience/provider.spec.md` | driver-reviewer, project-assistant, provider-builder, provider-reviewer, technical-director, trigger-builder, trigger-reviewer |
| `.claude/architecture/creativeshire/components/experience/provider.validator.ts` | provider-builder, provider-reviewer |
| `.claude/architecture/creativeshire/components/experience/trigger.spec.md` | behaviour-builder, behaviour-reviewer, driver-builder, experience-analyst, preset-reviewer, project-assistant, technical-director, trigger-builder, trigger-reviewer |
| `.claude/architecture/creativeshire/components/experience/trigger.validator.ts` | trigger-builder, trigger-reviewer |
| `.claude/architecture/creativeshire/components/preset/preset.spec.md` | preset-analyst, preset-builder, preset-reviewer, project-assistant, technical-director |
| `.claude/architecture/creativeshire/components/preset/preset.validator.ts` | preset-builder, preset-reviewer |
| `.claude/architecture/creativeshire/components/renderer/renderer.spec.md` | project-assistant, renderer-builder, renderer-reviewer, technical-director |
| `.claude/architecture/creativeshire/components/renderer/renderer.validator.ts` | renderer-builder, renderer-reviewer |
| `.claude/architecture/creativeshire/components/schema/schema.spec.md` | project-assistant, schema-builder, technical-director |
| `.claude/architecture/creativeshire/components/site/site.spec.md` | data-analyst, page-builder, project-assistant, site-builder, technical-director |
| `.claude/architecture/creativeshire/components/site/site.validator.ts` | page-builder, site-builder |
| `.claude/architecture/creativeshire/core/contracts.spec.md` | project-assistant, technical-director |
| `.claude/architecture/creativeshire/core/philosophy.spec.md` | inventory-agent, project-assistant, technical-director |
| `.claude/architecture/creativeshire/index.spec.md` | inventory-agent, project-assistant, runtime-validator, technical-director |
| `.claude/architecture/creativeshire/layers/content.spec.md` | project-assistant, technical-director |
| `.claude/architecture/creativeshire/layers/experience.spec.md` | project-assistant, technical-director |
| `.claude/architecture/creativeshire/layers/interface.spec.md` | project-assistant, technical-director |
| `.claude/architecture/creativeshire/layers/preset.spec.md` | preset-analyst, project-assistant, technical-director |
| `.claude/architecture/creativeshire/layers/renderer.spec.md` | project-assistant, renderer-reviewer, technical-director |
| `.claude/architecture/creativeshire/layers/schema.spec.md` | project-assistant, technical-director |
| `.claude/architecture/creativeshire/layers/site-instance.spec.md` | data-analyst, project-assistant, technical-director |
| `.claude/architecture/creativeshire/patterns/common.spec.md` | behaviour-builder, chrome-analyst, chrome-builder, driver-builder, experience-analyst, layout-analyst, project-assistant, section-analyst, section-builder, section-composite-builder, trigger-builder, widget-analyst, widget-builder, widget-composite-builder |
| `.claude/architecture/creativeshire/reference/css-variables.spec.md` | project-assistant, style-analyst |
| `.claude/architecture/creativeshire/reference/naming.spec.md` | chrome-analyst, experience-analyst, layout-analyst, project-assistant, section-analyst, widget-analyst |
| `.claude/architecture/creativeshire/reference/styling.spec.md` | project-assistant, style-analyst |

## Coverage by Folder

| Folder | Covered | Total | % |
|--------|---------|-------|---|
| `.claude/architecture/creativeshire` | 1 | 1 | 100% |
| `.claude/architecture/creativeshire/components/content` | 12 | 12 | 100% |
| `.claude/architecture/creativeshire/components/experience` | 9 | 9 | 100% |
| `.claude/architecture/creativeshire/components/preset` | 2 | 2 | 100% |
| `.claude/architecture/creativeshire/components/renderer` | 2 | 2 | 100% |
| `.claude/architecture/creativeshire/components/schema` | 2 | 2 | 100% |
| `.claude/architecture/creativeshire/components/site` | 2 | 2 | 100% |
| `.claude/architecture/creativeshire/core` | 5 | 5 | 100% |
| `.claude/architecture/creativeshire/diagrams` | 1 | 1 | 100% |
| `.claude/architecture/creativeshire/layers` | 7 | 7 | 100% |
| `.claude/architecture/creativeshire/patterns` | 5 | 5 | 100% |
| `.claude/architecture/creativeshire/reference` | 7 | 7 | 100% |
| `.claude/architecture/creativeshire/testing` | 4 | 4 | 100% |
