/**
 * ESLint rule: no-document-events
 *
 * Disallows document-level APIs in engine code that break container/iframe support:
 * - `document.addEventListener` / `document.removeEventListener`
 * - `document.body` (for portals)
 *
 * Engine code must be container-aware to work in both fullpage and iframe contexts.
 * Use useContainer() hook for container-aware targets.
 *
 * @example
 * // Bad - breaks iframe support
 * document.addEventListener('keydown', handler)
 * createPortal(content, document.body)
 *
 * // Good - container-aware
 * const { mode, containerRef, portalTarget } = useContainer()
 * const target = mode === 'contained' && containerRef?.current
 *   ? containerRef.current
 *   : document
 * target.addEventListener('keydown', handler)
 * createPortal(content, portalTarget || siteContainer)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow document-level APIs that break container/iframe support',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noDocumentEvents:
        'Use container-aware event target instead of document. ' +
        'See useContainer() hook in engine/interface/ContainerContext.tsx',
      noDocumentBody:
        'Do not use document.body for portals - breaks iframe/container support. ' +
        'Portals must stay inside the site container for container queries to work. ' +
        'Use portalTarget from useContainer() or portal to the site container element.',
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        // Check for document.addEventListener or document.removeEventListener
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'document' &&
          node.callee.property.type === 'Identifier' &&
          (node.callee.property.name === 'addEventListener' ||
            node.callee.property.name === 'removeEventListener')
        ) {
          context.report({
            node,
            messageId: 'noDocumentEvents',
          })
        }
      },

      MemberExpression(node) {
        // Check for document.body
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'document' &&
          node.property.type === 'Identifier' &&
          node.property.name === 'body'
        ) {
          context.report({
            node,
            messageId: 'noDocumentBody',
          })
        }
      },
    }
  },
}
