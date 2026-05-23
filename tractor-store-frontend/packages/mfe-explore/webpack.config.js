const path = require('path');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const { mfSharedRemote } = require('../../tools/webpack/mf-shared');

module.exports = (config) => {
  config.output = {
    ...config.output,
    publicPath:
      config.mode === 'production' ? '/mfe-explore/' : 'auto',
    uniqueName: 'mfe_explore',
  };
  config.plugins.push(
    new ModuleFederationPlugin({
      name: 'mfe_explore',
      filename: 'remoteEntry.js',
      exposes: {
        './Routes': path.join(
          __dirname,
          'src/app/remote-entry/entry.routes.ts'
        ),
      },
      shared: mfSharedRemote(),
      manifest: false,
    })
  );
  return config;
};
