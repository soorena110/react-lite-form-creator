"use strict";

const path = require('path');
const Webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => {
    return {
        entry: env.dev ? './src/_dev/index.tsx' : './src/index.ts',
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    exclude: /node_modules/
                },
                {
                    test: /\.tsx?$/,
                    use: [{
                        loader: 'awesome-typescript-loader',
                        options: {silent: true}
                    }],
                    exclude: /node_modules/
                },
                {
                    test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'react-svg-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(jpe?g|png|gif)(\?[a-z0-9=.]+)?$/,
                    loader: 'url-loader',
                    exclude: /node_modules/
                },
            ]
        },
        resolve: {
            extensions: ['*', '.ts', '.js', '.tsx']
        },
        output: {
            path: path.join(__dirname, './dist'),
            filename: 'index.js',
            library: 'react-lite-form-creator',
            libraryTarget: "umd"
        },
        devServer: {
            contentBase: './src/_dev',
            hot: true
        },
        stats: {
            all: false,
            modules: true,
            maxModules: 0,
            errors: true,
            warnings: true,
            moduleTrace: true,
            errorDetails: true
        },
        plugins: [env.dev ? new Webpack.HotModuleReplacementPlugin() : new UglifyJsPlugin()]
    };

};