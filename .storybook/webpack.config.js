// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org  /configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

// load the default config generator.

const devConfig = require('../webpack.dev.config');
const prodConfig = require('../webpack.prod.config');

module.exports = (baseConfig, configType) => {
  
  const config = Object.assign({}, configType === 'DEVELOPMENT' ? devConfig : prodConfig);

  baseConfig.module.rules = baseConfig.module.rules.concat(config.module.rules)
  baseConfig.resolve = config.resolve
  
  return baseConfig;
};
