var webpackDevServer = "http://localhost:8888/boh/"; // Webpack Dev Server
var phpApplicationVHost = "http://brisbaneopenhouse.jsa.test"; // Your external HTML server
var outputFolder = "./dist/";
var publicFolder = "/wp-content/themes/openhouse/dist/";

const path = require("path");

module.exports = {
	serverURL: webpackDevServer,
	proxyURL: phpApplicationVHost,
	devServerProxy: { "*": phpApplicationVHost },
	paths: {
		outputPath: outputFolder,
		publicFolder: publicFolder,
		outputPathAbs: path.resolve(__dirname, outputFolder),
	},
	loaders: {
		postCSSLoader: {
			loader: "postcss-loader",
			options: {
				sourceMap: true,
			},
		},
	},
};
