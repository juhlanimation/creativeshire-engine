/**
 * Handoff protocol validation utilities for generalist agents.
 *
 * These functions validate that generalist agents follow the proper
 * communication protocols when creating tasks, manifests, and reports.
 *
 * Used by:
 * - Technical Director validator (task protocol)
 * - Project Manager validator (task protocol, status validation)
 * - Inventory Agent validator (manifest format)
 * - Parity Agent validator (parity report format)
 *
 * @module _shared/protocol-checks
 */

// ============================================================================
// Task Protocol
// ============================================================================

/**
 * Result of task protocol validation.
 *
 * Task files must contain specific fields to ensure proper handoffs
 * between generalist coordinators and specialist implementers.
 */
export interface TaskFields {
  /** Whether "Assigned To:" field is present */
  hasAssignedTo: boolean;
  /** Whether "Scope:" section is present */
  hasScope: boolean;
  /** Whether "Acceptance Criteria:" section is present */
  hasAcceptanceCriteria: boolean;
  /** Whether "Status:" field is present */
  hasStatus: boolean;
  /** The detected status value (if present) */
  statusValue?: string;
  /** List of missing required fields */
  missingFields: string[];
}

/**
 * Valid status values for task items.
 */
export const VALID_TASK_STATUSES = [
  'pending',
  'in-progress',
  'blocked',
  'completed',
] as const;

export type TaskStatus = (typeof VALID_TASK_STATUSES)[number];

/**
 * Check if content follows the task protocol.
 *
 * Task protocol requires:
 * - "Assigned To:" field specifying which specialist handles the task
 * - "Scope:" section defining what files/folders the specialist can touch
 * - "Acceptance Criteria:" section with checkboxes for completion
 * - "Status:" field with a valid status value
 *
 * @param content - The task file content to validate
 * @returns TaskFields with validation results
 *
 * @example
 * ```typescript
 * const result = checkTaskProtocol(taskContent);
 * if (result.missingFields.length > 0) {
 *   outputBlock(`Missing required fields: ${result.missingFields.join(', ')}`);
 * }
 * ```
 */
export function checkTaskProtocol(content: string): TaskFields {
  const missingFields: string[] = [];

  // Check for "Assigned To:" field
  // Matches: "Assigned To:", "**Assigned To:**", "Assigned To:"
  const hasAssignedTo = /\*?\*?Assigned\s+To\*?\*?\s*:/i.test(content);
  if (!hasAssignedTo) {
    missingFields.push('Assigned To');
  }

  // Check for "Scope:" section
  // Matches: "## Scope", "### Scope", "Scope:", "**Scope:**"
  const hasScope =
    /^##+\s*Scope\b|^\*?\*?Scope\*?\*?\s*:/im.test(content);
  if (!hasScope) {
    missingFields.push('Scope');
  }

  // Check for "Acceptance Criteria:" section
  // Matches: "## Acceptance Criteria", "### Acceptance Criteria", "Acceptance Criteria:"
  const hasAcceptanceCriteria =
    /^##+\s*Acceptance\s+Criteria\b|^\*?\*?Acceptance\s+Criteria\*?\*?\s*:/im.test(
      content
    );
  if (!hasAcceptanceCriteria) {
    missingFields.push('Acceptance Criteria');
  }

  // Check for "Status:" field
  // Matches: "Status:", "**Status:**"
  const statusMatch = /\*?\*?Status\*?\*?\s*:\s*(\S+)/i.exec(content);
  const hasStatus = statusMatch !== null;
  let statusValue: string | undefined;

  if (hasStatus) {
    statusValue = statusMatch[1].toLowerCase().replace(/[*`]/g, '');
  } else {
    missingFields.push('Status');
  }

  return {
    hasAssignedTo,
    hasScope,
    hasAcceptanceCriteria,
    hasStatus,
    statusValue,
    missingFields,
  };
}

/**
 * Check if a status value is valid.
 *
 * @param status - The status value to check
 * @returns True if the status is valid
 */
export function isValidTaskStatus(status: string): status is TaskStatus {
  return VALID_TASK_STATUSES.includes(status.toLowerCase() as TaskStatus);
}

// ============================================================================
// Manifest Format
// ============================================================================

/**
 * Result of manifest format validation.
 *
 * Manifests track the conversion of source files to Creativeshire equivalents.
 * They must have a table with specific columns.
 */
export interface ManifestResult {
  /** Whether the manifest has a valid table structure */
  hasValidTable: boolean;
  /** Whether "Source" column is present */
  hasSourceColumn: boolean;
  /** Whether "Target" column is present */
  hasTargetColumn: boolean;
  /** Whether "Status" column is present */
  hasStatusColumn: boolean;
  /** Whether "Assigned" column is present */
  hasAssignedColumn: boolean;
  /** List of missing required columns */
  missingColumns: string[];
  /** List of invalid status values found */
  invalidStatuses: string[];
}

/**
 * Valid status values for manifest items.
 */
export const VALID_MANIFEST_STATUSES = [
  'pending',
  'in-progress',
  'converted',
  'verified',
  'cleaned',
] as const;

export type ManifestStatus = (typeof VALID_MANIFEST_STATUSES)[number];

/**
 * Check if content follows the manifest format.
 *
 * Manifest format requires a markdown table with columns:
 * - Source File (or Source)
 * - Creativeshire Target (or Target)
 * - Status (with valid values)
 * - Assigned To (or Assigned)
 *
 * @param content - The manifest file content to validate
 * @returns ManifestResult with validation results
 *
 * @example
 * ```typescript
 * const result = checkManifestFormat(manifestContent);
 * if (result.missingColumns.length > 0) {
 *   outputBlock(`Missing columns: ${result.missingColumns.join(', ')}`);
 * }
 * ```
 */
export function checkManifestFormat(content: string): ManifestResult {
  const missingColumns: string[] = [];
  const invalidStatuses: string[] = [];

  // Find markdown table header row
  // Table headers are like: | Col1 | Col2 | Col3 |
  const tableHeaderMatch = /^\|(.+)\|$/m.exec(content);
  const hasValidTable = tableHeaderMatch !== null;

  if (!hasValidTable) {
    return {
      hasValidTable: false,
      hasSourceColumn: false,
      hasTargetColumn: false,
      hasStatusColumn: false,
      hasAssignedColumn: false,
      missingColumns: ['Source', 'Target', 'Status', 'Assigned'],
      invalidStatuses: [],
    };
  }

  const headerRow = tableHeaderMatch[1].toLowerCase();

  // Check for required columns
  const hasSourceColumn = /source/i.test(headerRow);
  if (!hasSourceColumn) {
    missingColumns.push('Source');
  }

  const hasTargetColumn = /target/i.test(headerRow);
  if (!hasTargetColumn) {
    missingColumns.push('Target');
  }

  const hasStatusColumn = /status/i.test(headerRow);
  if (!hasStatusColumn) {
    missingColumns.push('Status');
  }

  const hasAssignedColumn = /assigned/i.test(headerRow);
  if (!hasAssignedColumn) {
    missingColumns.push('Assigned');
  }

  // Check status values in the table if Status column exists
  if (hasStatusColumn) {
    // Find all table rows after the header and separator
    const tableRows = content.match(/^\|[^-].*\|$/gm);
    if (tableRows && tableRows.length > 1) {
      // Skip header row
      for (let i = 1; i < tableRows.length; i++) {
        const row = tableRows[i];
        // Split by | and find status column
        const cells = row
          .split('|')
          .map((c) => c.trim())
          .filter((c) => c);

        // Find status cell (try to match column position from header)
        const headerCells = tableHeaderMatch[1]
          .split('|')
          .map((c) => c.trim())
          .filter((c) => c);

        const statusIndex = headerCells.findIndex((h) =>
          /status/i.test(h)
        );

        if (statusIndex !== -1 && cells[statusIndex]) {
          const status = cells[statusIndex].toLowerCase().replace(/[`*]/g, '');
          if (
            status &&
            !VALID_MANIFEST_STATUSES.includes(status as ManifestStatus)
          ) {
            invalidStatuses.push(status);
          }
        }
      }
    }
  }

  return {
    hasValidTable,
    hasSourceColumn,
    hasTargetColumn,
    hasStatusColumn,
    hasAssignedColumn,
    missingColumns,
    invalidStatuses: Array.from(new Set(invalidStatuses)), // Dedupe
  };
}

/**
 * Check if a status value is valid for manifests.
 *
 * @param status - The status value to check
 * @returns True if the status is valid
 */
export function isValidManifestStatus(
  status: string
): status is ManifestStatus {
  return VALID_MANIFEST_STATUSES.includes(
    status.toLowerCase() as ManifestStatus
  );
}

// ============================================================================
// Parity Report Format
// ============================================================================

/**
 * Result of parity report format validation.
 *
 * Parity reports document the comparison between original and converted
 * components to ensure behavioral equivalence.
 */
export interface ParityResult {
  /** Whether "Visual Parity" section is present */
  hasVisualSection: boolean;
  /** Whether "Behavioral Parity" section is present */
  hasBehavioralSection: boolean;
  /** Whether "Intentional Differences" section is present */
  hasDifferencesSection: boolean;
  /** Whether "Issues Found" section is present */
  hasIssuesSection: boolean;
  /** Whether browser testing evidence is present */
  hasBrowserTestEvidence: boolean;
  /** List of missing required sections */
  missingSections: string[];
}

/**
 * Check if content follows the parity report format.
 *
 * Parity report format requires sections:
 * - Visual Parity (layout, colors, responsive, animations)
 * - Behavioral Parity (handlers, scroll, state, errors)
 * - Intentional Differences (approved deviations)
 * - Issues Found (for specialist follow-up)
 *
 * Also checks for browser testing evidence.
 *
 * @param content - The parity report content to validate
 * @returns ParityResult with validation results
 *
 * @example
 * ```typescript
 * const result = checkParityReportFormat(reportContent);
 * if (result.missingSections.length > 0) {
 *   outputBlock(`Missing sections: ${result.missingSections.join(', ')}`);
 * }
 * ```
 */
export function checkParityReportFormat(content: string): ParityResult {
  const missingSections: string[] = [];

  // Check for "Visual Parity" section
  // Matches: "## Visual Parity", "### Visual Parity", "Visual Parity:"
  const hasVisualSection = /^##+\s*Visual\s+Parity\b|^\*?\*?Visual\s+Parity\*?\*?\s*:/im.test(
    content
  );
  if (!hasVisualSection) {
    missingSections.push('Visual Parity');
  }

  // Check for "Behavioral Parity" section
  // Matches: "## Behavioral Parity", "### Behavioral Parity", "Behavioral Parity:"
  const hasBehavioralSection =
    /^##+\s*Behavioral\s+Parity\b|^\*?\*?Behavioral\s+Parity\*?\*?\s*:/im.test(
      content
    );
  if (!hasBehavioralSection) {
    missingSections.push('Behavioral Parity');
  }

  // Check for "Intentional Differences" section
  // Matches: "## Intentional Differences", "### Intentional Differences"
  const hasDifferencesSection =
    /^##+\s*Intentional\s+Differences\b|^\*?\*?Intentional\s+Differences\*?\*?\s*:/im.test(
      content
    );
  if (!hasDifferencesSection) {
    missingSections.push('Intentional Differences');
  }

  // Check for "Issues Found" or "Issues" section
  // Matches: "## Issues Found", "### Issues", "Issues Found:"
  const hasIssuesSection =
    /^##+\s*Issues(?:\s+Found)?\b|^\*?\*?Issues(?:\s+Found)?\*?\*?\s*:/im.test(
      content
    );
  if (!hasIssuesSection) {
    missingSections.push('Issues Found');
  }

  // Check for browser testing evidence
  // Look for mentions of browser testing, screenshots, or testing tools
  const hasBrowserTestEvidence =
    /browser\s+test/i.test(content) ||
    /screenshot/i.test(content) ||
    /tested\s+in\s+(chrome|firefox|safari|edge)/i.test(content) ||
    /playwright|puppeteer|cypress/i.test(content) ||
    /\.(png|jpg|jpeg|gif)\b/i.test(content) ||
    /visual\s+comparison/i.test(content) ||
    /browser\s+automation/i.test(content);

  return {
    hasVisualSection,
    hasBehavioralSection,
    hasDifferencesSection,
    hasIssuesSection,
    hasBrowserTestEvidence,
    missingSections,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format a task protocol error message with fix instructions.
 *
 * @param filePath - The file that failed validation
 * @param result - The TaskFields validation result
 * @returns Formatted error message
 */
export function formatTaskProtocolError(
  filePath: string,
  result: TaskFields
): string {
  let error = `PROTOCOL VIOLATION: Task missing required fields\n\n`;
  error += `  File: ${filePath}\n`;
  error += `  Missing: ${result.missingFields.join(', ')}\n\n`;
  error += `  All tasks must specify:\n`;

  if (!result.hasAssignedTo) {
    error += `  - Assigned To: [specialist-agent-name]\n`;
  }
  if (!result.hasScope) {
    error += `  - Scope: (section describing files/folders)\n`;
  }
  if (!result.hasAcceptanceCriteria) {
    error += `  - Acceptance Criteria: (checklist of deliverables)\n`;
  }
  if (!result.hasStatus) {
    error += `  - Status: pending|in-progress|blocked|completed\n`;
  }

  return error;
}

/**
 * Format a manifest format error message with fix instructions.
 *
 * @param filePath - The file that failed validation
 * @param result - The ManifestResult validation result
 * @returns Formatted error message
 */
export function formatManifestFormatError(
  filePath: string,
  result: ManifestResult
): string {
  let error = `PROTOCOL VIOLATION: Manifest format invalid\n\n`;
  error += `  File: ${filePath}\n`;

  if (!result.hasValidTable) {
    error += `  Issue: No markdown table found\n\n`;
    error += `  Manifest must have a table like:\n`;
    error += `  | Source File | Creativeshire Target | Status | Assigned To |\n`;
    error += `  |-------------|---------------------|--------|-------------|\n`;
    error += `  | path/to/old | path/to/new | pending | agent-name |\n`;
    return error;
  }

  if (result.missingColumns.length > 0) {
    error += `  Missing columns: ${result.missingColumns.join(', ')}\n\n`;
    error += `  Required columns: Source, Target, Status, Assigned\n`;
  }

  if (result.invalidStatuses.length > 0) {
    error += `\n  Invalid status values: ${result.invalidStatuses.join(', ')}\n`;
    error += `  Valid statuses: ${VALID_MANIFEST_STATUSES.join(', ')}\n`;
  }

  return error;
}

/**
 * Format a parity report error message with fix instructions.
 *
 * @param filePath - The file that failed validation
 * @param result - The ParityResult validation result
 * @returns Formatted error message
 */
export function formatParityReportError(
  filePath: string,
  result: ParityResult
): string {
  let error = `PROTOCOL VIOLATION: Parity report format invalid\n\n`;
  error += `  File: ${filePath}\n`;

  if (result.missingSections.length > 0) {
    error += `  Missing sections: ${result.missingSections.join(', ')}\n\n`;
    error += `  Required sections:\n`;
    error += `  ## Visual Parity\n`;
    error += `  ## Behavioral Parity\n`;
    error += `  ## Intentional Differences\n`;
    error += `  ## Issues Found\n`;
  }

  if (!result.hasBrowserTestEvidence) {
    error += `\n  Warning: No browser testing evidence found\n`;
    error += `  Parity verification requires browser testing.\n`;
    error += `  Include: screenshots, test tool mentions, or visual comparisons\n`;
  }

  return error;
}
