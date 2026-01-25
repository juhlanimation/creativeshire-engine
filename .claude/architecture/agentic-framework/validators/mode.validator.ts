#!/usr/bin/env npx tsx
/**
 * Mode Validator
 *
 * Validates mode implementations against mode.spec.md rules.
 * Checks exports, interface compliance, and forbidden patterns.
 *
 * Exit codes:
 *   0 = Pass
 *   1 = Validator crashed
 *   2 = Validation failed
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationError {
  rule: number;
  message: string;
  line?: number;
  file?: string;
}

interface ModeFileContent {
  indexContent: string;
  storeContent: string | null;
  indexPath: string;
  storePath: string;
}

// ============================================================================
// Configuration
// ============================================================================

// Known trigger types from the architecture
const KNOWN_TRIGGER_TYPES = [
  "scroll-progress",
  "scroll-velocity",
  "section-progress",
  "intersection",
  "resize",
  "pointer",
  "keyboard",
  "time",
  "media-query",
];

// Known behaviour IDs from the architecture
const KNOWN_BEHAVIOUR_IDS = [
  "none",
  "scroll-stack",
  "slide-stack",
  "fade-in",
  "slide-in",
  "depth-layer",
  "parallax",
  "reveal",
];

// Paths to check for registries (relative to project root)
const TRIGGER_REGISTRY_PATH = "creativeshire/experience/triggers/registry.ts";
const BEHAVIOUR_REGISTRY_PATH = "creativeshire/experience/behaviours/registry.ts";

// ============================================================================
// File Reading
// ============================================================================

/**
 * Reads mode files from the given directory.
 */
function readModeFiles(modeDir: string): ModeFileContent | null {
  const indexPath = path.join(modeDir, "index.ts");
  const storePath = path.join(modeDir, "store.ts");

  if (!fs.existsSync(indexPath)) {
    return null;
  }

  const indexContent = fs.readFileSync(indexPath, "utf-8");
  const storeContent = fs.existsSync(storePath)
    ? fs.readFileSync(storePath, "utf-8")
    : null;

  return {
    indexContent,
    storeContent,
    indexPath,
    storePath,
  };
}

/**
 * Extracts the mode name from the directory name.
 */
function extractModeName(modeDir: string): string {
  return path.basename(modeDir);
}

/**
 * Finds line number for a pattern match.
 */
function findLineNumber(content: string, pattern: RegExp): number | null {
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return null;
}

/**
 * Finds all line numbers for a pattern match.
 */
function findAllLineNumbers(content: string, pattern: RegExp): number[] {
  const lines = content.split("\n");
  const matches: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      matches.push(i + 1);
    }
  }
  return matches;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Rule 1: Exports named Mode constant
 * Check: `export const {name}Mode: Mode`
 */
function checkExportsMode(
  content: string,
  modeName: string,
  filePath: string
): ValidationError | null {
  // Expected pattern: export const staticMode: Mode or export const parallaxMode: Mode
  const expectedName = `${modeName}Mode`;
  const pattern = new RegExp(
    `export\\s+const\\s+${expectedName}\\s*:\\s*Mode\\s*=`,
    "m"
  );

  if (!pattern.test(content)) {
    // Check if there's any Mode export to give a better error
    const anyModeExport = /export\s+const\s+(\w+Mode)\s*:\s*Mode\s*=/.exec(content);
    if (anyModeExport) {
      const line = findLineNumber(content, /export\s+const\s+\w+Mode\s*:\s*Mode\s*=/);
      return {
        rule: 1,
        message: `Expected "export const ${expectedName}: Mode" but found "export const ${anyModeExport[1]}: Mode"`,
        line: line || undefined,
        file: filePath,
      };
    }

    return {
      rule: 1,
      message: `Missing required export: "export const ${expectedName}: Mode"`,
      file: filePath,
    };
  }

  return null;
}

/**
 * Rule 2: Has id field
 * Check: `id` is non-empty string
 */
function checkHasId(content: string, filePath: string): ValidationError | null {
  // Look for id: 'something' or id: "something"
  const idPattern = /id\s*:\s*['"]([^'"]+)['"]/;
  const match = idPattern.exec(content);

  if (!match) {
    return {
      rule: 2,
      message: 'Mode definition missing "id" field',
      file: filePath,
    };
  }

  if (match[1].trim() === "") {
    const line = findLineNumber(content, idPattern);
    return {
      rule: 2,
      message: 'Mode "id" field cannot be empty',
      line: line || undefined,
      file: filePath,
    };
  }

  return null;
}

/**
 * Rule 3: Has provides array
 * Check: `provides` is string array
 */
function checkHasProvides(content: string, filePath: string): ValidationError | null {
  // Look for provides: [...] or provides: [] (empty is valid for static mode)
  const providesPattern = /provides\s*:\s*\[/;

  if (!providesPattern.test(content)) {
    return {
      rule: 3,
      message: 'Mode definition missing "provides" array',
      file: filePath,
    };
  }

  return null;
}

/**
 * Rule 4: Has createStore function
 * Check: `createStore` is function
 */
function checkHasCreateStore(content: string, filePath: string): ValidationError | null {
  // Look for createStore: followed by function reference or arrow function
  const createStorePatterns = [
    /createStore\s*:\s*\(/,                    // createStore: (
    /createStore\s*:\s*\w+/,                   // createStore: someFunction
    /createStore\s*:\s*\([^)]*\)\s*=>/,        // createStore: () =>
  ];

  const hasCreateStore = createStorePatterns.some((pattern) =>
    pattern.test(content)
  );

  if (!hasCreateStore) {
    return {
      rule: 4,
      message: 'Mode definition missing "createStore" function',
      file: filePath,
    };
  }

  return null;
}

/**
 * Rule 5: Has triggers array
 * Check: `triggers` is TriggerConfig array
 */
function checkHasTriggers(content: string, filePath: string): ValidationError | null {
  // Look for triggers: [...]
  const triggersPattern = /triggers\s*:\s*\[/;

  if (!triggersPattern.test(content)) {
    return {
      rule: 5,
      message: 'Mode definition missing "triggers" array',
      file: filePath,
    };
  }

  return null;
}

/**
 * Rule 6: Has defaults.section
 * Check: `defaults.section` exists
 */
function checkHasDefaultSection(content: string, filePath: string): ValidationError | null {
  // Look for defaults: { section: '...' } pattern
  // This is tricky with regex, but we can look for the general pattern
  const defaultsPattern = /defaults\s*:\s*\{/;

  if (!defaultsPattern.test(content)) {
    return {
      rule: 6,
      message: 'Mode definition missing "defaults" object',
      file: filePath,
    };
  }

  // Now check for section within defaults block
  // We need to find the defaults object and check it has a section key
  const sectionInDefaultsPattern = /defaults\s*:\s*\{[^}]*section\s*:\s*['"][^'"]*['"]/s;

  if (!sectionInDefaultsPattern.test(content)) {
    const line = findLineNumber(content, defaultsPattern);
    return {
      rule: 6,
      message: 'Mode "defaults" object missing required "section" field',
      line: line || undefined,
      file: filePath,
    };
  }

  return null;
}

/**
 * Rule 7: Triggers reference valid types
 * Check: All trigger types in registry
 */
function checkTriggerTypes(content: string, filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Extract all trigger type values: { type: 'scroll-progress', ... }
  const triggerTypePattern = /\{\s*type\s*:\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = triggerTypePattern.exec(content)) !== null) {
    const triggerType = match[1];

    // Check against known trigger types
    if (!KNOWN_TRIGGER_TYPES.includes(triggerType)) {
      const line = findLineNumber(
        content,
        new RegExp(`type\\s*:\\s*['"]${triggerType}['"]`)
      );
      errors.push({
        rule: 7,
        message: `Unknown trigger type: "${triggerType}". Known types: ${KNOWN_TRIGGER_TYPES.join(", ")}`,
        line: line || undefined,
        file: filePath,
      });
    }
  }

  return errors;
}

/**
 * Rule 8: Default behaviours exist
 * Check: All defaults in behaviour registry
 */
function checkDefaultBehaviours(content: string, filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Extract all values from defaults object
  // This matches patterns like: section: 'scroll-stack', Image: 'depth-layer'
  const defaultsMatch = content.match(/defaults\s*:\s*\{([^}]+)\}/s);

  if (!defaultsMatch) {
    return errors; // No defaults found, rule 6 will catch this
  }

  const defaultsContent = defaultsMatch[1];
  const behaviourPattern = /['"]([^'"]+)['"]/g;
  let match;

  while ((match = behaviourPattern.exec(defaultsContent)) !== null) {
    const behaviourId = match[1];

    // Check against known behaviour IDs
    if (!KNOWN_BEHAVIOUR_IDS.includes(behaviourId)) {
      const line = findLineNumber(
        content,
        new RegExp(`['"]${behaviourId}['"]`)
      );
      errors.push({
        rule: 8,
        message: `Unknown behaviour in defaults: "${behaviourId}". Known behaviours: ${KNOWN_BEHAVIOUR_IDS.join(", ")}`,
        line: line || undefined,
        file: filePath,
      });
    }
  }

  return errors;
}

/**
 * Rule 9: No DOM access
 * Check: No `document`, `window`
 */
function checkNoDom(
  content: string,
  filePath: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for document access
  const documentPattern = /\bdocument\b(?!\s*:)/g; // Avoid matching 'document:' in comments
  const documentLines = findAllLineNumbers(content, /\bdocument\b/);

  for (const line of documentLines) {
    // Skip if it's in a comment
    const lineContent = content.split("\n")[line - 1];
    if (lineContent.trim().startsWith("//") || lineContent.trim().startsWith("*")) {
      continue;
    }

    errors.push({
      rule: 9,
      message: 'Direct DOM access forbidden: "document" reference found',
      line,
      file: filePath,
    });
  }

  // Check for window access
  const windowLines = findAllLineNumbers(content, /\bwindow\b/);

  for (const line of windowLines) {
    const lineContent = content.split("\n")[line - 1];
    if (lineContent.trim().startsWith("//") || lineContent.trim().startsWith("*")) {
      continue;
    }

    errors.push({
      rule: 9,
      message: 'Direct DOM access forbidden: "window" reference found',
      line,
      file: filePath,
    });
  }

  return errors;
}

/**
 * Rule 10: No React imports
 * Check: No `import * from 'react'`
 */
function checkNoReact(content: string, filePath: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for any React imports
  const reactImportPatterns = [
    /import\s+.*\s+from\s+['"]react['"]/,
    /import\s+\*\s+as\s+React\s+from\s+['"]react['"]/,
    /import\s+React\s+from\s+['"]react['"]/,
    /import\s+\{[^}]*\}\s+from\s+['"]react['"]/,
    /require\s*\(\s*['"]react['"]\s*\)/,
  ];

  for (const pattern of reactImportPatterns) {
    const line = findLineNumber(content, pattern);
    if (line) {
      errors.push({
        rule: 10,
        message: "React imports forbidden in mode definitions",
        line,
        file: filePath,
      });
    }
  }

  return errors;
}

// ============================================================================
// Main Validation
// ============================================================================

/**
 * Validates a mode directory against all rules.
 */
function validateMode(modeDir: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Read mode files
  const files = readModeFiles(modeDir);
  if (!files) {
    errors.push(`Mode index.ts not found in: ${modeDir}`);
    return { valid: false, errors, warnings };
  }

  const modeName = extractModeName(modeDir);
  const allContent = files.indexContent + (files.storeContent || "");

  // Validate store.ts exists (warning, not error for simple modes)
  if (!files.storeContent) {
    warnings.push(`store.ts not found in: ${modeDir} (may be acceptable for static mode)`);
  }

  // Rule 1: Exports named Mode constant
  const rule1Error = checkExportsMode(files.indexContent, modeName, files.indexPath);
  if (rule1Error) {
    errors.push(formatError(rule1Error));
  }

  // Rule 2: Has id field
  const rule2Error = checkHasId(files.indexContent, files.indexPath);
  if (rule2Error) {
    errors.push(formatError(rule2Error));
  }

  // Rule 3: Has provides array
  const rule3Error = checkHasProvides(files.indexContent, files.indexPath);
  if (rule3Error) {
    errors.push(formatError(rule3Error));
  }

  // Rule 4: Has createStore function
  const rule4Error = checkHasCreateStore(files.indexContent, files.indexPath);
  if (rule4Error) {
    errors.push(formatError(rule4Error));
  }

  // Rule 5: Has triggers array
  const rule5Error = checkHasTriggers(files.indexContent, files.indexPath);
  if (rule5Error) {
    errors.push(formatError(rule5Error));
  }

  // Rule 6: Has defaults.section
  const rule6Error = checkHasDefaultSection(files.indexContent, files.indexPath);
  if (rule6Error) {
    errors.push(formatError(rule6Error));
  }

  // Rule 7: Triggers reference valid types
  const rule7Errors = checkTriggerTypes(files.indexContent, files.indexPath);
  for (const error of rule7Errors) {
    errors.push(formatError(error));
  }

  // Rule 8: Default behaviours exist
  const rule8Errors = checkDefaultBehaviours(files.indexContent, files.indexPath);
  for (const error of rule8Errors) {
    errors.push(formatError(error));
  }

  // Rule 9: No DOM access (check both files)
  const rule9IndexErrors = checkNoDom(files.indexContent, files.indexPath);
  for (const error of rule9IndexErrors) {
    errors.push(formatError(error));
  }

  if (files.storeContent) {
    const rule9StoreErrors = checkNoDom(files.storeContent, files.storePath);
    for (const error of rule9StoreErrors) {
      errors.push(formatError(error));
    }
  }

  // Rule 10: No React imports (check both files)
  const rule10IndexErrors = checkNoReact(files.indexContent, files.indexPath);
  for (const error of rule10IndexErrors) {
    errors.push(formatError(error));
  }

  if (files.storeContent) {
    const rule10StoreErrors = checkNoReact(files.storeContent, files.storePath);
    for (const error of rule10StoreErrors) {
      errors.push(formatError(error));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Formats a validation error into a string.
 */
function formatError(error: ValidationError): string {
  const location = error.line ? `:${error.line}` : "";
  const file = error.file ? path.basename(error.file) : "unknown";
  return `[Rule ${error.rule}] ${file}${location}: ${error.message}`;
}

// ============================================================================
// CLI
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: mode.validator.ts <mode-directory>");
    console.error("Example: mode.validator.ts creativeshire/experience/modes/parallax");
    process.exit(1);
  }

  const modeDir = args[0];

  // Resolve to absolute path if relative
  const absoluteModeDir = path.isAbsolute(modeDir)
    ? modeDir
    : path.resolve(process.cwd(), modeDir);

  console.log(`[mode-validator] Validating mode: ${path.basename(absoluteModeDir)}`);
  console.log(`[mode-validator] Path: ${absoluteModeDir}`);

  try {
    // Check if directory exists
    if (!fs.existsSync(absoluteModeDir)) {
      console.error(`[mode-validator] Directory not found: ${absoluteModeDir}`);
      process.exit(1);
    }

    if (!fs.statSync(absoluteModeDir).isDirectory()) {
      console.error(`[mode-validator] Path is not a directory: ${absoluteModeDir}`);
      process.exit(1);
    }

    const result = validateMode(absoluteModeDir);

    // Print warnings
    if (result.warnings.length > 0) {
      console.log("\nWarnings:");
      result.warnings.forEach((w) => console.log(`  ! ${w}`));
    }

    // Print errors
    if (result.errors.length > 0) {
      console.log("\nErrors:");
      result.errors.forEach((e) => console.log(`  x ${e}`));
      console.log(
        `\n[mode-validator] x Failed (${result.errors.length} error${result.errors.length === 1 ? "" : "s"})`
      );
      process.exit(2);
    }

    console.log(`[mode-validator] Pass`);
    process.exit(0);
  } catch (error) {
    console.error(`[mode-validator] Validator crashed: ${error}`);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
