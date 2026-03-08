/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['<rootDir>', 'node_modules'],
  testRegex: '.*\.(spec|test)\.ts$',
  collectCoverageFrom: ['src/**/*.ts'],
};