var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../webpack.config.js');

var path = require('path');
var fs = require('fs');

var compiler = Webpack(webpackConfig);

var runServer = function(){
  var server = new WebpackDevServer(compiler, {
    contentBase: path.resolve( __dirname, '../public/' ),
    publicPath: '/build/',
    hot: true,
    colors: true,
    quiet: false
  });
  server.listen(8080);
}
module.exports = runServer;

