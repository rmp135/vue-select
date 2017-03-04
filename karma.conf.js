const webpackConfig = require('./webpack.config.js');
// delete webpackConfig.output.libraryTarget;

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    reporters: ['dots'],
    files: [
      './src/*.spec.js'
    ],
    preprocessors: {
      'src/*.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true
  })
}
