import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const eslintConfig = [
    {
        ignores: ["**/node_modules/", "**/.next/", "**/*.d.ts"],

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },

        plugins: {
            prettier,
        },
    },
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "next/core-web-vitals",
        "plugin:tailwindcss/recommended",
        "prettier",
    ),
    {
        rules: {
            "import/prefer-default-export": 0,
            "react/prop-types": 0,
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-empty-object-type": "off",
        },
    }
];

export default eslintConfig;