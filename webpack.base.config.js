/**
 * base config, read by development & production configs
 */
var path = require('path');
var webpack = require('webpack');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var config = {
  addVendor: function( name, path ){
    this.resolve.alias[name] = path;
    this.module.noParse.push(new RegExp(path));
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  output: {
    path: __dirname+'/public/build',
    publicPath: "/build/"
  },
  entry: {
    'main': ['./public/js/main.js'],
    'components': ['./public/js/components.js'],
    'react_page': ['./public/js/react_page.js']
  },
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: [ path.resolve( __dirname, 'public' ) ]
      },
      // expose react global for dev tools
      {
        test: require.resolve("react"),
        loader: "expose?React"
      }
    ]
  },
  resolve: {
    alias: {},
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
    new CommonsChunkPlugin({ name: "common" })
  ]
};

config.addVendor( 'jquery', __dirname + '/node_modules/jquery/dist/jquery.min.js' );

module.exports = config;
