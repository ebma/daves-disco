const Dotenv = require("dotenv-webpack")
const webpack = require('webpack');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = []
  }

  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "timers": require.resolve("timers-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "vm": require.resolve("vm-browserify"),
  })
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ])

  config.plugins.push(new Dotenv())

  return config;
}
