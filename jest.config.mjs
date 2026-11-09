import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  //   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// next/jest ignores all of node_modules; allow ESM-only dependencies to be transformed
const esmPackages = ["superjson", "copy-anything", "is-what"];

export default async function jestConfig() {
  const config = await createJestConfig(customJestConfig)();
  config.transformIgnorePatterns = config.transformIgnorePatterns.map((pattern) =>
    pattern.startsWith("/node_modules/(?!.pnpm)(?!(")
      ? pattern.replace("(?!(", `(?!(${esmPackages.join("|")}|`)
      : pattern,
  );
  return config;
}
