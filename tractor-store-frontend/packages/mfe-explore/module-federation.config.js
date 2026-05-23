/**
 * @type {import('@nx/module-federation').ModuleFederationConfig}
 */
const config = {
  name: 'mfe-explore',
  exposes: {
    './Routes': 'packages/mfe-explore/src/app/remote-entry/entry.routes.ts',
  },
};

module.exports = config;
