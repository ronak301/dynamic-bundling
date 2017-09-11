const webpack = require('webpack');
const path = require('path');

const AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'not ie < 11',
  'safari >= 4'
];

module.exports = {
  entry: "./app.js",
  externals: {
    react: 'React',
    'react-native': 'ReactNative'
  },
  output: {
    path: path.join(__dirname, './output'),
    filename: 'index.js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, './') ],
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        presets: ['react', 'es2015', 'react-native']
      }
    }]
  },
  plugins: [
  ]
};