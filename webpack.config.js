const path = require('node:path');
const fs = require('node:fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function loadLocalEnv(filename) {
  const envPath = path.resolve(__dirname, filename);
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}

loadLocalEnv('.env.local');
loadLocalEnv('.env');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BIRDEYE_API_KEY__: JSON.stringify(process.env.BIRDEYE_API_KEY || ''),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    port: 8080,
    open: true,
    hot: true,
  },
};
