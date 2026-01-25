/**
 * Mermaid Generator for Knowledge Coverage System
 *
 * Generates mermaid mindmap visualizations from coverage data,
 * showing which agents know about files organized by architectural layer.
 */

import * as path from "path";
import { CoverageData } from "./coverage-builder";

// ============================================================================
// Types
// ============================================================================

/** Layer classification with display name and sort order */
interface LayerInfo {
  name: string;
  order: number;
}

/** File grouped by layer with coverage info */
interface LayerFile {
  filePath: string;
  fileName: string;
  agents: string[];
}

/** Layer with all its files */
interface LayerGroup {
  layer: string;
  order: number;
  files: LayerFile[];
}

/** Summary data for a layer */
interface LayerSummary {
  layer: string;
  fileCount: number;
  agents: string[];
}

// ============================================================================
// Layer Classification
// ============================================================================

/** Map of path patterns to layer info */
const LAYER_PATTERNS: Array<{ pattern: RegExp; info: LayerInfo }> = [
  { pattern: /components\/schema\//, info: { name: "L0 Schema", order: 0 } },
  { pattern: /components\/content\//, info: { name: "L1 Content", order: 1 } },
  {
    pattern: /components\/experience\//,
    info: { name: "L2 Experience", order: 2 },
  },
  { pattern: /layers\/interface/, info: { name: "L3 Interface", order: 3 } },
  { pattern: /components\/preset\//, info: { name: "L4 Preset", order: 4 } },
  { pattern: /components\/site\//, info: { name: "L5 Site", order: 5 } },
  {
    pattern: /components\/renderer\//,
    info: { name: "Renderer", order: 6 },
  },
  { pattern: /layers\//, info: { name: "Layers", order: 7 } },
  { pattern: /core\//, info: { name: "Core", order: 8 } },
  { pattern: /reference\//, info: { name: "Reference", order: 9 } },
  { pattern: /testing\//, info: { name: "Testing", order: 10 } },
  { pattern: /patterns\//, info: { name: "Patterns", order: 11 } },
  { pattern: /diagrams\//, info: { name: "Diagrams", order: 12 } },
];

const DEFAULT_LAYER: LayerInfo = { name: "Other", order: 99 };

/**
 * Gets the layer classification for a file path.
 *
 * @param filePath - Path to classify
 * @returns Layer name (e.g., 'L0 Schema', 'L1 Content')
 */
export function getLayer(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");

  for (const { pattern, info } of LAYER_PATTERNS) {
    if (pattern.test(normalized)) {
      return info.name;
    }
  }

  return DEFAULT_LAYER.name;
}

/**
 * Gets the layer order for sorting.
 *
 * @param layerName - Layer name
 * @returns Sort order (lower = first)
 */
function getLayerOrder(layerName: string): number {
  for (const { info } of LAYER_PATTERNS) {
    if (info.name === layerName) {
      return info.order;
    }
  }
  return DEFAULT_LAYER.order;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Escapes text for mermaid mindmap nodes.
 * Mermaid mindmap doesn't handle special characters well,
 * so we wrap text in brackets for safe display.
 *
 * @param text - Text to escape
 * @returns Escaped text safe for mermaid
 */
function escapeMermaidText(text: string): string {
  // If text contains special characters, wrap in brackets with quotes
  if (/[.\-\/\\:()[\]{}#@!$%^&*+=|<>?'"`~]/.test(text)) {
    // Escape internal quotes
    const escaped = text.replace(/"/g, '\\"');
    return `["${escaped}"]`;
  }
  return text;
}

/**
 * Groups files by their layer classification.
 *
 * @param coverage - Coverage data
 * @returns Array of layer groups sorted by layer order
 */
function groupFilesByLayer(coverage: CoverageData): LayerGroup[] {
  const groups: Map<string, LayerGroup> = new Map();

  for (const [filePath, fileCoverage] of Object.entries(coverage.files)) {
    // Skip files with no agents
    if (fileCoverage.knownBy.length === 0) {
      continue;
    }

    const layer = getLayer(filePath);
    const order = getLayerOrder(layer);

    if (!groups.has(layer)) {
      groups.set(layer, { layer, order, files: [] });
    }

    const group = groups.get(layer)!;
    group.files.push({
      filePath,
      fileName: path.basename(filePath),
      agents: [...fileCoverage.knownBy].sort(),
    });
  }

  // Sort files within each group alphabetically
  for (const group of groups.values()) {
    group.files.sort((a, b) => a.fileName.localeCompare(b.fileName));
  }

  // Sort groups by layer order
  return Array.from(groups.values()).sort((a, b) => a.order - b.order);
}

/**
 * Generates layer summaries for the report table.
 *
 * @param groups - Layer groups
 * @returns Array of layer summaries
 */
function generateLayerSummaries(groups: LayerGroup[]): LayerSummary[] {
  return groups.map((group) => {
    const allAgents = new Set<string>();
    for (const file of group.files) {
      for (const agent of file.agents) {
        allAgents.add(agent);
      }
    }

    return {
      layer: group.layer,
      fileCount: group.files.length,
      agents: Array.from(allAgents).sort(),
    };
  });
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Generates a mermaid mindmap showing coverage by layer.
 * Files grouped by layer, agents listed under files.
 *
 * @param coverage - Coverage data from buildCoverage()
 * @returns Mermaid mindmap syntax string
 */
export function generateMindmap(coverage: CoverageData): string {
  const groups = groupFilesByLayer(coverage);
  const lines: string[] = [];

  lines.push("mindmap");
  lines.push("  root((Creativeshire))");

  for (const group of groups) {
    // Layer node (2 spaces indent from root)
    lines.push(`    ${escapeMermaidText(group.layer)}`);

    for (const file of group.files) {
      // File node (3 spaces indent from layer)
      lines.push(`      ${escapeMermaidText(file.fileName)}`);

      for (const agent of file.agents) {
        // Agent node (4 spaces indent from file)
        lines.push(`        ${escapeMermaidText(agent)}`);
      }
    }
  }

  return lines.join("\n");
}

/**
 * Wraps mermaid in a markdown document with metadata.
 *
 * @param coverage - Coverage data from buildCoverage()
 * @returns Complete markdown document with mermaid diagram
 */
export function generateGraphDocument(coverage: CoverageData): string {
  const groups = groupFilesByLayer(coverage);
  const summaries = generateLayerSummaries(groups);
  const mindmap = generateMindmap(coverage);

  const lines: string[] = [];

  // Header
  lines.push("# Knowledge Coverage Graph");
  lines.push("");
  lines.push(`> Generated: ${coverage.generatedAt}`);
  lines.push(
    `> Coverage: ${coverage.stats.coveredFiles}/${coverage.stats.totalFiles} files (${coverage.stats.coveragePercent}%)`
  );
  lines.push("");

  // Visualization
  lines.push("## Visualization");
  lines.push("");
  lines.push("```mermaid");
  lines.push(mindmap);
  lines.push("```");
  lines.push("");

  // Layer Summary
  lines.push("## Layer Summary");
  lines.push("");
  lines.push("| Layer | Files | Agents |");
  lines.push("|-------|-------|--------|");

  for (const summary of summaries) {
    const agentList =
      summary.agents.length > 3
        ? `${summary.agents.slice(0, 3).join(", ")}, +${summary.agents.length - 3} more`
        : summary.agents.join(", ");
    lines.push(`| ${summary.layer} | ${summary.fileCount} | ${agentList} |`);
  }

  lines.push("");

  // Uncovered files section if any
  if (coverage.uncovered.length > 0) {
    lines.push("## Uncovered Files");
    lines.push("");
    lines.push(`${coverage.uncovered.length} files have no agent coverage:`);
    lines.push("");

    // Group uncovered by layer
    const uncoveredByLayer: Map<string, string[]> = new Map();
    for (const file of coverage.uncovered) {
      const layer = getLayer(file);
      if (!uncoveredByLayer.has(layer)) {
        uncoveredByLayer.set(layer, []);
      }
      uncoveredByLayer.get(layer)!.push(path.basename(file));
    }

    for (const [layer, files] of uncoveredByLayer) {
      lines.push(`### ${layer}`);
      lines.push("");
      for (const file of files.sort()) {
        lines.push(`- \`${file}\``);
      }
      lines.push("");
    }
  }

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
 * Use: npx tsx .claude/scripts/lib/mermaid-generator.ts
 */
export async function runTests(): Promise<void> {
  console.log("=== Mermaid Generator Test ===\n");

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
  console.log("");

  // Test getLayer function
  console.log("--- Layer Classification ---");
  const testPaths = [
    ".claude/architecture/creativeshire/components/schema/test.md",
    ".claude/architecture/creativeshire/components/content/widget.md",
    ".claude/architecture/creativeshire/components/experience/flow.md",
    ".claude/architecture/creativeshire/layers/interface-layer.md",
    ".claude/architecture/creativeshire/components/preset/theme.md",
    ".claude/architecture/creativeshire/components/site/config.md",
    ".claude/architecture/creativeshire/core/engine.md",
    ".claude/architecture/creativeshire/reference/tech-stack/next.md",
    ".claude/architecture/creativeshire/testing/test.md",
    ".claude/architecture/creativeshire/patterns/pattern.md",
    ".claude/architecture/creativeshire/random/file.md",
  ];

  for (const p of testPaths) {
    console.log(`  ${getLayer(p)}: ${path.basename(p)}`);
  }
  console.log("");

  // Test layer distribution from actual coverage
  console.log("--- Layer Distribution ---");
  const groups = groupFilesByLayer(coverage);
  for (const group of groups) {
    console.log(`  ${group.layer}: ${group.files.length} files`);
  }
  console.log("");

  // Generate and display mindmap (first 30 lines)
  console.log("--- Mindmap Preview (first 30 lines) ---");
  const mindmap = generateMindmap(coverage);
  const mindmapLines = mindmap.split("\n");
  mindmapLines.slice(0, 30).forEach((line) => console.log(line));
  if (mindmapLines.length > 30) {
    console.log(`... and ${mindmapLines.length - 30} more lines`);
  }
  console.log("");

  // Verify mermaid syntax basics
  console.log("--- Syntax Validation ---");
  const syntaxValid =
    mindmap.startsWith("mindmap") && mindmap.includes("root((Creativeshire))");
  console.log(`  Starts with mindmap: ${mindmap.startsWith("mindmap")}`);
  console.log(`  Has root node: ${mindmap.includes("root((Creativeshire))")}`);
  console.log(`  Overall: ${syntaxValid ? "VALID" : "INVALID"}`);
  console.log("");

  // Generate full document
  console.log("--- Graph Document Preview ---");
  const doc = generateGraphDocument(coverage);
  const docLines = doc.split("\n").slice(0, 20);
  docLines.forEach((line) => console.log(line));
  console.log("...");
  console.log(`Total document length: ${doc.length} characters`);
}

// ESM-compatible main module check
const isMain =
  typeof process !== "undefined" &&
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  runTests();
}
