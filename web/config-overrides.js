const Dotenv = require("dotenv-webpack")

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = []
  }

  config.plugins.push(new Dotenv())

  return config
}
