/// <binding BeforeBuild='Run - Development' />
var path = require('path');

module.exports = {
    context: path.join(__dirname, 'App'),
    entry: './ui/home.jsx',
    output: {
        path: path.join(__dirname, 'Built'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
