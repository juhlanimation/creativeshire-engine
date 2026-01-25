/**
 * Folder Expander for Knowledge Coverage System
 *
 * Expands folder paths and glob patterns to concrete file lists.
 * Used to resolve agent contract paths to actual files.
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

export interface ExpandOptions {
  /** Base path to resolve relative paths against */
  basePath?: string;
  /** Whether to include directories in output (default: false) */
  includeDirs?: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Recursively gets all files in a directory.
 *
 * @param dirPath - Directory to scan
 * @param includeDirs - Whether to include directory paths
 * @returns Array of relative file paths
 */
function getAllFilesInDir(dirPath: string, includeDirs = false): string[] {
  const results: string[] = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (includeDirs) {
          results.push(fullPath);
        }
        // Recurse into subdirectory
        results.push(...getAllFilesInDir(fullPath, includeDirs));
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return results;
}

/**
 * Simple glob pattern matching.
 * Supports:
 * - `*` matches any characters except path separator
 * - `**` matches any characters including path separator
 * - `{a,b}` matches either a or b
 *
 * @param pattern - Glob pattern
 * @param basePath - Base path to search in
 * @returns Array of matching file paths
 */
function simpleGlob(pattern: string, basePath: string): string[] {
  const results: string[] = [];

  // Handle {a,b} patterns by expanding to multiple patterns
  const braceMatch = pattern.match(/\{([^}]+)\}/);
  if (braceMatch) {
    const options = braceMatch[1].split(",");
    for (const option of options) {
      const expandedPattern = pattern.replace(braceMatch[0], option.trim());
      results.push(...simpleGlob(expandedPattern, basePath));
    }
    return [...new Set(results)];
  }

  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, "\\.")
    .replace(/\*\*/g, "<<<DOUBLE_STAR>>>")
    .replace(/\*/g, "[^/\\\\]*")
    .replace(/<<<DOUBLE_STAR>>>/g, ".*");

  const regex = new RegExp(`^${regexPattern}$`);

  // Get all files and filter by pattern
  const allFiles = getAllFilesInDir(basePath);

  for (const file of allFiles) {
    // Normalize path separators for matching
    const normalizedFile = file.replace(/\\/g, "/");
    const normalizedBase = basePath.replace(/\\/g, "/");

    // Get relative path from base
    let relativePath = normalizedFile;
    if (normalizedFile.startsWith(normalizedBase)) {
      relativePath = normalizedFile.slice(normalizedBase.length);
      if (relativePath.startsWith("/")) {
        relativePath = relativePath.slice(1);
      }
    }

    if (regex.test(relativePath) || regex.test(normalizedFile)) {
      results.push(file);
    }
  }

  return results;
}

/**
 * Normalizes a path to use forward slashes and remove trailing slashes.
 */
function normalizePath(p: string): string {
  return p.replace(/\\/g, "/").replace(/\/+$/, "");
}

/**
 * Checks if a path exists and is a directory.
 */
function isDirectory(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Checks if a path exists and is a file.
 */
function isFile(p: string): boolean {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Expands folder paths to include all children.
 *
 * Path handling:
 * - Paths ending with `/` are treated as folders and expanded to all children
 * - Pattern paths with `*` are expanded via glob
 * - Concrete file paths are returned as-is
 *
 * @param paths - Array of paths to expand
 * @param basePath - Base path to resolve relative paths against (default: ".")
 * @returns Array of expanded file paths (deduplicated)
 */
export function expandPaths(paths: string[], basePath = "."): string[] {
  const result: string[] = [];

  for (const p of paths) {
    const normalizedPath = normalizePath(p);

    if (normalizedPath.includes("*")) {
      // Pattern: expand via glob
      const matches = simpleGlob(normalizedPath, basePath);
      result.push(...matches);
    } else if (p.endsWith("/")) {
      // Folder path: expand to all children
      const fullPath = path.join(basePath, normalizedPath);
      if (isDirectory(fullPath)) {
        const children = getAllFilesInDir(fullPath);
        result.push(...children);
      }
    } else {
      // Concrete path: check if it exists
      const fullPath = path.join(basePath, normalizedPath);

      if (isFile(fullPath)) {
        result.push(fullPath);
      } else if (isDirectory(fullPath)) {
        // If it's a directory without trailing slash, expand it anyway
        const children = getAllFilesInDir(fullPath);
        result.push(...children);
      }
      // If path doesn't exist, we still add it (agent references non-existent file)
      // This allows detection of broken references
      else {
        result.push(fullPath);
      }
    }
  }

  // Deduplicate and normalize
  const normalized = result.map((p) => normalizePath(p));
  return [...new Set(normalized)];
}

/**
 * Normalizes paths to a consistent format for comparison.
 * Handles various path formats from agent contracts:
 * - `.claude/architecture/creativeshire/...` (full path)
 * - `creativeshire/...` (relative)
 * - Windows vs Unix separators
 *
 * @param filePath - Path to normalize
 * @param projectRoot - Project root for resolving absolute paths
 * @returns Normalized path relative to creativeshire folder
 */
export function normalizeForComparison(
  filePath: string,
  projectRoot = "."
): string {
  let normalized = normalizePath(filePath);

  // Convert absolute paths to relative
  const normalizedRoot = normalizePath(projectRoot);
  if (normalizedRoot !== "." && normalized.startsWith(normalizedRoot)) {
    normalized = normalized.slice(normalizedRoot.length);
    if (normalized.startsWith("/")) {
      normalized = normalized.slice(1);
    }
  }

  // Standardize to .claude/architecture/creativeshire/ prefix
  if (normalized.startsWith("creativeshire/")) {
    normalized = ".claude/architecture/" + normalized;
  }

  return normalized;
}

/**
 * Gets all files in the creativeshire folder.
 *
 * @param projectRoot - Project root path
 * @returns Array of file paths relative to project root
 */
export function getCreativeshireFiles(projectRoot = "."): string[] {
  const creativeshirePath = path.join(
    projectRoot,
    ".claude",
    "architecture",
    "creativeshire"
  );

  if (!isDirectory(creativeshirePath)) {
    return [];
  }

  const files = getAllFilesInDir(creativeshirePath);

  // Return paths relative to project root
  return files.map((f) => {
    const relative = path.relative(projectRoot, f);
    return normalizePath(relative);
  });
}

// ============================================================================
// Test Runner
// ============================================================================

/**
 * Run tests when this module is executed directly.
 * Use: npx tsx .claude/scripts/lib/folder-expander.ts
 */
export function runTests(): void {
  console.log("=== Folder Expander Test ===\n");

  const projectRoot = ".";

  // Test 1: Get creativeshire files
  console.log("--- Test 1: Get Creativeshire Files ---");
  const creativeshireFiles = getCreativeshireFiles(projectRoot);
  console.log(`Found ${creativeshireFiles.length} files in creativeshire:`);
  creativeshireFiles.slice(0, 5).forEach((f) => console.log(`  - ${f}`));
  if (creativeshireFiles.length > 5) {
    console.log(`  ... and ${creativeshireFiles.length - 5} more`);
  }
  console.log("");

  // Test 2: Expand folder path
  console.log("--- Test 2: Expand Folder Path ---");
  const folderPaths = [".claude/architecture/creativeshire/core/"];
  const expandedFolder = expandPaths(folderPaths, projectRoot);
  console.log(`Expanded "${folderPaths[0]}" to ${expandedFolder.length} files:`);
  expandedFolder.forEach((f) => console.log(`  - ${f}`));
  console.log("");

  // Test 3: Glob pattern
  console.log("--- Test 3: Glob Pattern ---");
  const globPaths = [".claude/architecture/creativeshire/core/*.md"];
  const expandedGlob = expandPaths(globPaths, projectRoot);
  console.log(`Expanded "${globPaths[0]}" to ${expandedGlob.length} files:`);
  expandedGlob.forEach((f) => console.log(`  - ${f}`));
  console.log("");

  // Test 4: Concrete path
  console.log("--- Test 4: Concrete Path ---");
  const concretePaths = [
    ".claude/architecture/creativeshire/components/content/widget.spec.md",
  ];
  const expandedConcrete = expandPaths(concretePaths, projectRoot);
  console.log(`Expanded "${concretePaths[0]}":`);
  expandedConcrete.forEach((f) => console.log(`  - ${f}`));
  console.log("");

  // Test 5: Normalize for comparison
  console.log("--- Test 5: Path Normalization ---");
  const testPaths = [
    ".claude/architecture/creativeshire/core/01-contracts.md",
    "creativeshire/core/01-contracts.md",
    ".claude\\architecture\\creativeshire\\core\\01-contracts.md",
  ];
  testPaths.forEach((p) => {
    console.log(`  "${p}" -> "${normalizeForComparison(p)}"`);
  });
}

// ESM-compatible main module check
import { fileURLToPath } from "url";
const isMain =
  typeof process !== "undefined" &&
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  runTests();
}
