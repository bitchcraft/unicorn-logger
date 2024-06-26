/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import {
	jest, describe, beforeEach, it, expect,
} from '@jest/globals';

/* Trick debug into thinking we actually want its output and disable colors and timestamp */
process.env.DEBUG = '*,-babel';
process.env.DEBUG_COLORS = 'no';
process.env.DEBUG_HIDE_DATE = 'true';

/* mock console */
const consoleLog = jest.fn();
const consoleInfo = jest.fn();
const consoleWarn = jest.fn();
const consoleError = jest.fn();
const consoleTrace = jest.fn();
const consoleAssert = jest.fn();
const consoleTable = jest.fn();
const consoleGroup = jest.fn();
const consoleGroupCollapsed = jest.fn();
const consoleGroupEnd = jest.fn();
const consoleClear = jest.fn();
const mockConsole = {
	log: consoleLog,
	info: consoleInfo,
	warn: consoleWarn,
	error: consoleError,
	trace: consoleTrace,
	assert: consoleAssert,
	table: consoleTable,
	group: consoleGroup,
	groupCollapsed: consoleGroupCollapsed,
	groupEnd: consoleGroupEnd,
	clear: consoleClear,
};
global.console = mockConsole;

// We need to import late here to ensure console mocks are setup first
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: UnicornLogger } = require('@/UnicornLogger');

const clearConsoleMocks = () => {
	Object.keys(mockConsole).forEach((key) => {
		mockConsole[key].mockClear();
	});
};

const UnicornLoggerPrototype = { ...UnicornLogger.prototype };
const resetUnicornLogger = () => {
	UnicornLogger.globalMiddlewares = [];
	UnicornLogger.protototype = { ...UnicornLoggerPrototype };
};

const loggerNamespace = 'jest';

class DummyMiddleware {
	constructor() {
		this.call = jest.fn((method, logger, next, args) => next(...args));
	}
}

class SuffixMiddleware {
	constructor(suffix) {
		this.suffix = suffix;
	}

	call(methods, logger, next, args) {
		return next(...args, this.suffix);
	}
}

class FunctionMiddleware {
	constructor() {
		this.fn = jest.fn();
		this.functionName = 'fn';
	}

	initialize(logger) {
		logger.registerMethod(this.functionName);
	}

	call(method, logger, next, args) {
		if (method === this.functionName) {
			this.fn(...args);
		}
		next(...args);
	}
}

class CancelCallMiddleware {
	/* eslint-disable consistent-return */
	call(method, logger, next, args) {
		if (method !== 'log') {
			return next(...args);
		}
	}
	/* eslint-enable consistent-return */
}

describe('UnicornLogger', () => {

	beforeEach(() => {
		clearConsoleMocks();
		/* Clear any changes to UnicornLogger */
		resetUnicornLogger();
	});

	it('calls base functions without any middlewares present', () => {
		const logger = new UnicornLogger(loggerNamespace);
		logger.log('calling log')
			.info('calling info')
			.warn('calling warn')
			.error('calling error')
			.trace('trace me')
			.assert(true, 'truthy assertion')
			.group('jest group')
			.groupCollapsed('jest group 2')
			.groupEnd()
			.groupEnd();

		expect(consoleLog).toHaveBeenCalledTimes(1);
		expect(consoleInfo).toHaveBeenCalledTimes(1);
		expect(consoleWarn).toHaveBeenCalledTimes(1);
		expect(consoleError).toHaveBeenCalledTimes(1);
		expect(consoleTrace).toHaveBeenCalledTimes(1);
		expect(consoleAssert).toHaveBeenCalledTimes(1);
		expect(consoleGroup).toHaveBeenCalledTimes(1);
		expect(consoleGroupCollapsed).toHaveBeenCalledTimes(1);
		expect(consoleGroupEnd).toHaveBeenCalledTimes(2);
	});

	it('calls base functions with middlewares present', () => {
		const logger = new UnicornLogger(loggerNamespace);
		logger.use(new DummyMiddleware());
		logger.log('calling log')
			.info('calling info')
			.warn('calling warn')
			.error('calling error')
			.trace('trace me')
			.assert(true, 'truthy assertion')
			.group('jest group')
			.groupCollapsed('jest group 2')
			.groupEnd()
			.groupEnd();

		expect(consoleLog).toHaveBeenCalledTimes(1);
		expect(consoleInfo).toHaveBeenCalledTimes(1);
		expect(consoleWarn).toHaveBeenCalledTimes(1);
		expect(consoleError).toHaveBeenCalledTimes(1);
		expect(consoleTrace).toHaveBeenCalledTimes(1);
		expect(consoleAssert).toHaveBeenCalledTimes(1);
		expect(consoleGroup).toHaveBeenCalledTimes(1);
		expect(consoleGroupCollapsed).toHaveBeenCalledTimes(1);
		expect(consoleGroupEnd).toHaveBeenCalledTimes(2);
	});

	it('middlewares do not alter args by default', () => {
		const args = [ 'calling log', { test: true } ];
		const logger = new UnicornLogger(loggerNamespace);
		logger.use(new DummyMiddleware());

		logger.log(...args);

		expect(consoleLog).toHaveBeenLastCalledWith(`${loggerNamespace} ${args[0]}`, ...args.slice(1));
	});

	it('middlewares can alter args', () => {
		const args = [ 'calling log', { test: true } ];
		const suffix = 'suffix';
		const logger = new UnicornLogger(loggerNamespace);
		logger.use(new SuffixMiddleware(suffix));

		logger.log(...args);

		expect(consoleLog).toHaveBeenLastCalledWith(`${loggerNamespace} ${args[0]}`, ...args.slice(1), suffix);
	});

	it('middlewares can cancel calls', () => {
		const args = [ 'calling log', { test: true } ];
		const logger = new UnicornLogger(loggerNamespace);
		logger.use(new CancelCallMiddleware());

		logger.log(...args);
		logger.info(...args);

		expect(consoleLog).not.toHaveBeenCalled();
		expect(consoleInfo).toHaveBeenLastCalledWith(`${loggerNamespace} ${args[0]}`, ...args.slice(1));
	});

	it('can have multiple middlewares, which are ordered', () => {
		const args = [ 'calling log', { test: true } ];
		const suffix1 = 'suffix1';
		const suffix2 = 'suffix2';
		const logger = new UnicornLogger(loggerNamespace);
		logger.use(new SuffixMiddleware(suffix1));
		logger.use(new SuffixMiddleware(suffix2));

		logger.log(...args);

		expect(consoleLog).toHaveBeenLastCalledWith(`${loggerNamespace} ${args[0]}`, ...args.slice(1), suffix1, suffix2);
	});

	it('middlewares can register new functions', () => {
		const args = [ 'calling log', { test: true } ];
		const middleware = new FunctionMiddleware();
		const logger = new UnicornLogger(loggerNamespace);
		logger.use(middleware);

		logger.fn(...args);

		expect(middleware.fn).toHaveBeenLastCalledWith(...args);
	});

	it('keeps functions added by middlewares chainable', () => {
		const args = [ 'calling log', { test: true } ];
		const middleware = new FunctionMiddleware();
		const logger = new UnicornLogger(loggerNamespace);
		logger.use(middleware);

		logger.fn(...args).log(...args);

		expect(middleware.fn).toHaveBeenLastCalledWith(...args);
		expect(consoleLog).toHaveBeenLastCalledWith(`${loggerNamespace} ${args[0]}`, ...args.slice(1));
	});

	it('can have global middlewares', () => {
		const args = [ 'calling log', { test: true } ];
		const suffix = 'suffix';
		const logger = new UnicornLogger(loggerNamespace);
		UnicornLogger.use(new SuffixMiddleware(suffix));

		logger.log(...args);

		expect(consoleLog).toHaveBeenLastCalledWith(`${loggerNamespace} ${args[0]}`, ...args.slice(1), suffix);
	});

	it('global middlewares can also register new functions', () => {
		const args = [ 'calling log', { test: true } ];
		const middleware = new FunctionMiddleware();
		const logger = new UnicornLogger(loggerNamespace);
		UnicornLogger.use(middleware);

		logger.fn(...args);

		expect(middleware.fn).toHaveBeenLastCalledWith(...args);
	});

	it('applies global middlewares before instance ones', () => {
		const args = [ 'calling log', { test: true } ];
		const suffix1 = 'suffix1';
		const suffix2 = 'suffix2';
		const logger = new UnicornLogger(loggerNamespace);
		logger.use(new SuffixMiddleware(suffix1));
		UnicornLogger.use(new SuffixMiddleware(suffix2));

		logger.log(...args);

		expect(consoleLog).toHaveBeenLastCalledWith(`${loggerNamespace} ${args[0]}`, ...args.slice(1), suffix2, suffix1);
	});

	it('passes the instance a method is called on to middlewares', () => {
		const args = [ 'calling log', { test: true } ];
		const ns1 = `${loggerNamespace}:1`;
		const ns2 = `${loggerNamespace}:2`;
		const middleware = new DummyMiddleware();
		UnicornLogger.use(middleware);
		const logger1 = new UnicornLogger(ns1);
		const logger2 = new UnicornLogger(ns2);

		logger1.log(args);
		logger2.log(args);

		expect(middleware.call).toHaveBeenCalledTimes(2);
		expect(middleware.call.mock.calls[1][1]).toEqual(logger2);
		expect(middleware.call.mock.calls[1][1].namespace).toEqual(ns2);
	});
});
