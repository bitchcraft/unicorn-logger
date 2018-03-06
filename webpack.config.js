/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const mainConfig = {
	context: path.resolve(__dirname),
	entry: {
		'unicorn-logger': [
			'./src/UnicornLogger.js',
		],
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.(js)?$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					query: {
						cacheDirectory: true,
						babelrc: true,
						plugins: [],
					},
				}],
			},
		],
	},
	resolve: {
		extensions: [ '.js', '.json' ],
	},
	resolveLoader: {
		modules: [ 'node_modules' ],
	},
};

if (process.env.NODE_ENV === 'development') {
	mainConfig.devtool = 'inline-source-map';

}

const browserConfig = Object.assign({}, mainConfig, {
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: '[name].browser.es5.js',
		library: 'UnicornLogger',
		libraryTarget: 'umd',
	},
});

const nodeConfig = Object.assign({}, mainConfig, {
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: '[name].node.es5.js',
		library: 'UnicornLogger',
		libraryTarget: 'umd',
	},
});

if (process.env.NODE_ENV === 'production') {

	const browserPlugins = Array.from(browserConfig.plugins);
	const nodePlugins = Array.from(nodeConfig.plugins);

	browserPlugins.push(new BundleAnalyzerPlugin({
		analyzerMode: 'static',
		openAnalyzer: false,
		reportFilename: 'es5-browser-bundle-analytics.html',
	}));
	nodePlugins.push(new BundleAnalyzerPlugin({
		analyzerMode: 'static',
		openAnalyzer: false,
		reportFilename: 'es5-node-bundle-analytics.html',
	}));

	browserConfig.plugins = browserPlugins;
	nodeConfig.plugins = nodePlugins;
}

module.exports = [browserConfig, nodeConfig];
