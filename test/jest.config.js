const { resolve } = require('path');
const root = resolve(__dirname, '../');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
    ...rootConfig, ...{
        rootDir: root,
        displayName: "tests",
        testMatch: ["<rootDir>/test/**/*.test.ts"],
    }
}