const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/jest.config.ts',
    '!**/environment*.ts',
    '!**/bootstrap.ts',
    '!**/main.ts',
    '!**/elements.ts',
    '!**/*-app.config.ts',
    '!**/*-root.component.ts',
    '!**/remote-entry/**',
    '!**/explore-layout.component.ts',
  ],
  coverageReporters: ['lcov', 'text-summary'],
};
