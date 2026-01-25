#!/usr/bin/env npx tsx
/**
 * Agent Factory - Deterministic Agent Verification
 *
 * Usage:
 *   npx tsx agent-factory.ts --verify {name}      # Verify single agent
 *   npx tsx agent-factory.ts --verify-all         # Verify all agents
 *   npx tsx agent-factory.ts --verify-all --deep  # Deep verification (check bundle files exist)
 *   npx tsx agent-factory.ts --list               # List all agents
 *   npx tsx agent-factory.ts --skills             # Show skill-to-agent mappings
 *
 * Exit codes:
 *   0 = All verified agents are valid
 *   1 = Script error (invalid args, file read error, etc.)
 *   2 = One or more agents have issues
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";

// ============================================================================
// Types
// ============================================================================

interface KnowledgeRef {
  path: string;
  exists: boolean;
  isPrimary: boolean;
}

interface AgentManifest {
  name: string;
  entryPoint: { path: string; exists: boolean };
  contract: { path: string; exists: boolean };
  validator: { path: string; exists: boolean };
  settingsEntry: boolean;
  hooksConfigured: boolean;
  knowledge: {
    primary: KnowledgeRef[];
    additional: KnowledgeRef[];
    allPrimaryResolved: boolean;
  };
  issues: string[];
  valid: boolean;
}

interface SettingsAgentType {
  path: string;
  description: string;
  tools: string[];
  hooks?: {
    PostToolUse?: Array<{
      matcher: string;
      hooks: Array<{
        type: string;
        command: string;
      }>;
    }>;
  };
}

interface SettingsJson {
  agentTypes: Record<string, SettingsAgentType>;
}

interface BundleConfig {
  description: string;
  prefixes: string[];
  agents: string[];
}

interface CategoryMapping {
  upstream: {
    repo: string;
    path: string;
    local: string;
  };
  bundles: Record<string, BundleConfig>;
}

interface SkillMapping {
  skill: string;
  path: string;
  bundlesDir: string;
  mapping: CategoryMapping | null;
}

// ============================================================================
// Skill Registry - Add new skills here
// ============================================================================

const SKILL_MAPPINGS: Array<{ skill: string; path: string; bundlesDir: string }> = [
  {
    skill: "react-best-practices",
    path: ".claude/skills/react-best-practices/category-mapping.yaml",
    bundlesDir: ".claude/skills/react-best-practices/bundles",
  },
  {
    skill: "tailwind-v4-skill",
    path: ".claude/skills/tailwind-v4-skill/category-mapping.yaml",
    bundlesDir: ".claude/skills/tailwind-v4-skill/bundles",
  },
];

// ============================================================================
// Paths
// ============================================================================

const SETTINGS_PATH = ".claude/settings.json";
const AGENTS_DIR = ".claude/agents";
const CONTRACTS_DIR = ".claude/architecture/agentic-framework";

// ============================================================================
// File System Helpers
// ============================================================================

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function readSettings(): SettingsJson | null {
  try {
    const content = fs.readFileSync(SETTINGS_PATH, "utf-8");
    return JSON.parse(content) as SettingsJson;
  } catch (error) {
    console.error(`Error reading settings.json: ${error}`);
    return null;
  }
}

function readContract(contractPath: string): string | null {
  try {
    return fs.readFileSync(contractPath, "utf-8");
  } catch {
    return null;
  }
}

function readSkillMappings(): SkillMapping[] {
  return SKILL_MAPPINGS.map(({ skill, path, bundlesDir }) => {
    try {
      if (!fs.existsSync(path)) {
        return { skill, path, bundlesDir, mapping: null };
      }
      const content = fs.readFileSync(path, "utf-8");
      return { skill, path, bundlesDir, mapping: yaml.parse(content) as CategoryMapping };
    } catch {
      return { skill, path, bundlesDir, mapping: null };
    }
  });
}

interface RequiredBundle {
  skill: string;
  bundlePath: string;
}

function getRequiredBundles(agentName: string, skillMappings: SkillMapping[]): RequiredBundle[] {
  const requiredBundles: RequiredBundle[] = [];

  for (const { skill, bundlesDir, mapping } of skillMappings) {
    if (!mapping) continue;

    for (const [bundleName, config] of Object.entries(mapping.bundles)) {
      if (config.agents.includes(agentName)) {
        requiredBundles.push({
          skill,
          bundlePath: `${bundlesDir}/${bundleName}.md`,
        });
      }
    }
  }

  return requiredBundles;
}

// ============================================================================
// Contract Parsing (inline for minimal dependencies)
// ============================================================================

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

function extractPathsFromTable(content: string): string[] {
  const paths: string[] = [];

  // Match table rows: | `path` | description |
  const tableRowRegex = /^\|\s*`([^`]+)`\s*\|/gm;
  let match: RegExpExecArray | null;

  while ((match = tableRowRegex.exec(content)) !== null) {
    const pathValue = match[1].trim();
    // Skip header row
    if (pathValue && pathValue !== "Document" && pathValue !== "Path") {
      paths.push(pathValue);
    }
  }

  return paths;
}

function parseKnowledge(contractContent: string): {
  primary: KnowledgeRef[];
  additional: KnowledgeRef[];
} {
  const knowledgeSection = extractSection(contractContent, "Knowledge", 2);
  const primarySection = extractSection(knowledgeSection, "Primary", 3);
  const additionalSection = extractSection(knowledgeSection, "Additional", 3);

  const primaryPaths = extractPathsFromTable(primarySection);
  const additionalPaths = extractPathsFromTable(additionalSection);

  return {
    primary: primaryPaths.map((p) => ({
      path: p,
      exists: fileExists(p),
      isPrimary: true,
    })),
    additional: additionalPaths.map((p) => ({
      path: p,
      exists: fileExists(p),
      isPrimary: false,
    })),
  };
}

// ============================================================================
// Agent Verification
// ============================================================================

function verifyAgent(name: string, settings: SettingsJson, skillMappings: SkillMapping[]): AgentManifest {
  const issues: string[] = [];

  // Check settings entry
  const settingsEntry = settings.agentTypes[name];
  const hasSettingsEntry = !!settingsEntry;
  if (!hasSettingsEntry) {
    issues.push(`Not registered in settings.json agentTypes`);
  }

  // Define paths
  const entryPointPath = path.join(AGENTS_DIR, `${name}.md`);
  const contractPath = path.join(CONTRACTS_DIR, `${name}.agent.md`);
  const validatorPath = path.join(CONTRACTS_DIR, `${name}.validator.ts`);

  // Check file existence
  const entryPointExists = fileExists(entryPointPath);
  const contractExists = fileExists(contractPath);
  const validatorExists = fileExists(validatorPath);

  // Determine if agent is read-only (reviewers and analysts don't need validators)
  const isReviewer = name.endsWith("-reviewer");
  const isAnalyst = name.endsWith("-analyst");
  const isReadOnly = isReviewer || isAnalyst;

  if (!entryPointExists) {
    issues.push(`Entry point missing: ${entryPointPath}`);
  }
  if (!contractExists) {
    issues.push(`Contract missing: ${contractPath}`);
  }
  // Read-only agents (reviewers, analysts) don't need validators
  if (!validatorExists && !isReadOnly) {
    issues.push(`Validator missing: ${validatorPath}`);
  }

  // Check hooks configuration
  let hooksConfigured = false;
  if (settingsEntry?.hooks?.PostToolUse) {
    const hasValidatorHook = settingsEntry.hooks.PostToolUse.some((h) =>
      h.hooks?.some((hook) =>
        hook.command?.includes(`${name}.validator.ts`)
      )
    );
    hooksConfigured = hasValidatorHook;
  } else {
    // Read-only agents (reviewers, analysts) don't need hooks
    if (isReadOnly) {
      hooksConfigured = true; // Not required for read-only agents
    }
  }

  // Parse knowledge from contract
  let knowledge: AgentManifest["knowledge"] = {
    primary: [],
    additional: [],
    allPrimaryResolved: true,
  };

  if (contractExists) {
    const contractContent = readContract(contractPath);
    if (contractContent) {
      const parsed = parseKnowledge(contractContent);
      knowledge.primary = parsed.primary;
      knowledge.additional = parsed.additional;
      knowledge.allPrimaryResolved = parsed.primary.every((k) => k.exists);

      // Check for missing primary refs
      if (parsed.primary.length === 0) {
        issues.push(`No primary knowledge refs in contract`);
      }
      parsed.primary.forEach((k) => {
        if (!k.exists) {
          issues.push(`Primary knowledge file missing: ${k.path}`);
        }
      });

      // Check for required skill bundles (React, Tailwind, etc.)
      const requiredBundles = getRequiredBundles(name, skillMappings);
      const additionalPaths = parsed.additional.map((k) => k.path);

      for (const { skill, bundlePath } of requiredBundles) {
        if (!additionalPaths.includes(bundlePath)) {
          issues.push(`Missing ${skill} bundle: ${bundlePath}`);
        }
      }
    }
  }

  const valid = issues.length === 0;

  return {
    name,
    entryPoint: { path: entryPointPath, exists: entryPointExists },
    contract: { path: contractPath, exists: contractExists },
    validator: { path: validatorPath, exists: validatorExists },
    settingsEntry: hasSettingsEntry,
    hooksConfigured,
    knowledge,
    issues,
    valid,
  };
}

function verifyAllAgents(settings: SettingsJson, skillMappings: SkillMapping[]): AgentManifest[] {
  const agentNames = Object.keys(settings.agentTypes);
  return agentNames.map((name) => verifyAgent(name, settings, skillMappings));
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatSingleAgentReport(manifest: AgentManifest): string {
  const lines: string[] = [];
  const status = manifest.valid ? "✓ VALID" : "✗ INVALID";

  lines.push("┌" + "─".repeat(65) + "┐");
  lines.push(`│ Agent: ${manifest.name.padEnd(56)} │`);
  lines.push(`│ Status: ${status.padEnd(55)} │`);
  lines.push("│" + " ".repeat(65) + "│");
  lines.push("│ Files:" + " ".repeat(58) + "│");

  const entryStatus = manifest.entryPoint.exists ? "✓" : "✗";
  const contractStatus = manifest.contract.exists ? "✓" : "✗";
  const validatorStatus = manifest.validator.exists ? "✓" : "✗";
  const settingsStatus = manifest.settingsEntry ? "✓" : "✗";

  lines.push(
    `│   ${entryStatus} Entry point: ${manifest.entryPoint.path.padEnd(44)} │`
  );
  lines.push(
    `│   ${contractStatus} Contract: ${manifest.contract.path.padEnd(47)} │`
  );
  lines.push(
    `│   ${validatorStatus} Validator: ${manifest.validator.path.padEnd(46)} │`
  );
  lines.push(
    `│   ${settingsStatus} Settings: agentTypes["${manifest.name}"]${" ".repeat(Math.max(0, 36 - manifest.name.length))} │`
  );

  lines.push("│" + " ".repeat(65) + "│");
  lines.push("│ Knowledge:" + " ".repeat(54) + "│");

  const primaryCount = manifest.knowledge.primary.length;
  const additionalCount = manifest.knowledge.additional.length;

  lines.push(`│   Primary (${primaryCount}):`.padEnd(66) + "│");
  manifest.knowledge.primary.forEach((k) => {
    const status = k.exists ? "✓" : "✗";
    const truncatedPath =
      k.path.length > 50 ? "..." + k.path.slice(-47) : k.path;
    lines.push(`│     ${status} ${truncatedPath}`.padEnd(66) + "│");
  });

  if (additionalCount > 0) {
    lines.push(`│   Additional (${additionalCount}):`.padEnd(66) + "│");
    manifest.knowledge.additional.forEach((k) => {
      const status = k.exists ? "✓" : "✗";
      const truncatedPath =
        k.path.length > 50 ? "..." + k.path.slice(-47) : k.path;
      lines.push(`│     ${status} ${truncatedPath}`.padEnd(66) + "│");
    });
  }

  if (manifest.issues.length > 0) {
    lines.push("│" + " ".repeat(65) + "│");
    lines.push("│ Issues:" + " ".repeat(56) + "│");
    manifest.issues.forEach((issue) => {
      const truncatedIssue =
        issue.length > 60 ? issue.slice(0, 57) + "..." : issue;
      lines.push(`│   - ${truncatedIssue}`.padEnd(66) + "│");
    });
  }

  lines.push("└" + "─".repeat(65) + "┘");

  return lines.join("\n");
}

function formatAllAgentsReport(manifests: AgentManifest[]): string {
  const lines: string[] = [];
  const validCount = manifests.filter((m) => m.valid).length;
  const totalCount = manifests.length;
  const issueCount = totalCount - validCount;

  lines.push("┌" + "─".repeat(65) + "┐");
  lines.push("│ AGENT VERIFICATION REPORT" + " ".repeat(39) + "│");
  lines.push("│" + " ".repeat(65) + "│");
  lines.push(`│ Valid: ${validCount}/${totalCount}`.padEnd(66) + "│");
  lines.push(`│ Issues: ${issueCount}`.padEnd(66) + "│");
  lines.push("│" + " ".repeat(65) + "│");
  lines.push("│" + "─".repeat(63) + "│");
  lines.push("│" + " ".repeat(65) + "│");

  // Valid agents
  manifests
    .filter((m) => m.valid)
    .forEach((m) => {
      const primaryCount = m.knowledge.primary.length;
      const additionalCount = m.knowledge.additional.length;
      const knowledgeInfo = `(${primaryCount} primary, ${additionalCount} additional)`;
      lines.push(
        `│ ✓ ${m.name.padEnd(25)} ${knowledgeInfo.padEnd(35)} │`
      );
    });

  // Invalid agents with details
  const invalidAgents = manifests.filter((m) => !m.valid);
  if (invalidAgents.length > 0) {
    lines.push("│" + " ".repeat(65) + "│");
    invalidAgents.forEach((m) => {
      lines.push(`│ ✗ ${m.name.padEnd(60)} │`);
      m.issues.slice(0, 2).forEach((issue) => {
        const truncatedIssue =
          issue.length > 58 ? issue.slice(0, 55) + "..." : issue;
        lines.push(`│     ${truncatedIssue}`.padEnd(66) + "│");
      });
      if (m.issues.length > 2) {
        lines.push(`│     ...and ${m.issues.length - 2} more issues`.padEnd(66) + "│");
      }
      lines.push("│" + " ".repeat(65) + "│");
    });
  }

  lines.push("│" + "─".repeat(63) + "│");
  lines.push("│" + " ".repeat(65) + "│");
  lines.push(
    "│ To fix: Either add primary knowledge refs to contracts,".padEnd(66) +
      "│"
  );
  lines.push(
    "│ or create missing specs in creativeshire/.".padEnd(66) + "│"
  );
  lines.push("└" + "─".repeat(65) + "┘");

  return lines.join("\n");
}

function formatAgentList(settings: SettingsJson): string {
  const lines: string[] = [];
  const agents = Object.entries(settings.agentTypes);

  lines.push("┌" + "─".repeat(65) + "┐");
  lines.push("│ REGISTERED AGENTS" + " ".repeat(47) + "│");
  lines.push("│" + " ".repeat(65) + "│");
  lines.push(`│ Total: ${agents.length}`.padEnd(66) + "│");
  lines.push("│" + " ".repeat(65) + "│");
  lines.push("│" + "─".repeat(63) + "│");
  lines.push("│" + " ".repeat(65) + "│");

  agents.forEach(([name, config]) => {
    const desc =
      config.description.length > 40
        ? config.description.slice(0, 37) + "..."
        : config.description;
    lines.push(`│ ${name.padEnd(25)} ${desc.padEnd(38)} │`);
  });

  lines.push("│" + " ".repeat(65) + "│");
  lines.push("└" + "─".repeat(65) + "┘");

  return lines.join("\n");
}

// ============================================================================
// Main CLI
// ============================================================================

function formatSkillsReport(skillMappings: SkillMapping[]): string {
  const lines: string[] = [];

  lines.push("┌" + "─".repeat(65) + "┐");
  lines.push("│ SKILL-TO-AGENT MAPPINGS" + " ".repeat(41) + "│");
  lines.push("│" + " ".repeat(65) + "│");

  for (const { skill, bundlesDir, mapping } of skillMappings) {
    if (!mapping) {
      lines.push(`│ ✗ ${skill}: Not loaded`.padEnd(66) + "│");
      continue;
    }

    lines.push(`│ ${skill}`.padEnd(66) + "│");
    lines.push("│" + "─".repeat(63) + "│");

    for (const [bundleName, config] of Object.entries(mapping.bundles)) {
      const bundlePath = `${bundlesDir}/${bundleName}.md`;
      const bundleExists = fs.existsSync(bundlePath);
      const status = bundleExists ? "✓" : "✗";
      const agentCount = config.agents.length;

      lines.push(`│   ${status} ${bundleName} (${agentCount} agents)`.padEnd(66) + "│");

      // Show first few agents
      const displayAgents = config.agents.slice(0, 4);
      const moreCount = config.agents.length - displayAgents.length;
      const agentList = displayAgents.join(", ") + (moreCount > 0 ? `, +${moreCount} more` : "");
      const truncatedList = agentList.length > 55 ? agentList.slice(0, 52) + "..." : agentList;
      lines.push(`│       ${truncatedList}`.padEnd(66) + "│");
    }

    lines.push("│" + " ".repeat(65) + "│");
  }

  lines.push("└" + "─".repeat(65) + "┘");

  return lines.join("\n");
}

// ============================================================================
// Fix Mode - Update agent contracts with missing skill bundles
// ============================================================================

interface FixResult {
  name: string;
  success: boolean;
  addedBundles: string[];
  errors: string[];
}

function getMissingBundles(
  agentName: string,
  contractContent: string,
  skillMappings: SkillMapping[]
): RequiredBundle[] {
  const parsed = parseKnowledge(contractContent);
  const additionalPaths = parsed.additional.map((k) => k.path);
  const requiredBundles = getRequiredBundles(agentName, skillMappings);

  return requiredBundles.filter(
    ({ bundlePath }) => !additionalPaths.includes(bundlePath)
  );
}

function addBundlesToContract(
  contractContent: string,
  bundles: RequiredBundle[]
): string {
  if (bundles.length === 0) return contractContent;

  // Find the Additional section
  const additionalMatch = contractContent.match(/### Additional\s*\n\s*\|[^\n]+\|\s*\n\s*\|[-|]+\|/);

  if (!additionalMatch) {
    // No Additional section found - need to add one after Primary
    const primaryMatch = contractContent.match(/(### Primary[\s\S]*?\n\n)/);
    if (!primaryMatch) {
      return contractContent; // Can't find where to insert
    }

    const bundleRows = bundles
      .map(({ skill, bundlePath }) => `| \`${bundlePath}\` | ${skill} optimization |`)
      .join("\n");

    const additionalSection = `### Additional

| Document | Why |
|----------|-----|
${bundleRows}

`;

    return contractContent.replace(primaryMatch[0], primaryMatch[0] + additionalSection);
  }

  // Find the end of the Additional table
  const additionalStart = additionalMatch.index! + additionalMatch[0].length;
  const afterAdditional = contractContent.slice(additionalStart);

  // Find where the table ends (next section or empty lines)
  const tableEndMatch = afterAdditional.match(/\n\n(?=[#A-Z]|\n)/);
  const tableEnd = tableEndMatch
    ? additionalStart + tableEndMatch.index!
    : contractContent.length;

  // Add new bundle rows
  const bundleRows = bundles
    .map(({ skill, bundlePath }) => `| \`${bundlePath}\` | ${skill} optimization |`)
    .join("\n");

  return (
    contractContent.slice(0, tableEnd) +
    "\n" +
    bundleRows +
    contractContent.slice(tableEnd)
  );
}

function fixAgent(
  name: string,
  skillMappings: SkillMapping[]
): FixResult {
  const contractPath = path.join(CONTRACTS_DIR, `${name}.agent.md`);

  if (!fileExists(contractPath)) {
    return {
      name,
      success: false,
      addedBundles: [],
      errors: [`Contract not found: ${contractPath}`],
    };
  }

  const contractContent = readContract(contractPath);
  if (!contractContent) {
    return {
      name,
      success: false,
      addedBundles: [],
      errors: [`Could not read contract: ${contractPath}`],
    };
  }

  const missingBundles = getMissingBundles(name, contractContent, skillMappings);

  if (missingBundles.length === 0) {
    return {
      name,
      success: true,
      addedBundles: [],
      errors: [],
    };
  }

  const updatedContent = addBundlesToContract(contractContent, missingBundles);

  try {
    fs.writeFileSync(contractPath, updatedContent, "utf-8");
    return {
      name,
      success: true,
      addedBundles: missingBundles.map((b) => b.bundlePath),
      errors: [],
    };
  } catch (error) {
    return {
      name,
      success: false,
      addedBundles: [],
      errors: [`Failed to write contract: ${error}`],
    };
  }
}

function formatFixReport(results: FixResult[]): string {
  const lines: string[] = [];
  const successCount = results.filter((r) => r.success && r.addedBundles.length > 0).length;
  const alreadyGood = results.filter((r) => r.success && r.addedBundles.length === 0).length;
  const failedCount = results.filter((r) => !r.success).length;

  lines.push("┌" + "─".repeat(65) + "┐");
  lines.push("│ AGENT FIX REPORT" + " ".repeat(48) + "│");
  lines.push("│" + " ".repeat(65) + "│");
  lines.push(`│ Fixed: ${successCount}`.padEnd(66) + "│");
  lines.push(`│ Already OK: ${alreadyGood}`.padEnd(66) + "│");
  lines.push(`│ Failed: ${failedCount}`.padEnd(66) + "│");
  lines.push("│" + " ".repeat(65) + "│");
  lines.push("│" + "─".repeat(63) + "│");

  // Fixed agents
  results
    .filter((r) => r.success && r.addedBundles.length > 0)
    .forEach((r) => {
      lines.push(`│ ✓ ${r.name} (+${r.addedBundles.length} bundles)`.padEnd(66) + "│");
    });

  // Failed agents
  results
    .filter((r) => !r.success)
    .forEach((r) => {
      lines.push(`│ ✗ ${r.name}`.padEnd(66) + "│");
      r.errors.forEach((err) => {
        const truncated = err.length > 58 ? err.slice(0, 55) + "..." : err;
        lines.push(`│     ${truncated}`.padEnd(66) + "│");
      });
    });

  lines.push("│" + " ".repeat(65) + "│");
  lines.push("└" + "─".repeat(65) + "┘");

  return lines.join("\n");
}

function printUsage(): void {
  console.log(`
Agent Factory - Deterministic Agent Verification

Usage:
  npx tsx agent-factory.ts --verify {name}      Verify single agent
  npx tsx agent-factory.ts --verify-all         Verify all agents
  npx tsx agent-factory.ts --fix {name}         Fix missing skill bundles for an agent
  npx tsx agent-factory.ts --fix-all            Fix all agents with missing bundles
  npx tsx agent-factory.ts --list               List all registered agents
  npx tsx agent-factory.ts --skills             Show skill-to-agent mappings

Exit codes:
  0 = All verified agents are valid / fix successful
  1 = Script error (invalid args, file read error, etc.)
  2 = One or more agents have issues
`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const settings = readSettings();
  if (!settings) {
    console.error("Failed to read settings.json");
    process.exit(1);
  }

  const skillMappings = readSkillMappings();
  const loadedSkills = skillMappings.filter((s) => s.mapping !== null);
  const missingSkills = skillMappings.filter((s) => s.mapping === null);

  if (missingSkills.length > 0) {
    console.warn(
      `Warning: Some skill mappings not found: ${missingSkills.map((s) => s.skill).join(", ")}`
    );
  }
  if (loadedSkills.length > 0) {
    console.log(`Loaded skill mappings: ${loadedSkills.map((s) => s.skill).join(", ")}`);
  }

  const command = args[0];

  switch (command) {
    case "--verify": {
      const name = args[1];
      if (!name) {
        console.error("Error: Agent name required for --verify");
        printUsage();
        process.exit(1);
      }

      const manifest = verifyAgent(name, settings, skillMappings);
      console.log(formatSingleAgentReport(manifest));
      process.exit(manifest.valid ? 0 : 2);
      break;
    }

    case "--verify-all": {
      const manifests = verifyAllAgents(settings, skillMappings);
      console.log(formatAllAgentsReport(manifests));
      const allValid = manifests.every((m) => m.valid);
      process.exit(allValid ? 0 : 2);
      break;
    }

    case "--list": {
      console.log(formatAgentList(settings));
      process.exit(0);
      break;
    }

    case "--skills": {
      console.log(formatSkillsReport(skillMappings));
      process.exit(0);
      break;
    }

    case "--fix": {
      const name = args[1];
      if (!name) {
        console.error("Error: Agent name required for --fix");
        printUsage();
        process.exit(1);
      }

      const result = fixAgent(name, skillMappings);
      if (result.success) {
        if (result.addedBundles.length > 0) {
          console.log(`✓ Fixed ${name}: Added ${result.addedBundles.length} bundles`);
          result.addedBundles.forEach((b) => console.log(`  + ${b}`));
        } else {
          console.log(`✓ ${name}: Already has all required bundles`);
        }
        process.exit(0);
      } else {
        console.error(`✗ Failed to fix ${name}:`);
        result.errors.forEach((e) => console.error(`  ${e}`));
        process.exit(2);
      }
      break;
    }

    case "--fix-all": {
      const manifests = verifyAllAgents(settings, skillMappings);
      const agentsNeedingFix = manifests.filter((m) =>
        m.issues.some((i) => i.includes("Missing") && i.includes("bundle"))
      );

      if (agentsNeedingFix.length === 0) {
        console.log("✓ All agents already have their required bundles");
        process.exit(0);
      }

      console.log(`Fixing ${agentsNeedingFix.length} agents with missing bundles...\n`);

      const results = agentsNeedingFix.map((m) => fixAgent(m.name, skillMappings));
      console.log(formatFixReport(results));

      const allSuccess = results.every((r) => r.success);
      process.exit(allSuccess ? 0 : 2);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }
}

main();
