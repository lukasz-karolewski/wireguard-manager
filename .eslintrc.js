module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:tailwind/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  rules: {
    "import/prefer-default-export": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      alias: [["~", "./"]],
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
  ignorePatterns: ["node_modules/", ".next/"],
};
