/**
 * Renderer Validator
 *
 * Validates files in the renderer sublayer (renderer/**).
 * Renderers are bridges that convert schema data into React components
 * using registry lookups for extensibility.
 *
 * Used by agents:
 * - renderer-builder (PostToolUse)
 * - renderer-reviewer (Stop)
 *
 * Two-phase validation:
 * 1. BOUNDARY CHECK: Is file in the renderer sublayer?
 * 2. CONTRACT CHECK: Does file follow renderer rules?
 *
 * Rules enforced:
 * | Rule ID                    | Check                                            |
 * |----------------------------|--------------------------------------------------|
 * | renderer-uses-registry     | Uses registry lookup, no hardcoded imports       |
 * | renderer-has-error-boundary| Contains ErrorBoundary usage                     |
 * | renderer-has-fallback      | Handles unknown/undefined types                  |
 * | renderer-forwards-refs     | Uses forwardRef or passes ref prop               |
 *
 * What are renderers?
 * - Bridge layer between schema data and React components
 * - Lookup components from registry, never hardcode imports
 * - Wrap content in ErrorBoundary for resilience
 * - Handle unknown schema types gracefully
 * - Support ref forwarding for driver registration
 *
 * @module validators/renderer
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
  type Sublayer,
} from './_shared/boundaries';

import {
  checkRendererContract,
  formatContractErrors,
} from './_shared/contracts';

/**
 * Renderer sublayers that this validator handles.
 */
const RENDERER_SUBLAYERS: Sublayer[] = [
  'renderer',
];

/**
 * Main validation function.
 *
 * Phase 1: Boundary check - is the file in the renderer sublayer?
 * Phase 2: Contract check - does the file follow renderer rules?
 */
function main(): void {
  // Get file path from hook or command line
  const filePath = getFilePathFromHook();

  // No file path provided - allow (nothing to validate)
  if (!filePath) {
    outputAllow();
    return;
  }

  // Skip non-TypeScript files
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

  // Skip non-renderer sublayers - this validator only handles renderer files
  if (!RENDERER_SUBLAYERS.includes(sublayer)) {
    outputAllow();
    return;
  }

  // =========================================================================
  // PHASE 1: BOUNDARY CHECK
  // =========================================================================
  // Is the file within allowed renderer sublayers?

  const boundaryResult = checkBoundary(filePath, RENDERER_SUBLAYERS);

  if (!boundaryResult.passed) {
    outputBlock(boundaryResult.error!);
    return;
  }

  // =========================================================================
  // PHASE 2: CONTRACT CHECK
  // =========================================================================
  // Does the file follow renderer architectural rules?

  let content: string;
  try {
    content = getFileContent(filePath);
  } catch (error) {
    // If we can't read the file, block with the error
    const message = error instanceof Error ? error.message : String(error);
    outputBlock(`Failed to read file for validation: ${message}`);
    return;
  }

  // Run contract checks
  const contractResult = checkRendererContract(content);

  if (!contractResult.passed) {
    // Add renderer-specific context to the error message
    const formattedErrors = formatContractErrors(filePath, contractResult.errors);
    const contextualHelp = getRendererContextHelp();
    outputBlock(formattedErrors + contextualHelp);
    return;
  }

  // All checks passed
  outputAllow();
}

/**
 * Get contextual help message explaining what renderers should contain.
 *
 * @returns Help message with examples
 */
function getRendererContextHelp(): string {
  return `
---
RENDERER GUIDELINES:

Renderers are bridges that convert schema data into React components.
They must follow these four requirements:

1. USE REGISTRY LOOKUP (renderer-uses-registry)
   Never hardcode component imports. Use registry for extensibility.
   \`\`\`typescript
   // WRONG - hardcoded imports
   import { ImageWidget } from '@/content/widgets/Image';

   // RIGHT - registry lookup
   const Component = registry[schema.type];
   if (!Component) return <Fallback type={schema.type} />;
   return <Component {...schema.props} />;
   \`\`\`

2. WRAP IN ERROR BOUNDARY (renderer-has-error-boundary)
   Handle component errors gracefully to prevent cascading failures.
   \`\`\`typescript
   import { ErrorBoundary } from 'react-error-boundary';

   return (
     <ErrorBoundary fallback={<ErrorFallback />}>
       <Component {...props} />
     </ErrorBoundary>
   );
   \`\`\`

3. HANDLE UNKNOWN TYPES (renderer-has-fallback)
   Provide fallback UI for unknown or undefined schema types.
   \`\`\`typescript
   const Component = registry[schema.type];
   if (!Component) {
     console.warn(\`Unknown component type: \${schema.type}\`);
     return <FallbackComponent type={schema.type} />;
   }
   \`\`\`

4. SUPPORT REF FORWARDING (renderer-forwards-refs)
   Enable driver registration by forwarding refs to DOM elements.
   \`\`\`typescript
   // Using forwardRef
   const WidgetRenderer = forwardRef<HTMLDivElement, Props>((props, ref) => {
     return <div ref={ref}>{/* content */}</div>;
   });

   // Or passing ref prop directly
   return <Component ref={componentRef} {...schema.props} />;
   \`\`\`

Example renderer structure:
\`\`\`typescript
import { forwardRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { registry } from '@/content/registry';

interface WidgetRendererProps {
  schema: WidgetSchema;
}

export const WidgetRenderer = forwardRef<HTMLDivElement, WidgetRendererProps>(
  ({ schema }, ref) => {
    const Component = registry[schema.type];

    if (!Component) {
      return <FallbackWidget type={schema.type} />;
    }

    return (
      <ErrorBoundary fallback={<WidgetError />}>
        <div ref={ref}>
          <Component {...schema.props} />
        </div>
      </ErrorBoundary>
    );
  }
);
\`\`\`
`;
}

// Run the validator
main();
