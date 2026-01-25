/**
 * Contract Parser for Knowledge Coverage System
 *
 * Parses agent contract markdown files to extract structured information
 * about agent knowledge requirements and scope boundaries.
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

/**
 * Represents a knowledge path with metadata about its specificity.
 */
export interface KnowledgePath {
  /** The file or folder path */
  path: string;
  /** True if path points to a specific file (not a glob or folder) */
  isExplicit: boolean;
  /** True if from Primary section (vs Additional) */
  isPrimary: boolean;
}

export interface AgentContract {
  /** Agent name derived from filename (e.g., "widget-builder") */
  name: string;
  /** Agent type inferred from name suffix */
  type: "builder" | "reviewer" | "coordinator";
  /** Full path to the .agent.md file */
  contractPath: string;
  /** Paths from Knowledge section tables (Primary + Additional) */
  knowledge: string[];
  /** Detailed knowledge paths with explicit/glob metadata */
  knowledgeDetails: KnowledgePath[];
  /** Paths from "Can Touch" section (builders only) */
  outputScope: string[];
  /** Paths from "Can Read" section (reviewers only) */
  readScope: string[];
  /** The domain this agent is responsible for (e.g., "widget" from "widget-builder") */
  domain: string | null;
  /** Expected spec file for this agent based on domain */
  expectedSpec: string | null;
  /** Whether the agent explicitly lists its expected spec in Primary knowledge */
  hasRequiredSpec: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extracts agent name from filename.
 * Example: "widget-builder.agent.md" -> "widget-builder"
 */
function extractAgentName(filePath: string): string {
  const basename = path.basename(filePath);
  return basename.replace(/\.agent\.md$/, "");
}

/**
 * Infers agent type from name suffix.
 */
function inferAgentType(name: string): AgentContract["type"] {
  if (name.endsWith("-builder")) return "builder";
  if (name.endsWith("-reviewer")) return "reviewer";
  return "coordinator";
}

/**
 * Strips backticks from a path string.
 * Example: "`path/to/file.md`" -> "path/to/file.md"
 */
function stripBackticks(str: string): string {
  return str.replace(/^`|`$/g, "");
}

/**
 * Determines if a path is explicit (specific file) vs glob/folder.
 * Explicit: ends with file extension, no wildcards
 * Glob: contains *, **, or ends with / or has no extension
 */
function isExplicitPath(pathStr: string): boolean {
  // Contains wildcard patterns
  if (pathStr.includes("*")) return false;

  // Ends with slash (folder)
  if (pathStr.endsWith("/")) return false;

  // Has a file extension (explicit file)
  const lastPart = pathStr.split("/").pop() || "";
  if (lastPart.includes(".") && !lastPart.startsWith(".")) {
    return true;
  }

  // No extension, likely a folder reference
  return false;
}

/**
 * Extracts the domain from an agent name.
 * E.g., "widget-builder" -> "widget", "section-composite-reviewer" -> "section-composite"
 */
function extractDomain(name: string): string | null {
  const suffixes = ["-builder", "-reviewer"];
  for (const suffix of suffixes) {
    if (name.endsWith(suffix)) {
      return name.slice(0, -suffix.length);
    }
  }
  return null;
}

/**
 * Determines the expected spec file path for an agent's domain.
 * Maps domain to the spec file it should know about.
 */
function getExpectedSpec(domain: string | null): string | null {
  if (!domain) return null;

  // Map domain to layer/folder
  const domainToLayer: Record<string, string> = {
    // Content layer
    "widget": "content",
    "widget-composite": "content",
    "section": "content",
    "section-composite": "content",
    "feature": "content",
    "chrome": "content",
    // Experience layer
    "behaviour": "experience",
    "driver": "experience",
    "provider": "experience",
    "trigger": "experience",
    // Other layers
    "preset": "preset",
    "renderer": "renderer",
    "schema": "schema",
    "site": "site",
    "page": "site", // page-builder works with site layer
  };

  const layer = domainToLayer[domain];
  if (!layer) return null;

  // Handle page-builder special case
  const specName = domain === "page" ? "site" : domain;

  return `.claude/architecture/creativeshire/components/${layer}/${specName}.spec.md`;
}

/**
 * Extracts paths from markdown table rows.
 * Looks for the first column containing backtick-wrapped paths.
 *
 * Example input:
 * | `.claude/architecture/spec.md` | Description |
 *
 * Returns: [".claude/architecture/spec.md"]
 */
function extractPathsFromTable(content: string): string[] {
  const paths: string[] = [];

  // Match table rows: | `path` | description |
  const tableRowRegex = /^\|\s*`([^`]+)`\s*\|/gm;
  let match: RegExpExecArray | null;

  while ((match = tableRowRegex.exec(content)) !== null) {
    const pathValue = match[1].trim();
    if (pathValue && pathValue !== "Document" && pathValue !== "Path") {
      paths.push(pathValue);
    }
  }

  return paths;
}

/**
 * Extracts paths with metadata from markdown table rows.
 */
function extractPathDetailsFromTable(
  content: string,
  isPrimary: boolean
): KnowledgePath[] {
  const paths: KnowledgePath[] = [];

  const tableRowRegex = /^\|\s*`([^`]+)`\s*\|/gm;
  let match: RegExpExecArray | null;

  while ((match = tableRowRegex.exec(content)) !== null) {
    const pathValue = match[1].trim();
    if (pathValue && pathValue !== "Document" && pathValue !== "Path") {
      paths.push({
        path: pathValue,
        isExplicit: isExplicitPath(pathValue),
        isPrimary,
      });
    }
  }

  return paths;
}

/**
 * Extracts a section from markdown content by heading level.
 * Returns content from the heading until the next heading of same or higher level.
 */
function extractSection(
  content: string,
  heading: string,
  level: number
): string {
  const headingPrefix = "#".repeat(level);
  const headingRegex = new RegExp(
    `^${headingPrefix}\\s+${heading}\\s*$`,
    "im"
  );

  const match = headingRegex.exec(content);
  if (!match) return "";

  const startIndex = match.index + match[0].length;

  // Find next heading of same or higher level
  const nextHeadingRegex = new RegExp(`^#{1,${level}}\\s+`, "m");
  const remainingContent = content.slice(startIndex);
  const nextMatch = nextHeadingRegex.exec(remainingContent);

  if (nextMatch) {
    return remainingContent.slice(0, nextMatch.index);
  }

  return remainingContent;
}

/**
 * Extracts file/folder paths from a scope section (Can Touch / Can Read).
 *
 * Handles two formats:
 * 1. Code block with tree structure:
 *    ```
 *    creativeshire/components/
 *    ├── file.tsx    ✓
 *    ```
 *
 * 2. Direct path lines before tree characters
 */
function extractScopePaths(sectionContent: string): string[] {
  const paths: string[] = [];

  // Extract content from code blocks
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks = sectionContent.match(codeBlockRegex) || [];

  for (const block of codeBlocks) {
    // Remove ``` markers
    const blockContent = block.replace(/```/g, "");

    // Split into lines and process each
    const lines = blockContent.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Skip lines that are just tree structure
      if (/^[├│└─\s]+$/.test(trimmed)) continue;

      // Extract the base path (first line that looks like a path)
      // Pattern: starts with path-like content, may have tree characters
      const pathMatch = trimmed.match(
        /^([a-zA-Z0-9._\-@*{}\/]+(?:\/[a-zA-Z0-9._\-@*{}\/]*)*)/
      );
      if (pathMatch) {
        const pathValue = pathMatch[1].replace(/\/$/, ""); // Remove trailing slash
        if (pathValue && !paths.includes(pathValue)) {
          paths.push(pathValue);
        }
      }

      // Also extract paths from tree lines like: ├── file.tsx    ✓
      const treePathMatch = trimmed.match(/[├└│─\s]+([a-zA-Z0-9._\-@*{}\/]+)/);
      if (treePathMatch) {
        const pathValue = treePathMatch[1];
        // Only include if it looks like a meaningful path segment
        if (
          pathValue &&
          !pathValue.startsWith("✓") &&
          !pathValue.startsWith("✗")
        ) {
          // Don't add individual files from tree, just the root paths
          // Files are indicated by tree structure under a folder path
        }
      }
    }
  }

  return paths;
}

// ============================================================================
// Main Parser Functions
// ============================================================================

/**
 * Normalizes a path for comparison (handles various formats).
 */
function normalizePath(p: string): string {
  return p
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .toLowerCase();
}

/**
 * Checks if a knowledge path matches an expected spec file.
 */
function pathMatchesSpec(knowledgePath: string, expectedSpec: string): boolean {
  const normalizedKnowledge = normalizePath(knowledgePath);
  const normalizedSpec = normalizePath(expectedSpec);

  // Direct match
  if (normalizedKnowledge === normalizedSpec) return true;

  // Check if knowledge path ends with the spec filename
  const specFilename = expectedSpec.split("/").pop() || "";
  if (normalizedKnowledge.endsWith(specFilename.toLowerCase())) return true;

  return false;
}

/**
 * Parses a single agent contract file.
 *
 * @param filePath - Absolute path to the .agent.md file
 * @returns Parsed AgentContract object
 */
export function parseContract(filePath: string): AgentContract {
  const content = fs.readFileSync(filePath, "utf-8");
  const name = extractAgentName(filePath);
  const type = inferAgentType(name);

  // Extract Knowledge section
  const knowledgeSection = extractSection(content, "Knowledge", 2);
  const primarySection = extractSection(knowledgeSection, "Primary", 3);
  const additionalSection = extractSection(knowledgeSection, "Additional", 3);

  const primaryPaths = extractPathsFromTable(primarySection);
  const additionalPaths = extractPathsFromTable(additionalSection);
  const knowledge = [...primaryPaths, ...additionalPaths];

  // Extract detailed knowledge paths
  const primaryDetails = extractPathDetailsFromTable(primarySection, true);
  const additionalDetails = extractPathDetailsFromTable(additionalSection, false);
  const knowledgeDetails = [...primaryDetails, ...additionalDetails];

  // Extract Scope section
  const scopeSection = extractSection(content, "Scope", 2);
  const canTouchSection = extractSection(scopeSection, "Can Touch", 3);
  const canReadSection = extractSection(scopeSection, "Can Read", 3);

  const outputScope = extractScopePaths(canTouchSection);
  const readScope = extractScopePaths(canReadSection);

  // Determine domain and expected spec
  const domain = extractDomain(name);
  const expectedSpec = getExpectedSpec(domain);

  // Check if agent has required spec in Primary knowledge
  let hasRequiredSpec = false;
  if (expectedSpec && type !== "coordinator") {
    const primaryExplicit = knowledgeDetails.filter(
      (k) => k.isPrimary && k.isExplicit
    );
    hasRequiredSpec = primaryExplicit.some((k) =>
      pathMatchesSpec(k.path, expectedSpec)
    );
  }

  return {
    name,
    type,
    contractPath: filePath,
    knowledge,
    knowledgeDetails,
    outputScope,
    readScope,
    domain,
    expectedSpec,
    hasRequiredSpec,
  };
}

/**
 * Parses all agent contracts matching a glob pattern.
 *
 * Note: This implementation uses a simple directory listing approach
 * since we're using Node built-ins only. The globPattern should be
 * a directory path or a simple pattern.
 *
 * @param globPattern - Path pattern (e.g., ".claude/architecture/agentic-framework/*.agent.md")
 * @returns Array of parsed AgentContract objects
 */
export function parseAllContracts(globPattern: string): AgentContract[] {
  const contracts: AgentContract[] = [];

  // Extract directory from pattern
  const patternParts = globPattern.replace(/\\/g, "/").split("/");
  const filePattern = patternParts.pop() || "*.agent.md";
  const dirPath = patternParts.join("/") || ".";

  // Convert glob pattern to regex
  const regexPattern = filePattern
    .replace(/\./g, "\\.")
    .replace(/\*/g, ".*");
  const fileRegex = new RegExp(`^${regexPattern}$`);

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (fileRegex.test(file)) {
        const fullPath = path.join(dirPath, file);
        try {
          const contract = parseContract(fullPath);
          contracts.push(contract);
        } catch (error) {
          // Skip files that can't be parsed
          console.error(`Warning: Could not parse ${fullPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return contracts;
}

// ============================================================================
// Test Runner (for verification)
// ============================================================================

import { fileURLToPath } from "url";

/**
 * Run tests when this module is executed directly.
 * Use: npx tsx .claude/scripts/lib/contract-parser.ts
 */
export function runTests(): void {
  console.log("=== Contract Parser Test ===\n");

  const testFiles = [
    ".claude/architecture/agentic-framework/widget-builder.agent.md",
    ".claude/architecture/agentic-framework/widget-reviewer.agent.md",
    ".claude/architecture/agentic-framework/technical-director.agent.md",
  ];

  for (const file of testFiles) {
    console.log(`--- Parsing: ${file} ---`);
    try {
      const contract = parseContract(file);
      console.log(`Name: ${contract.name}`);
      console.log(`Type: ${contract.type}`);
      console.log(`Knowledge (${contract.knowledge.length}):`);
      contract.knowledge.forEach((k) => console.log(`  - ${k}`));
      console.log(`Output Scope (${contract.outputScope.length}):`);
      contract.outputScope.forEach((s) => console.log(`  - ${s}`));
      console.log(`Read Scope (${contract.readScope.length}):`);
      contract.readScope.forEach((s) => console.log(`  - ${s}`));
      console.log("");
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
    }
  }

  console.log("=== Testing parseAllContracts ===\n");
  const allContracts = parseAllContracts(
    ".claude/architecture/agentic-framework/*.agent.md"
  );
  console.log(`Found ${allContracts.length} contracts:`);
  allContracts.forEach((c) => {
    console.log(`  - ${c.name} (${c.type}): ${c.knowledge.length} knowledge docs`);
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
