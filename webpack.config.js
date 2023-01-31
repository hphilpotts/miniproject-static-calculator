const path = require('path');

module.exports = {
  entry: './js/mainRewrite.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'mainRewrite.js',
    path: path.resolve(__dirname, 'dist'),
  },
};