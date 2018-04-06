/* eslint-env node */

process.env.CHROME_BIN = require('puppeteer').executablePath(); // eslint-disable-line no-process-env

module.exports = function(config) {
	config.set({
		singleRun: true,
		browsers: ['ChromeHeadless'],
		basePath: '../js',
		files: [
			{
				pattern: '**/*.spec.js'
			}
		],
		preprocessors: {
			'**/*.spec.js': ['webpack']
		},
		webpack: {
			output: {
				libraryTarget: 'umd'
			},
			resolve: {
				modules: ['.', 'node_modules']
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: ['babel-loader', 'eslint-loader']
					},
					{
						test: /\.dot$/,
						use: {
							loader: 'dotjs-loader',
							options: {
								varname: 'context'
							}
						}
					}
				]
			}
		},
		webpackMiddleware: {
			noInfo: true,
			stats: 'errors-only'
		},
		frameworks: ['mocha', 'chai'],
		reporters: ['mocha'],
		mochaReporter: {
			colors: true,
			symbols: {
				success: '+',
				info: '#',
				warning: '!',
				error: 'x'
			}
		}
	});
};
