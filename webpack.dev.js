require('dotenv').config();
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'eval',
	entry: 'apps/demo/index.js',
	output: {
		path: path.resolve(__dirname, 'dist/'),
		publicPath: '/dist/',
		filename: 'demo.bundle.js',
	},
	devServer: {
		contentBase: path.join(__dirname, 'public/'),
		host: process.env.HOST,
		port: process.env.PORT,
		publicPath: process.env.PUBLIC_PATH,
		hotOnly: true,
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
});
