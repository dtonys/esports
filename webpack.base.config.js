/**
 * base config, read by development & production configs
 */
var path = require('path');
var webpack = require('webpack');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var config = {
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  output: {
    path: __dirname+'/public/build',
    publicPath: "/build/"
  },
  entry: {
    'main': ['./public/js/main.js'],
    'components': ['./public/js/components.js']
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: [ path.resolve( __dirname, 'public' ) ]
      }
    ]
  },
  resolve: {
    modulesDirectories: [
      "web_modules",
      "public",
      "public/js",
      "public/js/vendor",
      "stylesheets",
      "node_modules"
    ]
  },
  plugins: [
    new CommonsChunkPlugin({ name: "common" }),
    new webpack.ProvidePlugin({
      _: "lodash"
    })
  ]
};

module.exports = config;
