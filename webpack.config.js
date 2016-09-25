var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: './src/Parser.js',
    debug: true,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'parser.min.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: 'es2015',
                },
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({ minimize: true, compress: { warnings: false } })
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
