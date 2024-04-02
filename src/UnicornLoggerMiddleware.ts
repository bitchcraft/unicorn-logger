import type UnicornLogger from '@/UnicornLogger';

/**
 * Classes implementing this interface can be used as middlewares for UnicornLogger
 * @type {UnicornLoggerMiddleware}
 */
export interface UnicornLoggerMiddleware {
	/**
	 * Initialization method called on adding the middleware.
	 * Call `logger.registerMethod(string)` to add new methods to the instance or class
	 *
	 * @public
	 * @method initialize
	 * @param {UnicornLogger} Reference to the logger instance or class, allows to register new methods
	 * @returns {void}
	 * @example
	 *
	 * initialize(logger) {
	 *   logger.registerMethod('foo');
	 * }
	 *
	 */
	initialize?: (logger: { registerMethod: UnicornLogger['registerMethod'] }) => void;

	/**
	 * Called whenever a logging function of UnicornLogger is called.
	 * Middlewares can implement this to react to function calls
	 *
	 * @public
	 * @method call
	 * @param {string} methodName Name of the method being called
	 * @param {UnicornLogger} logger Instance of UnicornLogger the method was called on
	 * @param {function(args)} next Next function used to call the nex middleware,
	 * use this with the members of args as params.
	 * You can also choose to cancel the call by not calling next, this will also
	 * stop the application of other remaining middlewares.
	 * @param {...Array} args Arguments of the call
	 * @returns {void}
	 * @example
	 *
	 * call(method, logger, next, args) {
	 *   if (method === '') {
	 *     this.fn(...args);
	 *   }
	 *   next(...args);
	 * }
	 */
	call?: (methodName: string, logger: UnicornLogger, next: (...args: Array<unknown>) => void, args: Array<unknown>) => void;
}
