/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {}
    ],
  },

  // Enable coverage collection
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',    // include all .ts files in src folder
    '!src/**/*.d.ts', // exclude type declaration files
  ],
  coverageDirectory: 'coverage',   // output folder for coverage
  coverageReporters: ['text', 'html', 'lcov'], // coverage formats
};
