/* eslint-env node */

process.env.CHROME_BIN = require("puppeteer").executablePath(); // eslint-disable-line no-process-env

module.exports = function(config) {
	config.set({
		singleRun: true,
		browsers: ["ChromeHeadless"],
		basePath: "../js",
		files: [
			{
				pattern: "**/*.spec.js"
			}
		],
		preprocessors: {
			"**/*.spec.js": ["webpack"]
		},
		webpack: {
			output: {
				libraryTarget: "umd"
			},
			resolve: {
				modules: [".", "node_modules"]
			}
		},
		frameworks: ["jasmine"],
		reporters: ["mocha"],
		mochaReporter: {
			colors: true,
			symbols: {
				success: "+",
				info: "#",
				warning: "!",
				error: "x"
			}
		},
		plugins: ["karma-webpack", "karma-chrome-launcher", "karma-mocha-reporter", "karma-jasmine"]
	});
};
