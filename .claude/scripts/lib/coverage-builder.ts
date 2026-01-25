/**
 * Coverage Builder for Knowledge Coverage System
 *
 * Builds an inverted coverage map from parsed agent contracts,
 * showing which agents know about each file in the creativeshire folder.
 */

import * as fs from "fs";
import * as path from "path";
import { AgentContract } from "./contract-parser";
import { getCreativeshireFiles } from "./folder-expander.js";

// ============================================================================
// Types
// ============================================================================

export interface FileCoverage {
  /** Agents that have this file in their knowledge paths */
  knownBy: string[];
  /** Agents that explicitly reference this file (not via glob) */
  explicitlyKnownBy: string[];
  /** Agents that cover this file via glob/folder patterns */
  globKnownBy: string[];
  /** Builder agents that can write to this file (outputScope) */
  writableBy: string[];
  /** Reviewer agents that can read this file (readScope) */
  readableBy: string[];
}

export interface CoverageStats {
  /** Total number of agents analyzed */
  totalAgents: number;
  /** Total number of files in creativeshire */
  totalFiles: number;
  /** Number of files known by at least one agent */
  coveredFiles: number;
  /** Number of files not known by any agent */
  uncoveredFiles: number;
  /** Coverage percentage (0-100) - any coverage */
  coveragePercent: number;
  /** Number of files with explicit (non-glob) coverage */
  explicitlyCoveredFiles: number;
  /** Explicit coverage percentage - the "real" specialist coverage */
  explicitCoveragePercent: number;
  /** Number of files only covered by glob patterns */
  globOnlyFiles: number;
}

/**
 * Per-agent knowledge statistics with token estimates.
 */
export interface AgentKnowledgeStats {
  /** Agent name */
  name: string;
  /** Agent type */
  type: "builder" | "reviewer" | "coordinator";
  /** Number of files explicitly referenced */
  explicitFiles: number;
  /** Number of files covered only via glob patterns */
  globOnlyFiles: number;
  /** Estimated tokens for explicit files */
  explicitTokens: number;
  /** Estimated tokens for glob-only files */
  globTokens: number;
  /** Total estimated tokens */
  totalTokens: number;
  /** List of explicit file paths */
  explicitFilePaths: string[];
  /** List of glob-only file paths */
  globFilePaths: string[];
}

export interface SpecialistCompleteness {
  /** Total builder agents */
  totalBuilders: number;
  /** Builders with their required spec explicitly listed */
  buildersWithSpec: number;
  /** Builder completeness percentage */
  builderPercent: number;
  /** Total reviewer agents */
  totalReviewers: number;
  /** Reviewers with their required spec explicitly listed */
  reviewersWithSpec: number;
  /** Reviewer completeness percentage */
  reviewerPercent: number;
  /** Overall specialist completeness */
  overallPercent: number;
  /** Agents missing their required specs */
  agentsMissingSpecs: Array<{
    agent: string;
    type: "builder" | "reviewer";
    expectedSpec: string;
    actualKnowledge: string[];
  }>;
}

export interface CoverageData {
  /** ISO timestamp when coverage was generated */
  generatedAt: string;
  /** All parsed agent contracts */
  agents: AgentContract[];
  /** Map of file path to coverage information */
  files: Record<string, FileCoverage>;
  /** Coverage statistics */
  stats: CoverageStats;
  /** Specialist completeness metrics */
  specialistCompleteness: SpecialistCompleteness;
  /** List of uncovered file paths */
  uncovered: string[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates an empty FileCoverage object.
 */
function createEmptyCoverage(): FileCoverage {
  return {
    knownBy: [],
    explicitlyKnownBy: [],
    globKnownBy: [],
    writableBy: [],
    readableBy: [],
  };
}

/**
 * Normalizes agent contract paths to match creativeshire file format.
 * Handles various path formats:
 * - `.claude/architecture/creativeshire/...`
 * - `creativeshire/...`
 * - Relative paths without prefix
 *
 * @param contractPath - Path from agent contract
 * @returns Normalized path matching creativeshire file format
 */
function normalizeContractPath(contractPath: string): string {
  let normalized = contractPath.replace(/\\/g, "/");

  // Remove leading ./ if present
  if (normalized.startsWith("./")) {
    normalized = normalized.slice(2);
  }

  // If path starts with creativeshire/, add .claude/architecture/ prefix
  if (
    normalized.startsWith("creativeshire/") &&
    !normalized.startsWith(".claude/architecture/creativeshire/")
  ) {
    normalized = ".claude/architecture/" + normalized;
  }

  return normalized;
}

/**
 * Checks if a file path matches a contract path (which may be a folder or pattern).
 *
 * @param filePath - Actual file path
 * @param contractPath - Path from contract (may be folder or pattern)
 * @returns True if file is covered by contract path
 */
function pathMatches(filePath: string, contractPath: string): boolean {
  const normalizedFile = filePath.replace(/\\/g, "/");
  const normalizedContract = normalizeContractPath(contractPath);

  // Exact match
  if (normalizedFile === normalizedContract) {
    return true;
  }

  // Folder match: contract path ends with / or is a prefix of file path
  if (
    normalizedContract.endsWith("/") ||
    normalizedFile.startsWith(normalizedContract + "/")
  ) {
    const folderPath = normalizedContract.replace(/\/$/, "");
    return normalizedFile.startsWith(folderPath + "/");
  }

  // Pattern match (simplified)
  if (normalizedContract.includes("*")) {
    const regexPattern = normalizedContract
      .replace(/\./g, "\\.")
      .replace(/\*\*/g, "<<<DOUBLE_STAR>>>")
      .replace(/\*/g, "[^/]*")
      .replace(/<<<DOUBLE_STAR>>>/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(normalizedFile);
  }

  return false;
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Builds a coverage map from agent contracts.
 *
 * Process:
 * 1. Get all files in creativeshire folder
 * 2. Initialize empty coverage for each file
 * 3. For each agent, check which files match their paths
 * 4. Calculate coverage statistics
 *
 * @param contracts - Array of parsed agent contracts
 * @param projectRoot - Project root path for file discovery
 * @returns Complete coverage data
 */
export function buildCoverage(
  contracts: AgentContract[],
  projectRoot = "."
): CoverageData {
  // Step 1: Get all creativeshire files
  const creativeshireFiles = getCreativeshireFiles(projectRoot);

  // Step 2: Initialize coverage map
  const files: Record<string, FileCoverage> = {};
  for (const file of creativeshireFiles) {
    files[file] = createEmptyCoverage();
  }

  // Step 3: Process each agent
  for (const agent of contracts) {
    // Process knowledge paths with explicit/glob tracking
    for (const knowledgeDetail of agent.knowledgeDetails) {
      for (const file of creativeshireFiles) {
        if (pathMatches(file, knowledgeDetail.path)) {
          if (!files[file].knownBy.includes(agent.name)) {
            files[file].knownBy.push(agent.name);
          }
          // Track explicit vs glob coverage
          if (knowledgeDetail.isExplicit) {
            if (!files[file].explicitlyKnownBy.includes(agent.name)) {
              files[file].explicitlyKnownBy.push(agent.name);
            }
          } else {
            if (!files[file].globKnownBy.includes(agent.name)) {
              files[file].globKnownBy.push(agent.name);
            }
          }
        }
      }
    }

    // Process output scope (builders only)
    if (agent.type === "builder") {
      for (const scopePath of agent.outputScope) {
        for (const file of creativeshireFiles) {
          if (pathMatches(file, scopePath)) {
            if (!files[file].writableBy.includes(agent.name)) {
              files[file].writableBy.push(agent.name);
            }
          }
        }
      }
    }

    // Process read scope (reviewers only)
    if (agent.type === "reviewer") {
      for (const scopePath of agent.readScope) {
        for (const file of creativeshireFiles) {
          if (pathMatches(file, scopePath)) {
            if (!files[file].readableBy.includes(agent.name)) {
              files[file].readableBy.push(agent.name);
            }
          }
        }
      }
    }
  }

  // Step 4: Calculate statistics
  const totalFiles = creativeshireFiles.length;
  const coveredFiles = Object.values(files).filter(
    (f) => f.knownBy.length > 0
  ).length;
  const uncoveredFiles = totalFiles - coveredFiles;
  const coveragePercent =
    totalFiles > 0 ? Math.round((coveredFiles / totalFiles) * 100) : 0;

  // Calculate explicit vs glob coverage
  const explicitlyCoveredFiles = Object.values(files).filter(
    (f) => f.explicitlyKnownBy.length > 0
  ).length;
  const explicitCoveragePercent =
    totalFiles > 0 ? Math.round((explicitlyCoveredFiles / totalFiles) * 100) : 0;
  const globOnlyFiles = Object.values(files).filter(
    (f) => f.knownBy.length > 0 && f.explicitlyKnownBy.length === 0
  ).length;

  const uncovered = creativeshireFiles.filter(
    (file) => files[file].knownBy.length === 0
  );

  const stats: CoverageStats = {
    totalAgents: contracts.length,
    totalFiles,
    coveredFiles,
    uncoveredFiles,
    coveragePercent,
    explicitlyCoveredFiles,
    explicitCoveragePercent,
    globOnlyFiles,
  };

  // Step 5: Calculate specialist completeness
  const builders = contracts.filter((a) => a.type === "builder");
  const reviewers = contracts.filter((a) => a.type === "reviewer");

  const buildersWithSpec = builders.filter((a) => a.hasRequiredSpec).length;
  const reviewersWithSpec = reviewers.filter((a) => a.hasRequiredSpec).length;

  const totalSpecialists = builders.length + reviewers.length;
  const specialistsWithSpec = buildersWithSpec + reviewersWithSpec;

  const agentsMissingSpecs: SpecialistCompleteness["agentsMissingSpecs"] = [];
  for (const agent of [...builders, ...reviewers]) {
    if (!agent.hasRequiredSpec && agent.expectedSpec) {
      agentsMissingSpecs.push({
        agent: agent.name,
        type: agent.type as "builder" | "reviewer",
        expectedSpec: agent.expectedSpec,
        actualKnowledge: agent.knowledgeDetails
          .filter((k) => k.isPrimary && k.isExplicit)
          .map((k) => k.path),
      });
    }
  }

  const specialistCompleteness: SpecialistCompleteness = {
    totalBuilders: builders.length,
    buildersWithSpec,
    builderPercent:
      builders.length > 0
        ? Math.round((buildersWithSpec / builders.length) * 100)
        : 0,
    totalReviewers: reviewers.length,
    reviewersWithSpec,
    reviewerPercent:
      reviewers.length > 0
        ? Math.round((reviewersWithSpec / reviewers.length) * 100)
        : 0,
    overallPercent:
      totalSpecialists > 0
        ? Math.round((specialistsWithSpec / totalSpecialists) * 100)
        : 0,
    agentsMissingSpecs,
  };

  return {
    generatedAt: new Date().toISOString(),
    agents: contracts,
    files,
    stats,
    specialistCompleteness,
    uncovered,
  };
}

/**
 * Estimates token count for a file based on its content.
 * Uses approximate ratio of 4 characters per token for English text.
 *
 * @param filePath - Path to the file
 * @returns Estimated token count
 */
function estimateFileTokens(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    // Rough estimate: 4 characters per token for typical English/code
    return Math.ceil(stats.size / 4);
  } catch {
    // File doesn't exist or can't be read
    return 0;
  }
}

/**
 * Calculates per-agent knowledge statistics including token estimates.
 *
 * @param coverage - Coverage data
 * @param projectRoot - Project root for resolving file paths
 * @returns Array of agent knowledge stats sorted by total tokens descending
 */
export function calculateAgentKnowledgeStats(
  coverage: CoverageData,
  projectRoot = "."
): AgentKnowledgeStats[] {
  const stats: AgentKnowledgeStats[] = [];

  for (const agent of coverage.agents) {
    // Find files this agent covers explicitly vs via glob
    const explicitFilePaths: string[] = [];
    const globFilePaths: string[] = [];

    for (const [filePath, fileCoverage] of Object.entries(coverage.files)) {
      if (fileCoverage.explicitlyKnownBy.includes(agent.name)) {
        explicitFilePaths.push(filePath);
      } else if (fileCoverage.globKnownBy.includes(agent.name)) {
        globFilePaths.push(filePath);
      }
    }

    // Calculate token estimates
    let explicitTokens = 0;
    for (const file of explicitFilePaths) {
      const fullPath = path.join(projectRoot, file);
      explicitTokens += estimateFileTokens(fullPath);
    }

    let globTokens = 0;
    for (const file of globFilePaths) {
      const fullPath = path.join(projectRoot, file);
      globTokens += estimateFileTokens(fullPath);
    }

    stats.push({
      name: agent.name,
      type: agent.type,
      explicitFiles: explicitFilePaths.length,
      globOnlyFiles: globFilePaths.length,
      explicitTokens,
      globTokens,
      totalTokens: explicitTokens + globTokens,
      explicitFilePaths,
      globFilePaths,
    });
  }

  // Sort by total tokens descending
  return stats.sort((a, b) => b.totalTokens - a.totalTokens);
}

/**
 * Generates an agent knowledge report as a markdown string.
 *
 * @param agentStats - Array of agent knowledge stats
 * @returns Markdown report
 */
export function generateAgentKnowledgeReport(
  agentStats: AgentKnowledgeStats[]
): string {
  const lines: string[] = [];

  lines.push("# Agent Knowledge Report");
  lines.push("");
  lines.push(
    "This report shows how much context each agent would load based on their knowledge paths."
  );
  lines.push("");
  lines.push("**Token estimates** are approximate (4 chars ≈ 1 token).");
  lines.push("");

  // Summary stats
  const totalExplicit = agentStats.reduce((sum, a) => sum + a.explicitTokens, 0);
  const totalGlob = agentStats.reduce((sum, a) => sum + a.globTokens, 0);

  lines.push("## Summary");
  lines.push("");
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Agents | ${agentStats.length} |`);
  lines.push(
    `| Total Explicit Tokens | ${totalExplicit.toLocaleString()} |`
  );
  lines.push(`| Total Glob Tokens | ${totalGlob.toLocaleString()} |`);
  lines.push(
    `| Avg Tokens per Agent | ${Math.round((totalExplicit + totalGlob) / agentStats.length).toLocaleString()} |`
  );
  lines.push("");

  // Main table
  lines.push("## Agent Knowledge Table");
  lines.push("");
  lines.push(
    "| Agent | Type | Explicit Files | Glob Files | Explicit Tokens | Glob Tokens | Total Tokens |"
  );
  lines.push(
    "|-------|------|----------------|------------|-----------------|-------------|--------------|"
  );

  for (const agent of agentStats) {
    lines.push(
      `| ${agent.name} | ${agent.type} | ${agent.explicitFiles} | ${agent.globOnlyFiles} | ${agent.explicitTokens.toLocaleString()} | ${agent.globTokens.toLocaleString()} | ${agent.totalTokens.toLocaleString()} |`
    );
  }

  lines.push("");

  // Breakdown by type
  lines.push("## By Agent Type");
  lines.push("");

  const types = ["builder", "reviewer", "coordinator"] as const;
  for (const type of types) {
    const typeAgents = agentStats.filter((a) => a.type === type);
    if (typeAgents.length === 0) continue;

    const avgExplicit =
      Math.round(
        typeAgents.reduce((sum, a) => sum + a.explicitTokens, 0) /
          typeAgents.length
      );
    const avgGlob =
      Math.round(
        typeAgents.reduce((sum, a) => sum + a.globTokens, 0) / typeAgents.length
      );

    lines.push(`### ${type.charAt(0).toUpperCase() + type.slice(1)}s`);
    lines.push("");
    lines.push(`- Count: ${typeAgents.length}`);
    lines.push(`- Avg Explicit Tokens: ${avgExplicit.toLocaleString()}`);
    lines.push(`- Avg Glob Tokens: ${avgGlob.toLocaleString()}`);
    lines.push("");
  }

  // Agents with high glob dependency
  const highGlobAgents = agentStats.filter(
    (a) => a.globTokens > a.explicitTokens && a.totalTokens > 0
  );
  if (highGlobAgents.length > 0) {
    lines.push("## Agents with High Glob Dependency");
    lines.push("");
    lines.push(
      "These agents load more context from glob patterns than explicit references:"
    );
    lines.push("");
    for (const agent of highGlobAgents) {
      const ratio = Math.round((agent.globTokens / agent.totalTokens) * 100);
      lines.push(`- **${agent.name}**: ${ratio}% glob (${agent.globTokens.toLocaleString()} tokens)`);
    }
    lines.push("");
  }

  // Agents with no explicit knowledge
  const noExplicitAgents = agentStats.filter(
    (a) => a.explicitFiles === 0 && a.globOnlyFiles > 0
  );
  if (noExplicitAgents.length > 0) {
    lines.push("## Agents with No Explicit Knowledge");
    lines.push("");
    lines.push(
      "These agents only cover files through glob patterns (may lack focused knowledge):"
    );
    lines.push("");
    for (const agent of noExplicitAgents) {
      lines.push(`- **${agent.name}**: ${agent.globOnlyFiles} files via glob`);
    }
    lines.push("");
  }

  // Agents with no coverage at all (broken paths)
  const noCoverageAgents = agentStats.filter(
    (a) => a.explicitFiles === 0 && a.globOnlyFiles === 0
  );
  if (noCoverageAgents.length > 0) {
    lines.push("## ⚠️ Agents with No Coverage (Broken Paths)");
    lines.push("");
    lines.push(
      "These agents' knowledge paths don't match any files in creativeshire."
    );
    lines.push("Their paths need to be fixed in their contract files:");
    lines.push("");
    for (const agent of noCoverageAgents) {
      lines.push(`- **${agent.name}** (${agent.type})`);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("*Report generated by Knowledge Coverage System*");

  return lines.join("\n");
}

/**
 * Gets files with multiple agents knowing about them.
 * Useful for identifying overlap and potential coordination points.
 *
 * @param coverage - Coverage data
 * @param minAgents - Minimum number of agents (default: 2)
 * @returns Map of file path to agent names
 */
export function getMultiAgentFiles(
  coverage: CoverageData,
  minAgents = 2
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [file, fileCoverage] of Object.entries(coverage.files)) {
    if (fileCoverage.knownBy.length >= minAgents) {
      result[file] = fileCoverage.knownBy;
    }
  }

  return result;
}

/**
 * Gets coverage summary by folder.
 * Groups files by parent folder and calculates coverage for each.
 *
 * @param coverage - Coverage data
 * @returns Map of folder path to coverage percentage
 */
export function getCoverageByFolder(
  coverage: CoverageData
): Record<string, { total: number; covered: number; percent: number }> {
  const folders: Record<string, { total: number; covered: number }> = {};

  for (const [file, fileCoverage] of Object.entries(coverage.files)) {
    const folder = path.dirname(file).replace(/\\/g, "/");

    if (!folders[folder]) {
      folders[folder] = { total: 0, covered: 0 };
    }

    folders[folder].total++;
    if (fileCoverage.knownBy.length > 0) {
      folders[folder].covered++;
    }
  }

  const result: Record<
    string,
    { total: number; covered: number; percent: number }
  > = {};

  for (const [folder, data] of Object.entries(folders)) {
    result[folder] = {
      ...data,
      percent:
        data.total > 0 ? Math.round((data.covered / data.total) * 100) : 0,
    };
  }

  return result;
}

/**
 * Generates a coverage report as a markdown string.
 *
 * @param coverage - Coverage data
 * @returns Markdown report
 */
export function generateReport(coverage: CoverageData): string {
  const lines: string[] = [];

  lines.push("# Knowledge Coverage Report");
  lines.push("");
  lines.push(`Generated: ${coverage.generatedAt}`);
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push("");
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Agents | ${coverage.stats.totalAgents} |`);
  lines.push(`| Total Files | ${coverage.stats.totalFiles} |`);
  lines.push(`| Covered Files | ${coverage.stats.coveredFiles} |`);
  lines.push(`| Uncovered Files | ${coverage.stats.uncoveredFiles} |`);
  lines.push(`| **Total Coverage** | ${coverage.stats.coveragePercent}% |`);
  lines.push(`| Explicitly Covered | ${coverage.stats.explicitlyCoveredFiles} |`);
  lines.push(`| **Explicit Coverage** | ${coverage.stats.explicitCoveragePercent}% |`);
  lines.push(`| Glob-Only Files | ${coverage.stats.globOnlyFiles} |`);
  lines.push(`| **Specialist Completeness** | ${coverage.specialistCompleteness.overallPercent}% |`);
  lines.push("");

  // Uncovered files
  if (coverage.uncovered.length > 0) {
    lines.push("## Uncovered Files");
    lines.push("");
    lines.push("These files are not in any agent's knowledge:");
    lines.push("");
    for (const file of coverage.uncovered) {
      lines.push(`- \`${file}\``);
    }
    lines.push("");
  }

  // Multi-agent files
  const multiAgent = getMultiAgentFiles(coverage);
  const multiAgentEntries = Object.entries(multiAgent);
  if (multiAgentEntries.length > 0) {
    lines.push("## Multi-Agent Files");
    lines.push("");
    lines.push("These files are known by multiple agents:");
    lines.push("");
    lines.push("| File | Agents |");
    lines.push("|------|--------|");
    for (const [file, agents] of multiAgentEntries) {
      lines.push(`| \`${file}\` | ${agents.join(", ")} |`);
    }
    lines.push("");
  }

  // Coverage by folder
  const byFolder = getCoverageByFolder(coverage);
  lines.push("## Coverage by Folder");
  lines.push("");
  lines.push("| Folder | Covered | Total | % |");
  lines.push("|--------|---------|-------|---|");
  for (const [folder, data] of Object.entries(byFolder).sort()) {
    lines.push(`| \`${folder}\` | ${data.covered} | ${data.total} | ${data.percent}% |`);
  }
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// Test Runner
// ============================================================================

import { parseAllContracts } from "./contract-parser.js";
import { fileURLToPath } from "url";

/**
 * Run tests when this module is executed directly.
 * Use: npx tsx .claude/scripts/lib/coverage-builder.ts
 */
export async function runTests(): Promise<void> {
  console.log("=== Coverage Builder Test ===\n");

  const projectRoot = ".";

  // Parse all contracts
  console.log("--- Parsing Agent Contracts ---");
  const contracts = parseAllContracts(
    ".claude/architecture/agentic-framework/*.agent.md"
  );
  console.log(`Found ${contracts.length} agent contracts\n`);

  // Build coverage
  console.log("--- Building Coverage Map ---");
  const coverage = buildCoverage(contracts, projectRoot);

  // Display results
  console.log("\n--- Coverage Statistics ---");
  console.log(`Total files in creativeshire: ${coverage.stats.totalFiles}`);
  console.log(`Covered files: ${coverage.stats.coveredFiles}`);
  console.log(`Coverage percentage: ${coverage.stats.coveragePercent}%`);

  console.log("\n--- First 5 Uncovered Files ---");
  coverage.uncovered.slice(0, 5).forEach((f) => console.log(`  - ${f}`));
  if (coverage.uncovered.length > 5) {
    console.log(`  ... and ${coverage.uncovered.length - 5} more`);
  }

  console.log("\n--- Files with Multiple Agents ---");
  const multiAgent = getMultiAgentFiles(coverage);
  const multiAgentEntries = Object.entries(multiAgent).slice(0, 5);
  for (const [file, agents] of multiAgentEntries) {
    console.log(`  - ${file}`);
    console.log(`    Known by: ${agents.join(", ")}`);
  }
  if (Object.keys(multiAgent).length > 5) {
    console.log(`  ... and ${Object.keys(multiAgent).length - 5} more`);
  }

  console.log("\n--- Coverage by Folder ---");
  const byFolder = getCoverageByFolder(coverage);
  Object.entries(byFolder)
    .slice(0, 5)
    .forEach(([folder, data]) => {
      console.log(`  ${folder}: ${data.covered}/${data.total} (${data.percent}%)`);
    });
}

// ESM-compatible main module check
const isMain =
  typeof process !== "undefined" &&
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  runTests();
}
