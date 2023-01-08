module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    moduleFileExtensions: ["ts", "js"],
    modulePathIgnorePatterns: ["/node_modules", "/dist", "/lib"],
    testMatch: ["<rootDir>/src/**/__tests__/*.test.ts"],
    testEnvironment: "jsdom",
};
