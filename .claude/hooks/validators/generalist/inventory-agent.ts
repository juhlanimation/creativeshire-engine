/**
 * Inventory Agent Validator
 *
 * Validates that the inventory-agent stays within its boundaries:
 * - Cannot edit code files (generalist constraint)
 * - Can only edit .claude/tasks/conversion-manifest.md
 * - Manifest must have proper format with required columns
 * - Status values must be valid
 * - Each source must have a target mapping
 *
 * Used by agents:
 * - inventory-agent (PostToolUse)
 *
 * Two-phase validation:
 * 1. BOUNDARY CHECK: Is file allowed for inventory-agent?
 * 2. PROTOCOL CHECK: Does manifest follow required format?
 *
 * Rules enforced:
 * | Rule ID            | Check                                                    |
 * |--------------------|----------------------------------------------------------|
 * | inv-no-code-edit   | File not .ts, .tsx, .js, .jsx, .css                      |
 * | inv-manifest-format| Has required columns (Source, Target, Status, Assigned)  |
 * | inv-valid-status   | Status in [pending, in-progress, converted, verified, cleaned] |
 * | inv-has-target     | Each source entry has a target mapping                   |
 *
 * @module validators/generalist/inventory-agent
 */

import {
  getFilePathFromHook,
  getFileContent,
  outputAllow,
  outputBlock,
} from '../_shared/io';

import {
  checkGeneralistBoundary,
} from '../_shared/generalist-boundaries';

import {
  checkManifestFormat,
  formatManifestFormatError,
  VALID_MANIFEST_STATUSES,
} from '../_shared/protocol-checks';

/**
 * Agent name constant for boundary checks.
 */
const AGENT_NAME = 'inventory-agent' as const;

/**
 * Check that each source row has a non-empty target.
 *
 * @param content - The manifest file content
 * @returns Object with validation result and any missing targets
 */
function checkSourcesHaveTargets(content: string): {
  passed: boolean;
  missingTargets: string[];
} {
  const missingTargets: string[] = [];

  // Find the table header row to get column positions
  const tableHeaderMatch = /^\|(.+)\|$/m.exec(content);
  if (!tableHeaderMatch) {
    // No table found - this will be caught by manifest format check
    return { passed: true, missingTargets: [] };
  }

  const headerCells = tableHeaderMatch[1]
    .split('|')
    .map((c) => c.trim())
    .filter((c) => c);

  // Find Source and Target column indices
  const sourceIndex = headerCells.findIndex((h) => /source/i.test(h));
  const targetIndex = headerCells.findIndex((h) => /target/i.test(h));

  if (sourceIndex === -1 || targetIndex === -1) {
    // Missing columns - this will be caught by manifest format check
    return { passed: true, missingTargets: [] };
  }

  // Find all table rows (skip header and separator)
  const tableRows = content.match(/^\|[^-].*\|$/gm);
  if (!tableRows || tableRows.length <= 1) {
    // Only header row or no rows - nothing to validate
    return { passed: true, missingTargets: [] };
  }

  // Check each data row (skip header)
  for (let i = 1; i < tableRows.length; i++) {
    const row = tableRows[i];
    const cells = row
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c);

    const sourceValue = cells[sourceIndex]?.replace(/[`*]/g, '').trim();
    const targetValue = cells[targetIndex]?.replace(/[`*]/g, '').trim();

    // If source has a value but target is empty or just whitespace/dash
    if (sourceValue && sourceValue !== '-' && sourceValue !== '') {
      if (!targetValue || targetValue === '-' || targetValue === '') {
        missingTargets.push(sourceValue);
      }
    }
  }

  return {
    passed: missingTargets.length === 0,
    missingTargets,
  };
}

/**
 * Format error message for missing target mappings.
 *
 * @param filePath - The file that failed validation
 * @param missingTargets - List of source files without targets
 * @returns Formatted error message
 */
function formatMissingTargetsError(
  filePath: string,
  missingTargets: string[]
): string {
  let error = `PROTOCOL VIOLATION: Sources missing target mappings\n\n`;
  error += `  File: ${filePath}\n`;
  error += `  Issue: ${missingTargets.length} source(s) have no Creativeshire target\n\n`;
  error += `  Sources without targets:\n`;

  for (const source of missingTargets.slice(0, 10)) {
    error += `    - ${source}\n`;
  }

  if (missingTargets.length > 10) {
    error += `    ... and ${missingTargets.length - 10} more\n`;
  }

  error += `\n  Fix: Add a target path in the "Target" column for each source.\n`;
  error += `  Every source file must map to its Creativeshire equivalent.\n`;

  return error;
}

/**
 * Get contextual help message explaining manifest format.
 *
 * @returns Help message with examples
 */
function getManifestContextHelp(): string {
  return `
---
MANIFEST FORMAT GUIDELINES:

The conversion manifest tracks migration from old code to Creativeshire architecture.
It must be a markdown table with these columns:

| Source File | Creativeshire Target | Status | Assigned To |
|-------------|---------------------|--------|-------------|
| path/to/old | path/to/new | pending | agent-name |

Required columns:
- Source (or Source File): The original file path
- Target (or Creativeshire Target): The new file path in Creativeshire
- Status: One of ${VALID_MANIFEST_STATUSES.join(', ')}
- Assigned (or Assigned To): The specialist agent handling conversion

Status progression:
- pending: Not yet started
- in-progress: Being converted
- converted: New code written
- verified: Tested and working
- cleaned: Old code removed

Example:
| Source File | Creativeshire Target | Status | Assigned To |
|-------------|---------------------|--------|-------------|
| components/Button.tsx | content/widgets/Button/index.tsx | converted | widget-builder |
| hooks/useScroll.ts | experience/triggers/useScroll.ts | in-progress | trigger-builder |
`;
}

/**
 * Main validation function.
 *
 * Phase 1: Boundary check - is the file allowed for inventory-agent?
 * Phase 2: Protocol check - does the manifest follow required format?
 */
function main(): void {
  // Get file path from hook or command line
  const filePath = getFilePathFromHook();

  // No file path provided - allow (nothing to validate)
  if (!filePath) {
    outputAllow();
    return;
  }

  // =========================================================================
  // PHASE 1: BOUNDARY CHECK
  // =========================================================================
  // Rule: inv-no-code-edit - Inventory Agent cannot edit code files
  // Rule: inv-allowed-paths - Only allowed to edit conversion-manifest.md

  const boundaryResult = checkGeneralistBoundary(filePath, AGENT_NAME);

  if (!boundaryResult.allowed) {
    outputBlock(boundaryResult.reason!);
    return;
  }

  // =========================================================================
  // PHASE 2: PROTOCOL CHECK
  // =========================================================================
  // Validate manifest format only for the conversion manifest file

  // Only validate manifest format for .md files in the tasks directory
  if (!filePath.endsWith('.md')) {
    outputAllow();
    return;
  }

  let content: string;
  try {
    content = getFileContent(filePath);
  } catch (error) {
    // If we can't read the file, block with the error
    const message = error instanceof Error ? error.message : String(error);
    outputBlock(`Failed to read file for validation: ${message}`);
    return;
  }

  // -------------------------------------------------------------------------
  // Rule: inv-manifest-format - Manifest must have required columns
  // -------------------------------------------------------------------------
  const manifestResult = checkManifestFormat(content);

  if (manifestResult.missingColumns.length > 0) {
    const formattedError = formatManifestFormatError(filePath, manifestResult);
    const contextHelp = getManifestContextHelp();
    outputBlock(formattedError + contextHelp);
    return;
  }

  // -------------------------------------------------------------------------
  // Rule: inv-valid-status - Status must be valid
  // -------------------------------------------------------------------------
  if (manifestResult.invalidStatuses.length > 0) {
    let error = `PROTOCOL VIOLATION: Invalid manifest status values\n\n`;
    error += `  File: ${filePath}\n`;
    error += `  Invalid statuses: ${manifestResult.invalidStatuses.join(', ')}\n\n`;
    error += `  Valid status values: ${VALID_MANIFEST_STATUSES.join(', ')}\n`;
    error += getManifestContextHelp();
    outputBlock(error);
    return;
  }

  // -------------------------------------------------------------------------
  // Rule: inv-has-target - Each source must have a target mapping
  // -------------------------------------------------------------------------
  const targetResult = checkSourcesHaveTargets(content);

  if (!targetResult.passed) {
    const formattedError = formatMissingTargetsError(
      filePath,
      targetResult.missingTargets
    );
    const contextHelp = getManifestContextHelp();
    outputBlock(formattedError + contextHelp);
    return;
  }

  // All checks passed
  outputAllow();
}

// Run the validator
main();
