/// <binding BeforeBuild='Run - Development' />
var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, ''),
    entry: [
        './Output/ui/home.js'
        ],
    output: {
        path: path.join(__dirname, 'public/Built'),
        filename: '[name].bundle.js'
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //   // Don't beautify output (enable for neater output)
        //   beautify: false,
        //
        //   // Eliminate comments
        //   comments: false,
        //
        //   // Compression specific options
        //   compress: {
        //     warnings: false,
        //
        //     // Drop `console` statements
        //     drop_console: true
        //   },
        //   mangle: {
        //        except: ['$super', '$', 'exports', 'require', '$q', '$ocLazyLoad', 'webpackJsonp'],
        //       // Don't care about IE8
        //       screw_ie8 : true,
        //
        //       // Don't mangle function names
        //       keep_fnames: true
        //    }
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loaders: ['react-hot', 'babel'],
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
        { test: /\.json$/, loaders: ['json']},
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
