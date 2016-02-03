// karma.conf.js
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: true,
        plugins: [
              'karma-chrome-launcher',
              'karma-mocha',
              'karma-sourcemap-loader',
              'karma-webpack'
        ],
        frameworks: ['mocha'],
        files: [
            "./tests.webpack.js"
        ],
        preprocessors: {
            "./tests.webpack.js": ["webpack"]
        },
        reporters: ['dots'],
        webpack: webpackConfig,
        webpackServer: {
            noInfo: true
        }
    });
};
