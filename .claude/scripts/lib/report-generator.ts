/**
 * Report Generator for Knowledge Coverage System
 *
 * Generates comprehensive AI-style analysis reports from coverage data.
 * Provides deterministic analysis with actionable insights.
 */

import { CoverageData, FileCoverage } from "./coverage-builder";
import { getLayer } from "./mermaid-generator";

// ============================================================================
// Types
// ============================================================================

interface BuilderReviewerPairing {
  spec: string;
  hasBuilder: boolean;
  hasReviewer: boolean;
  builder: string | null;
  reviewer: string | null;
  status: "complete" | "incomplete";
}

interface WriteConflict {
  folder: string;
  writers: string[];
  riskLevel: "low" | "medium" | "high";
  reason: string;
}

interface OrphanedFolder {
  folder: string;
  reason: string;
}

interface LayerCoverage {
  layer: string;
  totalFiles: number;
  coveredFiles: number;
  percent: number;
  agents: string[];
}

interface Recommendation {
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
}

// ============================================================================
// Analysis Functions
// ============================================================================

/**
 * Analyzes builder/reviewer pairing for spec files.
 * Checks if specs have both a builder AND a reviewer agent.
 */
function analyzeBuilderReviewerPairing(
  coverage: CoverageData
): BuilderReviewerPairing[] {
  const specs = Object.keys(coverage.files).filter((f) =>
    f.endsWith(".spec.md")
  );
  const results: BuilderReviewerPairing[] = [];

  for (const spec of specs) {
    const agents = coverage.files[spec].knownBy;
    const builderAgent = agents.find((a) => a.endsWith("-builder"));
    const reviewerAgent = agents.find((a) => a.endsWith("-reviewer"));

    results.push({
      spec,
      hasBuilder: !!builderAgent,
      hasReviewer: !!reviewerAgent,
      builder: builderAgent || null,
      reviewer: reviewerAgent || null,
      status: builderAgent && reviewerAgent ? "complete" : "incomplete",
    });
  }

  return results.sort((a, b) => a.spec.localeCompare(b.spec));
}

/**
 * Analyzes output scope for potential write conflicts.
 * Identifies folders where multiple builders can write.
 */
function analyzeWriteConflicts(coverage: CoverageData): WriteConflict[] {
  const folderWriters: Record<string, string[]> = {};

  for (const agent of coverage.agents) {
    if (agent.type !== "builder") continue;

    for (const scope of agent.outputScope) {
      // Normalize scope to folder path
      const folder = scope.replace(/\/$/, "");
      if (!folderWriters[folder]) {
        folderWriters[folder] = [];
      }
      if (!folderWriters[folder].includes(agent.name)) {
        folderWriters[folder].push(agent.name);
      }
    }
  }

  return Object.entries(folderWriters)
    .filter(([_, writers]) => writers.length > 1)
    .map(([folder, writers]) => {
      // Determine risk level based on overlap type
      const samePrefix = writers.every((w) =>
        w.startsWith(writers[0].split("-")[0])
      );
      const riskLevel: WriteConflict["riskLevel"] = samePrefix
        ? "low"
        : writers.length > 2
          ? "high"
          : "medium";

      const reason = samePrefix
        ? "Same component family (likely different subfolders)"
        : `${writers.length} unrelated builders`;

      return { folder, writers, riskLevel, reason };
    })
    .sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });
}

/**
 * Finds folders defined in agents but with no output scope coverage.
 */
function findOrphanedFolders(coverage: CoverageData): OrphanedFolder[] {
  // Get all unique parent folders from files
  const fileFolders = new Set<string>();
  for (const filePath of Object.keys(coverage.files)) {
    const parts = filePath.split("/");
    parts.pop(); // Remove filename
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      fileFolders.add(current);
    }
  }

  // Get all folders covered by output scope
  const coveredFolders = new Set<string>();
  for (const agent of coverage.agents) {
    if (agent.type !== "builder") continue;
    for (const scope of agent.outputScope) {
      const folder = scope.replace(/\/$/, "");
      coveredFolders.add(folder);
      // Also add parent folders as partially covered
      const parts = folder.split("/");
      let current = "";
      for (const part of parts) {
        current = current ? `${current}/${part}` : part;
        coveredFolders.add(current);
      }
    }
  }

  // Find folders with files but no builder coverage
  const orphaned: OrphanedFolder[] = [];
  for (const folder of fileFolders) {
    if (!coveredFolders.has(folder)) {
      // Check if any files in this folder have writers
      const filesInFolder = Object.keys(coverage.files).filter((f) =>
        f.startsWith(folder + "/")
      );
      const hasWriters = filesInFolder.some(
        (f) => coverage.files[f].writableBy.length > 0
      );

      if (!hasWriters && filesInFolder.length > 0) {
        orphaned.push({
          folder,
          reason: `${filesInFolder.length} files with no builder coverage`,
        });
      }
    }
  }

  return orphaned.sort((a, b) => a.folder.localeCompare(b.folder));
}

/**
 * Calculates coverage statistics grouped by architectural layer.
 */
function analyzeCoverageByLayer(coverage: CoverageData): LayerCoverage[] {
  const layers: Record<
    string,
    { total: number; covered: number; agents: Set<string> }
  > = {};

  for (const [filePath, fileCoverage] of Object.entries(coverage.files)) {
    const layer = getLayer(filePath);

    if (!layers[layer]) {
      layers[layer] = { total: 0, covered: 0, agents: new Set() };
    }

    layers[layer].total++;
    if (fileCoverage.knownBy.length > 0) {
      layers[layer].covered++;
      for (const agent of fileCoverage.knownBy) {
        layers[layer].agents.add(agent);
      }
    }
  }

  // Define layer order for sorting
  const layerOrder: Record<string, number> = {
    "L0 Schema": 0,
    "L1 Content": 1,
    "L2 Experience": 2,
    "L3 Interface": 3,
    "L4 Preset": 4,
    "L5 Site": 5,
    Renderer: 6,
    Layers: 7,
    Core: 8,
    Reference: 9,
    Testing: 10,
    Patterns: 11,
    Diagrams: 12,
    Other: 99,
  };

  return Object.entries(layers)
    .map(([layer, data]) => ({
      layer,
      totalFiles: data.total,
      coveredFiles: data.covered,
      percent: data.total > 0 ? Math.round((data.covered / data.total) * 100) : 0,
      agents: Array.from(data.agents).sort(),
    }))
    .sort((a, b) => (layerOrder[a.layer] ?? 99) - (layerOrder[b.layer] ?? 99));
}

/**
 * Finds specs that are missing builders.
 */
function findSpecsWithoutBuilders(coverage: CoverageData): string[] {
  return Object.keys(coverage.files)
    .filter((f) => f.endsWith(".spec.md"))
    .filter((spec) => {
      const agents = coverage.files[spec].knownBy;
      return !agents.some((a) => a.endsWith("-builder"));
    })
    .sort();
}

/**
 * Finds specs that are missing reviewers.
 */
function findSpecsWithoutReviewers(coverage: CoverageData): string[] {
  return Object.keys(coverage.files)
    .filter((f) => f.endsWith(".spec.md"))
    .filter((spec) => {
      const agents = coverage.files[spec].knownBy;
      return !agents.some((a) => a.endsWith("-reviewer"));
    })
    .sort();
}

/**
 * Finds files only known by coordinators (no specialists).
 */
function findCoordinatorOnlyFiles(coverage: CoverageData): string[] {
  return Object.entries(coverage.files)
    .filter(([_, fileCoverage]) => {
      if (fileCoverage.knownBy.length === 0) return false;

      const hasSpecialist = fileCoverage.knownBy.some(
        (a) => a.endsWith("-builder") || a.endsWith("-reviewer")
      );
      return !hasSpecialist;
    })
    .map(([filePath]) => filePath)
    .sort();
}

/**
 * Generates prioritized recommendations based on analysis.
 */
function generateRecommendations(coverage: CoverageData): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Critical: Uncovered files
  if (coverage.uncovered.length > 0) {
    recommendations.push({
      priority: "critical",
      title: "Uncovered files need agent assignment",
      description: `${coverage.uncovered.length} files have no agent coverage`,
      action: "Add these files to appropriate agent knowledge sections",
    });
  }

  // Critical: Low specialist completeness
  if (coverage.specialistCompleteness.overallPercent < 50) {
    recommendations.push({
      priority: "critical",
      title: "Low specialist completeness",
      description: `Only ${coverage.specialistCompleteness.overallPercent}% of specialists have required specs - ${coverage.specialistCompleteness.agentsMissingSpecs.length} agents missing`,
      action: "Update agent contracts to explicitly list their domain spec files in Primary Knowledge",
    });
  }

  // High: Agents missing required specs (if completeness is moderate)
  if (
    coverage.specialistCompleteness.agentsMissingSpecs.length > 0 &&
    coverage.specialistCompleteness.overallPercent >= 50
  ) {
    recommendations.push({
      priority: "high",
      title: "Specialists missing required knowledge",
      description: `${coverage.specialistCompleteness.agentsMissingSpecs.length} agents don't explicitly list their domain specs`,
      action: "Update agent contracts with correct spec file paths in Primary Knowledge",
    });
  }

  // High: Low explicit coverage
  if (
    coverage.stats.explicitCoveragePercent < 30 &&
    coverage.stats.coveragePercent > 80
  ) {
    recommendations.push({
      priority: "high",
      title: "Low explicit coverage despite high total coverage",
      description: `Only ${coverage.stats.explicitCoveragePercent}% explicit vs ${coverage.stats.coveragePercent}% total - coverage is mostly via globs`,
      action: "Replace glob patterns with explicit file references where possible",
    });
  }

  // High: Specs missing reviewers
  const specsWithoutReviewers = findSpecsWithoutReviewers(coverage);
  if (specsWithoutReviewers.length > 0) {
    recommendations.push({
      priority: "high",
      title: "Specs missing reviewer coverage",
      description: `${specsWithoutReviewers.length} spec files have no reviewer agent`,
      action: "Assign reviewer agents to validate spec implementations",
    });
  }

  // High: Specs missing builders
  const specsWithoutBuilders = findSpecsWithoutBuilders(coverage);
  if (specsWithoutBuilders.length > 0) {
    recommendations.push({
      priority: "high",
      title: "Specs missing builder coverage",
      description: `${specsWithoutBuilders.length} spec files have no builder agent`,
      action: "Assign builder agents to implement specs",
    });
  }

  // Medium: Write conflicts
  const conflicts = analyzeWriteConflicts(coverage);
  const highRiskConflicts = conflicts.filter((c) => c.riskLevel === "high");
  if (highRiskConflicts.length > 0) {
    recommendations.push({
      priority: "medium",
      title: "Potential write conflicts detected",
      description: `${highRiskConflicts.length} folders have multiple unrelated builders`,
      action: "Review output scopes to prevent accidental overwrites",
    });
  }

  // Medium: Orphaned folders
  const orphaned = findOrphanedFolders(coverage);
  if (orphaned.length > 0) {
    recommendations.push({
      priority: "medium",
      title: "Orphaned folders detected",
      description: `${orphaned.length} folders have no builder output scope`,
      action: "Assign builders or mark as read-only reference",
    });
  }

  // Low: Coordinator-only files
  const coordinatorOnly = findCoordinatorOnlyFiles(coverage);
  if (coordinatorOnly.length > 5) {
    recommendations.push({
      priority: "low",
      title: "Files known only by coordinators",
      description: `${coordinatorOnly.length} files lack specialist coverage`,
      action: "Consider adding builder/reviewer knowledge for better specialization",
    });
  }

  // Low: Coverage optimization
  const layerCoverage = analyzeCoverageByLayer(coverage);
  const lowCoverageLayers = layerCoverage.filter(
    (l) => l.percent < 80 && l.totalFiles > 0
  );
  if (lowCoverageLayers.length > 0) {
    recommendations.push({
      priority: "low",
      title: "Coverage optimization opportunity",
      description: `${lowCoverageLayers.length} layers have coverage below 80%`,
      action: "Expand agent knowledge to improve layer coverage",
    });
  }

  return recommendations;
}

/**
 * Determines the key finding for the executive summary.
 */
function getKeyFinding(coverage: CoverageData): string {
  const recommendations = generateRecommendations(coverage);
  const critical = recommendations.filter((r) => r.priority === "critical");
  const high = recommendations.filter((r) => r.priority === "high");

  if (critical.length > 0) {
    return `**Action Required**: ${critical[0].title}`;
  }

  // Check specialist completeness
  if (coverage.specialistCompleteness.overallPercent < 50) {
    return `**Attention**: Only ${coverage.specialistCompleteness.overallPercent}% of specialists have their required specs - many agents may not have the knowledge needed for their tasks.`;
  }

  if (high.length > 0) {
    return `**Attention**: ${high[0].title}`;
  }

  if (
    coverage.stats.coveragePercent === 100 &&
    coverage.specialistCompleteness.overallPercent === 100
  ) {
    return "**All Clear**: Full coverage and specialist completeness achieved.";
  }

  if (coverage.stats.explicitCoveragePercent < 50) {
    return `**Attention**: Only ${coverage.stats.explicitCoveragePercent}% explicit coverage - most files are only covered by glob patterns.`;
  }

  return `**Good Standing**: ${coverage.stats.coveragePercent}% total coverage, ${coverage.stats.explicitCoveragePercent}% explicit coverage.`;
}

// ============================================================================
// Report Formatting Functions
// ============================================================================

/**
 * Formats a list of items as markdown bullet points.
 */
function formatList(items: string[], emptyMessage = "None"): string {
  if (items.length === 0) return emptyMessage;
  return items.map((item) => `- \`${item}\``).join("\n");
}

/**
 * Formats agents list for table display.
 * Shows ALL agents sorted alphabetically, no truncation.
 */
function formatAgentsList(agents: string[]): string {
  if (agents.length === 0) return "-";
  return agents.sort().join(", ");
}

/**
 * Gets a short filename from a full path.
 */
function getShortPath(filePath: string): string {
  const parts = filePath.split("/");
  if (parts.length <= 3) return filePath;
  return `.../${parts.slice(-2).join("/")}`;
}

/**
 * Generates the Agent Inventory section showing all agents with their metadata.
 * Sorted by type then name for easy scanning.
 */
function generateAgentInventory(coverage: CoverageData): string {
  const lines: string[] = [];

  lines.push("## Agent Inventory");
  lines.push("");
  lines.push("| Agent | Type | Knowledge | Output Scope |");
  lines.push("|-------|------|-----------|--------------|");

  // Sort agents by type then name
  const sorted = [...coverage.agents].sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
  });

  for (const agent of sorted) {
    const scope =
      agent.outputScope.length > 0
        ? agent.outputScope.join(", ")
        : "(read-only)";
    lines.push(
      `| ${agent.name} | ${agent.type} | ${agent.knowledge.length} docs | ${scope} |`
    );
  }

  lines.push("");
  lines.push("---");
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Generates a comprehensive analysis report from coverage data.
 * This is deterministic analysis (not actual AI) that provides insights.
 *
 * @param coverage - Coverage data from buildCoverage()
 * @returns Markdown formatted analysis report
 */
export function generateAnalysisReport(coverage: CoverageData): string {
  const lines: string[] = [];

  // Perform all analyses
  const pairings = analyzeBuilderReviewerPairing(coverage);
  const conflicts = analyzeWriteConflicts(coverage);
  const orphaned = findOrphanedFolders(coverage);
  const layerCoverage = analyzeCoverageByLayer(coverage);
  const specsWithoutBuilders = findSpecsWithoutBuilders(coverage);
  const specsWithoutReviewers = findSpecsWithoutReviewers(coverage);
  const coordinatorOnly = findCoordinatorOnlyFiles(coverage);
  const recommendations = generateRecommendations(coverage);
  const keyFinding = getKeyFinding(coverage);

  // =========================================================================
  // Header
  // =========================================================================
  lines.push("# Knowledge Coverage Analysis Report");
  lines.push("");
  lines.push(`> Generated: ${coverage.generatedAt}`);
  lines.push(
    `> Analysis of ${coverage.stats.totalAgents} agents covering ${coverage.stats.totalFiles} files`
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  // =========================================================================
  // Executive Summary
  // =========================================================================
  lines.push("## Executive Summary");
  lines.push("");
  lines.push("### Coverage Metrics");
  lines.push("");
  lines.push("| Metric | Value | Description |");
  lines.push("|--------|-------|-------------|");
  lines.push(
    `| **Total Coverage** | ${coverage.stats.coveragePercent}% | ${coverage.stats.coveredFiles}/${coverage.stats.totalFiles} files known by any agent |`
  );
  lines.push(
    `| **Explicit Coverage** | ${coverage.stats.explicitCoveragePercent}% | ${coverage.stats.explicitlyCoveredFiles}/${coverage.stats.totalFiles} files with specific references |`
  );
  lines.push(
    `| **Glob-Only Files** | ${coverage.stats.globOnlyFiles} | Files only covered via folder/wildcard patterns |`
  );
  lines.push(
    `| **Specialist Completeness** | ${coverage.specialistCompleteness.overallPercent}% | Builders/reviewers with their required specs |`
  );
  lines.push("");
  lines.push(keyFinding);
  lines.push("");
  lines.push("---");
  lines.push("");

  // =========================================================================
  // Agent Inventory
  // =========================================================================
  lines.push(generateAgentInventory(coverage));

  // =========================================================================
  // Specialist Completeness
  // =========================================================================
  lines.push("## Specialist Completeness");
  lines.push("");
  lines.push("This section shows whether builder/reviewer agents have their required spec files explicitly listed in their Primary Knowledge section.");
  lines.push("");
  lines.push("| Type | With Spec | Total | Completeness |");
  lines.push("|------|-----------|-------|--------------|");
  lines.push(
    `| Builders | ${coverage.specialistCompleteness.buildersWithSpec} | ${coverage.specialistCompleteness.totalBuilders} | ${coverage.specialistCompleteness.builderPercent}% |`
  );
  lines.push(
    `| Reviewers | ${coverage.specialistCompleteness.reviewersWithSpec} | ${coverage.specialistCompleteness.totalReviewers} | ${coverage.specialistCompleteness.reviewerPercent}% |`
  );
  lines.push(
    `| **Overall** | ${coverage.specialistCompleteness.buildersWithSpec + coverage.specialistCompleteness.reviewersWithSpec} | ${coverage.specialistCompleteness.totalBuilders + coverage.specialistCompleteness.totalReviewers} | **${coverage.specialistCompleteness.overallPercent}%** |`
  );
  lines.push("");

  // Agents missing required specs
  if (coverage.specialistCompleteness.agentsMissingSpecs.length > 0) {
    lines.push("### Agents Missing Required Specs");
    lines.push("");
    lines.push("These agents should have their domain spec explicitly listed in their Primary Knowledge section:");
    lines.push("");
    lines.push("| Agent | Type | Expected Spec | Current Primary Knowledge |");
    lines.push("|-------|------|---------------|---------------------------|");

    for (const missing of coverage.specialistCompleteness.agentsMissingSpecs) {
      const currentKnowledge =
        missing.actualKnowledge.length > 0
          ? missing.actualKnowledge.map((p) => `\`${getShortPath(p)}\``).join(", ")
          : "(none)";
      lines.push(
        `| ${missing.agent} | ${missing.type} | \`${getShortPath(missing.expectedSpec)}\` | ${currentKnowledge} |`
      );
    }
    lines.push("");
  } else {
    lines.push("*All specialists have their required specs listed.*");
    lines.push("");
  }

  lines.push("---");
  lines.push("");

  // =========================================================================
  // Coverage by Layer
  // =========================================================================
  lines.push("## Coverage by Layer");
  lines.push("");
  lines.push("| Layer | Files | Covered | Coverage | Primary Agents |");
  lines.push("|-------|-------|---------|----------|----------------|");

  for (const layer of layerCoverage) {
    const coverageStr =
      layer.percent === 100 ? "100%" : `${layer.percent}%`;
    lines.push(
      `| ${layer.layer} | ${layer.totalFiles} | ${layer.coveredFiles} | ${coverageStr} | ${formatAgentsList(layer.agents)} |`
    );
  }

  lines.push("");
  lines.push("---");
  lines.push("");

  // =========================================================================
  // Builder/Reviewer Pairing
  // =========================================================================
  lines.push("## Builder/Reviewer Pairing");
  lines.push("");

  const specs = pairings.filter((p) => p.spec.endsWith(".spec.md"));
  if (specs.length === 0) {
    lines.push("*No spec files found in coverage.*");
  } else {
    lines.push("| Spec | Builder | Reviewer | Status |");
    lines.push("|------|---------|----------|--------|");

    for (const pairing of specs.slice(0, 15)) {
      const builderStr = pairing.builder || "-";
      const reviewerStr = pairing.reviewer || "-";
      const statusStr =
        pairing.status === "complete" ? "Complete" : "Missing Reviewer";

      lines.push(
        `| \`${getShortPath(pairing.spec)}\` | ${builderStr} | ${reviewerStr} | ${pairing.status === "complete" ? "Complete" : "Incomplete"} |`
      );
    }

    if (specs.length > 15) {
      lines.push(`| ... | ... | ... | *${specs.length - 15} more specs* |`);
    }

    const complete = specs.filter((p) => p.status === "complete").length;
    lines.push("");
    lines.push(`**Summary**: ${complete}/${specs.length} specs have complete pairing`);
  }

  lines.push("");
  lines.push("---");
  lines.push("");

  // =========================================================================
  // Output Scope Analysis
  // =========================================================================
  lines.push("## Output Scope Analysis");
  lines.push("");

  // Write Conflicts
  lines.push("### Write Conflicts (Multiple Writers)");
  lines.push("");

  if (conflicts.length === 0) {
    lines.push("*No write conflicts detected.*");
  } else {
    lines.push("| Folder | Writers | Risk |");
    lines.push("|--------|---------|------|");

    for (const conflict of conflicts) {
      const riskEmoji =
        conflict.riskLevel === "high"
          ? "High"
          : conflict.riskLevel === "medium"
            ? "Medium"
            : "Low";
      lines.push(
        `| \`${conflict.folder}\` | ${conflict.writers.join(", ")} | ${riskEmoji} (${conflict.reason}) |`
      );
    }
  }

  lines.push("");

  // Orphaned Folders
  lines.push("### Orphaned Folders (No Writers)");
  lines.push("");

  if (orphaned.length === 0) {
    lines.push("*No orphaned folders detected.*");
  } else {
    for (const folder of orphaned.slice(0, 10)) {
      lines.push(`- \`${folder.folder}\` - ${folder.reason}`);
    }
    if (orphaned.length > 10) {
      lines.push(`- *...and ${orphaned.length - 10} more*`);
    }
  }

  lines.push("");
  lines.push("---");
  lines.push("");

  // =========================================================================
  // Gap Analysis
  // =========================================================================
  lines.push("## Gap Analysis");
  lines.push("");

  // Uncovered Files
  lines.push("### Uncovered Files");
  lines.push("");
  if (coverage.uncovered.length === 0) {
    lines.push("*None - 100% coverage*");
  } else {
    for (const file of coverage.uncovered.slice(0, 10)) {
      lines.push(`- \`${file}\``);
    }
    if (coverage.uncovered.length > 10) {
      lines.push(`- *...and ${coverage.uncovered.length - 10} more*`);
    }
  }
  lines.push("");

  // Specs Without Builders
  lines.push("### Specs Missing Builders");
  lines.push("");
  if (specsWithoutBuilders.length === 0) {
    lines.push("*None*");
  } else {
    for (const spec of specsWithoutBuilders.slice(0, 10)) {
      lines.push(`- \`${getShortPath(spec)}\``);
    }
    if (specsWithoutBuilders.length > 10) {
      lines.push(`- *...and ${specsWithoutBuilders.length - 10} more*`);
    }
  }
  lines.push("");

  // Specs Without Reviewers
  lines.push("### Specs Missing Reviewers");
  lines.push("");
  if (specsWithoutReviewers.length === 0) {
    lines.push("*None*");
  } else {
    for (const spec of specsWithoutReviewers.slice(0, 10)) {
      lines.push(`- \`${getShortPath(spec)}\``);
    }
    if (specsWithoutReviewers.length > 10) {
      lines.push(`- *...and ${specsWithoutReviewers.length - 10} more*`);
    }
  }
  lines.push("");

  // Coordinator-only files
  lines.push("### Files Only Known by Coordinators");
  lines.push("");
  if (coordinatorOnly.length === 0) {
    lines.push("*None - all files have specialist coverage*");
  } else {
    for (const file of coordinatorOnly.slice(0, 10)) {
      lines.push(`- \`${getShortPath(file)}\``);
    }
    if (coordinatorOnly.length > 10) {
      lines.push(`- *...and ${coordinatorOnly.length - 10} more*`);
    }
  }

  lines.push("");
  lines.push("---");
  lines.push("");

  // =========================================================================
  // Recommendations
  // =========================================================================
  lines.push("## Recommendations");
  lines.push("");

  const critical = recommendations.filter((r) => r.priority === "critical");
  const high = recommendations.filter((r) => r.priority === "high");
  const medium = recommendations.filter((r) => r.priority === "medium");
  const low = recommendations.filter((r) => r.priority === "low");

  lines.push("### Critical Priority");
  lines.push("");
  if (critical.length === 0) {
    lines.push("*None*");
  } else {
    for (const rec of critical) {
      lines.push(`1. **${rec.title}**`);
      lines.push(`   - ${rec.description}`);
      lines.push(`   - Action: ${rec.action}`);
    }
  }
  lines.push("");

  lines.push("### High Priority");
  lines.push("");
  if (high.length === 0) {
    lines.push("*None*");
  } else {
    for (const rec of high) {
      lines.push(`1. **${rec.title}**`);
      lines.push(`   - ${rec.description}`);
      lines.push(`   - Action: ${rec.action}`);
    }
  }
  lines.push("");

  lines.push("### Medium Priority");
  lines.push("");
  if (medium.length === 0) {
    lines.push("*None*");
  } else {
    for (const rec of medium) {
      lines.push(`1. **${rec.title}**`);
      lines.push(`   - ${rec.description}`);
      lines.push(`   - Action: ${rec.action}`);
    }
  }
  lines.push("");

  lines.push("### Low Priority");
  lines.push("");
  if (low.length === 0) {
    lines.push("*None*");
  } else {
    for (const rec of low) {
      lines.push(`1. **${rec.title}**`);
      lines.push(`   - ${rec.description}`);
      lines.push(`   - Action: ${rec.action}`);
    }
  }
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push("*Report generated by Knowledge Coverage System*");

  return lines.join("\n");
}

// ============================================================================
// Test Runner
// ============================================================================

import { parseAllContracts } from "./contract-parser.js";
import { buildCoverage } from "./coverage-builder.js";
import { fileURLToPath } from "url";

/**
 * Run tests when this module is executed directly.
 * Use: npx tsx .claude/scripts/lib/report-generator.ts
 */
export async function runTests(): Promise<void> {
  console.log("=== Report Generator Test ===\n");

  const projectRoot = ".";

  // Parse contracts and build coverage
  console.log("--- Building Coverage Data ---");
  const contracts = parseAllContracts(
    ".claude/architecture/agentic-framework/*.agent.md"
  );
  const coverage = buildCoverage(contracts, projectRoot);

  console.log(`Agents: ${coverage.stats.totalAgents}`);
  console.log(`Files: ${coverage.stats.totalFiles}`);
  console.log(`Covered: ${coverage.stats.coveredFiles}`);
  console.log(`Coverage: ${coverage.stats.coveragePercent}%`);
  console.log("");

  // Test analysis functions
  console.log("--- Builder/Reviewer Pairing ---");
  const pairings = analyzeBuilderReviewerPairing(coverage);
  const complete = pairings.filter((p) => p.status === "complete").length;
  console.log(`  ${complete}/${pairings.length} specs have complete pairing`);
  console.log("");

  console.log("--- Write Conflicts ---");
  const conflicts = analyzeWriteConflicts(coverage);
  console.log(`  ${conflicts.length} potential conflicts detected`);
  for (const conflict of conflicts.slice(0, 3)) {
    console.log(`    ${conflict.folder}: ${conflict.writers.join(", ")}`);
  }
  console.log("");

  console.log("--- Layer Coverage ---");
  const layers = analyzeCoverageByLayer(coverage);
  for (const layer of layers.slice(0, 5)) {
    console.log(`  ${layer.layer}: ${layer.percent}% (${layer.coveredFiles}/${layer.totalFiles})`);
  }
  console.log("");

  console.log("--- Recommendations ---");
  const recs = generateRecommendations(coverage);
  for (const rec of recs) {
    console.log(`  [${rec.priority.toUpperCase()}] ${rec.title}`);
  }
  console.log("");

  // Generate full report
  console.log("--- Full Report Preview (first 50 lines) ---");
  const report = generateAnalysisReport(coverage);
  const reportLines = report.split("\n").slice(0, 50);
  reportLines.forEach((line) => console.log(line));
  console.log("...");
  console.log(`Total report length: ${report.length} characters`);
}

// ESM-compatible main module check
const isMain =
  typeof process !== "undefined" &&
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  runTests();
}
