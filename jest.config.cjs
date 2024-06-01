/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.ts"
 ],
 collectCoverage: true,
 coverageDirectory: 'coverage',
 coverageReporters: ['text', 'lcov'],
};
