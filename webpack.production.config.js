/**
 * production config
 */
var path = require('path');
var webpack = require('webpack');

// var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var DefinePlugin = webpack.DefinePlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var config = require('./webpack.base.config.js');

// minifed output file
config.output.filename = '[name].min.js';
config.module.loaders.push(
  // compile + process sass
  {
    test: /\.sass$/,
    loader: ExtractTextPlugin.extract(
      'css',
      'autoprefixer-loader?browsers=last 2 versions',
      'sass?indentedSyntax'
    ),
  }
);
config.plugins.push(
  // extract css to file
  new ExtractTextPlugin('[name].min.css'),
  // minifed
  new UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  // env global
  new DefinePlugin({
    PRODUCTION: true,
    DEVELOPMENT: false
  })
);

module.exports = config;
