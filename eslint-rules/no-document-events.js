/**
 * ESLint rule: no-document-events
 *
 * Disallows `document.addEventListener` and `document.removeEventListener` in engine code.
 * These should use container-aware event targets via useContainer() hook.
 *
 * @example
 * // Bad
 * document.addEventListener('keydown', handler)
 *
 * // Good
 * const { mode, containerRef } = useContainer()
 * const target = mode === 'contained' && containerRef?.current
 *   ? containerRef.current
 *   : document
 * target.addEventListener('keydown', handler)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow document.addEventListener without container awareness',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noDocumentEvents:
        'Use container-aware event target instead of document. ' +
        'See useContainer() hook in engine/interface/ContainerContext.tsx',
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
    }
  },
}
