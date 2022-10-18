const { resolve } = require('path');
const root = resolve(__dirname, '../');
const rootConfig = require(`${root}/test/jest.config.js`);

module.exports = {
        rootDir: root,
        displayName: "tests",
        preset: "ts-jest",
        testMatch: ["<rootDir>/test/**/*.test.ts"],
        moduleNameMapper: {
            '@src/(.*)': '<rootDir>/$1'
        }
}