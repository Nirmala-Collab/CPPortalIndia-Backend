import js from '@eslint/js';
import nodePlugin from 'eslint-plugin-node';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
  },

  {
    files: ['src/**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly', // ✅ ADD THIS
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },

    plugins: {
      node: nodePlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      ...js.configs.recommended.rules,

      'prettier/prettier': 'error',

      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      'no-console': 'off', // ✅ Allow console in backend
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      'require-await': 'off',
      'no-return-await': 'error',

      'node/no-unsupported-features/es-syntax': 'off',
      'node/no-missing-import': 'off',

      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];
