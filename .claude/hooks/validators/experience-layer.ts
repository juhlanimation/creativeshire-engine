/**
 * Experience Layer Validator
 *
 * Validates files in the experience layer (behaviours, drivers, triggers, providers).
 * The most complex validator - handles multiple sublayers with different rule sets.
 *
 * Used by agents:
 * - behaviour-builder (PostToolUse)
 * - behaviour-reviewer (Stop)
 * - driver-builder (PostToolUse)
 * - driver-reviewer (Stop)
 * - trigger-builder (PostToolUse)
 * - trigger-reviewer (Stop)
 * - provider-builder (PostToolUse)
 * - provider-reviewer (Stop)
 *
 * Two-phase validation:
 * 1. BOUNDARY CHECK: Is file in experience layer?
 * 2. CONTRACT CHECK: Does file follow the correct contract for its sublayer?
 *
 * Sublayer-specific rules:
 *
 * BEHAVIOUR rules (experience:behaviours, experience:presets:behaviours):
 * | Rule ID                    | Check                                            |
 * |----------------------------|--------------------------------------------------|
 * | behaviour-no-dom           | No document., window., element., .style., .classList. |
 * | behaviour-css-vars-only    | Returns --* keys only                            |
 * | behaviour-declares-requires| Has requires: declaration                        |
 * | behaviour-declares-applicable | Has applicableTo: declaration                 |
 * | behaviour-pure-function    | No side effects                                  |
 *
 * DRIVER rules (experience:drivers):
 * | Rule ID                    | Check                                            |
 * |----------------------------|--------------------------------------------------|
 * | driver-css-vars-only       | Only setProperty('--*', value)                   |
 * | driver-has-cleanup         | Has destroy(), cleanup(), or kill()              |
 * | driver-no-react-state      | No useState, useReducer                          |
 * | driver-registers-targets   | Has register() and unregister()                  |
 *
 * TRIGGER rules (experience:triggers):
 * | Rule ID                    | Check                                            |
 * |----------------------------|--------------------------------------------------|
 * | trigger-returns-cleanup    | Returns cleanup function                         |
 * | trigger-store-only         | Only writes to store                             |
 * | trigger-no-dom-mutation    | No direct DOM manipulation                       |
 *
 * @module validators/experience-layer
 */

import {
  getFilePathFromHook,
  getFileContent,
  outputAllow,
  outputBlock,
} from './_shared/io';

import {
  checkBoundary,
  detectSublayer,
  getExperienceSublayers,
  type Sublayer,
} from './_shared/boundaries';

import {
  checkBehaviourContract,
  checkDriverContract,
  checkTriggerContract,
  formatContractErrors,
  type ContractResult,
} from './_shared/contracts';

/**
 * Experience layer sublayers that this validator handles.
 */
const EXPERIENCE_LAYER_SUBLAYERS: Sublayer[] = [
  'experience:behaviours',
  'experience:drivers',
  'experience:triggers',
  'experience:presets:config',
  'experience:presets:behaviours',
  'experience:providers',
];

/**
 * All allowed sublayers for experience layer agents.
 */
const ALLOWED_SUBLAYERS: Sublayer[] = getExperienceSublayers();

/**
 * Behaviour sublayers - use behaviour contract.
 */
const BEHAVIOUR_SUBLAYERS: Sublayer[] = [
  'experience:behaviours',
  'experience:presets:behaviours',
];

/**
 * Detect which contract type to use based on sublayer.
 *
 * @param sublayer - The detected sublayer
 * @returns The contract type: 'behaviour', 'driver', 'trigger', 'provider', or null
 */
function getContractType(
  sublayer: Sublayer
): 'behaviour' | 'driver' | 'trigger' | 'provider' | 'preset' | null {
  if (BEHAVIOUR_SUBLAYERS.includes(sublayer)) {
    return 'behaviour';
  }
  if (sublayer === 'experience:drivers') {
    return 'driver';
  }
  if (sublayer === 'experience:triggers') {
    return 'trigger';
  }
  if (sublayer === 'experience:providers') {
    return 'provider';
  }
  if (sublayer === 'experience:presets:config') {
    return 'preset';
  }
  return null;
}

/**
 * Run the appropriate contract check based on sublayer.
 *
 * @param content - The file content to validate
 * @param contractType - The type of contract to check
 * @returns ContractResult with pass/fail and errors
 */
function runContractCheck(
  content: string,
  contractType: 'behaviour' | 'driver' | 'trigger' | 'provider' | 'preset'
): ContractResult {
  switch (contractType) {
    case 'behaviour':
      return checkBehaviourContract(content);
    case 'driver':
      return checkDriverContract(content);
    case 'trigger':
      return checkTriggerContract(content);
    case 'provider':
      // Providers have minimal contract requirements - mainly boundary enforcement
      // They can use React hooks and access experience internals
      return { passed: true, errors: [] };
    case 'preset':
      // Presets use the preset.ts validator, not this one
      // But if called here, skip (preset-builder should use preset.ts)
      return { passed: true, errors: [] };
    default:
      return { passed: true, errors: [] };
  }
}

/**
 * Get contextual help message explaining the contract for a sublayer.
 *
 * @param contractType - The type of contract
 * @returns Help message with examples
 */
function getContractContextHelp(
  contractType: 'behaviour' | 'driver' | 'trigger' | 'provider' | 'preset'
): string {
  switch (contractType) {
    case 'behaviour':
      return `
---
BEHAVIOUR CONTRACT GUIDELINES:

Behaviours are pure functions that:
1. Compute CSS variables from state (--propertyName: value)
2. NEVER access the DOM directly
3. NEVER have side effects
4. Declare what state they require (requires: [])
5. Declare what widgets they apply to (applicableTo: [])

Example behaviour:
\`\`\`typescript
export const parallaxBehaviour: Behaviour = {
  requires: ['scrollProgress', 'velocity'],
  applicableTo: ['Image', 'Video'],
  compute: ({ scrollProgress }) => ({
    '--y': \`\${scrollProgress * 50}px\`,
    '--opacity': String(1 - scrollProgress * 0.3),
  }),
};
\`\`\`

Remember: Behaviours COMPUTE, drivers APPLY to DOM.
`;

    case 'driver':
      return `
---
DRIVER CONTRACT GUIDELINES:

Drivers are DOM animation handlers that:
1. Only set CSS variables via setProperty('--name', value)
2. NEVER use React state (useState, useReducer)
3. Have cleanup methods (destroy/cleanup/kill)
4. Support element registration (register/unregister)

Example driver pattern:
\`\`\`typescript
class ParallaxDriver {
  private elements: Set<HTMLElement> = new Set();

  register(element: HTMLElement) {
    this.elements.add(element);
  }

  unregister(element: HTMLElement) {
    this.elements.delete(element);
  }

  update(values: CSSVariables) {
    for (const el of this.elements) {
      for (const [key, value] of Object.entries(values)) {
        el.style.setProperty(key, String(value));
      }
    }
  }

  destroy() {
    this.elements.clear();
  }
}
\`\`\`

Remember: Drivers bypass React - use CSS variables only.
`;

    case 'trigger':
      return `
---
TRIGGER CONTRACT GUIDELINES:

Triggers connect events to the store:
1. Observe events (scroll, resize, intersection, etc.)
2. Update the store with observed values
3. Return a cleanup function
4. NEVER mutate the DOM directly

Example trigger:
\`\`\`typescript
export function useScrollProgress(store: ExperienceStore) {
  useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / document.body.scrollHeight;
      store.setState({ scrollProgress: progress });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [store]);
}
\`\`\`

Remember: Triggers OBSERVE and write to store, drivers APPLY to DOM.
`;

    case 'provider':
      return `
---
PROVIDER CONTRACT GUIDELINES:

Providers are React context providers that:
1. Initialize and manage experience state
2. Connect triggers to the store
3. Provide context to child components
4. Can use React hooks normally

Providers are the bridge between React and the driver system.
`;

    case 'preset':
      return `
---
PRESET CONTRACT GUIDELINES:

Presets configure experiences. Use preset.ts validator for full validation.
`;

    default:
      return '';
  }
}

/**
 * Main validation function.
 *
 * Phase 1: Boundary check - is the file in the experience layer?
 * Phase 2: Contract check - does the file follow the correct contract for its sublayer?
 */
function main(): void {
  // Get file path from hook or command line
  const filePath = getFilePathFromHook();

  // No file path provided - allow (nothing to validate)
  if (!filePath) {
    outputAllow();
    return;
  }

  // Skip non-TypeScript/TSX files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    outputAllow();
    return;
  }

  // Detect sublayer
  const sublayer = detectSublayer(filePath);

  // File not in any recognized sublayer - allow (not architecture file)
  if (sublayer === null) {
    outputAllow();
    return;
  }

  // Skip non-experience sublayers - this validator only handles experience layer
  if (!EXPERIENCE_LAYER_SUBLAYERS.includes(sublayer)) {
    outputAllow();
    return;
  }

  // =========================================================================
  // PHASE 1: BOUNDARY CHECK
  // =========================================================================
  // Is the file within allowed experience sublayers?

  const boundaryResult = checkBoundary(filePath, ALLOWED_SUBLAYERS);

  if (!boundaryResult.passed) {
    outputBlock(boundaryResult.error!);
    return;
  }

  // =========================================================================
  // PHASE 2: CONTRACT CHECK
  // =========================================================================
  // Does the file follow the correct architectural contract for its sublayer?

  let content: string;
  try {
    content = getFileContent(filePath);
  } catch (error) {
    // If we can't read the file, block with the error
    const message = error instanceof Error ? error.message : String(error);
    outputBlock(`Failed to read file for validation: ${message}`);
    return;
  }

  // Determine which contract to check based on sublayer
  const contractType = getContractType(sublayer);

  // If no contract type, file passes (e.g., utility files in experience/)
  if (contractType === null) {
    outputAllow();
    return;
  }

  // Skip preset config files - they use preset.ts validator
  if (contractType === 'preset') {
    outputAllow();
    return;
  }

  // Run the appropriate contract check
  const contractResult = runContractCheck(content, contractType);

  if (!contractResult.passed) {
    const formattedErrors = formatContractErrors(filePath, contractResult.errors);
    const contextualHelp = getContractContextHelp(contractType);
    outputBlock(formattedErrors + contextualHelp);
    return;
  }

  // All checks passed
  outputAllow();
}

// Run the validator
main();
