const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
	name: 'js_bundle',
	context: path.resolve( __dirname, 'src' ),
	entry: {
		'js/jet-popup-block-editor.js': './block-editor/index.js',
		'js/jet-popup-block-editor-plugin.js': './block-editor/sidebar.js',
	},
	output: {
		path: path.resolve( __dirname, '../assets' ),
		filename: '[name]'
	},
	resolve: {
		modules: [
			path.resolve( __dirname, 'src' ),
			'node_modules'
		],
		extensions: [ '.js' ],
		alias: {
			'@': path.resolve( __dirname, 'src' ),
			'includes': path.resolve( __dirname, 'src/includes/' ),
			'admin': path.resolve( __dirname, 'src/block-editor/' )
		}
	},
	externals: {
		jquery: 'jQuery'
	},
	plugins: [
		new webpack.ProvidePlugin( {
			jQuery: 'jquery',
			$: 'jquery'
		} )
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
				],
			},
		]
	}
}