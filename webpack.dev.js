require('dotenv').config()
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
	host: process.env.HOST,
    port: process.env.PORT,
    publicPath: process.env.PUBLIC_PATH,
    hotOnly: true
  },
  plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
});
