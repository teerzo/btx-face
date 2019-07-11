const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ZipPlugin = require('zip-webpack-plugin');

const projectName = 'Threejs-text-teerzo';

// paths
const dirNode = 'node_modules';
const dirDist = path.resolve(__dirname, 'dist');
const dirEntry = path.resolve(__dirname, 'src/main.js');
const dirIndex = path.resolve(__dirname, 'src/index.html');

module.exports = {
  mode: 'production',
  entry: [
    dirEntry
  ],
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({title: projectName, template: dirIndex}),
    new webpack.NamedModulesPlugin(),
    new CopyWebpackPlugin([
      {from:'src/fonts',to:'fonts'},
      // {from:'src/images/muscles',to:'images/muscles'},
      {from:'src/data',to:'data'},
      {from:'src/obj',to:'obj'},
      {from:'src/tex',to:'tex'},
    ]), 
    new ZipPlugin({
      filename: projectName + '.zip',
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: dirDist,
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
