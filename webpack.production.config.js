var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var DefinePlugin = webpack.DefinePlugin;

module.exports = {
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  entry: {
    main: './public/js/main.js',
    components: './public/js/components.js'
  },
  output: {
    path: __dirname+'/public/build',
    filename: '[name].min.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap&indentedSyntax'),
      }
    ]
  },
  resolve: {
    modulesDirectories: [
      'stylesheets',
      'stylesheets/pages',
      'public',
      'public/js',
      'public/js/vendor'
    ]
  },
  plugins: [
    new CommonsChunkPlugin({ name: "common" }),
    new ExtractTextPlugin('[name].min.css'),
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new DefinePlugin({
      PRODUCTION: true,
      DEVELOPMENT: false
    }),
    new webpack.ProvidePlugin({
      _: "lodash.js"
    })
  ]
}