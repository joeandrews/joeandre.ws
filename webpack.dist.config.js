var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');

config.output = {
	filename: 'js/[name].bundle.js',
	publicPath: '',
  path: path.resolve(__dirname, 'dist')
};

config.plugins = config.plugins.concat([

  // Reduces bundles total size
]);

module.exports = config;
