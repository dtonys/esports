/**
 * development config
 */
var path = require('path');
var webpack = require('webpack');
var webpack_merge = require('webpack-merge');

// var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var DefinePlugin = webpack.DefinePlugin;

var base_config = require('./webpack.base.config.js').config;
var entry_point_map = require('./webpack.base.config.js').entry_point_map;

var config = require('./webpack.base.config.js');

// add dev-server files
for( var key in config.entry ){
  var value_arr = config.entry[key];
  value_arr.unshift(
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server'
  );
}
// output file
config.output.filename = '[name].js';
// compile sass, convert to style tags
config.module.loaders.push(
  {
    test: /\.sass$/,
    loaders: [
      'style',
      'css',
      'sass?indentedSyntax'
    ]
  }
);
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new DefinePlugin({
    PRODUCTION: false,
    DEVELOPMENT: true
  })
);

module.exports = config;

