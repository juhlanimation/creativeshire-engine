#!/usr/bin/env npx tsx
/**
 * Layout Analyst Validator
 *
 * Validates layout-analyst output using the shared analyst validator.
 *
 * Exit codes:
 *   0 = Pass
 *   1 = Validator crashed
 *   2 = Validation failed
 */

import { execSync } from "child_process";

try {
  execSync(
    "npx tsx .claude/architecture/creativeshire/meta/analyst/analyst.validator.ts Layout",
    { stdio: "inherit" }
  );
  process.exit(0);
} catch (error: any) {
  process.exit(error.status || 1);
}
