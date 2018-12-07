const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

// config files
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');
const common = require('./webpack.common.js');

// webpack plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// Configure Bundle Analyzer
const configureBundleAnalyzer = () => {
    return {
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: 'report.html',
    };
};

// Configure Clean webpack
const configureCleanWebpack = () => {
    return {
        root: path.resolve(__dirname, settings.paths.dist.base),
        verbose: true,
        dry: false
    };
};

// Configure optimization
const configureOptimization = () => {
    return {
        splitChunks: {
            cacheGroups: {
                default: false,
                common: false,
            }
        },
    }
};

module.exports = merge(common, {
    output: {
        // filename: path.join('./js', '[name].[chunkhash].js'),
        filename: path.join('./js', '[name].js'),
    },
    mode: 'production',
    devtool: 'source-map',
    optimization: configureOptimization(),
    plugins: [
        new CleanWebpackPlugin(settings.paths.dist.clean,
            configureCleanWebpack()
        ),
        // new HtmlWebpackPlugin({
        //     template: path.resolve(__dirname, settings.urls.publicPath) + '/index.html',
        // }),
        new BundleAnalyzerPlugin(
            configureBundleAnalyzer()
        ),
    ]
});
