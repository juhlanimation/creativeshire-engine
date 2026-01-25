#!/usr/bin/env npx tsx
/**
 * Analyst Validator
 *
 * Validates analyst output against analyst.spec.md rules.
 * Checks backlog item format, ID prefixes, and reference inclusion.
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

interface BacklogItem {
  id: string;
  title: string;
  line: number;
  hasReference: boolean;
  hasBuilder: boolean;
  hasReviewer: boolean;
}

// ============================================================================
// Configuration
// ============================================================================

const VALID_DOMAINS = ["Section", "Widget", "Experience", "Chrome", "Layout"];
const BACKLOG_PATH = ".claude/tasks/backlog.md";

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Checks if an ID has a valid domain prefix.
 * Valid: ITEM-Section-001, ITEM-Widget-005
 * Invalid: ITEM-001, ITEM-Unknown-001
 */
function checkIdPrefix(id: string): { valid: boolean; domain: string | null } {
  const match = id.match(/^ITEM-(\w+)-(\d+)$/);
  if (!match) {
    return { valid: false, domain: null };
  }

  const domain = match[1];
  if (!VALID_DOMAINS.includes(domain)) {
    return { valid: false, domain };
  }

  return { valid: true, domain };
}

/**
 * Parses backlog.md and extracts items.
 */
function parseBacklogItems(content: string): BacklogItem[] {
  const items: BacklogItem[] = [];
  const lines = content.split("\n");

  let currentItem: Partial<BacklogItem> | null = null;
  let lineNumber = 0;

  for (const line of lines) {
    lineNumber++;

    // Match item headers: #### [ITEM-XXX-XXX] Title
    const itemMatch = line.match(/^####\s+\[(ITEM-[\w-]+)\]\s+(.+)$/);
    if (itemMatch) {
      // Save previous item
      if (currentItem && currentItem.id) {
        items.push(currentItem as BacklogItem);
      }

      currentItem = {
        id: itemMatch[1],
        title: itemMatch[2],
        line: lineNumber,
        hasReference: false,
        hasBuilder: false,
        hasReviewer: false,
      };
      continue;
    }

    if (currentItem) {
      // Check for reference
      if (line.includes("**Reference:**") && line.includes("http")) {
        currentItem.hasReference = true;
      }
      if (line.includes("**Reference:**") && (line.includes("./") || line.includes("github:"))) {
        currentItem.hasReference = true;
      }

      // Check for builder
      if (line.includes("Builder:") && line.includes("-builder")) {
        currentItem.hasBuilder = true;
      }

      // Check for reviewer
      if (line.includes("Reviewer:") && line.includes("-reviewer")) {
        currentItem.hasReviewer = true;
      }
    }
  }

  // Don't forget the last item
  if (currentItem && currentItem.id) {
    items.push(currentItem as BacklogItem);
  }

  return items;
}

/**
 * Validates analyst output.
 */
function validateAnalystOutput(domain: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if backlog file exists
  if (!fs.existsSync(BACKLOG_PATH)) {
    warnings.push(`Backlog file not found: ${BACKLOG_PATH}`);
    return { valid: true, errors, warnings };
  }

  const content = fs.readFileSync(BACKLOG_PATH, "utf-8");
  const items = parseBacklogItems(content);

  // Filter items for this domain
  const domainItems = items.filter((item) => {
    const check = checkIdPrefix(item.id);
    return check.domain === domain;
  });

  if (domainItems.length === 0) {
    // No items for this domain - might be intentional
    return { valid: true, errors, warnings };
  }

  // Validate each item
  for (const item of domainItems) {
    // Rule 1: Valid ID prefix
    const idCheck = checkIdPrefix(item.id);
    if (!idCheck.valid) {
      errors.push(`Line ${item.line}: Invalid ID prefix "${item.id}"`);
    }

    // Rule 2: Reference included
    if (!item.hasReference) {
      errors.push(`Line ${item.line}: Item "${item.id}" missing reference`);
    }

    // Rule 3: Builder specified
    if (!item.hasBuilder) {
      errors.push(`Line ${item.line}: Item "${item.id}" missing builder specification`);
    }

    // Warning for missing reviewer (not required but recommended)
    if (!item.hasReviewer) {
      warnings.push(`Line ${item.line}: Item "${item.id}" has no reviewer specified`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// CLI
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);

  // Get domain from environment or argument
  const domain = args[0] || process.env.ANALYST_DOMAIN || "Section";

  console.log(`[analyst-validator] Checking ${domain} domain items...`);

  try {
    const result = validateAnalystOutput(domain);

    if (result.warnings.length > 0) {
      console.log("\nWarnings:");
      result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    }

    if (result.errors.length > 0) {
      console.log("\nErrors:");
      result.errors.forEach((e) => console.log(`  ✗ ${e}`));
      console.log(`\n[analyst-validator] ✗ Failed (${result.errors.length} errors)`);
      process.exit(2);
    }

    console.log(`[analyst-validator] ✓ Pass`);
    process.exit(0);
  } catch (error) {
    console.error(`[analyst-validator] Validator crashed: ${error}`);
    process.exit(1);
  }
}

main();
