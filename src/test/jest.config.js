const { resolve } = require('path');
const root = resolve(__dirname, '../');

module.exports = {
        rootDir: root,
        displayName: "tests",
        preset: "ts-jest",
        testMatch: ["<rootDir>/test/**/*.test.ts"],
        moduleNameMapper: {
            '@src/(.*)': '<rootDir>/$1'
        },
        setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
}