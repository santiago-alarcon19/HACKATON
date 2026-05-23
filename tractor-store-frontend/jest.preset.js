const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.spec.ts',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/jest.config.ts',
    '!**/environment*.ts',
  ],
  coverageReporters: ['lcov', 'text-summary'],
};
