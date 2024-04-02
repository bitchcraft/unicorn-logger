import { defineConfig } from 'vite';
import { resolve } from 'path';


export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/UnicornLogger.ts'),
			name: 'UnicornLogger',
			fileName: 'unicorn-logger',
		},
	},
	rollupOptions: {
		external: ['debug'],
		output: {
			globals: {
				debug: 'Debug',
			},
		},
	},
});
