/**
 * Data Binding Validator
 *
 * Validates that components with content array props support binding expressions.
 *
 * Rules:
 * - content-array-binding: Array props for content data must accept `| string` for binding
 *
 * Pattern:
 *   ❌ projects: Project[]           // Only accepts real arrays
 *   ✅ projects: Project[] | string  // Accepts arrays OR binding expressions
 *
 * This enables CMS users to use: projects: "{{ content.projects.featured }}"
 */

import type { ValidationResult, Validator } from '../types'
import { getFiles, readFile, relativePath } from '../utils/file-scanner'

/**
 * Content prop names that should support data binding.
 * These are props that CMS users would customize with dynamic content.
 */
const CONTENT_PROP_PATTERNS = [
  // Collections
  'projects',
  'logos',
  'clients',
  'roles',
  'items',
  'images',
  'photos',
  'videos',
  'links',
  'navLinks',
  'testimonials',
  'features',
  'services',
  'team',
  'members',
  'posts',
  'articles',
  'products',
  'categories',
  'tags',
  // Text arrays
  'paragraphs',
  'bioParagraphs',
  'bullets',
  'steps',
]

/**
 * Structural props that should NOT require binding support.
 * These hold child components/widgets, not CMS content.
 */
const STRUCTURAL_PROPS = [
  'widgets',    // Child widget array in layout components
  'sections',   // Child sections
  'children',   // React children
]

interface PropInfo {
  name: string
  type: string
  line: number
  isArray: boolean
  supportsBinding: boolean
}

/**
 * Extract prop definitions from types.ts content
 */
function extractProps(content: string): PropInfo[] {
  const props: PropInfo[] = []
  const lines = content.split('\n')

  // Match prop definitions like: propName: SomeType[] or propName?: SomeType[]
  const propRegex = /^\s*(\w+)\??:\s*(.+?)(?:;|$)/

  lines.forEach((line, index) => {
    const match = line.match(propRegex)
    if (!match) return

    const [, name, type] = match
    const trimmedType = type.trim()

    // Check if it's an array type
    const isArray = /\w+\[\]/.test(trimmedType) || /Array<\w+>/.test(trimmedType)

    // Check if it supports binding (has | string)
    const supportsBinding =
      /\|\s*string\b/.test(trimmedType) || /string\s*\|/.test(trimmedType)

    props.push({
      name,
      type: trimmedType,
      line: index + 1,
      isArray,
      supportsBinding,
    })
  })

  return props
}

/**
 * Check if a prop name is a structural prop (not content)
 */
function isStructuralProp(propName: string): boolean {
  const lowerName = propName.toLowerCase()
  return STRUCTURAL_PROPS.some((p) => lowerName === p.toLowerCase())
}

/**
 * Check if a prop name is a content prop that should support binding
 */
function isContentProp(propName: string): boolean {
  // Exclude structural props
  if (isStructuralProp(propName)) return false

  const lowerName = propName.toLowerCase()
  return CONTENT_PROP_PATTERNS.some(
    (pattern) =>
      lowerName === pattern.toLowerCase() ||
      lowerName.endsWith(pattern.toLowerCase())
  )
}

export const dataBindingValidator: Validator = {
  name: 'Data Binding',
  description: 'Validates content props support binding expressions',

  async validate(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    // Check all types.ts files in content/
    const typesFiles = await getFiles('content/**/types.ts')

    for (const file of typesFiles) {
      const content = await readFile(file)
      const relPath = relativePath(file)
      const props = extractProps(content)

      // Find content array props that don't support binding
      for (const prop of props) {
        if (!prop.isArray) continue
        if (!isContentProp(prop.name)) continue

        if (!prop.supportsBinding) {
          results.push({
            file: relPath,
            rule: 'content-array-binding',
            status: 'fail',
            message: `Content prop "${prop.name}" should support binding expressions`,
            details: `Line ${prop.line}: Change \`${prop.type}\` to \`${prop.type} | string\``,
          })
        } else {
          // Track as pass for reporting
          results.push({
            file: relPath,
            rule: 'content-array-binding',
            status: 'pass',
            message: `Content prop "${prop.name}" supports binding`,
          })
        }
      }
    }

    // If no content props found, add a pass result
    if (results.length === 0) {
      results.push({
        file: '',
        rule: 'data-binding',
        status: 'pass',
        message: 'No content array props found to validate',
      })
    }

    return results
  },
}
