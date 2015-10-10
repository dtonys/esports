var path = require('path');
var webpack = require('webpack');

var config = require('./webpack.config.base.js');

// extend base with dev options
config.devtool = 'eval';
for( var key in config.entry ){
  var value_arr = config.entry[key];
  value_arr.unshift(
    'webpack-hot-middleware/client'
  );
}
config.output.filename = '[name].js';
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
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify('development')
  })
);

module.exports = config;

