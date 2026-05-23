/**
 * @type {import('@nx/module-federation').ModuleFederationConfig}
 */
const config = {
  name: 'mfe-decide',
  exposes: {
    './Routes': 'packages/mfe-decide/src/app/remote-entry/entry.routes.ts',
  },
};

module.exports = config;
