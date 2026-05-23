/**
 * @type {import('@nx/module-federation').ModuleFederationConfig}
 */
const config = {
  name: 'shell',
  remotes: ['mfe-explore', 'mfe-decide', 'mfe-checkout'],
};

module.exports = config;
