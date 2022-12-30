module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    moduleFileExtensions: ["ts", "js"],
    modulePathIgnorePatterns: ["/node_modules","/dist", "/lib"],
    testMatch: ["<rootDir>/src/**/*.test.ts"],
};
