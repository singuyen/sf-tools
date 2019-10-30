const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const dirName = require('./package.json').name;

var path = require('path');
const distFolder = '../../dist/' + dirName;

module.exports = (env, argv) => ({
  entry: {
    'main': './src/assets/script.js',
    'style': './src/assets/style.scss'
  },
  output: {
    path: path.resolve(__dirname, distFolder),
    filename: './assets/[name].js'
  },
  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new HtmlWebpackPlugin({
      title: dirName,
      template: (argv.mode === 'production') ? './src/body.html' : './src/index.html',
      filename: './index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: './assets/[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new StyleExtHtmlWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: "./src/assets/schema.json",
        to:   "./assets/schema.json"
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development',
            }
          },
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  }
});
