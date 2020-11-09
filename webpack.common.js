const path = require('path');

module.exports = {
    entry: {
        index: './client/src/app.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, './client/public'),
        publicPath: './client/public',
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                    ],
                    plugins: [
                        'transform-class-properties',
                        'transform-object-rest-spread'
                    ]
                },
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 8192,
                            publicPath: '../',
                            useRelativePaths: true
                        }
                    }
                ]
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            }
        ]
    },
}
