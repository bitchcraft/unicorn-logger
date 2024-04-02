/* eslint-disable no-console, no-sequences */
import logFactory from 'debug';
import type { UnicornLoggerMiddleware } from '@/UnicornLoggerMiddleware';

type Cleaner = (args: unknown[]) => unknown[]
type Options = {
	cleaner?: Cleaner,
	maxTimers?: number,
};

const consoleLog = typeof console.log === 'function' ? console.log.bind(console) : () => {};
const consoleDebug = typeof console.debug === 'function' ? console.debug.bind(console) : consoleLog;
const consoleInfo = typeof console.info === 'function' ? console.info.bind(console) : consoleLog;
const consoleWarn = typeof console.warn === 'function' ? console.warn.bind(console) : consoleLog;
const consoleError = typeof console.error === 'function' ? console.error.bind(console) : consoleLog;
const consoleTrace = typeof console.trace === 'function' ? console.trace.bind(console) : consoleLog;
const consoleAssert = typeof console.assert === 'function' ? console.assert.bind(console) : consoleLog;
const consoleGroup = typeof console.group === 'function' ? console.group.bind(console) : consoleLog;
const consoleGroupCollapsed = typeof console.groupCollapsed === 'function' ? console.groupCollapsed.bind(console) : consoleLog;
const consoleGroupEnd = typeof console.groupEnd === 'function' ? console.groupEnd.bind(console) : () => {};
const consoleClear = typeof console.clear === 'function' ? console.clear.bind(console) : () => {};

const MAX_TIMERS = 1000;

const logToTable = function(namespace: string, color1: string | undefined, color2: string | undefined, color3: string | undefined, ...args: unknown[]) {
	console.group(namespace, color1, color2, color3);
	args.forEach((arg) => {
		if (arg && (!Array.isArray(arg) || typeof arg === 'object')) {
			console.table(arg);
		} else if (arg) console.log(arg);
	});
	console.groupEnd();
};

const consoleTable = (
	typeof console.table === 'function'
	&& typeof console.group === 'function'
	&& typeof console.groupEnd === 'function'
) ? logToTable : consoleLog;

const defaultCleaner: Cleaner = (args) => args;

/**
 * ```js
 * import UnicornLogger from '@bitchcraft/unicorn-logger';
 * ```
 *
 * Creates a chainable logger with namespaces. Wraps console API with fallbacks.
 *
 * Enabling/disabling log output can be controlled with DEBUG={glob patterns} for NodeJS
 * and a localStorage key value pair debug: glob patterns
 *
 * @public
 * @class
 * @module UnicornLogger
 * @requires debug
 * @example
 *
 * const logger = new UnicornLogger('my-namespace');
 *
 * logger.time('my-group-1')
 *     .group('New logging group')
 *     .log('Some log output in your logging group', { logger })
 *     .warn('There is nothing broken here')
 *     .timeNed('my-group-1')
 *     .groupEnd();
 */
class UnicornLogger {
	namespace: string;

	assert: (...args: unknown[]) => UnicornLogger;

	clear: () => UnicornLogger;

	group: (...args: unknown[]) => UnicornLogger;

	groupCollapsed: (...args: unknown[]) => UnicornLogger;

	groupEnd: () => UnicornLogger;

	time: (label: string) => UnicornLogger;

	timeEnd: (label: string) => UnicornLogger;

	debug: (...args: unknown[]) => UnicornLogger;

	error: (...args: unknown[]) => UnicornLogger;

	info: (...args: unknown[]) => UnicornLogger;

	log: (...args: unknown[]) => UnicornLogger;

	table: (...args: unknown[]) => UnicornLogger;

	trace: (...args: unknown[]) => UnicornLogger;

	warn: (...args: unknown[]) => UnicornLogger;

	static globalMiddlewares: UnicornLoggerMiddleware[] = [];

	middlewares: UnicornLoggerMiddleware[];

	cleaner: Cleaner;

	maxTimers: number;

	timers: Map<unknown, number>;


	/**
	 * @public
	 * @method constructor
	 * @param {string} namespace - Unique namespace for your function to filter for in glob patterns. Usually file path or module:submodule
	 * @param {Object} Options
	 * @param {number} [Options.maxTimers=1000] - maximum number of timers that can be created
	 * @param {function} [Options.cleaner] - clean up function for args
	 */
	constructor(namespace: string, {
		cleaner = defaultCleaner,
		maxTimers = MAX_TIMERS,
	}: Options = {}) {

		this.namespace = namespace;
		this.cleaner = cleaner;
		this.maxTimers = maxTimers;
		this.timers = new Map();
		this.middlewares = [];

		/**
		 * Wraps console.log
		 *
		 * @public
		 * @method log
		 * @param  {...args} args
		 * @return {this}
		 * @example logger.log('important object', { important: false });
		 */
		const log = logFactory(namespace);
		log.log = consoleLog;
		this.log = (...args) => (this.applyMiddlewares('log', this.cleaner(args), log), this);

		/**
		 * Wraps console.assert
		 *
		 * @public
		 * @method assert
		 * @param  {...args} args
		 * @return {this}
		 * @example logger.assert(typeof someCandidate !== 'function', 'someCandidate is now a %s', typeof someCandidate);
		 */
		const assert = logFactory(namespace);
		assert.log = consoleAssert;
		this.assert = (...args) => (this.applyMiddlewares('assert', this.cleaner(args), assert), this);

		/**
		 * Wraps console.info
		 *
		 * @public
		 * @method info
		 * @param  {...args} args
		 * @return {this}
		 * @example logger.info('important object', { important: false });
		 */
		const info = logFactory(namespace);
		info.log = consoleInfo;
		this.info = (...args) => (this.applyMiddlewares('info', this.cleaner(args), info), this);

		/**
		 * Wraps console.debug
		 *
		 * @public
		 * @method debug
		 * @param  {...args} args
		 * @return {this}
		 * @example logger.debug('important object', { important: false });
		 */
		const debug = logFactory(namespace);
		debug.log = consoleDebug;
		this.debug = (...args) => (this.applyMiddlewares('debug', this.cleaner(args), debug), this);

		/**
		 * Wraps console.warn
		 *
		 * @public
		 * @method warn
		 * @param  {...args} args
		 * @return {this}
		 * @example logger.warn('important object', { important: false });
		 */
		const warn = logFactory(namespace);
		warn.log = consoleWarn;
		this.warn = (...args) => (this.applyMiddlewares('warn', this.cleaner(args), warn), this);

		/**
		 * Wraps console.error
		 *
		 * @public
		 * @method error
		 * @param  {...args} args
		 * @return {this}
		 * @example logger.error(new Error('this is not an error'));
		 */
		const error = logFactory(namespace);
		error.log = consoleError;
		this.error = (...args) => (this.applyMiddlewares('error', this.cleaner(args), error), this);

		/**
		 * Wraps console.trace
		 *
		 * @public
		 * @method trace
		 * @param  {...args} args
		 * @return {this}
		 * @example logger.trace(someCall());
		 */
		const trace = logFactory(namespace);
		trace.log = consoleTrace;
		this.trace = (...args) => (this.applyMiddlewares('trace', this.cleaner(args), trace), this);

		/**
		 * Wraps console.table
		 *
		 * @public
		 * @method table
		 * @param  {data} data         - The data to display. This must be either an array or an object.
		 * @param  {columns} [columns] - An array containing the names of columns to include in the output.
		 * @return {this}
		 * @example logger.table('important object', { important: false });
		 */
		const table = logFactory(namespace);
		table.log = consoleTable;
		this.table = (...args) => (this.applyMiddlewares('table', this.cleaner(args), table), this);

		/**
		 * Wraps console.group
		 *
		 * @public
		 * @method group
		 * @param  {...args} [label] - label for the group
		 * @return {this}
		 * @example logger.group('%cAwesome group', 'color: #ff0000; font-weight: bold;');
		 */
		const group = logFactory(namespace);
		group.log = consoleGroup;
		this.group = (...args) => (this.applyMiddlewares('group', this.cleaner(args), group), this);

		/**
		 * Wraps console.groupCollapsed
		 *
		 * @public
		 * @method groupCollapsed
		 * @param  {...args} [label] - label for the group
		 * @return {this}
		 * @example logger.groupCollapsed('%cAwesome group', 'color: #ff0000; font-weight: bold;');
		 */
		const groupCollapsed = logFactory(namespace);
		groupCollapsed.log = consoleGroupCollapsed;
		this.groupCollapsed = (...args) => (this.applyMiddlewares('groupCollapsed', this.cleaner(args), groupCollapsed), this);

		/**
		 * Wraps console.clear
		 *
		 * @public
		 * @method clear
		 * @return {this}
		 * @example logger.clear();
		 */
		const clear = logFactory(namespace);
		clear.log = () => consoleClear();
		this.clear = () => (this.applyMiddlewares('clear', [], clear), this);

		/**
		 * Wraps groupEnd
		 *
		 * @public
		 * @method groupEnd
		 * @return {this}
		 * @example logger.groupEnd();
		 */
		const groupEnd = logFactory(namespace);
		groupEnd.log = () => consoleGroupEnd();
		this.groupEnd = () => (this.applyMiddlewares('groupEnd', [], groupEnd), this);

		/**
		 * Implements console.time functionality
		 *
		 * @public
		 * @method time
		 * @param  {label} [label] - The name to give the new timer. This will identify the timer; use the same name when calling logger.timeEnd() to stop the timer and get the time output to the console.
		 * @return {this}
		 * @example logger.time('timer-one');
		 */
		const time = logFactory(namespace);
		time.log = (ns, c1, c2, c3, label: unknown) => {
			const { maxTimers: MaxTimers, timers } = this;
			if (Array.from(timers.keys()).length >= MaxTimers) {
				this.warn(`Failed call to .time(${label}). You have exceeded the maximum number of timers (${MaxTimers}) for this Logger instance.`);
				return;
			}
			timers.set(label, Date.now());
		};
		this.time = (label) => (this.applyMiddlewares('time', [ label ], time), this);

		/**
		 * Implements console.timeEnd functionality
		 *
		 * @public
		 * @method timeEnd
		 * @param  {label} [label] - The name of the timer to stop. Once stopped, the elapsed time is automatically displayed in the console.
		 * @return {this}
		 * @example logger.timeEnd('timer-one');
		 */
		const timeEnd = logFactory(namespace);
		timeEnd.log = (ns, c1, c2, c3, label: unknown) => {
			const { timers } = this;
			if (!timers.has(label)) {
				this.error(`No timer with the label ${label} exists for this Logger instance.`);
				return;
			}
			const timePassed = Date.now() - Number(timers.get(label));
			timers.delete(label);
			this.log(`label: ${timePassed}ms`);
		};
		this.timeEnd = (label) => (this.applyMiddlewares('timeEnd', [ label ], timeEnd), this);
	}

	/**
	 * Allows middlewares to register new methods to an instance of UnicornLogger
	 * @public
	 * @method registerMethod
	 * @param  {string} methodName Name of the method to add
	 * @return {void}
	 * @example
	 *
	 * initialize(logger) {
	 *   logger.registerMethod('foo');
	 * }
	 */
	registerMethod(methodName: string) {
		// @ts-expect-error -- old style api, this is extremely complex to model via typescript
		if (this[methodName]) {
			// @ts-expect-error -- old style api, this is extremely complex to model via typescript
			return typeof this[methodName] === 'function';
		}
		// @ts-expect-error -- old style api, this is extremely complex to model via typescript
		this[methodName] = UnicornLogger.applyMethod(methodName);
		return true;
	}

	/**
	 * Allows middlewares to register new methods to UnicornLogger
	 * @public
	 * @method registerMethod
	 * @param  {string} methodName Name of the method to add
	 * @return {void}
	 * @example
	 *
	 * initialize(logger) {
	 *   logger.registerMethod('foo');
	 * }
	 */
	static registerMethod(methodName: string) {
		/* eslint-disable no-prototype-builtins */
		if (UnicornLogger.hasOwnProperty(methodName)) {
			// @ts-expect-error -- old style api, this is extremely complex to model via typescript
			return typeof UnicornLogger.prototype[methodName] === 'function';
		}
		/* eslint-enable no-prototype-builtins */
		// @ts-expect-error -- old style api, this is extremely complex to model via typescript
		UnicornLogger.prototype[methodName] = UnicornLogger.applyMethod(methodName);
		return true;
	}

	/**
	 * Adds a middleware to an instance of UnicornLogger
	 * @public
	 * @method use
	 * @param  {UnicornLoggerMiddleware} middleware The middleware to add
	 * @return {void}
	 * @example logger.use(new ExampleMiddleware());
	 */
	use(middleware: UnicornLoggerMiddleware) {
		if (typeof middleware.initialize === 'function') {
			middleware.initialize(this);
		}

		if (!this.middlewares.includes(middleware)) {
			this.middlewares.push(middleware);
		}
	}

	/**
	 * Adds a middleware to UnicornLogger
	 * @public
	 * @method use
	 * @param  {UnicornLoggerMiddleware} middleware The middleware to add
	 * @return {void}
	 * @example UnicornLogger.use(new ExampleMiddleware());
	 */
	static use(middleware: UnicornLoggerMiddleware): void {
		if (typeof middleware.initialize === 'function') {
			middleware.initialize(UnicornLogger);
		}

		if (!UnicornLogger.globalMiddlewares.includes(middleware)) {
			UnicornLogger.globalMiddlewares.push(middleware);
		}
	}

	/**
	 * Generates a method, which calls all middlewares
	 * @private
	 * @method applyMethod
	 * @param  {string} methodName The name of the method to generate
	 * @return {function}          The generated logging function
	 */
	static applyMethod(methodName: string) {
		return function(this: UnicornLogger, ...args: unknown[]) {
			this.applyMiddlewares(methodName, args);
			return this;
		};
	}

	/**
	 * Applies global and instance middlewares and calls the given base function afterwards
	 * @private
	 * @method applyMiddlewares
	 * @param  {string} methodName The name of the method being called
	 * @param  {Array} args        The arguments the method was called with
	 * @param  {Function} baseFn   The function to be called after all middlewares have been called
	 * @return {void}
	 */
	applyMiddlewares(methodName: string, args: unknown[], baseFn?: (...a: unknown[]) => void): void {
		const middlewares = UnicornLogger.globalMiddlewares.concat(this.middlewares);
		const iterator = middlewares.values();
		const callMiddleware = (_args: unknown[]): void => {
			const next = (...a: unknown[]) => callMiddleware(a);
			const nextMiddleware = iterator.next().value;
			if (!nextMiddleware) {
				if (baseFn) baseFn(..._args);
			} else if (typeof nextMiddleware.call === 'function') {
				nextMiddleware.call(methodName, this, next, _args);
			} else next(..._args);
		};
		callMiddleware(args);
	}
}

export default UnicornLogger;
