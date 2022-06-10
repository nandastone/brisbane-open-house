const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const myVariables = require('./webpack.variables');

module.exports = {
    entry: {
        main : "./assets/js/boh.js",
        globalStyles : "./assets/scss/app.scss",
        myBuildings : "./assets/js/myBuildingsApp/index.jsx",
    },
    output: {
        path: myVariables.paths.outputPathAbs,
    },
    externals: {
        jquery: 'jQuery'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: ( process.env.NODE_ENV === 'production' ) ? '[name].[hash].css' : '[name].css',
            chunkFilename: ( process.env.NODE_ENV === 'production' ) ? '[id].[hash].css' : '[id].css',
        }),
        new WriteFilePlugin(),
        new CleanWebpackPlugin({
            // dry: true,
            cleanOnceBeforeBuildPatterns: ['**/*','!**/*index.php'],
        }),
        new ManifestPlugin({
          writeToFileEmit: true
        })
    ],
    module: {
      rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
			loader: ["babel-loader"],
			resolve: { extensions: [".js", ".jsx"] }
        },
        {
            test: /\.css$/,
            use: [
                'css-hot-loader',
                // ( process.env.NODE_ENV === 'production' ) ?  MiniCssExtractPlugin.loader :  "style-loader",
                MiniCssExtractPlugin.loader,
                "css-loader",
                myVariables.loaders.postCSSLoader,
            ]
        },
        {
            test: /\.scss$/,
            use: [
                'css-hot-loader',
                // ( process.env.NODE_ENV === 'production' ) ?  MiniCssExtractPlugin.loader :  "style-loader",
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                },
                myVariables.loaders.postCSSLoader,
                {
                    loader: 'resolve-url-loader',
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        includePaths: []
                    }
                },
            ]
        },
      ]
    },
};
