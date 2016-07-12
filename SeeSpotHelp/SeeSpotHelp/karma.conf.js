// karma.conf.js
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: false,
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
        },
        captureTimeout: 60000, // it was already there
        browserDisconnectTimeout : 100000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 100000,
    });
};
