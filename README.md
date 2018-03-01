# @bitchcraft/unicorn-logger

```
             ,
          ‸„/,
         / (×\
   ,----’ / `-'        UnicornLogger 1.0.1
  /( JL_( )   ́ ́ ́   
 ‘ //   //    ́ ́ ́ ́ ́  
   ``   ``   ́ ́ ́ ́ ́ ́ ́ ́
```
A fancy wrapper for [debug](https://yarnpkg.com/en/package/debug) that supports all Console Web API methods and allows chaining.

## Installation

```sh
$ yarn add @bitchcraft/unicorn-logger
$ npm install -P @bitchcraft/unicorn-logger
```

## Usage

UnicornLogger optimizes debug for writing to the browser console, but is also usable in NodeJS. It binds all Console Web API methods to debug with graceful fallbacks.

As with debug you can control the logging output with the `DEBUG` env (NodeJS) or a localStorage key `debug`. Values are a string with wildcards (e. g. `api:*,-api:auth*,-*info*,*important*`).

Create a new logger instance by calling the UnicornLogger constructor with a namespace (string). The new logger instance is directly callable (defaults to log) and exposes the following methods on top. All methods return a reference to the instance to allow method chaining.


### ES6 example

```js
import UnicornLogger from '@bitchcraft/unicorn-logger';

const logger = new UnicornLogger('myNamespace');
logger.group('new console group')
	.log('some stuff: %O', { logger })
	.warn('Oops. There is some unicorn barf on the ground.')
	.error('Something went seriously wrong here')
	.groupEnd();

```

### ES5 example

```js
var UnicornLogger require('@bitchcraft/unicorn-logger');
var logger = UnicornLogger('myNamespace');

logger.group('new console group')
	.log('some stuff: %O', { logger })
	.warn('Oops. There is some unicorn barf on the ground.')
	.error('Something went seriously wrong here')
	.groupEnd();

```

### Supported methods

| Method                                                                                    | Parameters                             | Description                                                                                                                                                                                                                                                                                         |
|:----------------------------------------------------------------------------------------- |:-------------------------------------- |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [assert](https://developer.mozilla.org/en-US/docs/Web/API/console/assert)                 | assertion: boolean, ...obj: Any        | Writes an error message to the console if the assertion is false. If the assertion is true, nothing happens.                                                                                                                                                                                        |
| [clear](https://developer.mozilla.org/en-US/docs/Web/API/Console/clear)                   |                                        | Clears the console                                                                                                                                                                                                                                                                                  |
| [error](https://developer.mozilla.org/en-US/docs/Web/API/Console/error)                   | ...obj: Any                            | Outputs an error message to the console                                                                                                                                                                                                                                                             |
| [group](https://developer.mozilla.org/en-US/docs/Web/API/Console/group)                   | label: string                          | Creates a new inline group in the Web Console log. This indents following console messages by an additional level, until groupEnd() is called.                                                                                                                                                      |
| [groupCollapsed](https://developer.mozilla.org/en-US/docs/Web/API/Console/groupCollapsed) | label: string                          | Creates a new collapsed inline group in the Web Console log.                                                                                                                                                                                                                                        |
| [groupEnd](https://developer.mozilla.org/en-US/docs/Web/API/Console/groupEnd)             |                                        | Exits the current inline group in the Web Console.                                                                                                                                                                                                                                                  |
| [info](https://developer.mozilla.org/en-US/docs/Web/API/Console/info)                     | ...obj: Any                            | Outputs an informational message to the Web Console. Most browsers prefix these messages with an (i)-icon.                                                                                                                                                                                          |
| [log](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) (alias: debug)        |                                        | Outputs a message to the console.                                                                                                                                                                                                                                                                   |
| [table](https://developer.mozilla.org/en-US/docs/Web/API/Console/table)                   | data: Array or Object, columns: Object | Displays tabular data as a table.                                                                                                                                                                                                                                                                   |
| [time](https://developer.mozilla.org/en-US/docs/Web/API/Console/time)                     | label: string                          | Starts a timer you can use to track how long an operation takes. You give each timer a unique name, and may have up to 1,000 timers per instance. When you call console.timeEnd() with the same label, the elapsed time in milliseconds since the timer was started will be written to the console. |
| [timeEnd](https://developer.mozilla.org/en-US/docs/Web/API/Console/timeEnd)               | label: string                          | Stops a timer that was previously started by calling time().                                                                                                                                                                                                                                        |
| [trace](https://developer.mozilla.org/en-US/docs/Web/API/Console/trace)                   | ...obj: Any                            | Outputs a stack trace to the console.                                                                                                                                                                                                                                                               |
| [warn](https://developer.mozilla.org/en-US/docs/Web/API/Console/warn)                     | ...obj: Any                            | Outputs a warning message to the console.                                                                                                                                                                                                                                                           |


### ES2015+ import with flow types

```js
// babel: env, stage-0, flow
import UnicornLogger from '@bitchcraft/unicorn-logger/src/UnicornLogger';
```

# Bundle size

About core-js takes up roughly 62% of the bundle size, which should not increase your bundle size if you are running babel. After minification, the gzipped size (including core-js) should be around 13KB.
You can check out the [bundle analytics](./dist/es5-bundle-analytics.html) for the non-minified bundle.

# Help and feedback

Please file issues in [Github](https://github.com/maddrag0n/unicorn-logger/issues)

# Contribute

We are open for PRs. Please respect to the linting rules.

# License

UnicornLogger is free software und the BSD-3-Clause (see [LICENSE.md](./LICENSE.md)). The unicorn UTF8 art is CC-Attribution 2018 Josh Li.

# Contributors

- [Josh Li](https://github.com/maddrag0n) (Maintainer)
