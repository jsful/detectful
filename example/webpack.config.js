const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'edge-detect': [
            'webpack-hot-middleware/client',
            './example/edge-detect/index.js'
        ],
    },
    output: {
        path: path.join(__dirname, 'example'),
        filename: '[name]/bundle.[name].js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ],
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] }
        ]
    }
};