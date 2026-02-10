/**
 * Collection Widgets Architecture Test
 *
 * Validates that widgets rendering collections use __repeat children in schemas,
 * NOT direct array props. This ensures every item is visible in the hierarchy
 * panel and can be individually selected, edited, and reordered.
 *
 * Rule: Any widget with an array prop (e.g., projects[], logos[]) should
 * receive items via __repeat children, not via props.arrayProp binding.
 *
 * ❌ Bad (array as prop - items hidden in hierarchy):
 * {
 *   type: 'LogoMarquee',
 *   props: { logos: '{{ content.logos }}' }
 * }
 *
 * ✅ Good (items as children - visible in hierarchy):
 * {
 *   type: 'LogoMarquee',
 *   widgets: [{
 *     __repeat: '{{ content.logos }}',
 *     type: 'LogoItem',
 *     props: { src: '{{ item.src }}' }
 *   }]
 * }
 */

import { describe, it, expect } from 'vitest'
import { getFiles, readFile, relativePath } from './helpers'

/**
 * Widgets that are known to accept collection arrays as props.
 * These should use __repeat in schemas instead of direct prop binding.
 *
 * Format: { widgetType: arrayPropName }
 */
const COLLECTION_WIDGETS: Record<string, string> = {
  LogoMarquee: 'logos',
  ExpandableGalleryRow: 'projects',
  FeaturedProjectsGrid: 'projects',
  HeroRoles: 'roles',
  ShotIndicator: 'shots',
  TabbedContent: 'tabs',
  ProjectSelector: 'projects',
  TeamShowcase: 'members',
}

/**
 * Widgets that manage array data internally (video layers + names + state).
 * These accept arrays as props but cannot use __repeat children because
 * they coordinate multiple DOM structures from a single data source.
 * Exempt from the "use __repeat children" schema validation.
 */
const SELF_MANAGED_COLLECTIONS = new Set([
  'TeamShowcase', // Renders videos + names + hover/scroll state from members array
])

/**
 * Extract all widget usages from a schema file.
 * Returns array of { type, hasDirectArrayProp, hasRepeatChildren, location }
 */
function analyzeSchemaWidgets(content: string, filePath: string): Array<{
  type: string
  propName: string
  hasDirectArrayProp: boolean
  hasRepeatChildren: boolean
  location: string
}> {
  const results: Array<{
    type: string
    propName: string
    hasDirectArrayProp: boolean
    hasRepeatChildren: boolean
    location: string
  }> = []

  // For each known collection widget, check if it's used in this file
  for (const [widgetType, propName] of Object.entries(COLLECTION_WIDGETS)) {
    // Check if this widget type is used
    const typeRegex = new RegExp(`type:\\s*['"]${widgetType}['"]`, 'g')
    let match

    while ((match = typeRegex.exec(content)) !== null) {
      const startIndex = match.index

      // Find the widget block boundaries by counting braces
      // Go backwards to find opening brace
      let braceCount = 0
      let blockStart = startIndex
      for (let i = startIndex; i >= 0; i--) {
        if (content[i] === '}') braceCount++
        if (content[i] === '{') {
          braceCount--
          if (braceCount < 0) {
            blockStart = i
            break
          }
        }
      }

      // Go forwards to find closing brace
      braceCount = 0
      let blockEnd = startIndex
      for (let i = blockStart; i < content.length; i++) {
        if (content[i] === '{') braceCount++
        if (content[i] === '}') {
          braceCount--
          if (braceCount === 0) {
            blockEnd = i + 1
            break
          }
        }
      }

      const widgetBlock = content.slice(blockStart, blockEnd)

      // Check if array prop is passed directly in props
      // e.g., props: { logos: '{{ ... }}' } or logos: [...]
      const directPropRegex = new RegExp(
        `props:\\s*\\{[^}]*${propName}:\\s*['"\`{\\[]`,
        's'
      )
      const hasDirectArrayProp = directPropRegex.test(widgetBlock)

      // Check if widget has __repeat children
      const hasRepeatChildren = /__repeat:\s*['"]/.test(widgetBlock)

      results.push({
        type: widgetType,
        propName,
        hasDirectArrayProp,
        hasRepeatChildren,
        location: relativePath(filePath),
      })
    }
  }

  return results
}

describe('Collection Widgets Architecture', () => {
  describe('Schema usage validation', () => {
    it('collection widgets should use __repeat children, not array props', async () => {
      // Find all preset page schemas
      const schemaFiles = await getFiles('presets/**/pages/*.ts')
      const chromeFiles = await getFiles('presets/**/chrome/*.ts')
      const allSchemaFiles = [...schemaFiles, ...chromeFiles]

      const violations: string[] = []

      for (const file of allSchemaFiles) {
        const content = await readFile(file)
        const widgets = analyzeSchemaWidgets(content, file)

        for (const widget of widgets) {
          if (widget.hasDirectArrayProp && !widget.hasRepeatChildren && !SELF_MANAGED_COLLECTIONS.has(widget.type)) {
            violations.push(
              `${widget.location}: ${widget.type} uses direct '${widget.propName}' prop instead of __repeat children`
            )
          }
        }
      }

      if (violations.length > 0) {
        console.log('\n⚠️  Collection widgets should use __repeat for hierarchy visibility:\n')
        console.log('These widgets receive arrays as props, hiding items from the hierarchy panel.')
        console.log('Refactor to use __repeat children so each item is selectable/reorderable.\n')
        violations.forEach((v) => console.log(`  ❌ ${v}`))
        console.log('\nExample fix:')
        console.log(`
  // Before (items hidden):
  {
    type: 'LogoMarquee',
    props: { logos: '{{ content.logos }}' }
  }

  // After (items visible in hierarchy):
  {
    type: 'LogoMarquee',
    props: { duration: 30 },
    widgets: [{
      __repeat: '{{ content.logos }}',
      id: 'logo',
      type: 'LogoItem',
      props: {
        src: '{{ item.src }}',
        alt: '{{ item.alt }}'
      }
    }]
  }
`)
      }

      expect(
        violations,
        `Collection widgets using array props instead of __repeat:\n${violations.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Widget type definitions', () => {
    it('collection widgets should document their array props', async () => {
      const missing: string[] = []

      for (const widgetType of Object.keys(COLLECTION_WIDGETS)) {
        // Find the widget's types.ts file
        const typeFiles = await getFiles(`content/widgets/**/types.ts`)

        let found = false
        for (const file of typeFiles) {
          const content = await readFile(file)
          if (content.includes(`interface ${widgetType}Props`)) {
            found = true
            break
          }
        }

        if (!found) {
          missing.push(widgetType)
        }
      }

      expect(
        missing,
        `Collection widgets missing type definitions:\n${missing.join('\n')}`
      ).toHaveLength(0)
    })
  })

  describe('Known collection widgets registry', () => {
    it('all widgets with array props must be registered in COLLECTION_WIDGETS', async () => {
      // Find all widgets with array props in their types
      const typeFiles = await getFiles('content/widgets/**/types.ts')
      const detectedArrayWidgets: Record<string, string[]> = {}

      for (const file of typeFiles) {
        const content = await readFile(file)

        // Find interface XxxProps with array properties
        const interfaceMatch = content.match(/interface\s+(\w+)Props[^{]*\{([^}]+)\}/s)
        if (interfaceMatch) {
          const widgetName = interfaceMatch[1]
          const propsBody = interfaceMatch[2]

          // Find properties with array types: propName: SomeType[] | string
          const arrayProps = propsBody.match(/(\w+):\s*\w+\[\]/g)
          if (arrayProps) {
            const propNames = arrayProps.map((p) => p.split(':')[0].trim())
            if (propNames.length > 0) {
              detectedArrayWidgets[widgetName] = propNames
            }
          }
        }
      }

      // Report any widgets with array props not in our registry
      const unregistered: string[] = []
      for (const [widget, props] of Object.entries(detectedArrayWidgets)) {
        if (!COLLECTION_WIDGETS[widget]) {
          unregistered.push(`${widget}: ${props.join(', ')}`)
        }
      }

      if (unregistered.length > 0) {
        console.log('\n❌ Widgets with array props MUST be registered in COLLECTION_WIDGETS:')
        unregistered.forEach((u) => console.log(`  - ${u}`))
        console.log('\nTo fix: Add these to COLLECTION_WIDGETS in collections.test.ts')
        console.log('This ensures schemas use __repeat children for hierarchy visibility.\n')
      }

      expect(
        unregistered,
        `Unregistered collection widgets found. Add to COLLECTION_WIDGETS:\n${unregistered.join('\n')}`
      ).toHaveLength(0)
    })

    it('COLLECTION_WIDGETS entries reference existing widgets', async () => {
      // Verify all registered widgets actually exist
      const typeFiles = await getFiles('content/widgets/**/types.ts')
      const existingWidgets: Set<string> = new Set()

      for (const file of typeFiles) {
        const content = await readFile(file)
        const interfaceMatch = content.match(/interface\s+(\w+)Props/)
        if (interfaceMatch) {
          existingWidgets.add(interfaceMatch[1])
        }
      }

      const orphaned: string[] = []
      for (const widget of Object.keys(COLLECTION_WIDGETS)) {
        if (!existingWidgets.has(widget)) {
          orphaned.push(widget)
        }
      }

      expect(
        orphaned,
        `COLLECTION_WIDGETS references non-existent widgets:\n${orphaned.join('\n')}`
      ).toHaveLength(0)
    })
  })
})
