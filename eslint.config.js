import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist', 'src/__generated__', 'cypress/downloads', 'cypress/videos'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        // Every project, not just the application one: the specs and the build
        // tooling are TypeScript too, and a file outside all of them cannot be
        // parsed for the type-aware rules.
        project: [
          './tsconfig.json',
          './api/tsconfig.json',
          './tsconfig.node.json',
          './cypress/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      prettier,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    // Barrel files only re-export; the fast-refresh rule cannot see through them.
    files: ['src/**/index.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Everything outside the browser bundle: the serverless function, the
    // specs, the build tooling and this file.
    files: [
      'api/**/*.ts',
      'cypress/**/*.ts',
      'scripts/**/*.mjs',
      '*.config.{ts,js,cjs}',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Prettier's config is the one CommonJS file left, so it needs `module`.
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['cypress/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node, cy: 'readonly', Cypress: 'readonly' },
    },
  },
  prettierConfig
);
