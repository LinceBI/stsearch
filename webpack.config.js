const path = require('path');

const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('sass');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const pkg = require('./package.json');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	const ifProduction = (val, def) => (isProduction ? val : def);
	const dist = path.join(__dirname, `dist/${isProduction ? 'prod' : 'dev'}`);

	return {
		target: 'web',
		mode: ifProduction('production', 'development'),
		entry: path.join(__dirname, 'src/resources/html/js/app.js'),
		output: {
			filename: '[name].[contenthash].js',
			path: `${dist}/resources/html`,
			publicPath: '',
		},
		devtool: ifProduction(false, 'eval-source-map'),
		optimization: {
			minimizer: [
				new TerserPlugin({
					parallel: true,
					extractComments: false,
				}),
			],
		},
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: [dist],
			}),
			new webpack.EnvironmentPlugin({
				VERSION: pkg.version,
			}),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: path.resolve(__dirname, 'src/resources/html/index.html'),
				xhtml: true,
				minify: ifProduction(
					{
						minifyJS: true,
						minifyCSS: true,
						removeComments: true,
						collapseWhitespace: true,
						collapseInlineTagWhitespace: true,
						collapseBooleanAttributes: false,
						keepClosingSlash: true,
						maxLineLength: 512,
					},
					false,
				),
			}),
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css',
				chunkFilename: '[id].[contenthash].css',
			}),
			new CopyWebpackPlugin({
				patterns: [
					{ from: 'src/plugin.xml', to: dist },
					{ from: 'src/plugin.spring.xml', to: dist },
					{ from: 'src/resources/html/presets.json', to: `${dist}/resources/html/` },
					{ from: 'src/resources/messages', to: `${dist}/resources/messages/` },
					{ from: 'src/resources/images', to: `${dist}/resources/images/` },
				].map((pattern) => {
					pattern.globOptions = { ignore: ['.gitkeep'] };
					return pattern;
				}),
			}),
		],
		module: {
			rules: [
				{
					test: /\.js$/i,
					exclude: /node_modules/,
					use: { loader: 'babel-loader' },
				},
				{
					test: /\.(css|scss)$/i,
					use: [
						{ loader: MiniCssExtractPlugin.loader },
						{ loader: 'css-loader' },
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [
										autoprefixer(),
										...ifProduction(
											[cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })],
											[],
										),
									],
								},
							},
						},
						{
							loader: 'sass-loader',
							options: {
								implementation: sass,
								sassOptions: {
									quietDeps: true,
									silenceDeprecations: ['import'],
								},
							},
						},
					],
				},
				{
					test: /(\.(ttf|otf|eot|woff|woff2)|-webfont\.svg)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.(png|gif|jpg)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.svg$/i,
					exclude: /-webfont\.svg$/i,
					use: ['svg-url-loader', 'svgo-loader'],
				},
			],
		},
		ignoreWarnings: [
			{ message: /Replace color-adjust to print-color-adjust\. The color-adjust shorthand is currently deprecated\./ },
			{ message: /Using \/ for division outside of calc\(\) is deprecated and will be removed in Dart Sass 2\.0\.0\./ },
		],
		devServer: {
			host: '0.0.0.0',
			port: 8081,
			allowedHosts: 'all',
			static: {
				directory: dist,
				publicPath: '/',
			},
			client: {
				webSocketURL: {
					protocol: 'wss',
					hostname: '0.0.0.0',
					port: 8443,
				},
			},
			historyApiFallback: false,
			liveReload: true,
		},
	};
};
