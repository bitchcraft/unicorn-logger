/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
	context: path.resolve(__dirname),
	entry: {
		'unicorn-logger': [
			'./src/UnicornLogger.js',
		],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].es5.js',
		library: 'UnicornLogger',
		libraryTarget: 'umd',
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
	config.devtool = 'inline-source-map';

} else if (process.env.NODE_ENV === 'production') {

	config.plugins.push(new BundleAnalyzerPlugin({
		analyzerMode: 'static',
		openAnalyzer: false,
		reportFilename: 'es5-bundle-analytics.html',
	}));
}

module.exports = config;
