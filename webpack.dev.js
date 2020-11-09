const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: './client/public',
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "https://localhost:3001",
                "changeOrigin": false,
                "secure": false,
            },

        },
        writeToDisk: true,
        https: {
            key: fs.readFileSync('./localhost-key.pem'),
            ca: fs.readFileSync('./localhost.pem'),
            cert: fs.readFileSync('/Users/minhvu/localhost.pem')
        }
    },
    devtool: 'inline-source-map',
})