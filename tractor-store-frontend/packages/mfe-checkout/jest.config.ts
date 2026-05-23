export default {
  displayName: 'mfe-checkout',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/packages/mfe-checkout',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^@tractor-store/shared-catalog$': '<rootDir>/../shared-catalog/src/index.ts',
    '^@tractor-store/ts-design-system$': '<rootDir>/../ts-design-system/src/index.ts',
  },
};
