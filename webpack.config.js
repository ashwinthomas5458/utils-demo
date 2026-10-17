const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const site = require('./src/content/site');

// Public URL of the deployed page, with a trailing slash. Used for the
// canonical link, Open Graph tags, JSON-LD, robots.txt and sitemap.xml.
const SITE_URL = process.env.SITE_URL || 'https://utils.ashwinthomas.in/';
// Absolute URL of the 1200×630 share image. src/static/og.png is copied to the
// site root (its source is src/og/og.html); set OG_IMAGE='' to omit image tags.
const OG_IMAGE = process.env.OG_IMAGE ?? `${SITE_URL}og.png`;

const LASTMOD = new Date().toISOString().slice(0, 10);

module.exports = (_env, argv) => {
  const prod = argv.mode === 'production';

  return {
    entry: { main: './src/js/main.js' },
    output: {
      path: path.resolve(__dirname, 'out'),
      filename: prod ? '[name].[contenthash:8].js' : '[name].js',
      publicPath: './',
      clean: true,
    },
    target: ['web', 'es2020'],
    devtool: prod ? false : 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { url: false } }],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: prod ? '[name].[contenthash:8].css' : '[name].css' }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        scriptLoading: 'defer',
        templateParameters: {
          ...site,
          SITE_URL,
          OG_IMAGE,
          jsonLd: site.jsonLd(SITE_URL),
        },
        minify: prod && {
          collapseWhitespace: true,
          conservativeCollapse: false,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyJS: true,
          minifyCSS: true,
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/static',
            transform: (content, file) =>
              /\.(txt|xml)$/.test(file)
                ? content.toString().replaceAll('%SITE_URL%', SITE_URL).replaceAll('%LASTMOD%', LASTMOD)
                : content,
          },
        ],
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({ extractComments: false, terserOptions: { format: { comments: false } } }),
        new CssMinimizerPlugin(),
      ],
    },
    performance: { hints: prod ? 'warning' : false },
    devServer: {
      static: false,
      hot: false,
      port: 8080,
    },
  };
};
