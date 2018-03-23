// @flow
import type UnicornLogger from 'src/UnicornLogger';

export interface UnicornLoggerMiddleware {
	initialize?: (logger: UnicornLogger | Class<UnicornLogger>) => void;
	call?: (methodName: string, next: (...args: Array<*>) => void, args: Array<*>) => void;
}
