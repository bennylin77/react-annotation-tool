const fs = require("fs");
const path = require("path");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require("webpack");


module.exports = merge(common, {
  mode: "development",
	devtool: 'eval',	
  entry: "./src/demo/index.js",
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: 'demo.bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
		host: 'ivc.ischool.utexas.edu',
      https: {
	  key: fs.readFileSync("/etc/ssl/apache2/ivc.key"),
	  cert: fs.readFileSync("/etc/ssl/apache2/ivc.crt"),
      },
    port: 8080,
    publicPath: "ivc.ischool.utexas.edu:8080/dist/",
    hotOnly: true
  },
  plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
});
