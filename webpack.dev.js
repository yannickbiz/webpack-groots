const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

// webpack plugins
// const Dashboard = require('webpack-dashboard');
// const DashboardPlugin = require('webpack-dashboard/plugin');
// const dashboard = new Dashboard();

// config files
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');
const common = require('./webpack.common.js');

// style files regexes
const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const styleRegex = /\.(scss|sass|css|pcss)$/;

// Configure the webpack-dev-server
const configureDevServer = () => {
    return {
        public: settings.devServerConfig.public(),
        contentBase: path.resolve(__dirname, settings.paths.dist.base),
        host: settings.devServerConfig.host(),
        port: settings.devServerConfig.port(),
        // https: !!parseInt(settings.devServerConfig.https()),
        // quiet: true,
        // hot: true,
        // hotOnly: true,
        // overlay: true,
        // stats: 'errors-only',
        // watchOptions: {
            // poll: !!parseInt(settings.devServerConfig.poll()),
        //     ignored: /node_modules/,
        // },
        // headers: {
        //     'Access-Control-Allow-Origin': '*'
        // },
    };
};

// Development module exports
module.exports = merge(common, {
    output: {
        // filename: path.join('./js', '[name].[hash].js'),
        filename: path.join('./js', '[name].js'),
        publicPath: settings.devServerConfig.public() + '/',
    },
    mode: 'development',
    devtool: 'inline-source-map',
    watch: true,
    module: {
        rules: [
            configurePostcssLoader(),
        ],
    },
    // devServer: configureDevServer(),
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        // new DashboardPlugin(dashboard.setData),
    ],
});
