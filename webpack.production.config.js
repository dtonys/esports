var path = require('path');
var webpack = require('webpack');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var DefinePlugin = webpack.DefinePlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

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
        loader: ExtractTextPlugin.extract('css!autoprefixer-loader?browsers=last 2 versions!sass?indentedSyntax'),
      }
    ]
  },
  resolve: {
    root: [
      __dirname+'/',
      __dirname+'/public',
      __dirname+'/public/js',
      __dirname+'/public/js/vendor',
      __dirname+'/stylesheets'
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