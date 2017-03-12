module.exports = {
  entry: `./src/vue-select.vue`,
  output: {
    filename: `dist/vue-select.js`,
    libraryTarget: 'umd',
    library: 'VueSelect'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            loaders: {
              scss: 'vue-style-loader!css-loader!sass-loader',
              js: 'babel-loader'
            }
          }
        }]
      },
      { test: /\.js$/, loaders: 'babel-loader' },
      { test: /\.css$/, loaders: 'style-loader!css-loader' }
    ]
  }
}
