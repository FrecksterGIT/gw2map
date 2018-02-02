/* eslint-env node */

const path = require('path');

module.exports = {
	context: path.resolve(__dirname, 'js'),
	entry: {
		'application': 'application'
	},
	output: {
		path: path.resolve(__dirname, './build'),
		filename: '[name].js',
		umdNamedDefine: true,
		libraryTarget: 'umd',
		pathinfo: true,
		devtoolModuleFilenameTemplate: 'sourcemaps:///[resource-path]?[id]',
		sourceMapFilename: '[name].js.map'
	},
	devtool: 'source-map',
	resolve: {
		modules:
			[
				path.resolve(__dirname, 'js'),
				'node_modules'
			]
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
					'eslint-loader'
				]
			},
			{
				test: /\.dot$/,
				loader: 'dotjs-loader',
				options: {
					varname: 'context'
				}
			}
		]
	},
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
	}
};
