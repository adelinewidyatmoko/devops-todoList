const js = require('@eslint/js');
const globals = require('globals');
const cypressPlugin = require('eslint-plugin-cypress');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  // 1. Core JS Recommended rules
  js.configs.recommended,

  // 2. Cypress Recommended rules (Loaded natively without FlatCompat!)
  cypressPlugin.configs.recommended,

  // 3. Your custom project configurations
  {
    plugins: {
      ejs: require('eslint-plugin-ejs'),
      cypress: cypressPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // Fixes Jest global errors
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },

  // 4. Prettier integration (placed last to safely override spacing formatting)
  eslintConfigPrettier,
];
