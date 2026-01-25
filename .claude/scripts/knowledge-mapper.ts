#!/usr/bin/env npx tsx

/**
 * Knowledge Mapper CLI
 *
 * Main entry point for the Knowledge Coverage System.
 * Orchestrates contract parsing, coverage building, and report generation.
 *
 * Usage:
 *   npx tsx .claude/scripts/knowledge-mapper.ts [options]
 *
 * Options:
 *   --output=all|table|graph|json   Output format (default: all)
 *   --outdir=path                   Output directory
 *   --agent=name                    Filter to single agent
 *   --min-coverage=N                Fail if coverage below N%
 *   --verbose, -v                   Show detailed output
 *   --help, -h                      Show help
 */

import { mkdirSync, writeFileSync } from "fs";
import { parseAllContracts } from "./lib/contract-parser.js";
import {
  buildCoverage,
  generateReport,
  calculateAgentKnowledgeStats,
  generateAgentKnowledgeReport,
} from "./lib/coverage-builder.js";
import { generateGraphDocument } from "./lib/mermaid-generator.js";
import { generateAnalysisReport } from "./lib/report-generator.js";

// ============================================================================
// Types
// ============================================================================

type OutputFormat = "all" | "table" | "graph" | "json";

interface Args {
  output?: OutputFormat;
  outdir?: string;
  agent?: string;
  minCoverage?: number;
  verbose?: boolean;
  help?: boolean;
  report?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_OUTPUT_DIR =
  ".claude/architecture/agentic-framework/knowledge-map";
const CONTRACTS_PATTERN = ".claude/architecture/agentic-framework/*.agent.md";

// ============================================================================
// Argument Parsing
// ============================================================================

/**
 * Parses command line arguments.
 *
 * @param argv - Command line arguments (process.argv.slice(2))
 * @returns Parsed arguments object
 */
function parseArgs(argv: string[]): Args {
  const args: Args = {};

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--verbose" || arg === "-v") {
      args.verbose = true;
    } else if (arg === "--report") {
      args.report = true;
    } else if (arg.startsWith("--output=")) {
      const value = arg.split("=")[1];
      if (["all", "table", "graph", "json"].includes(value)) {
        args.output = value as OutputFormat;
      } else {
        console.error(`Error: Invalid output format "${value}"`);
        console.error('Valid options: all, table, graph, json');
        process.exit(1);
      }
    } else if (arg.startsWith("--outdir=")) {
      args.outdir = arg.split("=")[1];
    } else if (arg.startsWith("--agent=")) {
      args.agent = arg.split("=")[1];
    } else if (arg.startsWith("--min-coverage=")) {
      const value = parseFloat(arg.split("=")[1]);
      if (isNaN(value) || value < 0 || value > 100) {
        console.error(`Error: Invalid min-coverage value "${arg.split("=")[1]}"`);
        console.error("Must be a number between 0 and 100");
        process.exit(1);
      }
      args.minCoverage = value;
    } else if (arg.startsWith("-")) {
      console.error(`Error: Unknown option "${arg}"`);
      console.error('Use --help for usage information');
      process.exit(1);
    }
  }

  return args;
}

// ============================================================================
// Help Text
// ============================================================================

/**
 * Displays help text and usage information.
 */
function showHelp(): void {
  console.log(`
Knowledge Coverage Mapper

Usage: npx tsx .claude/scripts/knowledge-mapper.ts [options]

Options:
  --output=FORMAT     Output format: all, table, graph, json (default: all)
  --outdir=PATH       Output directory (default: ${DEFAULT_OUTPUT_DIR})
  --agent=NAME        Filter to single agent
  --min-coverage=N    Fail if coverage percentage below N
  --report            Generate AI analysis report (ANALYSIS-REPORT.md)
  --verbose, -v       Show detailed output
  --help, -h          Show this help

Examples:
  npx tsx .claude/scripts/knowledge-mapper.ts                    Generate all outputs
  npx tsx .claude/scripts/knowledge-mapper.ts --output=table     Generate only table
  npx tsx .claude/scripts/knowledge-mapper.ts --output=graph     Generate only graph
  npx tsx .claude/scripts/knowledge-mapper.ts --output=json      Generate only JSON
  npx tsx .claude/scripts/knowledge-mapper.ts --report --verbose Generate analysis report
  npx tsx .claude/scripts/knowledge-mapper.ts --agent=widget-builder --verbose
  npx tsx .claude/scripts/knowledge-mapper.ts --min-coverage=90  Enforce 90% coverage threshold

Output Files:
  COVERAGE-TABLE.md    Markdown table with coverage report
  COVERAGE-GRAPH.md    Mermaid visualization document
  coverage-data.json   Raw coverage data as JSON
  ANALYSIS-REPORT.md   AI-style analysis with recommendations (--report)
`);
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Main entry point for the Knowledge Mapper CLI.
 */
async function main(): Promise<void> {
  try {
    // 1. Parse CLI arguments
    const args = parseArgs(process.argv.slice(2));

    if (args.help) {
      showHelp();
      process.exit(0);
    }

    if (args.verbose) {
      console.log("Knowledge Coverage Mapper");
      console.log("=".repeat(40));
      console.log("");
    }

    // 2. Find and parse all agent contracts
    if (args.verbose) {
      console.log(`Scanning: ${CONTRACTS_PATTERN}`);
    }

    const contracts = parseAllContracts(CONTRACTS_PATTERN);

    if (contracts.length === 0) {
      console.error("Error: No agent contracts found");
      console.error(`Pattern: ${CONTRACTS_PATTERN}`);
      process.exit(1);
    }

    console.log(`Found ${contracts.length} agent contracts`);

    if (args.verbose) {
      for (const contract of contracts) {
        console.log(`  - ${contract.name} (${contract.type}): ${contract.knowledge.length} knowledge docs`);
      }
      console.log("");
    }

    // 3. Filter if --agent specified
    const filtered = args.agent
      ? contracts.filter((c) => c.name === args.agent)
      : contracts;

    if (args.agent && filtered.length === 0) {
      console.error(`Error: Agent "${args.agent}" not found`);
      console.error("Available agents:");
      for (const contract of contracts) {
        console.error(`  - ${contract.name}`);
      }
      process.exit(1);
    }

    if (args.agent && args.verbose) {
      console.log(`Filtered to agent: ${args.agent}`);
      console.log("");
    }

    // 4. Build coverage
    if (args.verbose) {
      console.log("Building coverage map...");
    }

    const coverage = buildCoverage(filtered);

    if (args.verbose) {
      console.log(`Coverage: ${coverage.stats.coveragePercent.toFixed(1)}%`);
      console.log(`Covered: ${coverage.stats.coveredFiles}/${coverage.stats.totalFiles} files`);
      console.log(`Uncovered: ${coverage.stats.uncoveredFiles} files`);
      console.log("");
    }

    // 5. Check threshold
    if (args.minCoverage !== undefined) {
      if (coverage.stats.coveragePercent < args.minCoverage) {
        console.error(
          `Coverage ${coverage.stats.coveragePercent.toFixed(1)}% below threshold ${args.minCoverage}%`
        );
        process.exit(1);
      }
      console.log(
        `Coverage ${coverage.stats.coveragePercent.toFixed(1)}% meets threshold ${args.minCoverage}%`
      );
    }

    // 6. Create output directory
    const outdir = args.outdir || DEFAULT_OUTPUT_DIR;
    mkdirSync(outdir, { recursive: true });

    if (args.verbose) {
      console.log(`Output directory: ${outdir}`);
      console.log("");
    }

    // 7. Generate outputs
    const output = args.output || "all";

    if (output === "all" || output === "table") {
      const table = generateReport(coverage);
      const tablePath = `${outdir}/COVERAGE-TABLE.md`;
      writeFileSync(tablePath, table);
      console.log(`Written: ${tablePath}`);
    }

    if (output === "all" || output === "graph") {
      const graph = generateGraphDocument(coverage);
      const graphPath = `${outdir}/COVERAGE-GRAPH.md`;
      writeFileSync(graphPath, graph);
      console.log(`Written: ${graphPath}`);
    }

    if (output === "all" || output === "json") {
      const jsonPath = `${outdir}/coverage-data.json`;
      writeFileSync(jsonPath, JSON.stringify(coverage, null, 2));
      console.log(`Written: ${jsonPath}`);
    }

    // Always generate agent knowledge report (new feature)
    if (output === "all" || output === "table") {
      const agentStats = calculateAgentKnowledgeStats(coverage);
      const agentReport = generateAgentKnowledgeReport(agentStats);
      const agentPath = `${outdir}/AGENT-KNOWLEDGE.md`;
      writeFileSync(agentPath, agentReport);
      console.log(`Written: ${agentPath}`);
    }

    // Generate analysis report if --report flag is set
    if (args.report) {
      const analysisReport = generateAnalysisReport(coverage);
      const reportPath = `${outdir}/ANALYSIS-REPORT.md`;
      writeFileSync(reportPath, analysisReport);
      console.log(`Written: ${reportPath}`);
    }

    console.log("");
    console.log(`Done! Coverage: ${coverage.stats.coveragePercent.toFixed(1)}%`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// ============================================================================
// Entry Point
// ============================================================================

main();
