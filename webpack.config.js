var path = require('path');
var webpack = require('webpack');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var DefinePlugin = webpack.DefinePlugin;

module.exports = {
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  entry: {
    app: [
      'webpack/hot/only-dev-server',
      './public/js/entry.js'
    ],
    main: [
      'webpack/hot/only-dev-server',
      './public/js/main.js'
    ],
    components: [
      'webpack/hot/only-dev-server',
      './public/js/components.js'
    ],        
  },
  output: {
    filename: '[name].js',
    path: __dirname+'/public/build',
    publicPath: "http://localhost:8080/build/"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.sass$/,
        loader: 'style!css!sass?indentedSyntax'
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
    new DefinePlugin({
      PRODUCTION: false,
      DEVELOPMENT: true
    }),
    new webpack.ProvidePlugin({
      _: "lodash"
    })
  ]
};