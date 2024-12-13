import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importX from 'eslint-plugin-import-x'
import n from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import unicorn from 'eslint-plugin-unicorn'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint, { configs } from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
})

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...compat.extends('next/core-web-vitals'),
    eslint.configs.recommended,
    //
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    //
    perfectionist.configs['recommended-natural'],
    //
    unicorn.configs['flat/recommended'],
    {
        rules: {
            'unicorn/expiring-todo-comments': 'off',
            'unicorn/filename-case': 'off',
            'unicorn/no-null': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/text-encoding-identifier-case': 'off',
        },
    },
    //
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                sourceType: 'module',
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    ...tseslint.config({
        extends: [...configs.strictTypeChecked, ...configs.stylisticTypeChecked],
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    vars: 'all',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    }),
    {
        files: ['**/*.{js,cjs,mjs}'],
        ...tseslint.disableTypeChecked,
    },
    prettier,
    //
    n.configs['flat/recommended-script'],
    {
        rules: {
            'n/no-missing-import': 'off',
            'n/no-unsupported-features/es-syntax': 'off',
            'n/no-unsupported-features/node-builtins': 'off',
        },
    },
]

export default config