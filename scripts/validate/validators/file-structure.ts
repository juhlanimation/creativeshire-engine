/**
 * File Structure Validator
 *
 * Validates component file structure and naming conventions.
 *
 * Rules:
 * - has-index: Components must have index.tsx or index.ts
 * - has-types: Components must have types.ts
 * - has-meta: Components must have meta.ts
 * - naming-convention: PascalCase for widget/section folders
 */

import type { Validator, ValidationResult } from '../types'
import {
  getFolders,
  getComponentName,
  fileExists,
  relativePath,
} from '../utils/file-scanner'
import path from 'path'

/**
 * Component paths requiring full structure (index, types, meta)
 */
const COMPONENT_PATHS = [
  'content/widgets/primitives/*',
  'content/widgets/layout/*',
  'content/widgets/interactive/*',
  'content/widgets/patterns/*',
  'content/sections/patterns/*',
  'content/chrome/regions/*',
  'content/chrome/overlays/*',
]

/**
 * PascalCase pattern: starts with uppercase, only alphanumeric
 */
const PASCAL_CASE_PATTERN = /^[A-Z][a-zA-Z0-9]*$/

export const fileStructureValidator: Validator = {
  name: 'File Structure',
  description: 'Validates component file structure and naming conventions',

  async validate(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    for (const pattern of COMPONENT_PATHS) {
      const folders = await getFolders(pattern)

      for (const folder of folders) {
        const name = getComponentName(folder)
        const relPath = relativePath(folder)

        // Check PascalCase naming convention
        if (!PASCAL_CASE_PATTERN.test(name)) {
          results.push({
            file: relPath,
            rule: 'naming-convention',
            status: 'fail',
            message: `Folder "${name}" should be PascalCase`,
            details: 'Component folders must start with uppercase letter and contain only alphanumeric characters',
          })
        }

        // Check for index file (index.tsx or index.ts)
        const indexTsx = path.join(folder, 'index.tsx')
        const indexTs = path.join(folder, 'index.ts')
        const hasIndex = (await fileExists(indexTsx)) || (await fileExists(indexTs))

        if (!hasIndex) {
          results.push({
            file: relPath,
            rule: 'has-index',
            status: 'fail',
            message: 'Missing index.ts or index.tsx',
            details: 'Components must have an index file as the main entry point',
          })
        }

        // Check for types.ts
        const typesTs = path.join(folder, 'types.ts')
        if (!(await fileExists(typesTs))) {
          results.push({
            file: relPath,
            rule: 'has-types',
            status: 'fail',
            message: 'Missing types.ts',
            details: 'Components must have a types.ts file for type definitions',
          })
        }

        // Check for meta.ts
        const metaTs = path.join(folder, 'meta.ts')
        if (!(await fileExists(metaTs))) {
          results.push({
            file: relPath,
            rule: 'has-meta',
            status: 'fail',
            message: 'Missing meta.ts',
            details: 'Components must have a meta.ts file for component metadata',
          })
        }
      }
    }

    return results
  },
}
