/**
 * @type {import('@nx/module-federation').ModuleFederationConfig}
 */
const config = {
  name: 'mfe-checkout',
  exposes: {
    './Routes': 'packages/mfe-checkout/src/app/remote-entry/entry.routes.ts',
  },
};

module.exports = config;
