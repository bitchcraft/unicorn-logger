/**
 * Detect node instances and switch import accordingly.
 * also detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
	module.exports = require('./unicorn-logger.browser.es5');
} else {
	module.exports = require('./unicorn-logger.node.es5');
}
