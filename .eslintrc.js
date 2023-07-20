module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:prettier/recommended",
    "next",
  ],
  rules: {
    "import/prefer-default-export": 0,
    "react/prop-types": 0,
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
  ignorePatterns: ["node_modules/", ".next/", "*.d.ts"],
};
