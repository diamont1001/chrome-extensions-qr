// webpack.config.js
// 
'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 单独打包CSS
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Html文件处理


module.exports = {
  entry: {
    popup: './app/popup/index.js',
    bg: './app/bg/index.js',
    content: './app/content/index.js',
    'content-qr': './app/content/content-qr.js', // 页面注入二维码后，需要注入的 JS
    'qr-frame': './app/content/qr-frame.js' // frameset 页面中，新建的弹出窗的落地页面包含的 JS
  },
  output: {
    path: path.resolve(__dirname, './pack/bundle'),
    publicPath: '', // This is used to generate URLs to e.g. images
    filename: '[name].js',
  },
  plugins: [
    // 单独打包CSS
    new ExtractTextPlugin('[name].css', {allChunks: true}),

    /**
     * HTML文件编译，自动引用JS/CSS
     *
     * filename - 输出文件名，相对路径output.path
     * template - HTML模板，相对配置文件目录
     * chunks - 只包含指定的文件（打包后输出的JS/CSS）,不指定的话，它会包含生成的所有js和css文件
     * excludeChunks - 排除指定的文件（打包后输出的JS/CSS），比如：excludeChunks: ['dev-helper']
     * hash
     */
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'app/popup/index.html',
      chunks: ['popup'],
      hash: true
    }),

    // frameset 页面中，新建的弹出窗的落地页面
    new HtmlWebpackPlugin({
      filename: 'qr-frame.html',
      template: 'app/content/qr-frame.html',
      chunks: ['qr-frame'],
      hash: true
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/, loader: 'babel-loader',
        exclude: /(node_modules|libs)/
      },
      // CSS,LESS打包进JS
      // { test: /\.css$/, loader: 'style-loader!css-loader' },
      // { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
      // CSS,LESS单独打包
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.art$/,
        loader: 'art-template-loader'
      },

      // { test: /\.tpl$/, loader: 'ejs'},
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
          name: '[path][name].[ext]?[hash:8]',
          limit: 8192 // inline base64 URLs for <=8k images, direct URLs for the rest
        }
      }
    ]
  }
};
