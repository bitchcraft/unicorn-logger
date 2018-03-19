// @flow
import type UnicornLogger from 'UnicornLogger';

export interface UnicornLoggerMiddleware {
	initialize?: (logger: UnicornLogger) => void;
	call?: (methodName: string, next: (args: Array<*>) => void, args: Array<*>) => void;
}
