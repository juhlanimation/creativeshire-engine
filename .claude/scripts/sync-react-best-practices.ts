/**
 * Sync React Best Practices
 *
 * Generates domain-specific bundles from Vercel's upstream rules.
 * Run: npm run sync:react-rules
 *
 * This script:
 * 1. Reads category-mapping.yaml
 * 2. Finds matching rules from upstream by prefix
 * 3. Concatenates rules into bundle files
 * 4. Records version info
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";

const ROOT = path.resolve(__dirname, "..");
const SKILL_DIR = path.join(ROOT, ".claude/skills/react-best-practices");
const UPSTREAM_DIR = path.join(
  ROOT,
  ".claude/skills/vercel-agent-skills-upstream/skills/react-best-practices/rules"
);
const BUNDLES_DIR = path.join(SKILL_DIR, "bundles");
const MAPPING_FILE = path.join(SKILL_DIR, "category-mapping.yaml");
const VERSION_FILE = path.join(SKILL_DIR, "VERSION");

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

function getUpstreamVersion(): string {
  const gitDir = path.join(
    ROOT,
    ".claude/skills/vercel-agent-skills-upstream/.git"
  );
  try {
    // Try to get commit hash
    const headFile = path.join(gitDir, "HEAD");
    if (fs.existsSync(headFile)) {
      const head = fs.readFileSync(headFile, "utf-8").trim();
      if (head.startsWith("ref:")) {
        const refPath = path.join(gitDir, head.slice(5).trim());
        if (fs.existsSync(refPath)) {
          return fs.readFileSync(refPath, "utf-8").trim().slice(0, 7);
        }
      }
      return head.slice(0, 7);
    }
  } catch {
    // Ignore errors
  }
  return new Date().toISOString().split("T")[0];
}

function findRulesByPrefix(prefix: string): string[] {
  if (!fs.existsSync(UPSTREAM_DIR)) {
    console.error(`Upstream directory not found: ${UPSTREAM_DIR}`);
    return [];
  }

  const files = fs.readdirSync(UPSTREAM_DIR);
  return files
    .filter((f) => f.startsWith(prefix) && f.endsWith(".md"))
    .sort()
    .map((f) => path.join(UPSTREAM_DIR, f));
}

function readRuleContent(filePath: string): string {
  const content = fs.readFileSync(filePath, "utf-8");
  const filename = path.basename(filePath, ".md");

  // Extract title from frontmatter or first heading
  const titleMatch = content.match(/^title:\s*(.+)$/m);
  const headingMatch = content.match(/^##?\s+(.+)$/m);
  const title = titleMatch?.[1] || headingMatch?.[1] || filename;

  // Remove frontmatter for cleaner output
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/m, "");

  return `### ${filename}\n\n${withoutFrontmatter.trim()}`;
}

function generateBundle(
  name: string,
  config: BundleConfig,
  version: string
): { ruleCount: number; content: string } {
  const rules: string[] = [];

  for (const prefix of config.prefixes) {
    const ruleFiles = findRulesByPrefix(prefix);
    for (const file of ruleFiles) {
      rules.push(readRuleContent(file));
    }
  }

  const header = `# ${name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")}

> ${config.description}

**Source:** vercel-labs/agent-skills @ ${version}
**Rules:** ${rules.length}
**Agents:** ${config.agents.join(", ")}

---

`;

  return {
    ruleCount: rules.length,
    content: header + rules.join("\n\n---\n\n"),
  };
}

function main() {
  console.log("Syncing React Best Practices bundles...\n");

  // Read mapping
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error(`Mapping file not found: ${MAPPING_FILE}`);
    process.exit(1);
  }

  const mappingContent = fs.readFileSync(MAPPING_FILE, "utf-8");
  const mapping: CategoryMapping = yaml.parse(mappingContent);

  // Get version
  const version = getUpstreamVersion();
  console.log(`Upstream version: ${version}\n`);

  // Ensure bundles directory
  if (!fs.existsSync(BUNDLES_DIR)) {
    fs.mkdirSync(BUNDLES_DIR, { recursive: true });
  }

  // Generate each bundle
  let totalRules = 0;
  const bundleStats: Array<{ name: string; rules: number }> = [];

  for (const [name, config] of Object.entries(mapping.bundles)) {
    const { ruleCount, content } = generateBundle(name, config, version);
    const outputPath = path.join(BUNDLES_DIR, `${name}.md`);

    fs.writeFileSync(outputPath, content);
    totalRules += ruleCount;
    bundleStats.push({ name, rules: ruleCount });

    console.log(`  ✓ ${name}.md (${ruleCount} rules)`);
  }

  // Write version file
  const versionContent = `${version}
Generated: ${new Date().toISOString()}
Total rules: ${totalRules}
Bundles: ${bundleStats.length}
`;
  fs.writeFileSync(VERSION_FILE, versionContent);

  console.log(`\nGenerated ${bundleStats.length} bundles with ${totalRules} rules total.`);
  console.log(`Version: ${version}`);
}

main();
