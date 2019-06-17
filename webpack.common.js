const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				options: {
					presets: ['env', 'react'],
					plugins: ['transform-object-rest-spread', 'transform-class-properties'],
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|svg|jpg|gif|pdf)$/,
				use: [
					'file-loader',
				],
			},
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
		alias: {
			apps: path.resolve(__dirname, 'src/apps'),
			shared: path.resolve(__dirname, 'src/shared'),
			// Todo: remove them
			models: path.resolve(__dirname, 'src/models'),
			components: path.resolve(__dirname, 'src/components'),
		},
	},
	plugins: [],
};
