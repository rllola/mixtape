const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
   app: './app/index.js'
  },
   plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'style.css'
    })
   ],
   output: {
     filename: 'all.js',
     path: path.resolve(__dirname, 'dist')
   },
   module:{
     rules: [
     {
       test: /\.m?js$/,
       exclude: /node_modules/,
       use: {
         loader: 'babel-loader',
         options: {
           presets: ['@babel/preset-env','@babel/preset-react'],
           plugins: [
             ['@babel/plugin-proposal-decorators', { 'legacy': true }],
             ['@babel/plugin-proposal-class-properties', { 'loose' : true }]
           ]
         }
       }
     },
     {
       test: /\.css$/,
       use: [
         {
           loader: MiniCssExtractPlugin.loader,
           options: {
             // you can specify a publicPath here
             // by default it use publicPath in webpackOptions.output
             publicPath: '../'
           }
         },
         "css-loader"
       ]
     },
     {
       test: /\.(png|svg|jpg|gif)$/,
       use: ['file-loader']
     },
     {
       test: /\.(woff|woff2|eot|ttf|otf)$/,
       use: ['file-loader']
     }]
   }
};
