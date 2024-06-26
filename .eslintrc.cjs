module.exports = {
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
	],
	plugins: [
		'@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		node: true,
		mocha: true,
		jest: true,
		jasmine: true,
		es6: true,
	},
	rules: {
		'arrow-body-style': 0,
		'array-bracket-spacing': [0, 'always'],
		camelcase: [1, {
			properties: 'never',
		}],
		'no-tabs': 0,
		'comma-dangle': [1, 'always-multiline'],
		'consistent-return': 1,
		'func-names': 0,
		'function-paren-newline': 0,
		'global-require': 0,
		indent: [2, 'tab', { SwitchCase: 1 }],
		'max-len': 0,
		'new-cap': [1, {
			capIsNewExceptions: [
				'Array',
				'Boolean',
				'Date',
				'Error',
				'Function',
				'Number',
				'Object',
				'RegExp',
				'String',
				'Symbol',
				'List',
				'Map',
				'OrderedMap',
			],
		}],
		'no-else-return': 1,
		'no-mixed-spaces-and-tabs': 1,
		'no-multiple-empty-lines': [1, {
			max: 10,
		}],
		'no-param-reassign': 0,
		'no-plusplus': 0,
		'no-trailing-spaces': [2, {
			skipBlankLines: true,
		}],
		'no-underscore-dangle': 0,
		'no-unused-vars': [2, {
			vars: 'all',
			args: 'none',
		}],
		'no-use-before-define': 0,
		'@typescript-eslint/no-use-before-define': [2, 'nofunc'],
		'no-var': 1,
		'one-var': [1, 'never'],
		'object-shorthand': 0,
		'padded-blocks': 0,
		'prefer-arrow-callback': 0,
		'prefer-const': 1,
		'prefer-template': 0,
		quotes: [1, 'single', 'avoid-escape'],
		radix: 0,
		'space-before-function-paren': [1, 'never'],
		'import/no-extraneous-dependencies': 0,
		'import/extensions': 0,
		'import/first': 0,
		'import/no-unresolved': [2, {
			ignore: [
				'src.*',
				'lib.*',
				'entries.*',
			],
		}],
		'no-duplicate-imports': 0,
	},
};
