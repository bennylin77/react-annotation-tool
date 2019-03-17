const path = require("path");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  entry: "./src/Main.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: 'bundle.js',
		libraryTarget: "commonjs2"
  },
  plugins: [
		new CleanWebpackPlugin(['dist/*.*'])
	]
});
