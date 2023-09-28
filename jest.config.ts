/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { useESM: true },
    ],
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testEnvironment: 'node',
  testRegex: '(\\/test\\/|.*)(test|spec)\\.[jt]sx?$',
  verbose: true,
  setupFiles: ["<rootDir>/test/jest.setup.ts"],
};
