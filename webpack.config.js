const path = require('path');

module.exports = {
  entry: './wavingtiles/wavingtiles.ts',
  output: {
    filename: 'wavingtiles.js', // Use a single filename for the entry point
    path: path.resolve(__dirname, 'dist'),
    library: 'WavingTiles',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'development', // Use 'development' mode for faster builds
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    minimize: true,
    splitChunks: false // Disable code splitting
  },
  devServer: {
    static: {
      directory: path.join(__dirname),
      watch: true,
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true
  }
};