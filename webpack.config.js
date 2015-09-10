var path = require("path");

module.exports = {
  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  },
  entry: "./public/js/index.js",
  output: {
    path: __dirname+"/public/js",
    filename: "bundle.js"
  },
  module: {
    loaders: [
        { test: /\.css$/, loader: "style!css" }
    ]
  }
}