/**
 * Registers a require extension that makes .css imports return empty modules.
 * Loaded via: npx tsx --require ./scripts/export/css-noop.cjs
 */

const Module = require('module')
const originalLoad = Module._extensions['.js']

// Intercept .css requires to return empty modules
Module._extensions['.css'] = function (module, filename) {
  module.exports = {}
}
