/**
 * Generalist agent boundary checking utilities.
 *
 * These functions ensure generalist agents stay in their lane:
 * - They cannot edit code files
 * - They can only edit markdown files in allowed locations
 *
 * Generalists communicate, specialists build.
 *
 * @module _shared/generalist-boundaries
 */

import * as path from 'path';

/**
 * All generalist agent types in the system.
 */
export type GeneralistAgent =
  | 'technical-director'
  | 'cleanup-agent'
  | 'inventory-agent'
  | 'parity-agent'
  | 'project-assistant';

/**
 * Describes an allowed path pattern for an agent.
 */
export interface AllowedPath {
  /** File path pattern (relative to project root) */
  pattern: string;
  /** Human-readable description of why this path is allowed */
  description: string;
}

/**
 * Result of a boundary check.
 */
export interface BoundaryResult {
  /** Whether the operation is allowed */
  allowed: boolean;
  /** Reason for blocking (only present if allowed is false) */
  reason?: string;
}

/**
 * File extensions that are considered code files.
 * Generalist agents cannot edit these.
 */
export const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json'];

/**
 * JSON files that are allowed but should be read-only.
 * These are not blocked by isCodeFile() but generalists still shouldn't edit them
 * unless they're in their allowed paths.
 */
const ALLOWED_JSON_READ_ONLY = ['package.json', 'tsconfig.json', 'components.json'];

/**
 * Maps each generalist agent to their allowed edit paths.
 *
 * Paths are relative to project root and must be markdown files.
 */
export const AGENT_ALLOWED_PATHS: Record<GeneralistAgent, AllowedPath[]> = {
  'technical-director': [
    { pattern: '.claude/tasks/backlog.md', description: 'Backlog management' },
    { pattern: '.claude/tasks/current-sprint.md', description: 'Sprint management' },
  ],
  'cleanup-agent': [
    { pattern: '.claude/tasks/current-sprint.md', description: 'Add cleanup tasks' },
  ],
  'inventory-agent': [
    { pattern: '.claude/tasks/conversion-manifest.md', description: 'Conversion tracking' },
  ],
  'parity-agent': [
    { pattern: '.claude/tasks/parity-report.md', description: 'Parity reports' },
  ],
  'project-assistant': [
    { pattern: '.claude/tasks/backlog.md', description: 'Backlog ID management' },
    { pattern: '.claude/tasks/current-sprint.md', description: 'Sprint status updates' },
    { pattern: '.claude/tasks/completed/index.md', description: 'Completion index maintenance' },
    { pattern: '.claude/tasks/completed/', description: 'Completion records (ITEM-XXX.md)' },
  ],
};

/**
 * Human-readable agent names for error messages.
 */
const AGENT_DISPLAY_NAMES: Record<GeneralistAgent, string> = {
  'technical-director': 'Technical Director',
  'cleanup-agent': 'Cleanup Agent',
  'inventory-agent': 'Inventory Agent',
  'parity-agent': 'Parity Agent',
  'project-assistant': 'Project Assistant',
};

/**
 * Check if a file is a code file that generalists cannot edit.
 *
 * @param filePath - The file path to check (absolute or relative)
 * @returns true if this is a code file that should be blocked
 *
 * @example
 * ```typescript
 * isCodeFile('components/Button.tsx'); // true
 * isCodeFile('.claude/tasks/backlog.md'); // false
 * isCodeFile('package.json'); // false (allowed JSON)
 * ```
 */
export function isCodeFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();

  // Not a code extension at all
  if (!CODE_EXTENSIONS.includes(ext)) {
    return false;
  }

  // Special handling for JSON files
  // Some JSON files like package.json are allowed (though still read-only)
  if (ext === '.json') {
    const fileName = path.basename(filePath);
    if (ALLOWED_JSON_READ_ONLY.includes(fileName)) {
      return false;
    }
    // Other JSON files are considered code (like data files)
    return true;
  }

  // All other code extensions are blocked
  return true;
}

/**
 * Normalize a file path for comparison.
 * Converts backslashes to forward slashes and removes leading ./
 */
function normalizePath(filePath: string): string {
  return filePath
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\//, '');
}

/**
 * Check if a file path is in the allowed paths for an agent.
 *
 * @param filePath - The file path to check
 * @param agent - The generalist agent type
 * @returns true if the path is allowed for this agent
 *
 * @example
 * ```typescript
 * isAllowedPath('.claude/tasks/backlog.md', 'technical-director'); // true
 * isAllowedPath('.claude/tasks/completed.md', 'technical-director'); // false
 * isAllowedPath('.claude/tasks/parity-report.md', 'parity-agent'); // true
 * ```
 */
export function isAllowedPath(filePath: string, agent: GeneralistAgent): boolean {
  const allowedPaths = AGENT_ALLOWED_PATHS[agent];
  if (!allowedPaths) {
    return false;
  }

  const normalizedFilePath = normalizePath(filePath);

  return allowedPaths.some((allowed) => {
    const normalizedPattern = normalizePath(allowed.pattern);
    // If pattern ends with '/', it's a directory pattern - check if file is inside
    if (normalizedPattern.endsWith('/')) {
      return normalizedFilePath.includes(normalizedPattern);
    }
    // Otherwise, exact file match (ends with pattern)
    return normalizedFilePath.endsWith(normalizedPattern);
  });
}

/**
 * Get suggested specialist agent for a given file path.
 */
function getSuggestedSpecialist(filePath: string): string {
  const normalizedPath = normalizePath(filePath).toLowerCase();

  // Content layer
  if (normalizedPath.includes('/widgets/content/')) return 'widget-builder';
  if (normalizedPath.includes('/widgets/layout/')) return 'widget-builder';
  if (normalizedPath.includes('/widgets/composite/')) return 'widget-composite-builder';
  if (normalizedPath.includes('/sections/')) return 'section-builder';
  if (normalizedPath.includes('/chrome/')) return 'chrome-builder';
  if (normalizedPath.includes('/features/')) return 'feature-builder';

  // Experience layer
  if (normalizedPath.includes('/behaviours/')) return 'behaviour-builder';
  if (normalizedPath.includes('/drivers/')) return 'driver-builder';
  if (normalizedPath.includes('/triggers/')) return 'trigger-builder';
  if (normalizedPath.includes('/presets/')) return 'preset-builder';

  // Schema and renderer
  if (normalizedPath.includes('/schema/')) return 'schema-builder';
  if (normalizedPath.includes('/renderer/')) return 'renderer-builder';

  // Default
  return 'appropriate specialist';
}

/**
 * Check if an agent is allowed to edit a file.
 *
 * Performs two checks:
 * 1. File type check - is this a code file?
 * 2. Path check - is this file in the agent's allowed paths?
 *
 * @param filePath - The file path being edited
 * @param agent - The generalist agent attempting the edit
 * @returns BoundaryResult with allowed status and reason if blocked
 *
 * @example
 * ```typescript
 * const result = checkGeneralistBoundary('components/Button.tsx', 'technical-director');
 * if (!result.allowed) {
 *   outputBlock(result.reason);
 * }
 * ```
 */
export function checkGeneralistBoundary(
  filePath: string,
  agent: GeneralistAgent
): BoundaryResult {
  const displayName = AGENT_DISPLAY_NAMES[agent] || agent;
  const ext = path.extname(filePath);

  // Phase 1: Check if this is a code file
  if (isCodeFile(filePath)) {
    const suggestedSpecialist = getSuggestedSpecialist(filePath);

    return {
      allowed: false,
      reason: `BOUNDARY VIOLATION: ${displayName} cannot edit code files.

  File: ${filePath}
  Type: Code file (${ext})

  Generalist agents coordinate work, they don't implement it.
  Create a task for ${suggestedSpecialist} instead.

  Fix: Add a task to .claude/tasks/current-sprint.md assigning this work
  to the appropriate specialist agent.`,
    };
  }

  // Phase 2: Check if this path is allowed for this agent
  if (!isAllowedPath(filePath, agent)) {
    const allowedPaths = AGENT_ALLOWED_PATHS[agent];
    const allowedList = allowedPaths
      .map((p) => `    - ${p.pattern} (${p.description})`)
      .join('\n');

    return {
      allowed: false,
      reason: `BOUNDARY VIOLATION: ${displayName} cannot edit this file.

  File: ${filePath}
  Agent: ${agent}

  Allowed paths for ${displayName}:
${allowedList}

  Fix: Edit one of the allowed files above, or create a task
  for the appropriate specialist to handle this file.`,
    };
  }

  // All checks passed
  return { allowed: true };
}
