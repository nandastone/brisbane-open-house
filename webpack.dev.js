const env = 'development';
process.env.NODE_ENV = env;

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const myVariables = require('./webpack.variables');
const webpack = require("webpack");

const config = {
    mode: env,
    watch: true,
    output: {
        publicPath: myVariables.serverURL + myVariables.paths.publicAssetFolder,
        filename: '[name].js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: myVariables.serverURL + myVariables.paths.publicAssetFolder,
        proxy: myVariables.devServerProxy,
        host: '0.0.0.0',
        hot: true,
        // hotOnly: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
	},
	plugins: [
        new webpack.HotModuleReplacementPlugin(),
	],
    module: {
        rules: [
            {
                test: /\.(woff2|woff|eot|otf|ttf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                          publicPath: '/wp-content/themes/openhouse/dist/',
                          name: "fonts/[name].[ext]",
                        }
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: '/wp-content/themes/openhouse/dist/',
                            name: "images/[name].[ext]",
                        }
                    },
                ],
            },
        ]
    }
};

module.exports = merge(common, config);
