const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    target: 'node',
    entry: slsw.lib.entries,
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, '.webpack'),
        filename: '[name].js',
    },
    optimization: {
        concatenateModules: false,
    },
};