var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('./webpack.config.base.js');

// extend base with prod options
config.devtool = 'source-map';
config.output.filename = '[name].min.js';
config.module.loaders.push(
  {
    test: /\.sass$/,
    loader: ExtractTextPlugin.extract('css!autoprefixer-loader?browsers=last 2 versions!sass?indentedSyntax')
  }
);
config.plugins.push(
  new ExtractTextPlugin('[name].min.css', { allChunks: true }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify('production')
  })
);

module.exports = config;
