const { name } = require('./package.json')

module.exports = {
  entry: `./src/${name}.vue`,
  output: {
    filename: `dist/${name}.js`,
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
