module.exports = {
    clearMocks: true,
    collectCoverage: false,
    collectCoverageFrom: ["src/**/*.ts"],
    moduleFileExtensions: ["ts", "js", "tsx"],
    modulePathIgnorePatterns: ["/node_modules", "/dist", "/lib"],
    testMatch: [
        "<rootDir>/src/**/__tests__/*.test.tsx",
        "<rootDir>/src/**/__tests__/*.test.ts",
    ],
    testEnvironment: "jsdom",
};
