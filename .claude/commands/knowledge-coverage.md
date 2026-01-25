---
name: knowledge-coverage
description: Generate knowledge coverage map for the agentic framework.
argument-hint: [--output=FORMAT] [--agent=NAME] [--min-coverage=N] [--report] [--verbose]
---

# knowledge-coverage

> Generate knowledge coverage map for the agentic framework.

## Triggers

- `/knowledge-coverage`
- `/kc`

## Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `--output=FORMAT` | string | Output format: all, table, graph, json (default: all) |
| `--agent=NAME` | string | Filter to single agent |
| `--min-coverage=N` | number | Fail if coverage below N% |
| `--report` | flag | Generate AI analysis report |
| `--verbose` | flag | Show detailed output |

## What It Does

1. Parses all agent contracts from `.claude/architecture/agentic-framework/*.agent.md`
2. Extracts Knowledge sections (what each agent knows)
3. Extracts Scope sections (where each agent can write/read)
4. Builds inverted coverage map (file -> agents)
5. Generates output files to `.claude/architecture/agentic-framework/knowledge-map/`

## Output Files

| File | Content |
|------|---------|
| `COVERAGE-TABLE.md` | Markdown table showing file -> agent coverage |
| `COVERAGE-GRAPH.md` | Mermaid mindmap visualization by layer |
| `coverage-data.json` | Raw coverage data for tooling |
| `ANALYSIS-REPORT.md` | AI analysis with recommendations (when --report) |

## Examples

```bash
# Generate all outputs
/knowledge-coverage

# Check coverage meets threshold
/knowledge-coverage --min-coverage=90

# Show single agent's coverage
/knowledge-coverage --agent=widget-builder --verbose

# Generate only the mermaid graph
/knowledge-coverage --output=graph

# Generate full analysis report with recommendations
/knowledge-coverage --report --verbose
```

## Workflow

Run the knowledge mapper script:

```bash
npx tsx .claude/scripts/knowledge-mapper.ts {args}
```

Report results to user including:
- Number of agents parsed
- Coverage percentage
- Number of covered/uncovered files
- Links to generated output files

## Notes

- This is a read-only operation that doesn't modify any existing files
- All agent contracts are parsed deterministically (no AI variance)
- Output directory is created automatically if it doesn't exist
