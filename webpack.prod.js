const env = "production";
process.env.NODE_ENV = env;

const merge = require("./node_modules/webpack-merge");
const common = require("./webpack.common.js");
const myVariables = require("./webpack.variables");

const config = {
	mode: env,
	devtool: false,
	output: {
		publicPath: myVariables.paths.publicFolder,
		filename: "[name].[hash].js",
	},
	module: {
		rules: [
			{
				test: /\.(woff2|woff|eot|otf|ttf)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "fonts",
						},
					},
				],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "images",
						},
					},
				],
			},
		],
	},
};

module.exports = merge(common, config);
