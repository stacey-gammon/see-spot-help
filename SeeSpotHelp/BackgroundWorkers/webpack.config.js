/// <binding BeforeBuild='Run - Development' />
var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, 'App'),
    entry: [
        './index.js'
        ],
    output: {
        path: path.join(__dirname, 'public/Built'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
	node: {
  		dgram: "empty",
		child_process: "empty",
		module: "empty",
		buffertools: "empty",
		net: "empty"
	},
    module: {
		preLoaders: [
        	{ test: /\.json$/, loader: 'json'},
    	],
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loaders: ['react-hot', 'babel'],
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    }
};
