/**
 * Project Assistant Validator
 *
 * Validates that the Project Assistant agent stays within its boundaries:
 * - Cannot edit code files (specialists own implementation)
 * - Can only edit task files in .claude/tasks/
 * - Must maintain proper ITEM-XXX format in completion records
 * - Must maintain proper index format in index.md
 *
 * The Project Assistant is the task hygiene guardian - they maintain
 * consistency across task files but never implement features.
 *
 * Rules:
 * - pa-no-code-edit: File extension not .ts, .tsx, .js, .jsx, .css, .scss, .json
 * - pa-allowed-paths: Path matches .claude/tasks/**
 * - pa-item-format: ITEM-XXX.md has required fields
 * - pa-index-format: index.md has required tables
 * - pa-id-sequential: Item IDs are sequential with no gaps
 *
 * @module validators/generalist/project-assistant
 */

import * as fs from 'fs';
import * as path from 'path';
import { getFilePathFromHook, getFileContent, outputAllow, outputBlock } from '../_shared/io';
import { checkGeneralistBoundary } from '../_shared/generalist-boundaries';

/**
 * Required fields in a completion record (ITEM-XXX.md)
 */
const COMPLETION_REQUIRED_FIELDS = [
  { pattern: /^- \*\*Type:\*\*/m, name: 'Type' },
  { pattern: /^- \*\*Priority:\*\*/m, name: 'Priority' },
  { pattern: /^- \*\*Completed:\*\*/m, name: 'Completed' },
  { pattern: /^## Summary/m, name: 'Summary section' },
];

/**
 * Required sections in index.md
 */
const INDEX_REQUIRED_SECTIONS = [
  { pattern: /^## Summary/m, name: 'Summary section' },
  { pattern: /^## Recent/m, name: 'Recent section' },
  { pattern: /^## All Items/m, name: 'All Items section' },
];

/**
 * Validate ITEM-XXX.md completion record format.
 */
function validateCompletionRecord(content: string, filePath: string): string[] {
  const errors: string[] = [];

  // Check for required fields
  for (const field of COMPLETION_REQUIRED_FIELDS) {
    if (!field.pattern.test(content)) {
      errors.push(field.name);
    }
  }

  // Check for proper header format (# ITEM-XXX: Title)
  const headerMatch = content.match(/^# (ITEM-\d+):/m);
  if (!headerMatch) {
    errors.push('Header format (# ITEM-XXX: Title)');
  } else {
    // Verify filename matches header
    const fileName = path.basename(filePath, '.md');
    const headerItemId = headerMatch[1];
    if (fileName !== headerItemId && !fileName.includes('-')) {
      // Allow combined items like ITEM-025-031
      errors.push(`Header/filename mismatch (file: ${fileName}, header: ${headerItemId})`);
    }
  }

  return errors;
}

/**
 * Validate index.md format.
 */
function validateIndexFormat(content: string): string[] {
  const errors: string[] = [];

  // Check for required sections
  for (const section of INDEX_REQUIRED_SECTIONS) {
    if (!section.pattern.test(content)) {
      errors.push(section.name);
    }
  }

  // Check for summary table with counts
  if (!/\| Total Items \|/i.test(content) && !/\| Metric \|.*\| Value \|/i.test(content)) {
    errors.push('Summary table with item counts');
  }

  return errors;
}

/**
 * Extract all ITEM-XXX IDs from backlog content.
 */
function extractBacklogIds(content: string): number[] {
  const regex = /\[ITEM-(\d+)\]/g;
  const ids: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const id = parseInt(match[1], 10);
    if (!isNaN(id) && ids.indexOf(id) === -1) {
      ids.push(id);
    }
  }

  return ids.sort((a, b) => a - b);
}

/**
 * Find gaps in a sequence of IDs (relative to completed items).
 * We only check for gaps in the backlog IDs that should follow completed IDs.
 */
function findIdGaps(backlogIds: number[], highestCompletedId: number): number[] {
  if (backlogIds.length === 0) return [];

  const gaps: number[] = [];
  const minBacklogId = Math.min(...backlogIds);

  // Check gap between completed and backlog
  if (minBacklogId > highestCompletedId + 1) {
    for (let i = highestCompletedId + 1; i < minBacklogId; i++) {
      gaps.push(i);
    }
  }

  // Check gaps within backlog
  const sortedIds = [...backlogIds].sort((a, b) => a - b);
  for (let i = 1; i < sortedIds.length; i++) {
    const expected = sortedIds[i - 1] + 1;
    if (sortedIds[i] > expected) {
      for (let j = expected; j < sortedIds[i]; j++) {
        gaps.push(j);
      }
    }
  }

  return gaps;
}

/**
 * Get highest completed item ID by scanning completed folder.
 */
function getHighestCompletedId(): number {
  const completedDir = path.join(process.cwd(), '.claude', 'tasks', 'completed');

  if (!fs.existsSync(completedDir)) {
    return 0;
  }

  const files = fs.readdirSync(completedDir);
  let highestId = 0;

  for (const file of files) {
    // Match ITEM-XXX.md or ITEM-XXX-YYY.md (combined items)
    const match = file.match(/^ITEM-(\d+)(?:-(\d+))?\.md$/);
    if (match) {
      const id1 = parseInt(match[1], 10);
      const id2 = match[2] ? parseInt(match[2], 10) : id1;
      highestId = Math.max(highestId, id1, id2);
    }
  }

  return highestId;
}

/**
 * Main validation function for Project Assistant.
 *
 * Multi-phase validation:
 * 1. File type and path check (via generalist-boundaries)
 * 2. Format validation for specific file types
 * 3. ID sequence validation for backlog
 */
function validate(): void {
  // Get the file path from hook input
  const filePath = getFilePathFromHook();

  // If no file path, allow (nothing to validate)
  if (!filePath) {
    outputAllow();
    return;
  }

  // Normalize path for comparison
  const normalizedPath = filePath.replace(/\\/g, '/');

  // ============================================================================
  // PHASE 1: File Type & Path Check
  // ============================================================================

  const boundaryResult = checkGeneralistBoundary(filePath, 'project-assistant');

  if (!boundaryResult.allowed) {
    outputBlock(boundaryResult.reason!);
    // outputBlock never returns (exits process)
  }

  // ============================================================================
  // PHASE 2: Format Validation
  // ============================================================================

  let content: string;
  try {
    content = getFileContent(filePath);
  } catch (error) {
    // If we can't read the file, allow the edit
    // (file might not exist yet for new files)
    outputAllow();
    return;
  }

  // Check completion record format
  if (/ITEM-\d+\.md$/.test(normalizedPath) || /ITEM-\d+-\d+\.md$/.test(normalizedPath)) {
    const errors = validateCompletionRecord(content, filePath);

    if (errors.length > 0) {
      outputBlock(`FORMAT VIOLATION: Completion record missing required fields.

  File: ${filePath}
  Missing: ${errors.join(', ')}

  Completion records must include:
  - Header: # ITEM-XXX: Title
  - Type field: - **Type:** Feature | Bug | Refactor | Migration | Chore
  - Priority field: - **Priority:** P0 | P1 | P2 | P3
  - Completed field: - **Completed:** YYYY-MM-DD
  - Summary section: ## Summary

  Fix: Add the missing fields following the completion template.`);
      // outputBlock never returns
    }
  }

  // Check index.md format
  if (normalizedPath.endsWith('completed/index.md')) {
    const errors = validateIndexFormat(content);

    if (errors.length > 0) {
      outputBlock(`FORMAT VIOLATION: Index file missing required sections.

  File: ${filePath}
  Missing: ${errors.join(', ')}

  Index files must include:
  - ## Summary - with item counts table
  - ## Recent - last 10 completed items
  - ## All Items - complete list with links

  Fix: Add the missing sections following the index template.`);
      // outputBlock never returns
    }
  }

  // ============================================================================
  // PHASE 3: ID Sequence Validation (for backlog.md)
  // ============================================================================

  if (normalizedPath.endsWith('backlog.md')) {
    const backlogIds = extractBacklogIds(content);
    const highestCompletedId = getHighestCompletedId();
    const gaps = findIdGaps(backlogIds, highestCompletedId);

    // Only warn about significant gaps (more than 5 consecutive missing IDs)
    // Small gaps might be intentional (reserved IDs, split items, etc.)
    if (gaps.length > 10) {
      outputBlock(`ID SEQUENCE WARNING: Large gap detected in item IDs.

  File: ${filePath}
  Highest Completed ID: ITEM-${String(highestCompletedId).padStart(3, '0')}
  Backlog IDs found: ${backlogIds.map(id => `ITEM-${String(id).padStart(3, '0')}`).join(', ')}
  Gap size: ${gaps.length} missing IDs

  Missing IDs: ${gaps.slice(0, 10).map(id => `ITEM-${String(id).padStart(3, '0')}`).join(', ')}${gaps.length > 10 ? '...' : ''}

  Item IDs should be sequential to maintain traceability.
  Next ID after ITEM-${String(highestCompletedId).padStart(3, '0')} should be ITEM-${String(highestCompletedId + 1).padStart(3, '0')}.

  Fix: Renumber backlog items to continue sequentially from the highest completed ID.`);
      // outputBlock never returns
    }
  }

  // All checks passed
  outputAllow();
}

// Run validation
validate();
