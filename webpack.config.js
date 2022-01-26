const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'WebdelegateClient',
            type: 'umd',  // see https://webpack.js.org/configuration/output/#outputlibrarytype
            export: 'default',  // see https://github.com/webpack/webpack/issues/8480
        },
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
            },
        ]
    }
};