const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './index.js', // 入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 定义输出目录
        filename: 'my-first-webpack.bundle.js',  // 定义输出文件名称
        publicPath: '/'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.(s(a|c)ss)$/,
                use: ['style-loader','css-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        hot: true, // 热替换
        static: './', // server文件的根目录
        compress: true, // 开启gzip
        port: 8080, // 端口
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './index.html',
            filename: path.resolve(__dirname, 'dist/index.html')
        }),
        new webpack.HotModuleReplacementPlugin(), // HMR允许在运行时更新各种模块，而无需进行完全刷新
        new HtmlWebPackPlugin({
            template: './index.html',
            filename: path.resolve(__dirname, 'dist/index.html')
        })
    ]
};