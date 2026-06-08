// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true, // Fixes Jest errors
  },
  extends: [
    'eslint:recommended',
    'plugin:cypress/recommended', // Fixes Cypress errors
    'prettier',
  ],
  plugins: ['ejs', 'cypress'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
};
