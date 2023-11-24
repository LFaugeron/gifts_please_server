const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');


module.exports = {
    target: 'node',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    externals: [nodeExternals({
        allowlist: ['datas']
    })],
    plugins: [
        new Dotenv({
            path: '.env',
        }),
    ],
};