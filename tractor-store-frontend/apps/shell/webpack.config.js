const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const { mfSharedHost } = require('../../tools/webpack/mf-shared');

module.exports = (config) => {
  const isProduction = config.mode === 'production';
  const remotes = isProduction
    ? {
        'mfe-explore': 'mfe_explore@/mfe-explore/remoteEntry.js',
        'mfe-decide': 'mfe_decide@/mfe-decide/remoteEntry.js',
        'mfe-checkout': 'mfe_checkout@/mfe-checkout/remoteEntry.js',
      }
    : {
        'mfe-explore': 'mfe_explore@http://localhost:4201/remoteEntry.js',
        'mfe-decide': 'mfe_decide@http://localhost:4202/remoteEntry.js',
        'mfe-checkout': 'mfe_checkout@http://localhost:4203/remoteEntry.js',
      };

  config.output = { ...config.output, publicPath: 'auto', uniqueName: 'shell' };
  config.plugins.push(
    new ModuleFederationPlugin({
      name: 'shell',
      remotes,
      shared: mfSharedHost(),
      manifest: false,
    })
  );
  return config;
};
