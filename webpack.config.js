const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 1337 })

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            client.send(data)
        })
    })
})

const config = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'build_output'),
        filename: 'options.bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'options.html',
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap(
                    'AfterEmitPlugin',
                    (compilation) => {
                        const ws = new WebSocket('ws://localhost:1337')
                        ws.on('open', () => ws.send('build complete'))
                    }
                )
            },
        },
    ],
}

module.exports = config
