var webpackDevServer = 'http://localhost:8888/boh/'; // Webpack Dev Server
var phpApplicationVHost = 'http://brisbaneopenhouse.jsa.test'; // Your external HTML server
var publicFolder = "./../../../"; // which folder is served as the public folder?
var publicOutputFolder = 'wp-content/themes/openhouse/dist/'; // if css should be generated as http://mydomain.com/dist/main.css, then it should be "dist/"
var outputFolder = publicFolder + publicOutputFolder; // Relative to the webpack config file

const path = require("path");

module.exports = {
    serverURL : webpackDevServer,
    proxyURL: phpApplicationVHost,
    devServerProxy: { '*': phpApplicationVHost },
    paths: {
        outputPath: outputFolder,
        publicFolder: publicFolder,
        publicAssetFolder: publicOutputFolder,
        outputPathAbs: path.resolve(__dirname, outputFolder),
    },
    loaders: {
        postCSSLoader: {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
            }
        },
    }
};
