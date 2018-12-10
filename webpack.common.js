const path = require('path');

// webpack plugins
const WebpackNotifierPlugin = require('webpack-notifier');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// config files
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure Babel loader
const configureBabelLoader = (browserList) => {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                            useBuiltIns: 'entry',
                            targets: {
                                browsers: browserList,
                            },
                        },
                    ],
                ],
                plugins: [],
            },
        },
    };
};

// Configure the Postcss loader
const configurePostcssLoader = () => {
    return {
        test: /\.(sa|sc|c)ss$/,
        use: [
            {
                // @ref: https://github.com/webpack-contrib/style-loader
                // Adds CSS to the DOM by injecting a <style> tag
                loader: 'style-loader',
            },
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    // you can specify a publicPath here
                    // by default it use publicPath in webpackOptions.output
                    // publicPath: './css/'
                }
            },
            // TODO: HMR
            // @ref: https://github.com/webpack-contrib/mini-css-extract-plugin#advanced-configuration-example
            // MiniCssExtractPlugin plugin should be used only on production builds without style-loader
            // in the loaders chain, especially if you want to have HMR in development.
            {
                // @ref: https://github.com/webpack-contrib/css-loader
                // The css-loader interprets @import and url() like import/require() and will resolve them
                // This module requires a minimum of Node v6.9.0 and Webpack v4.0.0.
                loader: 'css-loader',
                options: {
                    // @ref: https://github.com/webpack-contrib/css-loader#importloaders
                    // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                    importLoaders: 2,
                    sourceMap: true
                }
            },
            {
                // @ref: https://github.com/postcss/postcss-loader
                // Loader for webpack to process CSS with PostCSS
                loader: 'postcss-loader',
                options: {
                    // @ref: https://github.com/postcss/postcss-loader#sourcemap
                    // Enables source map support, postcss-loader will use the
                    // previous source map given by other loaders and update it accordingly
                    sourceMap: true
                }
            },
            {
                // @ref: https://github.com/webpack-contrib/sass-loader
                // Loads a Sass/SCSS file and compiles it to CSS.
                loader: 'sass-loader'
            }
        ]
    };
};

// Configure Entries
const configureEntries = () => {
    let entries = {};
    for (const [key, value] of Object.entries(settings.entries)) {
        entries[key] = path.resolve(__dirname, settings.paths.src.js + value);
    }

    return entries;
};

// Configure Manifest
const configureManifest = (fileName) => {
    return {
        fileName: fileName,
        basePath: settings.manifestConfig.basePath,
        map: (file) => {
            file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
            return file;
        },
    };
};

// The base webpack config
module.exports = {
    name: pkg.name,
    entry: configureEntries(),
    output: {
        path: path.resolve(__dirname, settings.paths.dist.base),
        publicPath: settings.urls.publicPath,
    },
    resolve: {
        alias: {},
    },
    module: {
        rules: [
            configureBabelLoader(Object.values(pkg.browserslist)),
            configurePostcssLoader(),
        ],
    },
    plugins: [
        new WebpackNotifierPlugin({
            title: 'Webpack',
            excludeWarnings: true,
            alwaysNotify: true,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new ManifestPlugin(
            configureManifest('manifest.json')
        ),
    ],
};
