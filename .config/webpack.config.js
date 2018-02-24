/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
	context: path.resolve(__dirname, '../src'),
	entry: {
		application: './application'
	},
	output: {
		path: path.resolve(__dirname, '../docroot/js/build'),
		filename: '[name].js',
		umdNamedDefine: true,
		libraryTarget: 'umd',
		pathinfo: true,
		devtoolModuleFilenameTemplate: 'sourcemaps:///[resource-path]?[id]',
		sourceMapFilename: '[name].js.map'
	},
	devtool: 'source-map',
	externals: [
		{
			'chart.js': 'Chart'
		}
	],
	resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules']
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader']
			},
			{
				test: /\.tpl$/,
				loader: 'raw-loader'
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			Chart: 'chart.js',
			'window.Chart': 'chart.js'
		})
	],
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
	}
};

// eslint-disable-next-line no-process-env
if (process.env.NODE_ENV !== 'development') {
	config.plugins.push(
		new UglifyJsPlugin({
			sourceMap: true,
			uglifyOptions: {
				compress: true
			}
		})
	);
}

module.exports = config;
