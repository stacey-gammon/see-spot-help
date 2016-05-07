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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
  	devtool: 'source-map',
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
