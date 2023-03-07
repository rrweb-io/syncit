module.exports = {
  transform: {
    '.ts': 'ts-jest',
  },

  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  moduleFileExtensions: ['ts', 'js'],

  testMatch: ['<rootDir>/__tests__/**/**.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '<rootDir>/lib/'],

  collectCoverage: Boolean(process.env.COVERAGE),
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
};
