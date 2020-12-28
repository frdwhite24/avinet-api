module.exports = {
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["test-utils", "dist", "/node_modules/*"],
  verbose: true,
};
