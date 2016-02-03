/// <binding BeforeBuild='Run - Development' />
var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, 'App'),
    entry: [
        'webpack/hot/only-dev-server',
        './ui/home.jsx'
        ],
    output: {
        path: path.join(__dirname, 'Built'),
        filename: '[name].bundle.js'
    },
    plugins: [
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
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
